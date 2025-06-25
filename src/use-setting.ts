import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {AppSettings, AppSettingType} from "./app-settings.ts";
import {useConfig} from "src/config/use-config.tsx";
import stringifyDeterministically from "json-stringify-deterministic";

export function useSetting<T extends AppSettingType>(setting: AppSettings): [T, Dispatch<SetStateAction<T>>] {
    const [config, setConfig] = useConfig(setting, "[]");

    function configToSetting(config: string): T {
        return JSON.parse(config) as T;
    }

    function settingToConfig(setting: unknown): string {
        return stringifyDeterministically(setting);
    }

    const [value, setValue] = useState(configToSetting(config))

    useEffect(() => {
        setConfig(settingToConfig(value))
    }, [value]);
    useEffect(() => {
        setValue(configToSetting(config))
    }, [config]);

    return [value, setValue]
}
