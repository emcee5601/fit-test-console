import {ConnectionStatus} from "src/portacount/porta-count-state.ts";
import {useContext} from "react";
import {AppContext} from "src/app-context.ts";
import {useSetting} from "src/use-setting.ts";
import {AppSettings} from "src/app-settings-types.ts";
import {ProtocolExecutionState} from "src/protocol-execution-state.ts";
import {ImPause, ImPlay2} from "react-icons/im";

export function StartPauseProtocolButton() {
    const appContext = useContext(AppContext)
    const protocolExecutor = appContext.protocolExecutor;
    const [selectedProtocolName] = useSetting<string>(AppSettings.SELECTED_PROTOCOL)
    const [protocolExecutorState] = useSetting<ProtocolExecutionState>(AppSettings.PROTOCOL_EXECUTION_STATE)
    const [connectionStatus] = useSetting<ConnectionStatus>(AppSettings.CONNECTION_STATUS)

    function handleOnClick() {
        if (connectionStatus !== ConnectionStatus.RECEIVING) {
            // portacount not ready
            return;
        }

        switch (protocolExecutorState) {
            case "Executing":
                protocolExecutor.pause()
                break;
            case "Paused":
                protocolExecutor.resume()
                break;
            case "Idle":
                protocolExecutor.executeProtocol(selectedProtocolName)
                break;
        }
    }

    return (
        <div id="start-protocol-button"
             className={`svg-container icon-button start ${(connectionStatus !== ConnectionStatus.RECEIVING) && "disabled"}`}
             onClick={handleOnClick}>
            {protocolExecutorState === "Executing" ? <ImPause/> : <ImPlay2/>}
        </div>)
}
