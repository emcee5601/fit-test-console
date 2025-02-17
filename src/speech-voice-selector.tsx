/*
 Text-to-speech functions
 */
import {useCallback, useEffect} from "react";
import {AppSettings, useDBSetting} from "./settings-db.ts";
import {speech} from "./speech.ts";
import {ToggleButton} from "./Settings.tsx";

export function EnableSpeechSwitch() {
    const [speechEnabled, setSpeechEnabled] = useDBSetting<boolean>(AppSettings.SPEECH_ENABLED, false);
    useEffect(() => {
        speech.setSpeechEnabled(speechEnabled);
    }, [speechEnabled]);

    return (
        <ToggleButton trueLabel={"Enable speech"} value={speechEnabled} setValue={setSpeechEnabled}/>
    )
}


export function SpeechVoiceSelector() {
    const [selectedVoiceName, setSelectedVoiceName] = useDBSetting<string>(AppSettings.SPEECH_VOICE, findDefaultVoice()?.name || "default");

    const updateSelectedVoice = useCallback((voiceName: string) => {
        const foundVoice = findVoiceByName(voiceName);
        console.log(`looking for voice '${voiceName}'; found voice ${foundVoice?.name}`)
        if (foundVoice) {
            speech.setSelectedVoice(foundVoice);
            setSelectedVoiceName(voiceName)
            speech.sayItLater(`This is ${foundVoice.name} speaking.`)
        }
    }, [setSelectedVoiceName])

    useEffect(() => {
        updateSelectedVoice(selectedVoiceName)
    }, [selectedVoiceName, updateSelectedVoice])

    function findDefaultVoice() {
        if (!speechSynthesis) {
            console.log("speechSynthesis not ready")
            return null;
        }
        const allVoices = speechSynthesis.getVoices();
        const foundVoice = allVoices.find((voice) => voice.default);
        return foundVoice ? foundVoice : null;
    }

    function findVoiceByName(name: string) {
        return speech.getAllVoices().find((voice) => voice.name === name) || null;
    }


    return (
        <>
            <div style={{display: "inline-block"}}>
                <label htmlFor='speech-voice-select'>Voice: </label>
                <select id="speech-voice-select"
                        value={selectedVoiceName}
                        onChange={e => setSelectedVoiceName(e.target.value)}
                        style={{textOverflow: "ellipsis", width: "15em"}}>
                    {
                        speech.getAllVoices().map((voice) => {
                            return <option key={voice.name}
                                        value={voice.name}>{`${voice.name} (${voice.lang}) ${voice.default ? " DEFAULT" : ""}`}</option>
                        })
                    }
                </select>
                &nbsp;&nbsp;
            </div>
        </>
    );
}
