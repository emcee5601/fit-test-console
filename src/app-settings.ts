import {JSONContent} from "vanilla-jsoneditor";
import {Dispatch, SetStateAction, useContext, useEffect, useState} from "react";
import {ProtocolDefinitions, ShortStageDefinition, StageDefinition} from "./simple-protocol.ts";
import {deepCopy} from "json-2-csv/lib/utils";
import {AppContext} from "./app-context.ts";
import {SortingState} from "@tanstack/react-table";
import AbstractDB from "./abstract-db.ts";
import {SimpleResultsDBRecord} from "./SimpleResultsDB.ts";
import stringifyDeterministically from "json-stringify-deterministic";

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

/**
 * Settings can be of these types.
 */
export type AppSettingType = boolean | string | JSONContent | SortingState | Partial<SimpleResultsDBRecord>;

export interface SettingsListener {
    subscriptions?(): [AppSettings],

    settingsChanged?(setting: ValidSettings, value: AppSettingType): void

    ready?(): void;
}


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
    "auto-estimate-fit-factor": false,
    "say-estimated-fit-factor": false,
    "show-external-control": false,
    "baud-rate": "1200", // todo: make this a number
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
    "default-to-previous-participant": false, // deprecated
    "show-protocol-editor": false, // deprecated
    "show-simple-protocol-editor": false, // deprecated
    "show-settings": false, // deprecated
    "show-log-panels": false, // deprecated
    "show-historical-tests": false, // deprecated
    "show-current-test-panel": false, // deprecated
}
// this class should use AppSettingsType for type checking/ validations to ensure every setting has a default.
type ValidSettings = keyof typeof AppSettingsDefaults;

// enums as keys doesn't force defaults, but maybe these can be used as keys but the type can be a separate declaration
/**
 * App settings are managed here.
 * - Getters return the cached value. If there is no cached value, returns the default value and loads the DB value asynchronously.
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
    private _protocolStages: StageDefinition[] = [];
    private _ready: boolean = false;
    private settingsLoaded: boolean = false;

    constructor() {
        const listener: SettingsListener = {
            subscriptions: () => [AppSettings.SELECTED_PROTOCOL],
            settingsChanged: (_setting: ValidSettings, protocolName: AppSettingType) => {
                this.updateProtocolStages(protocolName as string);
            }
        };
        this.addListener(listener)
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
        console.debug(`dispatching setting ${setting}: ${JSON.stringify(value)}`);
        this.listeners.forEach((listener) => {
            if (listener.subscriptions && listener.settingsChanged) {
                if (listener.subscriptions().some((wantSetting) => wantSetting === setting)) {
                    listener.settingsChanged(setting, value);
                }
            }
        })
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

    get protocolStages(): StageDefinition[] {
        return this._protocolStages;
    }

    set protocolStages(value: StageDefinition[]) {
        this._protocolStages = value
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

    get protocolDefinitions(): ProtocolDefinitions {
        return (this.getSetting(AppSettings.PROTOCOL_INSTRUCTION_SETS) as JSONContent).json as ProtocolDefinitions;
    }

    set protocolDefinitions(value: ProtocolDefinitions) {
        this.saveSetting(AppSettings.PROTOCOL_INSTRUCTION_SETS, {"json": value})
    }

    get testTemplate(): Partial<SimpleResultsDBRecord> {
        return this.getSetting(AppSettings.TEST_TEMPLATE)
    }

    set testTemplate(value: Partial<SimpleResultsDBRecord>) {
        this.saveSetting(AppSettings.TEST_TEMPLATE, value)
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
            console.log(`getSetting(${setting}) returning value from cache: ${JSON.stringify(cachedValue)}`)
            return cachedValue as T;
        }
        const defaultValue = AppSettingsDefaults[setting] as T
        console.log(`getSetting(${setting}) returning default value ${JSON.stringify(defaultValue)}`)
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
        await SETTINGS_DB.open();
        const dbValue = await SETTINGS_DB.getSetting(setting);
        const defaultValue = AppSettingsDefaults[setting] as T
        const result: T = dbValue === undefined ? defaultValue: dbValue as T; // explicitly check for undefined instead of truthy
        this.updateCache(setting, result);
        return result;
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
            console.log(`saveSetting ${setting} -> ${value}, but setting has not been loaded from DB yet, ignoring`)
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
        if(this.cache.has(setting)) {
            const oldValue = this.cache.get(setting);
            if(stringifyDeterministically(oldValue) === stringifyDeterministically(value)) {
                // settings haven't changed.  prevent infinite loop by not dispatching
                return false;
            }

            // value was changed, update the db
            SETTINGS_DB.open().then(() => {
                SETTINGS_DB.saveSetting(setting, value);
            })

        } else {
            // the first time we're trying to update this cache key. This means this call was the result of loading from the DB
            // don't re-save it to the db (not necessary)
        }
        // settings have changed. update cache and dispatch event
        this.cache.set(setting, value);
        this.dispatch(setting, value);
        return true
    }


    private updateProtocolStages(selectedProtocol: string) {
        console.log(`updateProtocolStages ${selectedProtocol}`);
        const protocol = (this.protocolDefinitions)[selectedProtocol];
        if (!protocol) {
            return;
        }
        const stages = protocol.map((item) => {
            let stageDefinition: StageDefinition;
            if (typeof item === "string") {
                stageDefinition = {
                    instructions: item,
                };
            } else if ((item as StageDefinition).instructions !== undefined) {
                stageDefinition = deepCopy(item) as StageDefinition
            } else if ((item as ShortStageDefinition).i !== undefined) {
                const ssd = item as ShortStageDefinition;
                stageDefinition = {
                    instructions: ssd.i,
                    purge_duration: ssd.p,
                    ambient_duration: ssd.a,
                    sample_duration: ssd.s
                }
            } else {
                console.error(`unexpected item in protocol definition: ${JSON.stringify(item)}`)
                return;
            }
            return stageDefinition;
        }).filter((value) => {
            return value !== undefined
        });
        this.protocolStages = stages;
    }
}

export const APP_SETTINGS_CONTEXT = new AppSettingsContext()

// todo: move default value handling to AppSettingsContext, not the caller of useSetting()
export function useSetting<T extends AppSettingType>(setting: AppSettings): [T, Dispatch<SetStateAction<T>>] {
    // initialize the value from settings context
    const settingsContext = useContext(AppContext).settings
    const [value, setValue] = useState<T>(settingsContext.getSetting<T>(setting));

    useEffect(() => {
        // setValue(APP_SETTINGS_CONTEXT.getSetting<T>(setting, defaultValue))

        const listener: SettingsListener = {
            subscriptions: () => [setting],
            settingsChanged(_changedSetting: ValidSettings, newValue: T) {
                // when the setting changes, update the UI
                console.debug(`useSetting SettingsListener called for ${_changedSetting}: ${JSON.stringify(newValue)}`);
                setValue(newValue);
            }
        }
        settingsContext.addListener(listener);
        return () => settingsContext.removeListener(listener)
    }, []);

    useEffect(() => {
        // propagate changes to settings context
        console.log(`useSetting() updating setting ${setting} -> ${JSON.stringify(value)}`)
        settingsContext.saveSetting(setting, value);
    }, [value]);
    return [value, setValue]
}

