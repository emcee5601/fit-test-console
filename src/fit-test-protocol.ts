/**
 * Describes a fit test protocol.
 */
import AbstractDB from "./abstract-db.ts";

enum SampleSource {
    Ambient = 'Ambient',
    Mask = 'Mask',
}

export enum FitFactorCalculationMethod {
    /**
     * Use 2 ambient readings (time weighted average) to calculate fit factor.
     * Take the last reading from before the mask sample
     * and the first reading from after the mask sample.
     */
    BeforeAndAfter = 'BeforeAndAfter',
    /**
     * Use a single ambient reading to calculate fit factor. Prefer the reading closest in time.
     */
    Before = 'Before',

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
    name: string| undefined;
    fitFactorCalculationMethod: FitFactorCalculationMethod | undefined;
    stages: SamplingStage[] = []

    constructor(name = undefined,
                fitFactorCalculationMethod = undefined) {
        this.name = name;
        this.fitFactorCalculationMethod = fitFactorCalculationMethod;
    }

    addStage(stage:SamplingStage) {
        this.stages.push(stage);
    }
    setStages(stages: SamplingStage[]) {
        this.stages = stages;
    }
}

class FitTestProtocolDB extends AbstractDB {
    static readonly DB_NAME = "fit-test-protocols"
    static readonly PROTOCOLS_OBJECT_STORE = "protocol-definitions"
    constructor(name = FitTestProtocolDB.DB_NAME) {
        super(name, [FitTestProtocolDB.PROTOCOLS_OBJECT_STORE], 1);
    }

    saveProtocol(protocol: FitTestProtocol) {
        this.put(FitTestProtocolDB.PROTOCOLS_OBJECT_STORE, protocol).then((result) => {
            console.log(`saveProtocol succeeded; index=${JSON.stringify(result)}, ${JSON.stringify(protocol)}`);
        })
    }

    async getAllData(): Promise<FitTestProtocol[]> {
        return super.getAllDataFromDataSource(FitTestProtocolDB.PROTOCOLS_OBJECT_STORE);
    }

    override onUpgradeNeeded(request: IDBOpenDBRequest) {
        const theDb = request.result;
        console.warn(`Database upgrade needed: ${this.dbName}`);
        // Create an objectStore for this database
        theDb.createObjectStore(FitTestProtocolDB.PROTOCOLS_OBJECT_STORE, {autoIncrement: true, keyPath: "index"});
    }
}

export const fitTestProtocolDb = new FitTestProtocolDB();
