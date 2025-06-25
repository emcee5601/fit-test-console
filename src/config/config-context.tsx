import {createContext} from "react";

export type Config = { name: string, value: string }

export interface ConfigListener {
    subscriptions(): string[],
    configChanged(name: string, value: string): void,
}

class ConfigManager {
    private cache = new Map<string, string>();
    private defaults = new Map<string, string>()
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


    setDefaults(configs: Config[]) {
        configs.forEach((config) => {
            this.setDefault(config.name, config.value);
        });
    }

    setDefault(name: string, value: string) {
        this.defaults.set(name, value);
    }

    getConfig(name: string, defaultValue?: string) {
        const storageKey = this.getStorageKey(name);
        if (!this.cache.has(name)) {
            const storedValue = localStorage.getItem(storageKey);
            const value = storedValue ?? this.getDefaultValue(name, defaultValue);
            this.cache.set(name, value);
        }
        return this.cache.get(name);
    }

    private getDefaultValue(name: string, defaultValue?: string): string {
        const defValue = defaultValue ?? this.defaults.get(name)
        if (defValue === undefined) {
            console.warn(`No default value for ${name}, using ""`)
        }
        return defValue || ""
    }

    setConfig(name: string, value: string) {
        const prev = this.cache.get(name);
        if( prev === value ) {
            // no change
            return;
        }
        this.cache.set(name, value);
        localStorage.setItem(this.getStorageKey(name), value);
        this.dispatch(name, value)
    }

    private dispatch(name: string, value: string) {
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
