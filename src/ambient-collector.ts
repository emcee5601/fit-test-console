/**
 * Collects ambient counts in the background.
 */
import {ParticleConcentrationEvent, PortaCountListener} from "src/portacount-client-8020.ts";
import {SampleSource} from "src/portacount/porta-count-state.ts";

export class AmbientCollector implements PortaCountListener {
    private readonly MAX_AGE_MS = 60 * 1000; // 1 minute
    private history: ParticleConcentrationEvent[] = []

    constructor() {
    }

    particleConcentrationReceived(concentrationEvent: ParticleConcentrationEvent): void {
        if(concentrationEvent.sampleSource === SampleSource.AMBIENT) {
            this.history.push(concentrationEvent);
            const now = Date.now();
            const index = this.history.findLastIndex((event) => now - event.timestamp > this.MAX_AGE_MS)
            if(index > -1 ) {
                // prune
                this.history.splice(index);
            }
        }
    }

    getEvents(maxAgeMs: number, minSamples: number = 5): ParticleConcentrationEvent[] {
        const now = Date.now();
        const events = this.history.filter((event) => now - event.timestamp < maxAgeMs).slice(minSamples)
        if(events.length < minSamples) {
            console.debug(`ambient collector not enough samples for ${minSamples} samples with max age ${maxAgeMs}ms; only have ${events.length} samples.`)
            return []
        }
        return events;
    }

    getAvg(maxAgeMs: number, minSamples: number = 5): number {
        const events = this.getEvents(maxAgeMs, minSamples)
        if(events.length < minSamples) {
            return -1
        }
        return events.reduce((total, cur) => total + cur.concentration, 0) / events.length
    }
}
