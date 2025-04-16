import {JSONContent} from "vanilla-jsoneditor";
import {
    standardizeProtocolDefinitions,
    ProtocolDefinitions,
    SampleSource,
    StageDefinition,
    StandardizedProtocolDefinitions, ProtocolDefaults, StandardStageDefinition
} from "./simple-protocol.ts";
import {ColumnFiltersState, SortingState} from "@tanstack/react-table";
import AbstractDB from "./abstract-db.ts";
import {SimpleResultsDBRecord} from "./SimpleResultsDB.ts";
import stringifyDeterministically from "json-stringify-deterministic";
import {DataSource} from "./data-source.ts";
import {SegmentState} from "./protocol-executor.ts";
import {ParticleConcentrationEvent} from "./portacount-client-8020.ts";

/**
 * this is for convenience. code outside of this module should use AppSettings enum.
 * Code within this module should ValidSettings and AppSettingsDefaults
 */
export enum AppSettings {
    SPEECH_ENABLED = "speech-enabled",
    ADVANCED_MODE = "advanced-mode",
    SPEECH_VOICE = "speech-voice",
    VERBOSE = "verbose",
    SAY_PARTICLE_COUNT = "say-particle-count",
    RESULTS_TABLE_SORT = "results-table-sort",
    PARTICIPANT_RESULTS_TABLE_SORT = "participant-results-table-sort",
    SAY_ESTIMATED_FIT_FACTOR = "say-estimated-fit-factor",
    SHOW_EXTERNAL_CONTROL = "show-external-control",
    BAUD_RATE = "baud-rate",
    PROTOCOL_INSTRUCTION_SETS = "protocol-instruction-sets",
    SELECTED_PROTOCOL = "selected-protocol",
    SELECTED_INTERNAL_PROTOCOL = "selected-internal-protocol",
    SELECTED_EXTERNAL_PROTOCOL = "selected-external-protocol",
    KEEP_SCREEN_AWAKE = "keep-screen-awake",
    TEST_TEMPLATE = "test-template",
    ENABLE_SIMULATOR = "enable-simulator",
    ENABLE_AUTO_CONNECT = "enable-auto-connect",
    SIMULATOR_FILE_SPEED = "simulator-file-speed",
    SELECTED_DATA_SOURCE = "selected-data-source",
    SYNC_DEVICE_STATE_ON_CONNECT = "sync-device-state-on-connect",
    MINUTES_ALLOTTED_PER_PARTICIPANT = "minutes-allotted-per-participant",
    EVENT_END_HHMM = "event-end-hhmm", // in local time
    SHOW_ELAPSED_PARTICIPANT_TIME = "show-elapsed-participant-time",
    SHOW_REMAINING_EVENT_TIME = "show-remaining-event-time",
    AUTO_CREATE_FAST_PROTOCOLS = "auto-create-fast-protocols",
    LAST_KNOWN_SETTINGS_KEYS_HASH = "last-known-settings-keys-hash", // hash of sorted settings keys

    // session only settings. todo: can we merge these from another enum into this?
    STATS_FIRST_DATE = "so-stats-first-date",
    STATS_LAST_DATE = "so-stats-last-date",
    RESULTS_TABLE_FILTER = "so-results-table-filter",
    PARTICIPANT_RESULTS_TABLE_FILTER = "so-participant-results-table-filter",

    // these are deprecated:
    DEFAULT_TO_PREVIOUS_PARTICIPANT = "default-to-previous-participant",
    AUTO_ESTIMATE_FIT_FACTOR = "auto-estimate-fit-factor",
    SHOW_PROTOCOL_EDITOR = "show-protocol-editor",
    SHOW_SIMPLE_PROTOCOL_EDITOR = "show-simple-protocol-editor",
    SHOW_SETTINGS = "show-settings",
    SHOW_LOG_PANELS = "show-log-panels",
    SHOW_HISTORICAL_TESTS = "show-historical-tests",
    SHOW_CURRENT_TEST_PANEL = "show-current-test-panel",
}

