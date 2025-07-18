import {useSetting} from "src/use-setting.ts";
import {useEffect} from "react";
import {AppSettings} from "src/app-settings-types.ts";

export function ColorSchemeSwitcher() {
    const [colorScheme] = useSetting<string>(AppSettings.COLOR_SCHEME)
    useEffect(() => {
        document.querySelector('meta[name="color-scheme"]')?.setAttribute('content', colorScheme);
    }, [colorScheme]);
    return(<></>)
}
