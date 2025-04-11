import {useSetting} from "./use-setting.ts";
import {AppSettings} from "./app-settings.ts";
import {useCallback, useEffect} from "react";
import {SPEECH} from "./speech.ts";

export function SpeechVoiceSelectorWidget() {
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
        if (defaultVoice) {
            setSelectedVoiceName(defaultVoice.name);
        }
    }, []);
    useEffect(() => {
        updateSelectedVoice(selectedVoiceName)
    }, [selectedVoiceName, updateSelectedVoice])

    function findDefaultVoice() {
        const allVoices = SPEECH.allVoices;
        const foundVoice = allVoices.find((voice) => voice.default);
        return foundVoice ? foundVoice : null;
    }

    function findVoiceByName(name: string) {
        return SPEECH.allVoices.find((voice) => voice.name === name) || null;
    }


    return (
        <>
            <div className={"labeled-setting"}>
                <label htmlFor='speech-voice-select'>Voice: </label>
                <select id="speech-voice-select"
                        value={selectedVoiceName}
                        onChange={e => setSelectedVoiceName(e.target.value)}
                        style={{textOverflow: "ellipsis", width: "15em"}}>
                    {
                        SPEECH.allVoices.map((voice) => {
                            return <option key={voice.name}
                                           value={voice.name}>{`${voice.name} (${voice.lang}) ${voice.default ? " DEFAULT" : ""}`}</option>
                        })
                    }
                </select>
            </div>
        </>
    );
}
