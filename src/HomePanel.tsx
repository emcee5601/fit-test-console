import './App.css'

import {ProtocolExecutorPanel} from "./ProtocolExecutorPanel.tsx";
import {CurrentParticipantPanel} from "./CurrentParticipantPanel.tsx";
import {PortaCountCommandWidget} from "./PortaCountCommandWidget.tsx";
import {PortaCountControlSourceWidget} from "./PortaCountControlSourceWidget.tsx";
import {PortaCountSampleSourceWidget} from "./PortaCountSampleSourceWidget.tsx";
import {CurrentActivityWidget} from "./CurrentActivityWidget.tsx";
import {PortaCountLastLineWidget} from "./PortaCountLastLineWidget.tsx";
import {DriverSelectorWidget} from "./DriverSelectorWidget.tsx";
import {useSetting} from "./use-setting.ts";
import {CurrentParticipantResults} from "src/CurrentParticipantResults.tsx";
import {BrowserDetect} from "src/BrowserDetect.tsx";
import {AppSettings} from "src/app-settings-types.ts";

function HomePanel() {
    const [showExternalControl] = useSetting<boolean>(AppSettings.SHOW_EXTERNAL_CONTROL);
    const [useCompactControls] = useSetting<boolean>(AppSettings.USE_COMPACT_UI);
    const [zoomInstructions] = useSetting<boolean>(AppSettings.ZOOM_INSTRUCTIONS)

    return (
        <>
            <BrowserDetect/>
            {!zoomInstructions && <section id="control-widgets"
                                           style={{
                                               display: "flex",
                                               flexWrap: "wrap",
                                               alignItems: "center",
                                               justifySelf: "center"
                                           }}>
                {!useCompactControls && <DriverSelectorWidget/>}
                {!useCompactControls && showExternalControl && <PortaCountControlSourceWidget/>}
                {!useCompactControls && showExternalControl && <PortaCountSampleSourceWidget/>}
                {!useCompactControls && <CurrentActivityWidget/>}
                {/*<PortaCountDataTransmissionWidget/>*/}
                {!useCompactControls && <PortaCountLastLineWidget/>}
                {!useCompactControls && showExternalControl && <PortaCountCommandWidget/>}
            </section>}
            {!zoomInstructions && <CurrentParticipantPanel/>}
            <ProtocolExecutorPanel/>
            {!zoomInstructions && <CurrentParticipantResults/>}
        </>
    )
}

export default HomePanel
