import {ConnectionStatus} from "src/portacount/porta-count-state.ts";
import {ImStop} from "react-icons/im";
import {useContext} from "react";
import {AppContext} from "src/app-context.ts";
import {useSetting} from "src/use-setting.ts";
import {AppSettings} from "src/app-settings-types.ts";
import {ProtocolExecutionState} from "src/protocol-execution-state.ts";

export function StopProtocolButton() {
    const appContext = useContext(AppContext)
    const protocolExecutor = appContext.protocolExecutor;
    const [protocolExecutorState] = useSetting<ProtocolExecutionState>(AppSettings.PROTOCOL_EXECUTION_STATE)
    const [connectionStatus] = useSetting<ConnectionStatus>(AppSettings.CONNECTION_STATUS)

    function handleOnClick() {
        if (protocolExecutorState === "Idle" || connectionStatus !== ConnectionStatus.RECEIVING) {
            // protocol not running or portacount not ready
            return;
        }
        protocolExecutor.cancel()
    }

    return (
        <div id="stop-protocol-button" className={`svg-container icon-button stop ${(protocolExecutorState === "Idle" || connectionStatus !== ConnectionStatus.RECEIVING)&&"disabled"}`}
             onClick={handleOnClick}>
            <ImStop/>
        </div>)
}
