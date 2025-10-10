import {GiScrollQuill} from "react-icons/gi";
import {ControlSource} from "src/portacount/porta-count-state.ts";
import {useSetting} from "src/use-setting.ts";
import {AppSettings} from "src/app-settings-types.ts";
import {useContext} from "react";
import {AppContext} from "src/app-context.ts";
import {ProtocolExecutionState} from "src/protocol-execution-state.ts";

type ManualEntryButtonProps = {
    text?: string,
}
export function ManualEntryButton(props: ManualEntryButtonProps) {
    const appContext = useContext(AppContext)
    const dataCollector = appContext.dataCollector;
    const [protocolExecutorState] = useSetting<ProtocolExecutionState>(AppSettings.PROTOCOL_EXECUTION_STATE)

    function manualEntry() {
        dataCollector.recordTestStart(ControlSource.Manual)
    }

    return (<div id={"manual-entry-button"}>
        <button disabled={protocolExecutorState!=="Idle"} onClick={() => manualEntry()}
                className={"icon-button"}>{props.text || "Manual"} <div className={"svg-container icon-button"}><GiScrollQuill/>
        </div></button>
    </div>)
}
