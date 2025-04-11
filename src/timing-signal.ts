/**
 * Global interval that goes off every second. Intended use is to synchronize periodic updates to the ui, for clocks
 * etc.
 */
import {useContext, useEffect, useRef} from "react";
import {AppContext} from "src/app-context.ts";

export interface TimingSignalListener {
    tick(clockTimeMs: number): void;
}

class TimingSignal {
    private readonly listeners: TimingSignalListener[] = []
    private readonly intervalMs: number;
    private intervalId?: NodeJS.Timeout;


    constructor(intervalMs: number = 1000) {
        this.intervalMs = intervalMs;
    }

    addListener(listener: TimingSignalListener) {
        this.listeners.push(listener)
    }

    removeListener(listener: TimingSignalListener) {
        this.listeners.filter((value, index, array) => {
            if (value === listener) {
                array.splice(index, 1);
                return true
            }
            return false;
        })
    }

    private tick() {
        const now = Date.now()
        this.listeners.forEach((listener) => {
            listener.tick(now)
        })
    }

    start() {
        this.intervalId = setInterval(() => {
            this.tick()
        }, this.intervalMs);
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId)
            this.intervalId = undefined;
        }
    }
}

export const timingSignal = new TimingSignal()


export function useTimingSignal(callback: () => void) {
    const appContext = useContext(AppContext);
    const nullFunction = () => {};
    const savedCallback = useRef<() => void>(nullFunction);

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        const listener: TimingSignalListener = {
            tick: () => {
                // console.debug("useTimingSignal tick")
                savedCallback.current();
            }
        }

        appContext.timingSignal.addListener(listener)
        return () => appContext.timingSignal.removeListener(listener)
    }, []);
}

