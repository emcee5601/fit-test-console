import {PortaCountClient8020, PortaCountListener} from "./portacount-client-8020.ts";
import {useContext, useEffect, useState} from "react";
import {AppContext} from "./app-context.ts";
import {ControlSource} from "./control-source.ts";
import {RiComputerLine, RiRobot2Line} from "react-icons/ri";
import {useSetting} from "src/use-setting.ts";
import {AppSettings} from "src/app-settings.ts";

export function ControlSourceWidget() {
    const appContext = useContext(AppContext)
    const client: PortaCountClient8020 = appContext.portaCountClient
    const [controlSource, setControlSource] = useState(client.state.controlSource)
    const [controlSourceInView] = useSetting<boolean>(AppSettings.CONTROL_SOURCE_IN_VIEW)

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

    return (
        !controlSourceInView ? <div id={"control-source-widget"}>
            {controlSource === ControlSource.External && <RiComputerLine />}
            {controlSource === ControlSource.Internal && <RiRobot2Line />}
        </div> : null
    )
}
