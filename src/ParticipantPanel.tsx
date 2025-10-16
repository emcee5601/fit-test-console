import './App.css'
import {CurrentParticipantResults} from "src/CurrentParticipantResults.tsx";
import {CurrentParticipantPanel} from "./CurrentParticipantPanel.tsx";

export function ParticipantPanel() {
    return (
        <div id={"participant-panel"} style={{display: "flex", flexDirection: "column"}}>
            <CurrentParticipantPanel mode={"compact"}/>
            <CurrentParticipantResults/>
        </div>
    )
}
