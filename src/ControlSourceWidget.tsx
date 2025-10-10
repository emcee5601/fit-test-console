import {PortaCountClient8020, PortaCountListener} from "./portacount-client-8020.ts";
import {useContext, useEffect, useState} from "react";
import {AppContext} from "./app-context.ts";
import {FaLaptop} from "react-icons/fa";
import {TfiTablet} from "react-icons/tfi";
import {ControlSource} from "src/portacount/porta-count-state.ts";

export function ControlSourceWidget() {
    const appContext = useContext(AppContext)
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
        client.externalController.controlSource = controlSource == ControlSource.Internal ? ControlSource.External : ControlSource.Internal;
    }

    return (
        <div id={"control-source-widget"} onClick={toggleSetting} className={"svg-container icon-button"}>
            {controlSource === ControlSource.External && <FaLaptop/>}
            {controlSource === ControlSource.Internal && <TfiTablet/>}
        </div>
    )
}
