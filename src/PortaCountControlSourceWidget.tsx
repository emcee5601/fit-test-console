import {PortaCountClient8020, PortaCountListener} from "./portacount-client-8020.ts";
import {useContext, useEffect, useState} from "react";
import {AppContext} from "./app-context.ts";
import {ToggleButton} from "./ToggleButton.tsx";
import {ControlSource} from "./control-source.ts";
import {useSetting} from "./use-setting.ts";
import {ConnectionStatus} from "src/connection-status.ts";
import {AppSettings} from "src/app-settings-types.ts";

/**
 * Shows current state of the PortaCount's control source and a toggle to change it when appropriate
 * @constructor
 */
export function PortaCountControlSourceWidget() {
    const appContext = useContext(AppContext)
    const client: PortaCountClient8020 = appContext.portaCountClient
    const [showExternalControl] = useSetting(AppSettings.SHOW_EXTERNAL_CONTROL)
    const [controlSource, setControlSource] = useState(client.state.controlSource)
    function shouldBeDisabled(connectionStatus:ConnectionStatus): boolean {
        return connectionStatus !== ConnectionStatus.RECEIVING
    }
    const [disabled, setDisabled] = useState(shouldBeDisabled(client.state.connectionStatus))

    useEffect(() => {
        const listener: PortaCountListener = {
            controlSourceChanged(source:ControlSource) {
                setControlSource(source);
            },
            connectionStatusChanged(connectionStatus: ConnectionStatus) {
                setDisabled(shouldBeDisabled(connectionStatus))
            }
        };
        client.addListener(listener);
        return () => {
            client.removeListener(listener)
        };
    }, []);

    return (
        <fieldset className="info-box-compact">
            <legend>Control</legend>
            {showExternalControl
                ? <ToggleButton
                    trueLabel={ControlSource.External}
                    falseLabel={ControlSource.Internal}
                    value={controlSource}
                    setValue={(val) => client.externalController.controlSource = val}
                    disabled={disabled}
                />
                : controlSource
            }
        </fieldset>
    )
}
