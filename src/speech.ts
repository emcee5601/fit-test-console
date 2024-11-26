let theSelectedVoice: SpeechSynthesisVoice | null = null;
const speechRate: number = 1;
let theSpeechEnabled: boolean = true;
let allVoices: SpeechSynthesisVoice[] = [];
const speechSynthesis: SpeechSynthesis = window.speechSynthesis;


export const speech = new class {
    constructor() {
        this.updateVoiceList(speechSynthesis.getVoices());
        speechSynthesis.onvoiceschanged = () => {
            this.updateVoiceList(speechSynthesis.getVoices());
        };
    }

    /**
     * Exclude non-english voices
     * @param voices
     */
    private updateVoiceList(voices: SpeechSynthesisVoice[]) {
        allVoices = voices.filter((voice) => {
            console.log(`voice ${voice.name} has lang ${voice.lang}`);
            return voice.lang.startsWith("en")
        }).sort((a, b) => `${a.lang} ${a.name}`.localeCompare(`${b.lang} ${b.name}`));
    }

    public setSelectedVoice(voice: SpeechSynthesisVoice) {
        theSelectedVoice = voice
    }
    public getSelectedVoice() {
        return theSelectedVoice
    }
    public getAllVoices() {
        return allVoices;
    }

    public setSpeechEnabled(enabled: boolean) {
        theSpeechEnabled = enabled
    }
    public isSayingSomething() {
        return speechSynthesis.speaking;
    }

    /**
     * enqueue
     * @param message
     */
    public sayItLater(message: string) {
        if (!theSpeechEnabled) {
            return;
        }
        console.log(`say it later: ${message}`)
        const utterThis = new SpeechSynthesisUtterance(message);
        utterThis.voice = theSelectedVoice;
        utterThis.rate = speechRate;

        speechSynthesis.speak(utterThis); // this enqueues
    }

    public sayIt(message: string) {
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
}
