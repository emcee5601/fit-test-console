import {ControlSourceWidget} from "src/ControlSourceWidget.tsx";
import {CurrentParticipantPanel} from "src/CurrentParticipantPanel.tsx";
import {DriverSelectorWidget} from "src/DriverSelectorWidget.tsx";
import {EstimatedFitFactorWidget} from "src/EstimatedFitFactorWidget.tsx";
import {EstimatedOverallScoreWidget} from "src/EstimatedOverallScoreWidget.tsx";
import {PortaCountCommandWidget} from "src/PortaCountCommandWidget.tsx";
import {PortaCountLastLineWidget} from "src/PortaCountLastLineWidget.tsx";
import {ProtocolExecutorPanel} from "src/ProtocolExecutorPanel.tsx";
import {ProtocolSelectorWidget0} from "src/ProtocolSelectorWidget0.tsx";
import {RecordCurrentEstimateButton} from "src/RecordCurrentEstimateButton.tsx";
import {SampleSourceWidget} from "src/SampleSourceWidget.tsx";
import {StartPauseProtocolButton} from "src/StartPauseProtocolButton.tsx";
import {StopProtocolButton} from "src/StopProtocolButton.tsx";
import {TestInstructionsPanel} from "src/TestInstructionsPanel.tsx";

export function TestPanel() {
    return (
        <div id="test-panel" style={{height: "inherit", display: "flex", flexDirection: "column"}}>
            <CurrentParticipantPanel/>
            <div className={"inline-flex"}>
                <EstimatedFitFactorWidget/>
                <div style={{flexGrow:1}}>
                    <ProtocolSelectorWidget0/>
                    <ProtocolExecutorPanel/>
                </div>
            </div>
            <div id="compact-ui"
                 style={{
                     display: 'inline-flex',
                     width: 'fit-content',
                     gap: "1em",
                     alignItems: "center",
                     height: "fit-content",
                     flexWrap: "wrap",
                     justifyContent: "start"
                 }}>
                <DriverSelectorWidget compact={true}/>
                <RecordCurrentEstimateButton/>
                <StartPauseProtocolButton/>
                <StopProtocolButton/>
                <SampleSourceWidget/>
                <PortaCountCommandWidget compact={true}/>
                <ControlSourceWidget/>
                <EstimatedOverallScoreWidget/>
                <PortaCountLastLineWidget label={""}/>
            </div>
            <div style={{width: "100%", display: "flex", flexGrow: 1}}>
                <TestInstructionsPanel/>
            </div>
        </div>
    )
}
