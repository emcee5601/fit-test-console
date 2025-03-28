import {useEffect, useRef} from "react";

/**
 * from https://overreacted.io/making-setinterval-declarative-with-react-hooks/
 * @param callback
 * @param delay
 */
export function useInterval(callback: () => void, delay: number|null) {
    const nullFunction = () => {};
    const savedCallback = useRef<() => void>(nullFunction);

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            const id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}
