import {PortaCountClient8020, PortaCountListener} from "./portacount-client-8020.ts";
import {useContext, useEffect, useState} from "react";
import {AppContext} from "./app-context.ts";
import {ControlSource} from "./control-source.ts";
import {useSetting} from "src/use-setting.ts";
import {AppSettings} from "src/app-settings.ts";
import {FaLaptop} from "react-icons/fa";
import {TfiTablet} from "react-icons/tfi";

export function ControlSourceWidget() {
    const appContext = useContext(AppContext)
    const client: PortaCountClient8020 = appContext.portaCountClient
    const [controlSource, setControlSource] = useState(client.state.controlSource)
    const [controlSourceInView] = useSetting<boolean>(AppSettings.CONTROL_SOURCE_IN_VIEW)
    const [showCompactControls] = useSetting<boolean>(AppSettings.USE_COMPACT_UI);
    const [showExternalControl] = useSetting<boolean>(AppSettings.SHOW_EXTERNAL_CONTROL)

    useEffect(() => {
        const listener: PortaCountListener = {
            controlSourceChanged(source: ControlSource) {
                setControlSource(source);
            },
        };
        client.addListener(listener);
        return () => {
            client.removeListener(listener)
        };
    }, []);

    function toggleSetting() {
        client.externalController.controlSource = controlSource == ControlSource.Internal ? ControlSource.External : ControlSource.Internal;
    }

    return (
        showExternalControl && (!controlSourceInView || showCompactControls)? <div id={"control-source-widget"} onClick={toggleSetting} className={"svg-container"}>
            {controlSource === ControlSource.External && <FaLaptop/>}
            {controlSource === ControlSource.Internal && <TfiTablet/>}
        </div> : null
    )
}
