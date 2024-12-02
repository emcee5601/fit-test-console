/**
 * Describes a fit test protocol.
 */
import AbstractDB from "./abstract-db.ts";

export enum SampleSource {
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
    purgeDuration: number;
    purgeInstructions: string|undefined;
    sampleDuration: number;
    sampleInstructions: string|undefined;

    constructor(index: number|undefined = undefined,
                name: string|undefined = undefined,
                source: SampleSource|undefined = undefined,
                purgeDuration: number = 4, purgeInstructions: string|undefined = undefined,
                sampleDuration: number = 5, sampleInstructions: string|undefined = undefined) {
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
    index: number|undefined;
    name: string| undefined;
    fitFactorCalculationMethod: FitFactorCalculationMethod | undefined;
    stages: SamplingStage[] = []

    constructor(name:string|undefined = undefined,
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
    static readonly keyPath = "index";
    constructor(name = FitTestProtocolDB.DB_NAME) {
        super(name, [FitTestProtocolDB.PROTOCOLS_OBJECT_STORE], 1);
    }

    private async putInternal(protocol: FitTestProtocol) {
        // strip out the keyPath if it's not truthy, otherwise we can get in invalid key error
        const record = protocol
        if(!record.index) {
            console.log(`record has no index: ${JSON.stringify(record)}`)
            delete record.index;
        }
        return super.put(FitTestProtocolDB.PROTOCOLS_OBJECT_STORE, record)
    }
    private async deleteInternal(protocol: FitTestProtocol) {
        const record = protocol
        if(record.index) {
            return super.delete(FitTestProtocolDB.PROTOCOLS_OBJECT_STORE, record.index)
        } else {
            return new Promise((_resolve, reject) => {
                reject(`protocol ${protocol.name} has no index, cannot delete it`)
            })
        }
    }

    saveProtocol(protocol: FitTestProtocol) {
        this.putInternal(protocol).then((result) => {
            console.log(`saveProtocol succeeded; index=${JSON.stringify(result)}, ${JSON.stringify(protocol)}`);
        }).catch((reason) => {
            console.error(`could not save protocol ${JSON.stringify(protocol)}; ${reason}`);
        })
    }
    deleteProtocol(protocol: FitTestProtocol) {
        this.deleteInternal(protocol).then(() => {
            console.log(`deleteProtocol succeeded: ${protocol.index} (${protocol.name})`);
        }).catch((reason) => {
            console.error(`could not save protocol ${JSON.stringify(protocol)}; ${reason}`);
        })
    }

    async getAllProtocols(): Promise<FitTestProtocol[]> {
        return new Promise<FitTestProtocol[]>((resolve, reject) => {
        super.getAllDataFromDataSource<FitTestProtocol>(FitTestProtocolDB.PROTOCOLS_OBJECT_STORE).then((protocols) => {
            // clean up protocols: strip any stages that are 'null'
            const fixedProtocols = protocols.map((protocol) => {
                protocol.stages = protocol.stages.filter((stage) => stage)
                return protocol;
            })
            resolve(fixedProtocols);
        }).catch((reason) => {
            reject(reason);
        });
        })
    }

    override onUpgradeNeeded(request: IDBOpenDBRequest) {
        const theDb = request.result;
        console.warn(`Database upgrade needed: ${this.dbName}`);
        // Create an objectStore for this database
        theDb.createObjectStore(FitTestProtocolDB.PROTOCOLS_OBJECT_STORE, {autoIncrement: true, keyPath: FitTestProtocolDB.keyPath});
    }
}

export const fitTestProtocolDb = new FitTestProtocolDB();
