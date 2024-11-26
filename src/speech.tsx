/*
 Text-to-speech functions
 */
import {ChangeEvent, useEffect, useRef, useState} from "react";
import {AppSettings, SettingsDB} from "./database.ts";

let theSelectedVoice: SpeechSynthesisVoice | null = null;
const speechRate: number = 1;
let theSpeechEnabled: boolean = true;
let allVoices: SpeechSynthesisVoice[] = [];
const speechSynthesis: SpeechSynthesis = window.speechSynthesis;

export function SpeechSynthesisPanel() {
    const [settingsDb] = useState(() => new SettingsDB())
    const [selectedVoiceName, setSelectedVoiceName] = useState<string | undefined>(undefined);
    const [speechEnabled, setSpeechEnabled] = useState<boolean>(false);
    const enableSpeechCheckboxRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        console.log(`speech useEffect init`)
        if (!speechSynthesis) {
            console.log("no SpeechSynthesis");
            return;
        }

        updateVoiceList(speechSynthesis.getVoices());
        speechSynthesis.onvoiceschanged = () => {
            updateVoiceList(speechSynthesis.getVoices());
        };

        settingsDb.open().then(() => {
            console.log("settings db ready, loading speech settings")

            settingsDb.getSetting(AppSettings.SPEECH_ENABLED, false).then((res) => setSpeechEnabled(res as boolean))
            getSelectedVoiceSetting();
        });
    }, [])

    useEffect(() => {
        theSpeechEnabled = speechEnabled;
        if (!speechEnabled) {
            speechSynthesis.cancel();
        }
    }, [speechEnabled]);


    function getSelectedVoiceSetting() {
        settingsDb.getSetting(AppSettings.SPEECH_VOICE, findDefaultVoice()?.name)
            .then((res) => {
                console.log(`got speech voice, res is ${res}`)
                updateSelectedVoice(res as string)
            })
    }


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
        return allVoices.find((voice) => voice.name === name) || null;
    }

    function updateSelectedVoice(voiceName: string) {
        const foundVoice = findVoiceByName(voiceName);
        console.log(`looking for voice '${voiceName}'; found voice ${foundVoice?.name}`)
        if(foundVoice) {
            theSelectedVoice = foundVoice;
            setSelectedVoiceName((prev) => {
                if(prev !== voiceName){
                    settingsDb.saveSetting(AppSettings.SPEECH_VOICE, voiceName);
                }
                return voiceName;
            }); // this syncs the ui state(?)
            sayItLater(`This is ${theSelectedVoice.name} speaking.`)
        }
    }

    /**
     * Exclude non-english voices
     * @param voices
     */
    function updateVoiceList(voices: SpeechSynthesisVoice[]) {
        allVoices = voices.filter((voice) => {
            console.log(`voice ${voice.name} has lang ${voice.lang}`);
            return voice.lang.startsWith("en")
        }).sort((a, b) => `${a.lang} ${a.name}`.localeCompare(`${b.lang} ${b.name}`));
        if(selectedVoiceName) {
            updateSelectedVoice(selectedVoiceName)
        } else {
            // db hasn't loaded yet, but voices changed
            getSelectedVoiceSetting();
        }
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
                    allVoices.map((voice) => {
                        return <option key={voice.name}
                                       value={voice.name}>{`${voice.name} (${voice.lang}) ${voice.default ? " DEFAULT" : ""}`}</option>
                    })
                }
            </select>
        </>
    );
}

export function isSayingSomething() {
    return speechSynthesis.speaking;
}

/**
 * enqueue
 * @param message
 */
export function sayItLater(message: string) {
    if (!theSpeechEnabled) {
        return;
    }
    console.log(`say it later: ${message}`)
    const utterThis = new SpeechSynthesisUtterance(message);
    utterThis.voice = theSelectedVoice;
    utterThis.rate = speechRate;

    speechSynthesis.speak(utterThis); // this enqueues
}

export function sayIt(message: string) {
    if (!theSpeechEnabled) {
        return;
    }
    console.log(`using ${theSelectedVoice?.name} say it ${message}`)
    const utterThis = new SpeechSynthesisUtterance(message);
    utterThis.voice = theSelectedVoice;
    utterThis.rate = speechRate;

    if (speechSynthesis.speaking) {
        speechSynthesis.cancel(); // stop current utterance
        // chrome needs a delay here for some reason, otherwise speak doesn't do anything.
        // 60 ms seems to be around the minimum delay
        setTimeout(() => speechSynthesis.speak(utterThis), 60)
    } else {
        speechSynthesis.speak(utterThis);
    }
}
