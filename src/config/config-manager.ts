import stringifyDeterministically from "json-stringify-deterministic";

export type Config<T> = { name: string, value: T }

export interface ConfigListener {
    subscriptions(): string[],
    configChanged<T>(name: string, value: T): void,
}

export class ConfigManager {
    private cache = new Map<string, unknown>();
    private defaults = new Map<string, unknown>()
    private listeners: ConfigListener[] = []
    private readonly sessionConfigPrefix: string | null;


    /**
     * @param sessionConfigPrefix when specified, any config with this prefix will only be saved to the app instance
     *     cache.
     */
    constructor(sessionConfigPrefix?: string) {
        this.sessionConfigPrefix = sessionConfigPrefix || null;
    }

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
            const storedValue =
                this.isSessionOnlyConfig(name)
                    ? null
                    : localStorage.getItem(storageKey);
            const value = storedValue === null ? this.getDefaultValue(name, defaultValue) : JSON.parse(storedValue) as T;
            this.cache.set(name, value);
        }
        return this.cache.get(name) as T;
    }

    private isSessionOnlyConfig(name: string) {
        return this.sessionConfigPrefix && name.startsWith(this.sessionConfigPrefix);
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
        if (prev === value) {
            // todo: deep compare
            // no change
            return;
        }
        this.cache.set(name, value);
        if (!this.isSessionOnlyConfig(name)) {
            localStorage.setItem(this.getStorageKey(name), stringifyDeterministically(value));
        }
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
