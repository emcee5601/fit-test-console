/**
 * Collects particle counts in the background.
 */
import {AppSettings} from "src/app-settings-types.ts";
import {APP_SETTINGS_CONTEXT} from "src/app-settings.ts";
import {NO_PARTICLE_COUNT_STATS, ParticleCountStats} from "src/particle-count-stats.ts";
import {ParticleConcentrationEvent, PortaCountListener} from "src/portacount-client-8020.ts";
import {SampleSource} from "src/portacount/porta-count-state.ts";
import {calcStats} from "src/utils.ts";

type AmbientOrMask = AppSettings.CURRENT_MASK_AVERAGE | AppSettings.CURRENT_AMBIENT_AVERAGE;

export class ParticleSampleCollector implements PortaCountListener {
    static readonly DEFAULT_MAX_AGE_MS = 60 * 1000; // 1 minute
    private readonly history: ParticleConcentrationEvent[] = []
    private readonly source: SampleSource
    private readonly maxAgeMs: number;
    private readonly settingName: AmbientOrMask;
    private nextSampleTimeMs: number = 0;

    constructor(source: SampleSource, maxAgeMs: number = ParticleSampleCollector.DEFAULT_MAX_AGE_MS) {
        this.source = source
        this.maxAgeMs = maxAgeMs
        this.settingName = source === SampleSource.AMBIENT ? AppSettings.CURRENT_AMBIENT_AVERAGE : AppSettings.CURRENT_MASK_AVERAGE;
    }

    particleConcentrationReceived(concentrationEvent: ParticleConcentrationEvent): void {
        const now = Date.now();
        if (concentrationEvent.sampleSource === this.source && now > this.nextSampleTimeMs) {
            this.history.push(concentrationEvent);
            const index = this.history.findLastIndex((event) => now - event.timestamp > this.maxAgeMs)
            if (index > -1) {
                // prune
                // console.debug(new Date(), `pruning ${this.source} at index ${index}, history length is `,
                // this.history.length)
                this.history.splice(0, index + 1);
            }
            APP_SETTINGS_CONTEXT.saveSetting(this.settingName, this.getStats(10 * 60 * 1000, 0))
        }
    }

    getEvents(eventMaxAgeMs: number): ParticleConcentrationEvent[] {
        const now = Date.now();
        return this.history.filter((event) => now - event.timestamp < eventMaxAgeMs);
    }

    getStats(eventMaxAgeMs: number, minSamples: number = 5): ParticleCountStats {
        const events = this.getEvents(eventMaxAgeMs)
        if (events.length < minSamples) {
            console.debug(`${this.source} collector not enough samples for ${minSamples} samples with max age ${eventMaxAgeMs}ms; only have ${events.length} samples.`)
            return NO_PARTICLE_COUNT_STATS
        }
        return calcStats(events.map((pce) => pce.concentration))
    }

    isPurging(): boolean {
        return Date.now() < this.nextSampleTimeMs;
    }

    reset(purgeDurationMs: number = 0) {
        if (purgeDurationMs) {
            this.nextSampleTimeMs = Date.now() + purgeDurationMs
        }
        this.history.splice(0);
        this.resetStats(this.settingName);
    }

    private resetStats(settingName: AmbientOrMask) {
        APP_SETTINGS_CONTEXT.saveSetting(settingName, NO_PARTICLE_COUNT_STATS)
    }
}
