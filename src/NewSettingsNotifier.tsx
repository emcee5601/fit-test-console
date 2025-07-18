import {useSetting} from "src/use-setting.ts";
import {calculateSettingsKeysHash} from "src/app-settings.ts";
import {useContext, useEffect} from "react";
import {useNavigate} from "react-router";
import {AppContext} from "src/app-context.ts";
import {AppSettings} from "src/app-settings-types.ts";

/**
 * Show an alert dialog when there are new settings in this version of the app vs the last time we've run this check.
 */
export function NewSettingsNotifier() {
    const appContext = useContext(AppContext)
    const [, setLastKnownSettingsKeysHash] = useSetting<string>(AppSettings.LAST_KNOWN_SETTINGS_KEYS_HASH)
    const navigate = useNavigate()
    useEffect(() => {
        appContext.settings.getActualSetting<string>(AppSettings.LAST_KNOWN_SETTINGS_KEYS_HASH).then((lastKnownSettingsKeysHash) => {
            calculateSettingsKeysHash().then((currentHash) => {
                if (currentHash !== lastKnownSettingsKeysHash) {
                    setLastKnownSettingsKeysHash(currentHash);
                    navigate("/settings")
                    alert("New settings are available")
                }
            })
        })
    }, []);
    return (<div id={"new-settings-notifier"} style={{display: "none"}}/>)
}
