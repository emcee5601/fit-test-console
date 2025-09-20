import {createContext} from "react";
import stringifyDeterministically from "json-stringify-deterministic";

export type Config<T> = { name: string, value: T }

export interface ConfigListener {
    subscriptions(): string[],
    configChanged<T>(name: string, value: T): void,
}

class ConfigManager {
    private cache = new Map<string, unknown>();
    private defaults = new Map<string, unknown>()
    private listeners: ConfigListener[] = []

    private getStorageKey(name: string): string {
        return `config-${name}`;
    }

    addListener(listener: ConfigListener): void {
        this.listeners.push(listener)
    }

    removeListener(listener: ConfigListener): void {
        this.listeners = this.listeners.filter(item => listener !== item)
    }


    setDefaults(configs: Config<unknown>[]) {
        configs.forEach((config) => {
            this.setDefault(config.name, config.value);
        });
    }

    setDefault<T>(name: string, value: T) {
        this.defaults.set(name, value);
    }

    getConfig<T>(name: string, defaultValue: T = {} as T): T {
        const storageKey = this.getStorageKey(name);
        if (!this.cache.has(name)) {
            const storedValue = localStorage.getItem(storageKey);
            const value = storedValue === null ? this.getDefaultValue(name, defaultValue) : JSON.parse(storedValue) as T;
            this.cache.set(name, value);
        }
        return this.cache.get(name) as T;
    }

    getDefaultValue<T>(name: string, defaultValue: T = {} as T): T {
        const defValue: T = this.defaults.has(name) ? this.defaults.get(name) as T : defaultValue
        if (defValue === undefined) {
            // this should never happen
            console.warn(`No default value for ${name}, using ""`)
        }
        return defValue
    }

    setConfig<T>(name: string, value: T) {
        const prev = this.cache.get(name);
        if( prev === value ) {
            // todo: deep compare
            // no change
            return;
        }
        this.cache.set(name, value);
        localStorage.setItem(this.getStorageKey(name), stringifyDeterministically(value));
        this.dispatch(name, value)
    }

    private dispatch<T>(name: string, value: T) {
        this.listeners.forEach(listener => {
            if (listener.subscriptions().includes(name)) {
                (async () => {
                    listener.configChanged(name, value)
                })()
            }
        })
    }
}

export const defaultConfigManager = new ConfigManager();
export const ConfigContext = createContext(defaultConfigManager);
