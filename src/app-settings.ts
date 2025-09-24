import {JSONContent} from "vanilla-jsoneditor";
import {
    ProtocolDefaults,
    ProtocolDefinitions,
    StageDefinition,
    StandardizedProtocolDefinitions,
    standardizeProtocolDefinitions,
    StandardProtocolDefinition,
    StandardStageDefinition
} from "./simple-protocol.ts";
import {SimpleResultsDBRecord} from "./SimpleResultsDB.ts";
import {DataSource} from "./data-source.ts";
import {SegmentState} from "./protocol-executor.ts";
import {ConfigListener, defaultConfigManager} from "src/config/config-context.tsx";
import {
    AppSettings,
    AppSettingsDefaults,
    AppSettingType,
    ProtocolSegment,
    ValidSettings
} from "src/app-settings-types.ts";
import {SampleSource} from "src/portacount/porta-count-state.ts";

function isSessionOnlySetting(setting: ValidSettings) {
    return setting.toLowerCase().startsWith("so-")
}

export interface SettingsListener {
    subscriptions(): AppSettings[],
    settingsChanged(setting: ValidSettings, value: AppSettingType): void
}

// todo put these into utils?
export function isThisAnExerciseSegment(segment: ProtocolSegment) {
    return segment.source === SampleSource.MASK && segment.state === SegmentState.SAMPLE;
}

export function calculateNumberOfExercises(protocol: StandardProtocolDefinition) {
    return convertStagesToSegments(protocol).reduce((numExercises: number, segment: ProtocolSegment) => numExercises + (isThisAnExerciseSegment(segment) ? 1 : 0), 0);
}

// enums as keys doesn't force defaults, but maybe these can be used as keys but the type can be a separate declaration
/**
 * App settings are managed here.
 * - Getters return the cached value. If there is no cached value, returns the default value and loads the DB value
 * asynchronously.
 * - The cache contains the value from the database.
 * - Setters update the cache, and the database. If there is no current cached value, ignore.
 *     This means the cache value can only be updated after it is successfully read from the DB. The DB load provides
 *     a default value if it's missing from the DB.
 * - When a setting is loaded from the database, update the cache.
 * - When the cache updates, dispatch an event if the value has changed.
 */
class AppSettingsContext {
    private _protocolStages: StageDefinition[] = []; // kept in sync with selected protocol
    private _protocolSegments: ProtocolSegment[] = []; // kept in sync with protocol stages
    readonly numExercisesForProtocol: { [key: string]: number } = {}

    private _listenerMap: Map<SettingsListener, ConfigListener> = new Map();

    constructor() {
        this.addListener({
            subscriptions: () => [AppSettings.SELECTED_PROTOCOL],
            settingsChanged: (setting: ValidSettings, protocolName: AppSettingType) => {
                if (setting === AppSettings.SELECTED_PROTOCOL) {
                    this.updateProtocolStages(protocolName as string);
                }
            }
        })
        this.addListener({
            subscriptions: () => [AppSettings.ENABLE_SIMULATOR],
            settingsChanged: (setting: ValidSettings, simulatorEnabled: AppSettingType) => {
                if (setting === AppSettings.ENABLE_SIMULATOR) {
                    if (!simulatorEnabled && [DataSource.Simulator, DataSource.SimulatorFile].includes(this.getSetting(AppSettings.SELECTED_DATA_SOURCE))) {
                        // make sure the selected data source is not simulator if we've disabled the simulator
                        this.saveSetting(AppSettings.SELECTED_DATA_SOURCE, AppSettingsDefaults[AppSettings.SELECTED_DATA_SOURCE])
                    }
                }
            }
        })
        this.addListener({
            subscriptions: () => [AppSettings.SHOW_EXTERNAL_CONTROL],
            settingsChanged: (setting: ValidSettings, showControls: AppSettingType) => {
                if (setting === AppSettings.SHOW_EXTERNAL_CONTROL) {
                    if (!showControls) {
                        // if we're not showing external controls, disable sync state on connect because that requires
                        // external control
                        this.saveSetting(AppSettings.SYNC_DEVICE_STATE_ON_CONNECT, false)
                    }
                }
            }
        })
        this.addListener({
            subscriptions: () => [AppSettings.SYNC_DEVICE_STATE_ON_CONNECT],
            settingsChanged: (setting: ValidSettings, syncOnConnect: AppSettingType) => {
                if (setting === AppSettings.SYNC_DEVICE_STATE_ON_CONNECT) {
                    if (syncOnConnect && !this.getSetting(AppSettings.SHOW_EXTERNAL_CONTROL)) {
                        // we're trying to turn on sync on connect but external control is not enabled. disallow
                        // (re-disable sync on connect) need to do this in a separate thread? react doesn't seem to
                        // update itself if we just call saveSetting
                        setTimeout(() => {
                            this.saveSetting(AppSettings.SYNC_DEVICE_STATE_ON_CONNECT, false);
                        }, 200)
                    }
                }
            }
        })
    }

