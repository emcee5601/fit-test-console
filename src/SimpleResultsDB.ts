import AbstractDB from "./abstract-db.ts";

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
    Final?: number,
    ProtocolName?: string,
    TestController?: string,
    DataSource?: string,
    [key: string]: string | number | undefined,
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

    async getAllData(): Promise<SimpleResultsDBRecord[]> {
        return super.getAllDataFromDataSource(SimpleResultsDB.TEST_RESULTS_OBJECT_STORE);
    }

    /**
     * Return a recent contiguous block of data. Look at the timestamp of the record. Stop when there is a gap of more than 1 hour between timestamps.
     * Don't return anything if the most recent record is more than 1 hour old.
     * @param callback
     */
    getSomeRecentData(callback: ((data: SimpleResultsDBRecord) => void)) {
        const transaction = this.openTransactionClassic("readonly");
        if (!transaction) {
            console.log("database not ready");
            return;
        }
        const request = transaction.objectStore(SimpleResultsDB.TEST_RESULTS_OBJECT_STORE).openCursor(null, "prev");
        let done = false;

        request.onerror = (event) => {
            console.log(`getSomeRecentData openCursor request error ${event}`);
        }
        request.onsuccess = (event) => {
            console.log(`getSomeRecentData openCursor request complete: ${event}`);
            const cursor = request.result;
            if (cursor) {
                // console.log(`got key ${cursor.key}`);

                // keep
                this.keepRecords.push(cursor.value);
                cursor.continue();

                // callback();
            } else {
                // no more results
                console.log(`${this.dbName} cursor done`);
                done = true;
            }

            if (done) {
                // now we can call the callback with records we're keeping in order of oldest to newest
                console.log(`collected ${this.keepRecords.length} records`);
                while (this.keepRecords.length > 0) {
                    const record = this.keepRecords.pop();
                    if (record) {
                        callback(record);
                    }
                }
            }
        }
    }

    /**
     * Inserts an empty record into the database. This generates a new ID for the record.
     * Return the json representation of the data that was inserted. Includes the generated primary key.
     */
    async createNewTest(timestamp: string, protocolName: string, testController: string, dataSource: string): Promise<SimpleResultsDBRecord> {
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
}


export const RESULTS_DB = new SimpleResultsDB();
