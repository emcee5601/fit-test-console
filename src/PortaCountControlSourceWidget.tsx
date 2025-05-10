import {ConnectionStatus, PortaCountClient8020, PortaCountListener} from "./portacount-client-8020.ts";
import {useContext, useEffect, useState} from "react";
import {AppContext} from "./app-context.ts";
import {AppSettings} from "./app-settings.ts";
import {ToggleButton} from "./ToggleButton.tsx";
import {ControlSource} from "./control-source.ts";
import {useSetting} from "./use-setting.ts";
import {useInView} from "react-intersection-observer";

/**
 * Shows current state of the PortaCount's control source and a toggle to change it when appropriate
 * @constructor
 */
export function PortaCountControlSourceWidget() {
    const appContext = useContext(AppContext)
    const client: PortaCountClient8020 = appContext.portaCountClient
    const [showExternalControl] = useSetting(AppSettings.SHOW_EXTERNAL_CONTROL)
    const [, setControlSourceInView] = useSetting(AppSettings.CONTROL_SOURCE_IN_VIEW)
    const [controlSource, setControlSource] = useState(client.state.controlSource)
    function shouldBeDisabled(connectionStatus:ConnectionStatus): boolean {
        return connectionStatus !== ConnectionStatus.RECEIVING
    }
    const [disabled, setDisabled] = useState(shouldBeDisabled(client.state.connectionStatus))
    const {ref, inView} = useInView()

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

    useEffect(() => {
        setControlSourceInView(inView)
    }, [inView]);

    return (
        <fieldset ref={ref} className="info-box-compact">
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