    public addListener(listener: SettingsListener): void {
        const configListener: ConfigListener = {
            subscriptions: () => {
                if (listener.subscriptions) {
                    return listener.subscriptions()
                } else {
                    return []
                }
            },
            configChanged<T>(name: string, value: T) {
                if (listener.settingsChanged) {
                    listener.settingsChanged(name as ValidSettings, value);
                }
            }
        };
        this._listenerMap.set(listener, configListener);
        defaultConfigManager.addListener(configListener)
    }

    public removeListener(listener: SettingsListener): void {
        const configListener = this._listenerMap.get(listener);
        if (configListener) {
            defaultConfigManager.removeListener(configListener);
        }
    }


    getDefault<T extends AppSettingType>(setting: AppSettings): T {
        return AppSettingsDefaults[setting] as T;
    }

    // todo: load all values into the cache on constructor / startup
    get selectedProtocol(): string {
        // todo: use a sensible default
        return this.getSetting(AppSettings.SELECTED_PROTOCOL) as string
    }

    set selectedProtocol(protocolName: string) {
        console.log(`set selected protocol ${protocolName}`)
        if (protocolName in this.protocolDefinitions) {
            this.saveSetting(AppSettings.SELECTED_PROTOCOL, protocolName);
        } else {
            console.log(`trying to set an invalid protocol name: ${protocolName}, ignoring`);
        }
    }

    /**
     * protocolStages and protocolSegments are kept in sync with selectedProtocol.
     */
    get protocolStages(): StageDefinition[] {
        return this._protocolStages;
    }

    set protocolStages(value: StageDefinition[]) {
        this._protocolStages = value
    }

    get protocolSegments(): ProtocolSegment[] {
        return this._protocolSegments;
    }

    get eventEndTime(): Date {
        const theTime = new Date()
        const [hh, mm] = this.getSetting<string>(AppSettings.EVENT_END_HHMM).split(":")
        theTime.setHours(Number(hh), Number(mm), 0, 0)
        return theTime
    }

