/*
 Text-to-speech functions
 */
import {ChangeEvent, useEffect, useRef, useState} from "react";
import {AppSettings, SettingsDB} from "./database.ts";

let theSelectedVoice:SpeechSynthesisVoice|null = null;
const speechRate:number = 1;
let theSpeechEnabled:boolean = true;
let speechSynthesis: SpeechSynthesis;

export function SpeechSynthesisPanel({settingsDb}:{settingsDb: SettingsDB}) {
    const [synth, setSynth] = useState<SpeechSynthesis|null>(null);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice|null>(null);
    const [speechEnabled, setSpeechEnabled] = useState<boolean>(false);
    const enableSpeechCheckboxRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        console.log(`speech useeffect init`)
        speechSynthesis = window.speechSynthesis;
        if(!speechSynthesis) {
            console.log("no SpeechSynthesis");
            return;
        }
        if(!synth) {
            setSynth(speechSynthesis);
            const allVoices = speechSynthesis.getVoices();
            speechSynthesis.onvoiceschanged = () => {
                setVoices(speechSynthesis.getVoices());
            };
            setVoices(allVoices);
            console.log(`found ${voices.length} voices`);
            setSelectedVoice(findDefaultVoice(allVoices));
        }
    }, [])

    useEffect(() => {
        console.log(`voices changed, there are now ${voices.length} voices`);
    }, [voices])

    useEffect(() => {
        theSelectedVoice = selectedVoice;
    }, [selectedVoice])

    useEffect(() => {
        theSpeechEnabled = speechEnabled;
        if(!speechEnabled) {
            speechSynthesis.cancel();
        }
    }, [speechEnabled]);

    useEffect(() => {
        settingsDb.getSetting(AppSettings.ENABLE_SPEECH).then((res) => setSpeechEnabled(res))
    }, [settingsDb.db]);

    function findDefaultVoice(allVoices: SpeechSynthesisVoice[]) {
        const foundVoice = allVoices.find((voice) => voice.default);
        return foundVoice ? foundVoice : null;
    }

    function voiceSelectionChanged(event: ChangeEvent<HTMLSelectElement>) {
        const foundVoice = voices.find((voice) => voice.name === event.target.value);
        setSelectedVoice(foundVoice ? foundVoice : null);
    }

    function enableSpeechCheckboxChanged() {
        if(!enableSpeechCheckboxRef.current) {
            return;
        }
        setSpeechEnabled(enableSpeechCheckboxRef.current.checked)
        settingsDb.saveSetting(AppSettings.ENABLE_SPEECH, enableSpeechCheckboxRef.current.checked)
    }

    return(
        <>
            <div style={{display: "inline-block"}}>
                <input type="checkbox" ref={enableSpeechCheckboxRef} id="enable-speech-checkbox" checked={speechEnabled} onChange={enableSpeechCheckboxChanged}/>
                <label htmlFor="enable-speech-checkbox">Enable Speech</label>
            </div>
            &nbsp;
            <select defaultValue={findDefaultVoice(voices)?.name} onChange={voiceSelectionChanged}>
                {
                    voices.map((voice) => {
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
export function sayItLater(message:string) {
    if(!theSpeechEnabled) {
        return;
    }
    console.log(`say it later: ${message}`)
    const utterThis = new SpeechSynthesisUtterance(message);
    utterThis.voice = theSelectedVoice;
    utterThis.rate = speechRate;

    speechSynthesis.speak(utterThis); // this enqueues
}

export function sayIt(message:string) {
    if(!theSpeechEnabled) {
        return;
    }
    console.log(`say it ${message}`)
    const utterThis = new SpeechSynthesisUtterance(message);
    utterThis.voice = theSelectedVoice;
    utterThis.rate = speechRate;

    if(speechSynthesis.speaking) {
        speechSynthesis.cancel(); // stop current utterance
        // chrome needs a delay here for some reason, otherwise speak doesn't do anything.
        // 60 ms seems to be around the minimum delay
        setTimeout(() => speechSynthesis.speak(utterThis), 60)
    } else {
        speechSynthesis.speak(utterThis);
    }
}
