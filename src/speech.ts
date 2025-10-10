/**
 *
 */
export const SPEECH = new class {
    private _synth?: SpeechSynthesis;
    private speechEnabled: boolean = false;
    private _allVoices: SpeechSynthesisVoice[] = [];
    private selectedVoice: SpeechSynthesisVoice | null = null;
    private speechRate: number = 1;

    constructor() {
    }
    findDefaultVoice() {
        const allVoices = this.allVoices;
        const foundVoice = allVoices.find((voice) => voice.default);
        return foundVoice ? foundVoice : null;
    }

    findVoiceByName(name: string) {
        return this.allVoices.find((voice) => voice.name === name) || null;
    }


    private ensureSynthInitialized() {
        if(!this._synth) {
            this._synth = this.initSynth();
            console.debug("init synth")
        }
    }

    private initSynth() {
        const synth = window.speechSynthesis; // this could just be speechSynthesis without the window reference?
        this.updateVoiceList(synth.getVoices());
        synth.onvoiceschanged = () => {
            this.updateVoiceList(synth.getVoices());
        };
        return synth
    }

    get synth(): SpeechSynthesis {
        this.ensureSynthInitialized();
        return this._synth!;
    }

    /**
     * Exclude non-english voices
     * @param voices
     */
    private updateVoiceList(voices: SpeechSynthesisVoice[]) {
        this._allVoices = voices.filter((voice) => {
            // console.log(`voice ${voice.name} has lang ${voice.lang}`);
            return voice.lang.startsWith("en")
        }).sort((a, b) => `${a.lang} ${a.name}`.localeCompare(`${b.lang} ${b.name}`));
        // todo: emit an event so the widget can pick up the voice list changed. or maybe force the selected voice to change?
    }

    public setSelectedVoice(voice: SpeechSynthesisVoice) {
        this.selectedVoice = voice
    }
    public getSelectedVoice() {
        return this.selectedVoice
    }
    get allVoices() {
        this.ensureSynthInitialized();
        return this._allVoices;
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
        // console.log(`say it later: ${message}`)
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
        console.log(`using voice ${this.selectedVoice?.name} say it ${message}`)
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
