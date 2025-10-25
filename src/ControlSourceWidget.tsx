import {useContext, useEffect, useState} from "react";
import {FaLaptop} from "react-icons/fa";
import {TfiTablet} from "react-icons/tfi";
import {AppSettings} from "src/app-settings-types.ts";
import {ControlSource} from "src/portacount/porta-count-state.ts";
import {useSetting} from "src/use-setting.ts";
import {AppContext} from "./app-context.ts";
import {PortaCountClient8020, PortaCountListener} from "./portacount-client-8020.ts";

export function ControlSourceWidget() {
    const appContext = useContext(AppContext)
    const [enabled] = useSetting<boolean>(AppSettings.ENABLE_CONTROL_SOURCE_WIDGET)
    const client: PortaCountClient8020 = appContext.portaCountClient
    const [controlSource, setControlSource] = useState(client.state.controlSource)

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
        if(enabled) {
            client.externalController.controlSource = controlSource == ControlSource.Internal ? ControlSource.External : ControlSource.Internal;
        } else {
            // Sometimes we just want it as a status, not a control surface.
            console.log("ControlSourceWidget disabled by setting");
        }
    }

    return (
        <div id={"control-source-widget"} onClick={toggleSetting} className={`svg-container icon-button ${!enabled&&"disabled"}`} >
            {controlSource === ControlSource.External && <FaLaptop/>}
            {controlSource === ControlSource.Internal && <TfiTablet/>}
        </div>
    )
}