    set eventEndTime(endDate: Date) {
        const hhmm = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`
        this.saveSetting(AppSettings.EVENT_END_HHMM, hhmm)
    }

    get numExercises(): number {
        return Math.max(...this.protocolSegments.map((segment) => segment.exerciseNumber ?? 0), 0)
    }

    set protocolSegments(value: ProtocolSegment[]) {
        this._protocolSegments = value;
    }

    get sayEstimatedFitFactor(): boolean {
        return this.getSetting(AppSettings.SAY_ESTIMATED_FIT_FACTOR) as boolean;
    }

    set sayEstimatedFitFactor(value: boolean) {
        this.saveSetting(AppSettings.SAY_ESTIMATED_FIT_FACTOR, value);
    }

    get verboseSpeech(): boolean {
        return this.getSetting(AppSettings.VERBOSE) as boolean;
    }

    set verboseSpeech(value: boolean) {
        this.saveSetting(AppSettings.VERBOSE, value);
    }

    get sayParticleCount(): boolean {
        return this.getSetting(AppSettings.SAY_PARTICLE_COUNT) as boolean;
    }

    set sayParticleCount(value: boolean) {
        this.saveSetting(AppSettings.SAY_PARTICLE_COUNT, value);
    }

    get speechEnabled(): boolean {
        return this.getSetting(AppSettings.SPEECH_ENABLED) as boolean;
    }

    set speechEnabled(value: boolean) {
        this.saveSetting(AppSettings.SPEECH_ENABLED, value);
    }

    getProtocolDefinition(protocolName: string): StandardProtocolDefinition {
        return this.protocolDefinitions[protocolName] || [];
    }

    getProtocolNames(): string[] {
        return Object.keys(this.protocolDefinitions)
    }

    private get protocolDefinitions(): StandardizedProtocolDefinitions {
        // todo: cache these. for now, fetch them every time
        const baseProtocols: StandardizedProtocolDefinitions = standardizeProtocolDefinitions(this.getSetting<JSONContent>(AppSettings.PROTOCOL_INSTRUCTION_SETS).json as ProtocolDefinitions);

        if (this.getSetting(AppSettings.AUTO_CREATE_FAST_PROTOCOLS)) {
            const fastProtocols = this.createFastProtocols(baseProtocols);
            // copy fast protocols to base protocols. todo: use a separate 3rd object instead.
            Object.assign(baseProtocols, fastProtocols)
        }
        return baseProtocols;
    }

    /**
     * make "fast" versions of existing protocols by removing ambient samples between exercises and reducing sampling
     * times.
     * @param baseProtocols
     * @private
     */
    private createFastProtocols(baseProtocols: StandardizedProtocolDefinitions) {
        // TODO: define "fast" and "compressed" as separate auto-created protocols?
        //  "compressed" => remove ambient segments in the middle
        //  "fast" => shortened sample duration
        //  "fast-compressed" => both "fast" and "compressed"
        const fastProtocols: StandardizedProtocolDefinitions = {};
        const baseProtocolNamesLowerCase = Object.keys(baseProtocols).map((name: string) => name.toLowerCase());

        Object.entries(baseProtocols).forEach(([baseProtocolName, baseStages]) => {
            const fastProtocolName = `fast-${baseProtocolName} (*)`;
            if (baseProtocolName.toLowerCase().startsWith("fast-")) {
                // skip
            } else if (baseProtocolNamesLowerCase.includes(fastProtocolName.toLowerCase())) {
                // don't overwrite existing fast protocols
                // skip
            } else {
                const fastStages: StandardStageDefinition[] = []
                // make sure the first stage has an ambient segment. if not, add a prep stage
                // make sure the first mask segment has a mask purge segment.
                // remove ambient segments and mask purge segments from all following stages
                // add a finalizing stage with ambient purge and sample with no mask segment
                const firstStage = baseStages[0]
                fastStages.push({
                    // use settings from the first stage to build the first ambient segment. use defaults if the
                    // duration is zero
                    instructions: "Prep",
                    ambient_purge: firstStage.ambient_purge || ProtocolDefaults.defaultAmbientPurgeDuration,
                    ambient_sample: firstStage.ambient_sample || ProtocolDefaults.defaultAmbientSampleDuration,
                    mask_purge: 0,
                    mask_sample: 0,
                })

                baseStages.forEach((baseStage: StandardStageDefinition) => {
                    // create a fast version of each stage that has the ambient segments removed
                    // if the stage has no sample duration, skip it.
                    if (baseStage.mask_sample > 0) {
                        fastStages.push({
                            instructions: baseStage.instructions,
                            ambient_purge: 0,
                            ambient_sample: 0,
                            mask_purge: 4, // it takes about 4 seconds to clear the counting chamber. the tube
                                           // takes about 0.1 sec to clear
                            // todo: make min and reduction ratio configurable
                            mask_sample: Math.min(baseStage.mask_sample, Math.max(20, baseStage.mask_sample * 0.75)),
                        })
                    }
                })

                // todo: don't add trailing ambient stage unless there is an ambient segment at the end already
                // add the final ambient segment back. If the last stage had it, use whatever its setting were.
                const lastStage = baseStages[baseStages.length - 1]
                fastStages.push({
                    // use settings from the last stage to build the final ambient segment. use defaults if the
                    // duration is zero
                    instructions: "Finalize",
                    ambient_purge: lastStage.ambient_purge === 0 ? 0 : ProtocolDefaults.defaultAmbientPurgeDuration,
                    ambient_sample: lastStage.ambient_sample || ProtocolDefaults.defaultAmbientSampleDuration,
                    mask_purge: 0,
                    mask_sample: 0,
                })

                fastProtocols[fastProtocolName] = fastStages
            }
        })
        return fastProtocols
    }

    // this isn't used anywhere yet
    private set protocolDefinitions(value: ProtocolDefinitions) {
        this.saveSetting(AppSettings.PROTOCOL_INSTRUCTION_SETS, {"json": value})
    }

    public getTestTemplate(): Partial<SimpleResultsDBRecord> {
        return this.getSetting(AppSettings.TEST_TEMPLATE)
    }

    setTestTemplate(value: Partial<SimpleResultsDBRecord>) {
        this.saveSetting(AppSettings.TEST_TEMPLATE, value)
    }

    /**
     * get setting from the db. a cached value will do if the cache has been loaded.
     * @param setting
     */
    async getActualSetting<T extends AppSettingType>(setting: AppSettings): Promise<T> {
        return this.getSetting(setting);
    }

    /**
     * return value from the cache, return default value if not found (and initiate bg load from db)
     * @param setting
     * @param defaultValue
     * @private
     */
    getSetting<T extends AppSettingType>(setting: ValidSettings): T {
        return defaultConfigManager.getConfig(setting);
    }

    /**
     * load all known settings into the cache
     * todo: rename this to init()
     * @private
     */
    public async loadAllSettings() {
        // nothing to do since settings uses config which is synchronous

        const protocolInstructionSets = this.protocolDefinitions;
        for (const protocolName of Object.keys(protocolInstructionSets)) {
            const protocolInstructionSet = protocolInstructionSets[protocolName];
            this.numExercisesForProtocol[protocolName] = calculateNumberOfExercises(protocolInstructionSet);
        }
    }

    /**
     * persist value to database (and update cache). ignores call if cache does not contain the setting (this can
     * happen if the UI loads before the settings have been loaded from the DB)
     * @param setting
     * @param value
     * @private
     */
    saveSetting(setting: ValidSettings, value: AppSettingType) {
        defaultConfigManager.setConfig(setting, value);
    }


    private updateProtocolStages(selectedProtocol: string) {
        console.debug(`updateProtocolStages ${selectedProtocol}`);
        const protocolStages = (this.protocolDefinitions)[selectedProtocol];
        if (!protocolStages) {
            return;
        }
        this.protocolSegments = convertStagesToSegments(protocolStages)
        this.protocolStages = protocolStages;
    }

    getProtocolDuration(protocolName: string): number {
        // todo: this should be pre-calculated since these wouldn't change
        const protocolDefinition: StandardStageDefinition[] = this.protocolDefinitions[protocolName] ?? [];
        const segments: ProtocolSegment[] = convertStagesToSegments(protocolDefinition);
        return calculateProtocolDuration(segments)
    }

}

export const APP_SETTINGS_CONTEXT = new AppSettingsContext()

/**
 *
 * @param segments
 * @return protocol duration in seconds
 */
export function calculateProtocolDuration(segments: ProtocolSegment[]): number {
    return segments.reduce((totalTime: number, segment: ProtocolSegment) => totalTime + segment.duration, 0)
}

// todo: keep this private, convert all stages to segments on settings load since these shouldn't change often
export function convertStagesToSegments(stages: StandardStageDefinition[]): ProtocolSegment[] {
    const segments: ProtocolSegment[] = []
    let numExercisesSeen: number | null = null;
    let currentOffset: number = 0

    stages.forEach((stage: StandardStageDefinition, stageIndex: number) => {
        let stageOffset: number = 0
        if (stage.mask_sample > 0) {
            // increment the exercise number if this stage has a mask sample segment
            numExercisesSeen = (numExercisesSeen ?? 0) + 1; // increment; 1-based
        }
        // this stage's has an exercise num only if it has a mask sample segment. otherwise it has no exercise number
        // (either a prep or finalize stage)
        const thisStageExerciseNum = stage.mask_sample > 0 ? numExercisesSeen : null

        // allow any combination of ambient/mask/purge/sample. rely on the protocol standardizer to set these to
        // coherent values

        // ambient segments
        if (stage.ambient_purge > 0) {
            const ambientPurgeSegment: ProtocolSegment = {
                index: segments.length,
                stage: stage,
                stageIndex: stageIndex,
                exerciseNumber: thisStageExerciseNum,
                source: SampleSource.AMBIENT,
                state: SegmentState.PURGE,
                protocolStartTimeOffsetSeconds: currentOffset,
                stageStartTimeOffsetSeconds: stageOffset,
                duration: stage.ambient_purge,
                data: []
            };
            segments.push(ambientPurgeSegment);
            currentOffset += ambientPurgeSegment.duration;
            stageOffset += ambientPurgeSegment.duration;
        }

        if (stage.ambient_sample > 0) {
            const ambientSampleSegment: ProtocolSegment = {
                index: segments.length,
                stage: stage,
                stageIndex: stageIndex,
                exerciseNumber: thisStageExerciseNum,
                source: SampleSource.AMBIENT,
                state: SegmentState.SAMPLE,
                protocolStartTimeOffsetSeconds: currentOffset,
                stageStartTimeOffsetSeconds: stageOffset,
                duration: stage.ambient_sample,
                data: []
            };
            segments.push(ambientSampleSegment);
            currentOffset += ambientSampleSegment.duration;
            stageOffset += ambientSampleSegment.duration;
        }

        // mask segments
        if (stage.mask_purge > 0) {
            const maskPurgeSegment: ProtocolSegment = {
                index: segments.length,
                stage: stage,
                stageIndex: stageIndex,
                exerciseNumber: thisStageExerciseNum,
                source: SampleSource.MASK,
                state: SegmentState.PURGE,
                protocolStartTimeOffsetSeconds: currentOffset,
                stageStartTimeOffsetSeconds: stageOffset,
                duration: stage.mask_purge,
                data: []
            };
            segments.push(maskPurgeSegment);
            currentOffset += maskPurgeSegment.duration;
            stageOffset += maskPurgeSegment.duration;
        }

        if (stage.mask_sample > 0) {
            const maskSampleSegment: ProtocolSegment = {
                index: segments.length,
                stage: stage,
                stageIndex: stageIndex,
                exerciseNumber: thisStageExerciseNum,
                source: SampleSource.MASK,
                state: SegmentState.SAMPLE,
                protocolStartTimeOffsetSeconds: currentOffset,
                stageStartTimeOffsetSeconds: stageOffset,
                duration: stage.mask_sample,
                data: []
            };
            segments.push(maskSampleSegment);
            currentOffset += maskSampleSegment.duration;
        }
    });

    // console.log(`created segments: ${JSON.stringify(segments)}`);
    return segments;
}


/**
 * Deterministically hash the settings keys we have today. This lets us compare with the last time we made this
 * calculation so we can detect changes.
 */
export async function calculateSettingsKeysHash() {
    const qualifiedSettingsKeys = Object.values(AppSettings).filter((setting) => !isSessionOnlySetting(setting));
    const keysString = JSON.stringify(qualifiedSettingsKeys.sort())
    const data = new TextEncoder().encode(keysString);
    const digest = await crypto.subtle.digest("SHA-1", data);
    const digestString = Array.from(new Uint8Array(digest), (byte) => String.fromCodePoint(byte)).join("")
    return btoa(digestString) // base64-ify
}
