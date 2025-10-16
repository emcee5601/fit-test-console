import './App.css'
import {CurrentParticipantResults} from "src/CurrentParticipantResults.tsx";
import {CurrentParticipantPanel} from "./CurrentParticipantPanel.tsx";

export function ParticipantPanel() {

    return (
        <div id={"participant-panel"}>
            <CurrentParticipantPanel mode={"editor"}/>
            <CurrentParticipantResults/>
        </div>
    )
}
