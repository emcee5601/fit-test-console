/*
 Text-to-speech functions
 */
import {useCallback, useEffect} from "react";
import {SPEECH} from "./speech.ts";
import {AppSettings, useSetting} from "./app-settings.ts";
import {BooleanToggleButton} from "./ToggleButton.tsx";

export function EnableSpeechSwitch() {
    const [speechEnabled, setSpeechEnabled] = useSetting<boolean>(AppSettings.SPEECH_ENABLED);
    useEffect(() => {
        SPEECH.setSpeechEnabled(speechEnabled);
    }, [speechEnabled]);

    return (
        <BooleanToggleButton trueLabel={"Enable speech"} value={speechEnabled} setValue={setSpeechEnabled}/>
    )
}


export function SpeechVoiceSelector() {
    const [selectedVoiceName, setSelectedVoiceName] = useSetting<string>(AppSettings.SPEECH_VOICE);

    const updateSelectedVoice = useCallback((voiceName: string) => {
        const foundVoice = findVoiceByName(voiceName);
        console.log(`looking for voice '${voiceName}'; found voice ${foundVoice?.name}`)
        if (foundVoice) {
            SPEECH.setSelectedVoice(foundVoice);
            setSelectedVoiceName(voiceName)
            SPEECH.sayItLater(`This is ${foundVoice.name} speaking.`)
        }
    }, [setSelectedVoiceName])

    useEffect(() => {
        // on first load, set a default voice if found
        // todo: don't override voice loaded from db
        const defaultVoice = findDefaultVoice()
        if(defaultVoice) {
            setSelectedVoiceName(defaultVoice.name);
        }
    }, []);
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
        return SPEECH.getAllVoices().find((voice) => voice.name === name) || null;
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
                        SPEECH.getAllVoices().map((voice) => {
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