/**
 * Settings can be of these types.
 */
export type AppSettingType =
    boolean
    | string
    | number
    | JSONContent
    | SortingState
    | ColumnFiltersState
    | Partial<SimpleResultsDBRecord>
    | Date;

/**
 * Settings names and default values.
 * Keys are the database keys, so we must preserve what we have previously used (or convert)
 */
const AppSettingsDefaults = {
    "speech-enabled": false,
    "advanced-mode": false,
    "speech-voice": "default",
    "verbose": false,
    "say-particle-count": false,
    "results-table-sort": [{
        id: 'ID',
        desc: true,
    }],
    "participant-results-table-sort": [{
        id: 'ID',
        desc: true,
    }],
    "auto-estimate-fit-factor": false,
    "say-estimated-fit-factor": false,
    "show-external-control": false,
    "baud-rate": 1200, // todo: make this a number
    "protocol-instruction-sets": {
        "json": {
            "w1": [
                "Normal breathing. Breathe normally",
                "Heavy breathing. Take deep breaths.",
                [
                    "Jaw movement.",
                    "Read the rainbow passage:",
                    "When the sunlight strikes raindrops in the air, they act as a prism and form a rainbow.",
                    "The rainbow is a division of white light into many beautiful colors.",
                    "These take the shape of a long round arch, with its path high above,",
                    "and its two ends apparently beyond the horizon.",
                    "There is, according to legend, a boiling pot of gold at one end.",
                    "People look, but no one ever finds it.",
                    "When a man looks for something beyond his reach,",
                    "his friends say he is looking for the pot of gold at the end of the rainbow."
                ].join(" "),
                "Head movement. Look up, down, left, and right. Repeat."
            ],
        }
    },
    "selected-protocol": "w1",
    "selected-internal-protocol": "w1",
    "selected-external-protocol": "w1",
    "keep-screen-awake": true,
    "test-template": {} as Partial<SimpleResultsDBRecord>,
    "enable-simulator": false,
    "enable-auto-connect": true,
    "simulator-file-speed": 300, // baud
    "selected-data-source": DataSource.WebSerial,
    "sync-device-state-on-connect": false,
    "minutes-allotted-per-participant": 20,
    "event-end-hhmm": "13:30", // 1:30p. use a divider for easier parsing
    "show-elapsed-participant-time": false,
    "show-remaining-event-time": false,
    "auto-create-fast-protocols": false,
    "last-known-settings-keys-hash": "",
    "so-stats-first-date": new Date(0), // epoch, sentinel value
    "so-stats-last-date": new Date(), // today
    "so-results-table-filter": [],
    "so-participant-results-table-filter": [],

    "default-to-previous-participant": false, // deprecated
    "show-protocol-editor": false, // deprecated
    "show-simple-protocol-editor": false, // deprecated
    "show-settings": false, // deprecated
    "show-log-panels": false, // deprecated
    "show-historical-tests": false, // deprecated
    "show-current-test-panel": false, // deprecated
}
// this class should use AppSettingsType for type checking/ validations to ensure every setting has a default.
export type ValidSettings = keyof typeof AppSettingsDefaults;

/**
 * sessionOnlySettings are not preserved to database.
 */
const sessionOnlySettings: Set<ValidSettings> = new Set<ValidSettings>([
    AppSettings.STATS_FIRST_DATE,
    AppSettings.STATS_LAST_DATE,
    AppSettings.RESULTS_TABLE_FILTER,
    AppSettings.PARTICIPANT_RESULTS_TABLE_FILTER,
])

type SettingsDBEntry<T> = { ID: string, value: T }

// this should be kept internal
class SettingsDB extends AbstractDB {
    static DB_NAME = "settings-db";
    static OBJECT_STORE_NAME = "settings-data";

    constructor(name = SettingsDB.DB_NAME) {
        super(name, [SettingsDB.OBJECT_STORE_NAME], 1)
    }

