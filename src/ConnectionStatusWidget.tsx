import {useContext, useEffect, useState} from "react";
import {PortaCountListener} from "src/portacount-client-8020.ts";
import {AppContext} from "src/app-context.ts";
import {HiLinkSlash} from "react-icons/hi2";
import {PiPlugsConnectedLight} from "react-icons/pi";
import {MdOutlinePending} from "react-icons/md";
import {useSetting} from "src/use-setting.ts";
import {AppSettings} from "src/app-settings.ts";
import {ConnectionStatus} from "src/connection-status.ts";

export function ConnectionStatusWidget() {
    const appContext = useContext(AppContext)
    const portaCountClient = appContext.portaCountClient
    const [connectionStatus, setConnectionStatus] = useState(portaCountClient.state.connectionStatus)
    const [connectionStatusInView] = useSetting<boolean>(AppSettings.CONNECTION_STATUS_IN_VIEW)

    useEffect(() => {
        const listener: PortaCountListener = {
            connectionStatusChanged(connectionStatus: ConnectionStatus) {
                setConnectionStatus(connectionStatus)
            }
        };
        portaCountClient.addListener(listener);
        return () => {
            portaCountClient.removeListener(listener)
        };
    }, []);

    return (
        !connectionStatusInView ? <div>
            {connectionStatus === ConnectionStatus.DISCONNECTED && <HiLinkSlash/>}
            {connectionStatus === ConnectionStatus.WAITING && <MdOutlinePending/>}
            {connectionStatus === ConnectionStatus.RECEIVING && <PiPlugsConnectedLight/>}
        </div> : null
    )
}
