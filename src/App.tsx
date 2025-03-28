import './App.css'

import {ProtocolExecutorPanel} from "./ProtocolExecutorPanel.tsx";
import {CurrentParticipantPanel} from "./CurrentParticipantPanel.tsx";
import {ProtocolSelectorWidget} from "./ProtocolSelectorWidget.tsx";
import {AppSettings, useSetting} from "./app-settings.ts";
import {PortaCountCommandWidget} from "./PortaCountCommandWidget.tsx";
import {PortaCountControlSourceWidget} from "./PortaCountControlSourceWidget.tsx";
import {PortaCountSampleSourceWidget} from "./PortaCountSampleSourceWidget.tsx";
import {PortaCountCurrentActivityWidget} from "./PortaCountCurrentActivityWidget.tsx";
import {PortaCountLastLineWidget} from "./PortaCountLastLineWidget.tsx";
import {TestInstructionsPanel} from "./TestInstructionsPanel.tsx";
import {DriverSelectorWidget} from "./DriverSelectorWidget.tsx";

function App() {
    const [showExternalControl] = useSetting<boolean>(AppSettings.SHOW_EXTERNAL_CONTROL);

    return (
        <>
            <section style={{float: "inline-start"}}>
                <DriverSelectorWidget/>
                <ProtocolSelectorWidget/>
                {showExternalControl && <PortaCountControlSourceWidget/>}
                {showExternalControl && <PortaCountSampleSourceWidget/>}
                <PortaCountCurrentActivityWidget/>
                {/*<PortaCountDataTransmissionWidget/>*/}
                <PortaCountLastLineWidget/>
                {showExternalControl && <PortaCountCommandWidget/>}
            </section>
            <div style={{display: "flex", width: "100%"}}>
                {showExternalControl && <ProtocolExecutorPanel/>}
                <TestInstructionsPanel/>
            </div>
            <CurrentParticipantPanel/>
        </>
    )
}

export default App
