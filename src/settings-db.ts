import AbstractDB from "./abstract-db.ts";
import {Dispatch, SetStateAction, useEffect, useState} from "react";

type SettingsDBEntry<T> = { ID: string, value: T }

export enum AppSettings {
    SPEECH_ENABLED = "speech-enabled",
    ADVANCED_MODE = "advanced-mode",
    SPEECH_VOICE = "speech-voice",
    VERBOSE = "verbose",
    SAY_PARTICLE_COUNT = "say-particle-count",
    RESULTS_TABLE_SORT = "results-table-sort",
    AUTO_ESTIMATE_FIT_FACTOR = "auto-estimate-fit-factor",
    SAY_ESTIMATED_FIT_FACTOR = "say-estimated-fit-factor",
    DEFAULT_TO_PREVIOUS_PARTICIPANT = "default-to-previous-participant",
    SHOW_EXTERNAL_CONTROL = "show-external-control",
    SHOW_PROTOCOL_EDITOR = "show-protocol-editor",
    SHOW_SIMPLE_PROTOCOL_EDITOR = "show-simple-protocol-editor",
    BAUD_RATE = "baud-rate",
    PROTOCOL_INSTRUCTION_SETS = "protocol-instruction-sets",
    SELECTED_PROTOCOL = "selected-protocol",
    SHOW_SETTINGS = "show-settings",
    SHOW_LOG_PANELS = "show-log-panels",
    KEEP_SCREEN_AWAKE = "keep-screen-awake",
}

const defaultSettings: { [key: string]: unknown } = {}
defaultSettings[
    AppSettings.PROTOCOL_INSTRUCTION_SETS] = {
        "json": {
            "w1": [
                "Normal breathing. Breathe normally",
                "Heavy breathing. Take deep breaths.",
                "Jaw movement. Read a passage, sing a song, talk, or pretend to do so.",
                "Head movement. Look up, down, left, and right. Repeat."
            ],
        }
    };

interface Cache {
    [key: string]: unknown;
}

class SettingsDB extends AbstractDB {
    static DB_NAME = "settings-db";
    static OBJECT_STORE_NAME = "settings-data";
    private readonly settingsCache: Cache = {};

    constructor(name = SettingsDB.DB_NAME) {
        super(name, [SettingsDB.OBJECT_STORE_NAME], 1)
    }

    override onUpgradeNeeded(request: IDBOpenDBRequest) {
        const theDb = request.result;

        console.warn(`Database upgrade needed: ${theDb.name}`);
        // Create an objectStore for this database
        theDb.createObjectStore(SettingsDB.OBJECT_STORE_NAME, {keyPath: "ID"});
    }

    private updateCache<T>(entry: SettingsDBEntry<T>) {
        this.settingsCache[entry.ID] = entry.value;
        console.log(`getSettings ${entry.ID}: ${JSON.stringify(entry.value)}`);
    }

    public async getSetting<T>(name: AppSettings, defaultValue?: T): Promise<T> {
        const result = await this.get<SettingsDBEntry<T>>(SettingsDB.OBJECT_STORE_NAME, name);
        if (result) {
            this.updateCache<T>(result)
            return result.value;
        }
        if (defaultValue) {
            console.log(`getSettings ${name}; no saved setting, returning default ${defaultValue}`)
            return defaultValue
        }
        const defaultSetting = defaultSettings[name] as T;
        console.log(`getSettings ${name}; no saved setting and no primary default setting, returning fallback default setting ${defaultSetting}`)
        return defaultSetting;
    }

    async saveSetting<T>(name: AppSettings, value: T) {
        if (name in this.settingsCache && this.settingsCache[name] === value) {
            // we have a value in the cache, and the new value is the same as what's in the cache
            console.log(`saving settings ${name} but nothing was changed`)
            return;
        }
        const entry = {ID: name, value: value}
        this.updateCache(entry);
        return this.put<SettingsDBEntry<T>>(SettingsDB.OBJECT_STORE_NAME, entry)
    }
}


export const SETTINGS_DB:SettingsDB = new SettingsDB();

export function useDBSetting<T>(setting: AppSettings, defaultValue?: T): [T, Dispatch<SetStateAction<T>>] {
    const [value, setValue] = useState<T>(defaultValue || defaultSettings[setting] as T);
    const [loadedFromDb, setLoadedFromDb] = useState(false);

    // initialize (can't depend on defaultValue or it will loop forever, also can't remove deps array or it will loop forever)
    useEffect(() => {
        SETTINGS_DB.open().then(() => {
            SETTINGS_DB.getSetting(setting, defaultValue).then((v) => {
                setValue(v)
                setLoadedFromDb(true);
            })
        })
    }, []);
    // update the db when the setting changes
    useEffect(() => {
        if (loadedFromDb) {
            SETTINGS_DB.saveSetting(setting, value);
            console.log(`updating setting ${setting} -> ${JSON.stringify(value)}`)
        }
    }, [setting, value, loadedFromDb]);
    return [value, setValue]
}
