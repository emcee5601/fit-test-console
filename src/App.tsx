import './App.css'

import {ProtocolExecutorPanel} from "./ProtocolExecutorPanel.tsx";
import {CurrentParticipantPanel} from "./CurrentParticipantPanel.tsx";
import {ProtocolSelectorWidget1} from "./ProtocolSelectorWidget1.tsx";
import {AppSettings} from "./app-settings.ts";
import {PortaCountCommandWidget} from "./PortaCountCommandWidget.tsx";
import {PortaCountControlSourceWidget} from "./PortaCountControlSourceWidget.tsx";
import {PortaCountSampleSourceWidget} from "./PortaCountSampleSourceWidget.tsx";
import {PortaCountCurrentActivityWidget} from "./PortaCountCurrentActivityWidget.tsx";
import {PortaCountLastLineWidget} from "./PortaCountLastLineWidget.tsx";
import {TestInstructionsPanel} from "./TestInstructionsPanel.tsx";
import {DriverSelectorWidget} from "./DriverSelectorWidget.tsx";
import {useSetting} from "./use-setting.ts";
import {CurrentParticipantResults} from "src/CurrentParticipantResults.tsx";

function App() {
    const [showExternalControl] = useSetting<boolean>(AppSettings.SHOW_EXTERNAL_CONTROL);

    return (
        <>
            <section id="control-widgets" style={{display:"flex", flexWrap:"wrap", alignItems:"center", justifySelf:"center"}}>
                <DriverSelectorWidget/>
                {(!showExternalControl) && <ProtocolSelectorWidget1/> /* don't need this here since protocol executor panel has one*/}
                {showExternalControl && <PortaCountControlSourceWidget/>}
                {showExternalControl && <PortaCountSampleSourceWidget/>}
                <PortaCountCurrentActivityWidget/>
                {/*<PortaCountDataTransmissionWidget/>*/}
                <PortaCountLastLineWidget/>
                {showExternalControl && <PortaCountCommandWidget/>}
            </section>
            <CurrentParticipantPanel/>
            <div style={{display: "flex", width: "100%", flexDirection:"column"}}>
                <TestInstructionsPanel/>
            </div>
            {showExternalControl && <ProtocolExecutorPanel style={{display:"block", width: "100%"}}/>}
            <CurrentParticipantResults/>
        </>
    )
}

export default App
