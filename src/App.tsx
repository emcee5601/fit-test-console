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

function App() {
    const [showExternalControl] = useSetting<boolean>(AppSettings.SHOW_EXTERNAL_CONTROL);

    return (
        <>
            <section style={{display:"flex", flexWrap:"wrap", float: "inline-start", alignItems:"center"}}>
                {/*todo: auto-connect. should be part of app context. and a setting*/}
                <DriverSelectorWidget/>
                {(!showExternalControl) && <ProtocolSelectorWidget1/> /* don't need this here since protocol executor panel has one*/}
                {showExternalControl && <PortaCountControlSourceWidget/>}
                {showExternalControl && <PortaCountSampleSourceWidget/>}
                <PortaCountCurrentActivityWidget/>
                {/*<PortaCountDataTransmissionWidget/>*/}
                <PortaCountLastLineWidget/>
                {showExternalControl && <PortaCountCommandWidget/>}
            </section>
            <div style={{display: "flex", width: "100%", flexDirection:"column"}}>
                {showExternalControl && <ProtocolExecutorPanel style={{display:"block", width: "100%"}}/>}
                <TestInstructionsPanel/>
            </div>
            <CurrentParticipantPanel/>
        </>
    )
}

export default App