    override onUpgradeNeeded(request: IDBOpenDBRequest) {
        const theDb = request.result;

        console.warn(`Database upgrade needed: ${theDb.name}`);
        // Create an objectStore for this database
        theDb.createObjectStore(SettingsDB.OBJECT_STORE_NAME, {keyPath: "ID"});
    }

    public async getSetting<T>(name: ValidSettings): Promise<T | undefined> {
        // because we change the way AppSettings
        const result = await this.get<SettingsDBEntry<T>>(SettingsDB.OBJECT_STORE_NAME, name);
        if (result) {
            return result.value;
        }
        return undefined;
    }

    async saveSetting<T>(name: ValidSettings, value: T) {
        console.debug(`saveSettings saving to DB ${name} : ${JSON.stringify(value)}`);
        const entry = {ID: name, value: value}
        return this.put<SettingsDBEntry<T>>(SettingsDB.OBJECT_STORE_NAME, entry)
    }
}

const SETTINGS_DB: SettingsDB = new SettingsDB();

export interface SettingsListener {
    subscriptions?(): AppSettings[],

    settingsChanged?(setting: ValidSettings, value: AppSettingType): void

    ready?(): void;
}

// todo put these into utils?
export function isThisAnExerciseSegment(segment: ProtocolSegment) {
    return segment.source === SampleSource.MASK && segment.state === SegmentState.SAMPLE;
}

export function calculateNumberOfExercises(stages: StandardStageDefinition[]) {
    return convertStagesToSegments(stages).reduce((numExercises: number, segment: ProtocolSegment) => numExercises + (isThisAnExerciseSegment(segment) ? 1 : 0), 0);
}

