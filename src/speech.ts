/**
 *
 */
export const SPEECH = new class {
    private readonly synth: SpeechSynthesis = window.speechSynthesis;
    private speechEnabled: boolean = false;
    private allVoices: SpeechSynthesisVoice[] = [];
    private selectedVoice: SpeechSynthesisVoice | null = null;
    private speechRate: number = 1;

    constructor() {
        this.updateVoiceList(this.synth.getVoices());
        this.synth.onvoiceschanged = () => {
            this.updateVoiceList(this.synth.getVoices());
        };
    }

    /**
     * Exclude non-english voices
     * @param voices
     */
    private updateVoiceList(voices: SpeechSynthesisVoice[]) {
        this.allVoices = voices.filter((voice) => {
            // console.log(`voice ${voice.name} has lang ${voice.lang}`);
            return voice.lang.startsWith("en")
        }).sort((a, b) => `${a.lang} ${a.name}`.localeCompare(`${b.lang} ${b.name}`));
    }

    public setSelectedVoice(voice: SpeechSynthesisVoice) {
        this.selectedVoice = voice
    }
    public getSelectedVoice() {
        return this.selectedVoice
    }
    public getAllVoices() {
        return this.allVoices;
    }

    public setSpeechEnabled(enabled: boolean) {
        this.speechEnabled = enabled
    }
    public isSayingSomething() {
        return this.synth.speaking;
    }

    /**
     * enqueue
     * @param message
     */
    public sayItLater(message: string) {
        if (!this.speechEnabled) {
            return;
        }
        console.log(`say it later: ${message}`)
        const utterThis = new SpeechSynthesisUtterance(message);
        utterThis.voice = this.selectedVoice;
        utterThis.rate = this.speechRate;

        this.synth.speak(utterThis); // this enqueues
    }

    /**
     * interrupt
     * @param message
     */
    public sayIt(message: string) {
        if (!this.speechEnabled) {
            return;
        }
        console.log(`using ${this.selectedVoice?.name} say it ${message}`)
        const utterThis = new SpeechSynthesisUtterance(message);
        utterThis.voice = this.selectedVoice;
        utterThis.rate = this.speechRate;

        if (this.synth.speaking) {
            this.synth.cancel(); // stop current utterance
            // chrome needs a delay here for some reason, otherwise speak doesn't do anything.
            // 60 ms seems to be around the minimum delay
            setTimeout(() => this.synth.speak(utterThis), 60)
        } else {
            this.synth.speak(utterThis);
        }
    }

    /**
     * say it if not already saying something
     * @param message
     */
    public sayItPolitely(message:string) {
        if(this.isSayingSomething()) {
            console.log(`say it politely yielding. ${message}`);
            return;
        }
        this.sayIt(message);
    }
}
