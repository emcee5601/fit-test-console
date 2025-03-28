import {useCallback, useEffect, useRef} from "react";
import {AppSettings, useSetting} from "./app-settings.ts";

/**
 * hook to prevent screen from going to sleep tied to a setting.
 * todo: make the setting optional?
 * note: must be used within a component that is always visible?
 */
export const useWakeLock = () => {
    const [keepScreenAwake] = useSetting<boolean>(AppSettings.KEEP_SCREEN_AWAKE);
    const wakeLock = useRef<WakeLockSentinel | null>(null)

    async function requestWakeLock() {
        console.debug("requestWakeLock()")
        wakeLock.current = await navigator.wakeLock.request('screen');
    }

    const handleVisibilityChange = useCallback(() => {
        if (wakeLock.current !== null && document.visibilityState === 'visible' && keepScreenAwake) {
            requestWakeLock();
        }
    },[])

    useEffect(() => {
        if (keepScreenAwake) {
            requestWakeLock();
            document.addEventListener('visibilitychange', handleVisibilityChange);
        } else if (wakeLock.current !== null) {
            console.debug("removing wake lock")
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            wakeLock.current.release().then(() => {
                wakeLock.current = null;
            })
        }
    }, [keepScreenAwake]);
}
