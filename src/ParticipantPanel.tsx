import './App.css'
import {CurrentParticipantPanel} from "./CurrentParticipantPanel.tsx";
import {CurrentParticipantResults} from "src/CurrentParticipantResults.tsx";
import {BrowserDetect} from "src/BrowserDetect.tsx";

export function ParticipantPanel() {

    return (
        <div id={"home"}>
            <BrowserDetect/>
            <CurrentParticipantPanel/>
            <CurrentParticipantResults/>
        </div>
    )
}
