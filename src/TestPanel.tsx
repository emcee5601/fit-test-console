import {HiOutlineClipboardList} from "react-icons/hi";
import {IoPersonSharp} from "react-icons/io5";
import {PiFaceMask} from "react-icons/pi";
import {AppSettings} from "src/app-settings-types.ts";
import {ControlSourceWidget} from "src/ControlSourceWidget.tsx";
import {DriverSelectorWidget} from "src/DriverSelectorWidget.tsx";
import {EstimatedFitFactorWidget} from "src/EstimatedFitFactorWidget.tsx";
import {PortaCountCommandWidget} from "src/PortaCountCommandWidget.tsx";
import {PortaCountLastLineWidget} from "src/PortaCountLastLineWidget.tsx";
import {ProtocolExecutorPanel} from "src/ProtocolExecutorPanel.tsx";
import {SampleSourceWidget} from "src/SampleSourceWidget.tsx";
import {SimpleResultsDBRecord} from "src/SimpleResultsDB.ts";
import {TestInstructionsPanel} from "src/TestInstructionsPanel.tsx";
import {useSetting} from "src/use-setting.ts";

export function TestPanel() {
    const [testTemplate] = useSetting<Partial<SimpleResultsDBRecord>>(AppSettings.TEST_TEMPLATE)
    return (
        <div id="test-panel" style={{height:"inherit", display:"flex", flexDirection:"column"}}>
            <div style={{display: "inline-flex", flexWrap: "nowrap", overflow: "scroll", gap: "0.7em", width: "100%"}}>
                <span className="svg-container"><IoPersonSharp/>{testTemplate.Participant}</span>
                <span className="svg-container" style={{textWrap: "nowrap"}}><PiFaceMask/>{testTemplate.Mask}</span>
                <span className="svg-container"
                      style={{textWrap: "nowrap"}}><HiOutlineClipboardList/>{testTemplate.Notes}</span>
            </div>
            <div className={"inline-flex"}>
                <EstimatedFitFactorWidget/>
                <div id="compact-ui"
                     style={{
                         display: 'flex',
                         width: 'fit-content',
                         gap: "0.3em",
                         alignItems: "center",
                         height: "inherit",
                         flexWrap: "wrap",
                         justifyContent: "center"
                     }}>
                    <DriverSelectorWidget compact={true}/>
                    <ControlSourceWidget/>
                    <SampleSourceWidget/>
                    <PortaCountCommandWidget compact={true}/>
                    <PortaCountLastLineWidget label={""}/>
                </div>
            </div>
            <ProtocolExecutorPanel/>
            <div style={{width: "100%", display:"flex", flexGrow:1}}>
                <TestInstructionsPanel/>
            </div>
        </div>
    )
}
