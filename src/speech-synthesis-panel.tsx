/*
 Text-to-speech functions
 */
import {ChangeEvent, useCallback, useEffect, useRef, useState} from "react";
import {AppSettings, SETTINGS_DB} from "./database.ts";
import {speech} from "./speech.ts";


export function SpeechSynthesisPanel() {
    const [settingsDb] = useState(() => SETTINGS_DB)
    const [selectedVoiceName, setSelectedVoiceName] = useState<string | undefined>(undefined);
    const [speechEnabled, setSpeechEnabled] = useState<boolean>(false);
    const enableSpeechCheckboxRef = useRef<HTMLInputElement>(null);

    const updateSelectedVoice = useCallback((voiceName: string) => {
        const foundVoice = findVoiceByName(voiceName);
        console.log(`looking for voice '${voiceName}'; found voice ${foundVoice?.name}`)
        if(foundVoice) {
            speech.setSelectedVoice(foundVoice);
            setSelectedVoiceName((prev) => {
                if(prev !== voiceName){
                    settingsDb.saveSetting(AppSettings.SPEECH_VOICE, voiceName);
                }
                return voiceName;
            }); // this syncs the ui state(?)
            speech.sayItLater(`This is ${foundVoice.name} speaking.`)
        }
    }, [settingsDb])

    const getSelectedVoiceSetting = useCallback(() => {
        settingsDb.getSetting(AppSettings.SPEECH_VOICE, findDefaultVoice()?.name)
            .then((res) => {
                console.log(`got speech voice, res is ${res}`)
                updateSelectedVoice(res as string)
            })
    },[settingsDb, updateSelectedVoice])


    useEffect(() => {
        console.log(`speech useEffect init`)
        if (!speechSynthesis) {
            console.log("no SpeechSynthesis");
            return;
        }

        settingsDb.open().then(() => {
            console.log("settings db ready, loading speech settings")

            settingsDb.getSetting(AppSettings.SPEECH_ENABLED, false).then((res) => setSpeechEnabled(res as boolean))
            getSelectedVoiceSetting();
        });
    }, [settingsDb, getSelectedVoiceSetting])

    useEffect(() => {
        speech.setSpeechEnabled(speechEnabled);
        if (!speechEnabled) {
            speechSynthesis.cancel();
        }
    }, [speechEnabled]);


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


    function voiceSelectionChanged(event: ChangeEvent<HTMLSelectElement>) {
        const voiceName = event.target.value;
        console.log(`voice selection changed to ${voiceName}`);
        updateSelectedVoice(voiceName);
    }

    function enableSpeechCheckboxChanged() {
        if (!enableSpeechCheckboxRef.current) {
            return;
        }
        setSpeechEnabled(enableSpeechCheckboxRef.current.checked)
        settingsDb.saveSetting(AppSettings.SPEECH_ENABLED, enableSpeechCheckboxRef.current.checked)
    }

    return (
        <>
            <div style={{display: "inline-block"}}>
                <input type="checkbox" ref={enableSpeechCheckboxRef} id="enable-speech-checkbox" checked={speechEnabled}
                       onChange={enableSpeechCheckboxChanged}/>
                <label htmlFor="enable-speech-checkbox">Enable Speech</label>
            </div>
            &nbsp;
            <select value={selectedVoiceName} onChange={voiceSelectionChanged}>
                {
                    speech.getAllVoices().map((voice) => {
                        return <option key={voice.name}
                                       value={voice.name}>{`${voice.name} (${voice.lang}) ${voice.default ? " DEFAULT" : ""}`}</option>
                    })
                }
            </select>
        </>
    );
}
