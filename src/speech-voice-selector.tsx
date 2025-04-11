/*
 Text-to-speech functions
 */
import {useEffect} from "react";
import {SPEECH} from "./speech.ts";
import {AppSettings} from "./app-settings.ts";
import {BooleanToggleButton} from "./ToggleButton.tsx";
import {useSetting} from "./use-setting.ts";

export function EnableSpeechSwitch() {
    const [speechEnabled, setSpeechEnabled] = useSetting<boolean>(AppSettings.SPEECH_ENABLED);
    useEffect(() => {
        SPEECH.setSpeechEnabled(speechEnabled);
    }, [speechEnabled]);

    return (
        <BooleanToggleButton trueLabel={"Enable speech"} value={speechEnabled} setValue={setSpeechEnabled}/>
    )
}


