import {Dispatch, SetStateAction, useContext, useEffect, useState} from "react";
import {ConfigContext} from "src/config/config-context.tsx";
import {ConfigListener} from "src/config/config-manager.ts";

export type Getter<T> = () => T;

// todo: allow defaultValue to take a function so we can defer calculating it
export function useConfig<T>(name: string, defaultValue:T = {} as T): [T, Dispatch<SetStateAction<T>>, Getter<T>] {
    const configManager = useContext(ConfigContext)
    const [value, setValue] = useState<T>(configManager.getConfig(name, defaultValue));

    useEffect(() => {
        const listener: ConfigListener = {
            subscriptions: () => [name],
            configChanged(_changedSetting: string, newValue: unknown): void {
                setValue(newValue as T);
            }
        }
        configManager.addListener(listener);
        return () => configManager.removeListener(listener)
    }, []);

    const setValueImmediate: Dispatch<SetStateAction<T>> = (param) => {
        const result = (typeof param === "function")
            // @ts-expect-error we know param is a function here
            ? param(configManager.getConfig(name, defaultValue))
            : param;
        configManager.setConfig(name, result);
        setValue(result);
    }
    const getValueImmediate: Getter<T> = () => configManager.getConfig(name);
    return [value, setValueImmediate, getValueImmediate]
}
