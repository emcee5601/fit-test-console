import {useSetting} from "src/use-setting.ts";
import {AppSettings} from "src/app-settings.ts";
import {useEffect} from "react";

export function ColorSchemeSwitcher() {
    const [colorScheme] = useSetting<string>(AppSettings.COLOR_SCHEME)
    useEffect(() => {
        document.querySelector('meta[name="color-scheme"]')?.setAttribute('content', colorScheme);
    }, [colorScheme]);
    return(<></>)
}
