/*
 Text-to-speech functions
 */
import {useEffect} from "react";
import {SPEECH} from "./speech.ts";
import {BooleanToggleButton} from "./ToggleButton.tsx";
import {useSetting} from "./use-setting.ts";
import {AppSettings} from "src/app-settings-types.ts";

export function EnableSpeechSwitch() {
    const [speechEnabled, setSpeechEnabled] = useSetting<boolean>(AppSettings.SPEECH_ENABLED);
    useEffect(() => {
        SPEECH.setSpeechEnabled(speechEnabled);
    }, [speechEnabled]);

    return (
        <BooleanToggleButton trueLabel={"Enable speech"} value={speechEnabled} setValue={setSpeechEnabled}/>
    )
}


