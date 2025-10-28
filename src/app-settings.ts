import {AppSettings, AppSettingType, ValidSettings} from "src/app-settings-types.ts";
import {defaultConfigManager} from "src/config/config-context.tsx";
import {ConfigListener} from "src/config/config-manager.ts";
import {getStageDuration} from "src/protocol-executor/utils.ts";
import {validateProtocols} from "src/protocol-validator.ts";
import {DataSource} from "./data-source.ts";
import {
    StandardizedProtocolDefinitions, standardizeProtocolDefinitions,
    StandardProtocolDefinition,
    StandardStageDefinition
} from "./simple-protocol.ts";
import {TestTemplate} from "./SimpleResultsDB.ts";

function isSessionOnlySetting(setting: ValidSettings) {
    return setting.toLowerCase().startsWith("so-")
}

export interface SettingsListener {
    subscriptions(): AppSettings[],
    settingsChanged(setting: ValidSettings, value: AppSettingType): void
}

// todo put these into utils?
function isThisAnExerciseStage(stage: StandardStageDefinition) {
    return stage.mask_sample > 0
}

export function calculateNumberOfExercises(protocol: StandardProtocolDefinition) {
    return protocol.reduce((numExercises: number, stage: StandardStageDefinition) => numExercises + (isThisAnExerciseStage(stage) ? 1 : 0), 0);
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
    private _protocolStages: StandardStageDefinition[] = []; // kept in sync with selected protocol
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
                        this.saveSetting(AppSettings.SELECTED_DATA_SOURCE, defaultConfigManager.getDefaultValue(AppSettings.SELECTED_DATA_SOURCE))
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


    getDefault<T extends AppSettingType>(setting: ValidSettings): T {
        return defaultConfigManager.getDefaultValue<T>(setting);
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
    get protocolStages(): StandardStageDefinition[] {
        return this._protocolStages;
    }

    set protocolStages(value: StandardStageDefinition[]) {
        this._protocolStages = value
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
        return calculateNumberOfExercises(this.protocolStages)
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

    resetToDefault<T>(setting: ValidSettings):T {
        console.debug(`resetting setting ${setting} to defaults`)
        const defaultValue = this.getDefault<T>(setting);
        this.saveSetting(setting, defaultValue)
        return defaultValue
    }

    private get protocolDefinitions(): StandardizedProtocolDefinitions {
        // todo: cache these. for now, fetch them every time
        const protocolDefs = standardizeProtocolDefinitions(this.getSetting<StandardizedProtocolDefinitions>(AppSettings.PROTOCOL_INSTRUCTION_SETS));
        if (validateProtocols(protocolDefs)) {
            return protocolDefs;
        }
        console.debug("could not parse protocols from settings, resetting to default")
        return this.resetToDefault(AppSettings.PROTOCOL_INSTRUCTION_SETS)
    }

    public getTestTemplate(): Readonly<TestTemplate> {
        return this.getSetting(AppSettings.TEST_TEMPLATE)
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
    saveSetting<T extends AppSettingType>(setting: ValidSettings, value: T) {
        defaultConfigManager.setConfig(setting, value);
    }


    private updateProtocolStages(selectedProtocol: string) {
        console.debug(`updateProtocolStages ${selectedProtocol}`);
        const protocolStages = (this.protocolDefinitions)[selectedProtocol];
        if (!protocolStages) {
            return;
        }
        this.protocolStages = protocolStages;
    }

    getProtocolDuration(protocolName: string): number {
        // todo: this should be pre-calculated since these wouldn't change
        const protocolDefinition: StandardStageDefinition[] = this.protocolDefinitions[protocolName] ?? [];
        return protocolDefinition.reduce((result, stage) =>
            result + getStageDuration(stage), 0)
    }

    // todo: move protocol functions elsewhere
    getProtocolTimeRemaining(): number {
        const protocolName = this.getSetting<string>(AppSettings.SELECTED_PROTOCOL)
        const currentStageIndex = this.getSetting<number>(AppSettings.CURRENT_STAGE_INDEX);
        const stageStartTime = this.getSetting<number>(AppSettings.STAGE_START_TIME);
        const stages: StandardStageDefinition[] = this.protocolDefinitions[protocolName] ?? [];
        const currentStage = stages[currentStageIndex];
        const currentStageElapsedMs = Date.now() - stageStartTime
        const msRemaining = stages.filter((_stage, index) => currentStageIndex < index).reduce((result, stage) => result + 1000 * getStageDuration(stage), Math.max(0, 1000 * getStageDuration(currentStage) - currentStageElapsedMs))
        return msRemaining;
    }
}

export const APP_SETTINGS_CONTEXT = new AppSettingsContext()


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
