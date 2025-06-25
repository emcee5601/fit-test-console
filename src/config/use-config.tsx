import {Dispatch, SetStateAction, useContext, useEffect, useState} from "react";
import {ConfigContext, ConfigListener} from "src/config/config-context.tsx";

export function useConfig(name: string, defaultValue?:string): [string, Dispatch<SetStateAction<string>>] {
    const configManager = useContext(ConfigContext)
    const [value, setValue] = useState<string>(configManager.getConfig(name) || defaultValue || "");

    useEffect(() => {
        const listener: ConfigListener = {
            subscriptions: () => [name],
            configChanged(_changedSetting: string, newValue: string): void {
                setValue(newValue);
            }
        }
        configManager.addListener(listener);
        return () => configManager.removeListener(listener)
    }, []);

    useEffect(() => {
        // propagate changes to context
        configManager.setConfig(name, value);
    }, [value]);
    return [value, setValue]
}
