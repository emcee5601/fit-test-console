/**
 * Collects particle counts in the background.
 */
import {ParticleConcentrationEvent, PortaCountListener} from "src/portacount-client-8020.ts";
import {SampleSource} from "src/portacount/porta-count-state.ts";
import {AppSettings, ValidSettings} from "src/app-settings-types.ts";
import {APP_SETTINGS_CONTEXT} from "src/app-settings.ts";

export class ParticleSampleCollector implements PortaCountListener {
    static readonly DEFAULT_MAX_AGE_MS = 60 * 1000; // 1 minute
    private readonly history: ParticleConcentrationEvent[] = []
    private readonly source: SampleSource
    private readonly maxAgeMs: number;
    private readonly settingName: ValidSettings;

    constructor(source: SampleSource, maxAgeMs: number = ParticleSampleCollector.DEFAULT_MAX_AGE_MS) {
        this.source = source
        this.maxAgeMs = maxAgeMs
        this.settingName = source === SampleSource.AMBIENT ? AppSettings.CURRENT_AMBIENT_AVERAGE : AppSettings.CURRENT_MASK_AVERAGE;
    }

    particleConcentrationReceived(concentrationEvent: ParticleConcentrationEvent): void {
        if(concentrationEvent.sampleSource === this.source) {
            this.history.push(concentrationEvent);
            const now = Date.now();
            const index = this.history.findLastIndex((event) => now - event.timestamp > this.maxAgeMs)
            if(index > -1 ) {
                // prune
                // console.debug(new Date(), `pruning ${this.source} at index ${index}, history length is `, this.history.length)
                this.history.splice(0,index+1);
            }
            APP_SETTINGS_CONTEXT.saveSetting(this.settingName, this.getAvg(10*60*1000, 0)) // try to get all the data
        }
    }

    getEvents(eventMaxAgeMs: number): ParticleConcentrationEvent[] {
        const now = Date.now();
        return this.history.filter((event) => now - event.timestamp < eventMaxAgeMs);
    }

    getAvg(eventMaxAgeMs: number, minSamples: number = 5): number {
        const events = this.getEvents(eventMaxAgeMs)
        if(events.length < minSamples) {
            console.debug(`${this.source} collector not enough samples for ${minSamples} samples with max age ${eventMaxAgeMs}ms; only have ${events.length} samples.`)
            return -1
        }
        return events.reduce((total, cur) => total + cur.concentration, 0) / events.length
    }

    reset() {
        this.history.splice(0);
        APP_SETTINGS_CONTEXT.saveSetting(this.settingName, NaN)
    }
}