// todo: rename this to phase? so we don't share the same first letter as Stage
export type ProtocolSegment = {
    index: number, // segment index
    stageIndex: number,
    exerciseNumber: number | null, // this is usually stageIndex+1 (to be 1-based), but sometimes it's shifted by some
                                   // amount, in order to skip 0-duration stages
    instructions: string | null, // what the participant should be doing during this segment, null if this segment is
                                 // not sampling from mask
    state: SegmentState,
    source: SampleSource,
    protocolStartTimeOffsetSeconds: number, // to help with pointer
    segmentStartTimeMs?: number, // epoch time
    duration: number,
    data: ParticleConcentrationEvent[], // todo: trim this down to timestamp and concentration?
    calculatedScore?: number // FF. keep it here since we can revise it with more ambient info
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
    private readonly cache = new Map<ValidSettings, AppSettingType>(); // todo: consolidate cache with settings db cache
    private readonly listeners: SettingsListener[] = [];
    private _protocolStages: StageDefinition[] = []; // kept in sync with selected protocol
    private _protocolSegments: ProtocolSegment[] = []; // kept in sync with protocol stages
    private _ready: boolean = false;
    private settingsLoaded: boolean = false;

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
        this.loadAllSettings().then(() => {
            this.updateReadyStatus()
        });
    }

    private updateReadyStatus() {
        this._ready = this.settingsLoaded && true;
        if (this._ready) {
            this.listeners.forEach((listener) => {
                if (listener.ready) {
                    listener.ready();
                }
            })
        }
    }

    public addListener(listener: SettingsListener): void {
        this.listeners.push(listener);
    }

    public removeListener(listener: SettingsListener): void {
        this.listeners.filter((value, index, array) => {
            if (value === listener) {
                array.splice(index, 1);
                return true
            }
            return false;
        })
    }

    private dispatch(setting: ValidSettings, value: AppSettingType) {
        // console.debug(`dispatching setting ${setting}: ${JSON.stringify(value)}`);
        this.listeners.forEach((listener) => {
            if (listener.subscriptions && listener.settingsChanged) {
                if (listener.subscriptions().some((wantSetting) => wantSetting === setting)) {
                    listener.settingsChanged(setting, value);
                }
            }
        })
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
        return Math.max(...this.protocolSegments.map((segment) => segment.exerciseNumber ?? 0))
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

    get protocolDefinitions(): StandardizedProtocolDefinitions {
        // todo: cache these. for now, fetch them every time
        const baseProtocols: StandardizedProtocolDefinitions = standardizeProtocolDefinitions(this.getSetting<JSONContent>(AppSettings.PROTOCOL_INSTRUCTION_SETS).json as ProtocolDefinitions);

        if (this.getSetting(AppSettings.AUTO_CREATE_FAST_PROTOCOLS)) {
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
                        mask_purge: firstStage.mask_purge || ProtocolDefaults.defaultMaskPurgeDuration,
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
                                mask_purge: 0, // todo: optionally keep this if present
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

            // copy fast protocols to base protocols. todo: use a separate 3rd object instead.
            Object.assign(baseProtocols, fastProtocols)
        }
        return baseProtocols;
    }

    // this isn't used anywhere yet
    private set protocolDefinitions(value: ProtocolDefinitions) {
        this.saveSetting(AppSettings.PROTOCOL_INSTRUCTION_SETS, {"json": value})
    }

    get testTemplate(): Partial<SimpleResultsDBRecord> {
        return this.getSetting(AppSettings.TEST_TEMPLATE)
    }

    set testTemplate(value: Partial<SimpleResultsDBRecord>) {
        this.saveSetting(AppSettings.TEST_TEMPLATE, value)
    }

    /**
     * get setting from the db. a cached value will do if the cache has been loaded.
     * @param setting
     */
    async getActualSetting<T extends AppSettingType>(setting: AppSettings): Promise<T> {
        const cachedValue = this.cache.get(setting);
        if (cachedValue !== undefined) {
            // console.debug(`getActualSetting(${setting}) returning value from cache: ${JSON.stringify(cachedValue)}`)
            return cachedValue as T;
        }
        // not in cache
        return this.loadSetting(setting); // load it asynchronously, return default value while waiting
    }

    /**
     * return value from the cache, return default value if not found (and initiate bg load from db)
     * @param setting
     * @param defaultValue
     * @private
     */
    getSetting<T extends AppSettingType>(setting: AppSettings): T {
        const cachedValue = this.cache.get(setting);
        if (cachedValue !== undefined) {
            // console.debug(`getSetting(${setting}) returning value from cache: ${JSON.stringify(cachedValue)}`)
            return cachedValue as T;
        }
        const defaultValue = AppSettingsDefaults[setting] as T
        // console.debug(`getSetting(${setting}) returning default value ${JSON.stringify(defaultValue)}`)
        // not in cache
        this.loadSetting(setting); // load it asynchronously, return default value while waiting
        return defaultValue;
    }

    /**
     * load value from the database and add it to the cache
     * @param setting
     * @param defaultValue
     * @private
     */
    private async loadSetting<T extends AppSettingType>(setting: ValidSettings): Promise<T> {
        const defaultValue = AppSettingsDefaults[setting] as T
        if (sessionOnlySettings.has(setting)) {
            // don't bother loading from db because session only settings are not saved to db
            this.updateCache(setting, defaultValue);
            return defaultValue;
        } else {
            await SETTINGS_DB.open();
            const dbValue = await SETTINGS_DB.getSetting(setting);
            const result: T = dbValue === undefined ? defaultValue : dbValue as T; // explicitly check for undefined
                                                                                   // instead of truthy
            this.updateCache(setting, result);
            return result;
        }
    }

    /**
     * load all known settings into the cache
     * @private
     */
    private async loadAllSettings() {
        const enumKeys = Object.keys(AppSettingsDefaults) // todo: can this be taken from AppSettings?
        for (const key of enumKeys) {
            await this.loadSetting(key as ValidSettings);
        }
        this.settingsLoaded = true;
    }

    /**
     * persist value to database (and update cache). ignores call if cache does not contain the setting (this can
     * happen if the UI loads before the settings have been loaded from the DB)
     * @param setting
     * @param value
     * @private
     */
    saveSetting(setting: ValidSettings, value: AppSettingType) {
        // todo: rethink how this should work
        // for now, only save setting to cache if a value is already there.
        // and only call updateCache initially from loadSetting
        if (!this.cache.has(setting)) {
            // console.debug(`saveSetting ${setting} -> ${value}, but setting has not been loaded from DB yet,
            // ignoring`)
            return;
        }
        this.updateCache(setting, value)
    }

    /**
     * update the cached value of the setting. dispatch changes.
     * returns true if the value of the setting has changed, false otherwise.
     * @param setting
     * @param value
     * @private
     */
    private updateCache(setting: ValidSettings, value: AppSettingType): boolean {
        if (this.cache.has(setting)) {
            const oldValue = this.cache.get(setting);
            if (stringifyDeterministically(oldValue) === stringifyDeterministically(value)) {
                // settings haven't changed.  prevent infinite loop by not dispatching
                return false;
            }

            // value was changed
            if (sessionOnlySettings.has(setting)) {
                // ignore. session-only settings don't get preserved to db
            } else {
                // update the db
                SETTINGS_DB.open().then(() => {
                    SETTINGS_DB.saveSetting(setting, value);
                })
            }

        } else {
            // the first time we're trying to update this cache key. This means this call was the result of loading
            // from the DB don't re-save it to the db (not necessary)
        }
        // settings have changed. update cache and dispatch event
        this.cache.set(setting, value);
        this.dispatch(setting, value);
        return true
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

    stages.forEach((stage: StandardStageDefinition, stageIndex) => {
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
                stageIndex: stageIndex,
                exerciseNumber: thisStageExerciseNum,
                instructions: null,
                source: SampleSource.AMBIENT,
                state: SegmentState.PURGE,
                protocolStartTimeOffsetSeconds: currentOffset,
                duration: stage.ambient_purge,
                data: []
            };
            segments.push(ambientPurgeSegment);
            currentOffset += ambientPurgeSegment.duration;
        }

        if (stage.ambient_sample > 0) {
            const ambientSampleSegment: ProtocolSegment = {
                index: segments.length,
                stageIndex: stageIndex,
                exerciseNumber: thisStageExerciseNum,
                instructions: null,
                source: SampleSource.AMBIENT,
                state: SegmentState.SAMPLE,
                protocolStartTimeOffsetSeconds: currentOffset,
                duration: stage.ambient_sample,
                data: []
            };
            segments.push(ambientSampleSegment);
            currentOffset += ambientSampleSegment.duration;
        }

        // mask segments
        if (stage.mask_purge > 0) {
            const maskPurgeSegment: ProtocolSegment = {
                index: segments.length,
                stageIndex: stageIndex,
                exerciseNumber: thisStageExerciseNum,
                instructions: null,
                source: SampleSource.MASK,
                state: SegmentState.PURGE,
                protocolStartTimeOffsetSeconds: currentOffset,
                duration: stage.mask_purge,
                data: []
            };
            segments.push(maskPurgeSegment);
            currentOffset += maskPurgeSegment.duration;
        }

        if (stage.mask_sample > 0) {
            const maskSampleSegment: ProtocolSegment = {
                index: segments.length,
                stageIndex: stageIndex,
                exerciseNumber: thisStageExerciseNum,
                instructions: stage.instructions,
                source: SampleSource.MASK,
                state: SegmentState.SAMPLE,
                protocolStartTimeOffsetSeconds: currentOffset,
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
    const qualifiedSettingsKeys = Object.values(AppSettings).filter((key) => !sessionOnlySettings.has(key));
    const keysString = JSON.stringify(qualifiedSettingsKeys.sort())
    const data = new TextEncoder().encode(keysString);
    const digest = await crypto.subtle.digest("SHA-1", data);
    const digestString = Array.from(new Uint8Array(digest), (byte) => String.fromCodePoint(byte)).join("")
    return btoa(digestString) // base64-ify
}
