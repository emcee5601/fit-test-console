import {Dispatch, SetStateAction} from "react";
import {Getter, useConfig} from "src/config/use-config.tsx";
import {AppSettings, AppSettingType} from "src/app-settings-types.ts";

export function useSetting<T extends AppSettingType>(name: AppSettings): [T, Dispatch<SetStateAction<T>>, Getter<T>] {
    return useConfig<T>(name);
}
