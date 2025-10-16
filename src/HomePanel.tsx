import './App.css'
import {useEffect} from "react";
import {useNavigate} from "react-router";
import {AppSettings} from "src/app-settings-types.ts";
import {BrowserDetect} from "src/BrowserDetect.tsx";
import {useSetting} from "./use-setting.ts";

export function HomePanel() {
    const [enableTesterMode] = useSetting<boolean>(AppSettings.ENABLE_TESTER_MODE)
    const navigate = useNavigate()
    useEffect(() => {
        if (enableTesterMode) {
            navigate("/test")
        } else {
            navigate("/view-results")
        }
    }, []);

    return (<>
        <BrowserDetect/>
    </>)
}
