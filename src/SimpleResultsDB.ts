import AbstractDB from "./abstract-db.ts";
import {DataSource} from "src/data-source.ts";
import {ControlSource, SampleSource} from "src/portacount/porta-count-state.ts";

type ParticleCount = {type: SampleSource, count: number}
export interface SimpleResultsDBRecord {
    ID: number,
    Time: string,
    Participant?: string,
    Mask?: string,
    Notes?: string,
    "Ex 1"?: number,
    "Ex 2"?: number,
    "Ex 3"?: number,
    "Ex 4"?: number,
    "Ex 5"?: number,
    "Ex 6"?: number,
    "Ex 7"?: number,
    "Ex 8"?: number,
    "Ex 9"?: number,
    "Ex 10"?: number,
    "Ex 11"?: number,
    "Ex 12"?: number,
    Final?: number,
    ProtocolName?: string,
    TestController?: ControlSource,
    DataSource?: string,
    ParticleCounts?: ParticleCount[],
    [key: string]: string | number | undefined | ParticleCount[],
}

class SimpleResultsDB extends AbstractDB {
    static DEFAULT_DB_NAME = "fit-test-data-db";
    static TEST_RESULTS_OBJECT_STORE = "test-results-table-data";

    // dbOpenDBRequest: IDBOpenDBRequest | undefined;
    constructor(name = SimpleResultsDB.DEFAULT_DB_NAME) {
        super(name, [SimpleResultsDB.TEST_RESULTS_OBJECT_STORE], 2)
    }

    override onUpgradeNeeded(request: IDBOpenDBRequest) {
        const theDb = request.result;

        console.warn(`${this.dbName} Database upgrade needed: ${theDb.name}`);
        // Create an objectStore for this database
        theDb.createObjectStore(SimpleResultsDB.TEST_RESULTS_OBJECT_STORE, {autoIncrement: true, keyPath: "ID"});
    }

    keepRecords: SimpleResultsDBRecord[] = [];

    async getData(keep?:(item:SimpleResultsDBRecord) => boolean): Promise<SimpleResultsDBRecord[]> {
        return this.getDataFromDataSource(SimpleResultsDB.TEST_RESULTS_OBJECT_STORE, keep);
    }

    /**
     * Inserts an empty record into the database. This generates a new ID for the record.
     * Return the json representation of the data that was inserted. Includes the generated primary key.
     */
    async createNewTest(timestamp: string, protocolName: string, testController: ControlSource, dataSource: DataSource): Promise<SimpleResultsDBRecord> {
        const transaction = this.openTransactionClassic("readwrite");
        if (!transaction) {
            console.log("database not ready");
            return new Promise((_resolve, reject) => reject(`${this.dbName} database not ready`));
        }

        const record = {
            Time: timestamp,
            ProtocolName: protocolName,
            TestController: testController,
            DataSource: dataSource
        };
        const request = transaction?.objectStore(SimpleResultsDB.TEST_RESULTS_OBJECT_STORE).add(record);
        return new Promise((resolve, reject) => {
            request.onerror = (event) => {
                const errorMessage = `createNewTest request error ${event}`;
                console.log(errorMessage);
                reject(errorMessage);
            }
            request.onsuccess = (event) => {
                console.log(`createNewTest request complete: ${event}, new key is ${request.result}`);
                // TODO: fetch the whole record and return that instead of constructing this by hand?
                resolve({ ...record, ID: Number(request.result)});
            }
        });
    }

    async updateTest(record: SimpleResultsDBRecord) {
        return new Promise((resolve, reject) => {
            const transaction = this.openTransactionClassic("readwrite");
            if (!transaction) {
                console.log("database not ready");
                reject(`${this.dbName} database not ready`);
                return
            }

            // make sure ID is numeric?
            record.ID = Number(record.ID);

            const request = transaction.objectStore(SimpleResultsDB.TEST_RESULTS_OBJECT_STORE).put(record);
            request.onerror = (event) => {
                const errorMessage = `updateTest request error ${event}`;
                console.log(errorMessage);
                reject(errorMessage);
            }
            request.onsuccess = () => {
                // console.log(`updateTest request complete: ${JSON.stringify(event)}, record: ${JSON.stringify(record)}`);
                resolve({ID: request.result}); // todo: return something more appropriate for an update
            }
        });
    }

    /**
     * Add a record. Intended for merging datasets.
     * Ignores the ID column of the input data.
     * De-duplication is the responsibility of the caller.
     * @param record
     */
    async addRecord(record: SimpleResultsDBRecord) {
        const partial:Partial<SimpleResultsDBRecord> = record;
        delete(partial.ID)
        return this.put(SimpleResultsDB.TEST_RESULTS_OBJECT_STORE, partial as SimpleResultsDBRecord);
    }

    async addRecords(records: SimpleResultsDBRecord[]) {
        for (const record of records) {
            await this.addRecord(record);
        }
    }

    async deleteRecord(record: SimpleResultsDBRecord) {
        return this.deleteRecordById(record.ID);
    }
    async deleteRecordById(recordId: number) {
        return this.delete(SimpleResultsDB.TEST_RESULTS_OBJECT_STORE, recordId);
    }
}


export const RESULTS_DB = new SimpleResultsDB();
