import {UnsupportedBrowser} from "src/UnsupportedBrowser.tsx";

export function BrowserDetect() {
    const browserIsSupported = navigator.userAgent.includes("Chrome");
    return(<>
        {!browserIsSupported&&<UnsupportedBrowser/>}
    </>)
}
