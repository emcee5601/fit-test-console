/**
 * Describes a fit test protocol.
 */

enum SampleSource {
    Ambient = 'Ambient',
    Mask = 'Mask',
}

enum FitFactorCalculationMethod {
    /**
     * Use a single ambient reading to calculate fit factor. Prefer the reading closest in time.
     */
    NearestAmbient = 'NearestAmbient',
    /**
     * Use 2 ambient readings (time weighted average) to calculate fit factor. Take the 2 readings closest in time to the mask reading.
     * This will typically be the sample before and the sample after the mask.
     */
    TwoNearestAmbient = 'TwoNearestAmbient',
    /**
     * Use the (time weighted) average of all ambient readings in the test.
     */
    AllAmbient = 'AllAmbient',
}

/**
 * Describes a stage in the protocol. Each stage consists of 3 steps:
 * - switch the valve to sample from the specified source
 * - purge for the specified number of seconds (can be zero)
 * - sample for the specified number of seconds (can be zero)
 */
export class SamplingStage {
    index: number|undefined;
    name: string|undefined;
    source: SampleSource|undefined
    purgeDuration: number|undefined;
    purgeInstructions: string|undefined;
    sampleDuration: number|undefined;
    sampleInstructions: string|undefined;

    constructor(index: number|undefined = undefined,
                name: string|undefined = undefined,
                source: SampleSource|undefined = undefined,
                purgeDuration: number|undefined = undefined, purgeInstructions: string|undefined = undefined,
                sampleDuration: number|undefined = undefined, sampleInstructions: string|undefined = undefined) {
        this.index = index;
        this.name = name;
        this.source = source;
        this.purgeDuration = purgeDuration;
        this.purgeInstructions = purgeInstructions;
        this.sampleDuration = sampleDuration;
        this.sampleInstructions = sampleInstructions;
    }
}

export class FitTestProtocol {
    readonly name: string;
    readonly fitFactorCalculationMethod: FitFactorCalculationMethod;
    readonly stages: SamplingStage[] = []

    constructor(name: string, fitFactorCalculationMethod: FitFactorCalculationMethod = FitFactorCalculationMethod.NearestAmbient) {
        this.name = name;
        this.fitFactorCalculationMethod = fitFactorCalculationMethod;
    }

    addStage(index:number, name: string, source: SampleSource, purgeDuration: number, purgeInstructions: string, sampleDuration: number, sampleInstructions: string) {
        this.stages.push(new SamplingStage(index, name, source, purgeDuration, purgeInstructions, sampleDuration, sampleInstructions));
    }

}