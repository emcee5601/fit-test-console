import {Dispatch, SetStateAction, useContext, useEffect, useState} from "react";
import {AppContext} from "./app-context.ts";
import {AppSettings, AppSettingType, SettingsListener, ValidSettings} from "./app-settings.ts";

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
                // console.debug(`useSetting SettingsListener called for ${_changedSetting}: ${JSON.stringify(newValue)}`);
                setValue(newValue);
            }
        }
        settingsContext.addListener(listener);
        return () => settingsContext.removeListener(listener)
    }, []);

    useEffect(() => {
        // propagate changes to settings context
        // console.debug(`useSetting() updating setting ${setting} -> ${JSON.stringify(value)}`)
        settingsContext.saveSetting(setting, value);
    }, [value]);
    return [value, setValue]
}
