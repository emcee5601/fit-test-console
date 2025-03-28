import {ConnectionStatus, PortaCountClient8020, PortaCountListener} from "./portacount-client-8020.ts";
import {useContext, useEffect, useState} from "react";
import {getConnectionStatusCssClass} from "./utils.ts";
import {AppContext} from "./app-context.ts";

/**
 * Displays connection status.
 * @constructor
 */
export function PortaCountConnectionStatusWidget() {
    const appContext = useContext(AppContext)
    const client: PortaCountClient8020 = appContext.portaCountClient
    const [connectionStatus, setConnectionStatus] = useState(client.state.connectionStatus)

    useEffect(() => {
        const listener: PortaCountListener = {
            connectionStatusChanged(connectionStatus: ConnectionStatus) {
                setConnectionStatus(connectionStatus)
            }
        };
        client.addListener(listener);
        return () => {
            client.removeListener(listener)
        };
    }, []);

    return (
        <fieldset className="info-box">
            <legend>Connection</legend>
            <span
                className={getConnectionStatusCssClass(connectionStatus)}>{connectionStatus}</span>
            {/*<HiLinkSlash/>*/}
            {/*<ImSpinner3/>*/}
            {/*<HiLink/>*/}
        </fieldset>
    )
}
