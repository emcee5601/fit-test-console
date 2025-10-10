import {useCallback, useEffect, useRef} from "react";
import {useSetting} from "./use-setting.ts";
import {AppSettings} from "src/app-settings-types.ts";

/**
 * hook to prevent screen from going to sleep tied to a setting.
 * todo: make the setting optional?
 * note: must be used within a component that is always visible?
 */
export const useWakeLock = () => {
    const [keepScreenAwake] = useSetting<boolean>(AppSettings.KEEP_SCREEN_AWAKE);
    const wakeLock = useRef<WakeLockSentinel | null>(null)

    async function requestWakeLock() {
        // console.debug("requestWakeLock()")
        if (wakeLock.current === null && document.visibilityState === 'visible') {
            try {
                wakeLock.current = await navigator.wakeLock.request('screen')
            } catch (error) {
                console.warn(error)
            }
        } else {
            // console.debug("not visible or already have a wakelock")
        }
    }

    const handleVisibilityChange = useCallback(() => {
        if (keepScreenAwake) {
            requestWakeLock();
        }
    }, [keepScreenAwake])

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
        return () => {document.removeEventListener('visibilitychange', handleVisibilityChange);}
    }, [keepScreenAwake, handleVisibilityChange]);
}
