import './App.css'

import {ProtocolExecutorPanel} from "./ProtocolExecutorPanel.tsx";
import {CurrentParticipantPanel} from "./CurrentParticipantPanel.tsx";
import {PortaCountCommandWidget} from "./PortaCountCommandWidget.tsx";
import {CurrentActivityWidget} from "./CurrentActivityWidget.tsx";
import {PortaCountLastLineWidget} from "./PortaCountLastLineWidget.tsx";
import {DriverSelectorWidget} from "./DriverSelectorWidget.tsx";
import {useSetting} from "./use-setting.ts";
import {CurrentParticipantResults} from "src/CurrentParticipantResults.tsx";
import {BrowserDetect} from "src/BrowserDetect.tsx";
import {AppSettings} from "src/app-settings-types.ts";
import {ControlSourceWidget} from "src/ControlSourceWidget.tsx";
import {SampleSourceWidget} from "src/SampleSourceWidget.tsx";

function MobileHomePanel() {
    const [zoomInstructions] = useSetting<boolean>(AppSettings.ZOOM_INSTRUCTIONS)

    return (
        <div id={"mobile-home"}>
            <BrowserDetect/>
            {!zoomInstructions && <div id="compact-ui"
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
                <CurrentActivityWidget label={""}/>
                <PortaCountLastLineWidget label={""}/>
            </div>}
            {!zoomInstructions && <CurrentParticipantPanel/>}
            <ProtocolExecutorPanel/>
            {!zoomInstructions && <CurrentParticipantResults/>}
        </div>
    )
}

export default MobileHomePanel
