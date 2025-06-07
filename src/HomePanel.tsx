import './App.css'

import {ProtocolExecutorPanel} from "./ProtocolExecutorPanel.tsx";
import {CurrentParticipantPanel} from "./CurrentParticipantPanel.tsx";
import {ProtocolSelectorWidget1} from "./ProtocolSelectorWidget1.tsx";
import {AppSettings} from "./app-settings.ts";
import {PortaCountCommandWidget} from "./PortaCountCommandWidget.tsx";
import {PortaCountControlSourceWidget} from "./PortaCountControlSourceWidget.tsx";
import {PortaCountSampleSourceWidget} from "./PortaCountSampleSourceWidget.tsx";
import {CurrentActivityWidget} from "./CurrentActivityWidget.tsx";
import {PortaCountLastLineWidget} from "./PortaCountLastLineWidget.tsx";
import {TestInstructionsPanel} from "./TestInstructionsPanel.tsx";
import {DriverSelectorWidget} from "./DriverSelectorWidget.tsx";
import {useSetting} from "./use-setting.ts";
import {CurrentParticipantResults} from "src/CurrentParticipantResults.tsx";
import {Activity} from "src/activity.ts";
import {BsArrowsFullscreen} from "react-icons/bs";
import {useEffect, useState} from "react";
import {MdCloseFullscreen} from "react-icons/md";
import {BrowserDetect} from "src/BrowserDetect.tsx";

function HomePanel() {
    const [showExternalControl] = useSetting<boolean>(AppSettings.SHOW_EXTERNAL_CONTROL);
    const [useCompactControls] = useSetting<boolean>(AppSettings.USE_COMPACT_UI);
    const [activity] = useSetting<Activity>(AppSettings.ACTIVITY)
    const [enableInstructionsZoom] = useSetting<boolean>(AppSettings.ENABLE_TEST_INSTRUCTIONS_ZOOM);
    const [zoomInstructions, setZoomInstructions] = useState<boolean>(enableInstructionsZoom && activity === Activity.Testing)

    useEffect(() => {
        setZoomInstructions(enableInstructionsZoom && activity === Activity.Testing)
    }, [activity, enableInstructionsZoom]);

    function handleZoomInstructions() {
        // toggle
        setZoomInstructions((prev) => !prev)
    }

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
                {(!showExternalControl) &&
                    <ProtocolSelectorWidget1/> /* don't need this here since protocol executor panel has one*/}
                {!useCompactControls && showExternalControl && <PortaCountControlSourceWidget/>}
                {!useCompactControls && showExternalControl && <PortaCountSampleSourceWidget/>}
                {!useCompactControls && <CurrentActivityWidget/>}
                {/*<PortaCountDataTransmissionWidget/>*/}
                {!useCompactControls && <PortaCountLastLineWidget/>}
                {!useCompactControls && showExternalControl && <PortaCountCommandWidget/>}
            </section>}
            {!zoomInstructions && <CurrentParticipantPanel/>}
            <div id={"testing-mode-container"}
                 className={`test-instructions-container ${zoomInstructions && "test-in-progress"}`}>
                <div style={{
                    padding: "0.2em",
                    position: "absolute",
                    right: 0,
                    backgroundColor: "inherit",
                    aspectRatio: 1,
                    zIndex:10,
                }}
                     onClick={() => handleZoomInstructions()}
                >
                    {zoomInstructions ? <MdCloseFullscreen/> : <BsArrowsFullscreen/>}
                </div>
                {showExternalControl && <ProtocolExecutorPanel/>}
                <TestInstructionsPanel/>
            </div>
            {!zoomInstructions && <CurrentParticipantResults/>}
        </>
    )
}

export default HomePanel
