/*
Stores raw data lines from the data collector. Suitable for parsing with the updated simulator.
 */

import AbstractDB from "./abstract-db.ts";

export interface SimpleDBRecord {
    timestamp: string;
    data: string;
}

export interface SimpleResultsDBRecord {
    ID: number,

    [key: string]: string | number;
}

export enum AppSettings {
    SPEECH_ENABLED = "speech-enabled",
    ADVANCED_MODE = "advanced-mode",
    SPEECH_VOICE = "speech-voice",
}


class SettingsDB extends AbstractDB {
    static DB_NAME = "settings-db";
    static OBJECT_STORE_NAME = "settings-data";

    constructor(name = SettingsDB.DB_NAME) {
        super(name, [SettingsDB.OBJECT_STORE_NAME], 1)
    }

    override onUpgradeNeeded(request: IDBOpenDBRequest) {
        const theDb = request.result;

        console.warn(`Database upgrade needed: ${theDb.name}`);
        // Create an objectStore for this database
        theDb.createObjectStore(SettingsDB.OBJECT_STORE_NAME, {keyPath: "ID"});
    }

    public async getSetting(name:AppSettings, defaultValue:string|boolean|number|undefined) {
        const transaction = this.openTransactionClassic("readonly");
        if (!transaction) {
            return undefined;
        }
        const request = transaction.objectStore(SettingsDB.OBJECT_STORE_NAME).get(name)
        return new Promise<boolean|string|number|undefined>((resolve, reject) => {
            request.onerror = (event) => {
                const errorMessage = `failed to get setting for ${name}; error: ${event}`;
                console.log(errorMessage);
                reject(errorMessage);
            }
            request.onsuccess = () => {
                console.log(`getSetting ${name} = ${JSON.stringify(request.result)}`);
                if(request.result) {
                    resolve(request.result.value);
                } else {
                    // no value in db, return default
                    resolve(defaultValue)
                }
            }
        });
    }

    async saveSetting(name:AppSettings, value: string|number|boolean) {
        console.log(`saving setting ${name} = ${value}`)
        const transaction = this.openTransactionClassic("readwrite");
        if (!transaction) {
            console.log("settings db not ready")
            return;
        }

        const entry = {ID: name, value:value}
        const request = transaction.objectStore(SettingsDB.OBJECT_STORE_NAME).put(entry);
        return new Promise((resolve, reject) => {
            request.onerror = (event) => {
                const errorMessage = `failed to save setting ${name} = ${value}; error: ${event}`;
                console.log(errorMessage);
                reject(errorMessage);
            }
            request.onsuccess = () => {
                console.log(`saved setting ${JSON.stringify(entry)}`);
                resolve(request.result);
            }
        });
    }
}


export class SimpleDB extends AbstractDB {
    static DEFAULT_DB_NAME = "raw-serial-line-data-db";
    static SERIAL_LINE_OBJECT_STORE = "serial-line-data";

    constructor(name = SimpleDB.DEFAULT_DB_NAME) {
        super(name, [SimpleDB.SERIAL_LINE_OBJECT_STORE], 1);
    }

    override onUpgradeNeeded(request: IDBOpenDBRequest) {
        const theDb = request.result;
        console.warn(`Database upgrade needed: ${this.dbName}`);
        // Create an objectStore for this database
        theDb.createObjectStore(SimpleDB.SERIAL_LINE_OBJECT_STORE, {autoIncrement: true, keyPath: "index"});
    }


    keepRecords: SimpleDBRecord[] = [];
    now = new Date(); // use .getTime() to get epoch time

    async getAllData(): Promise<SimpleDBRecord[]> {
        return super.getAllDataFromDataSource(SimpleDB.SERIAL_LINE_OBJECT_STORE);
    }

    /**
     * Return a recent contiguous block of lines. Look at the timestamp of the record. Stop when there is a gap of more than 1 hour between timestamps.
     * Don't return anything if the most recent record is more than 1 hour old.
     * @param callback
     */
    getSomeRecentLines(callback: ((keepLines: SimpleDBRecord) => void)) {
        const transaction = this.openTransactionClassic("readonly");
        if (!transaction) {
            console.log(`${this.dbName} database not ready`);
            return;
        }
        const request = transaction.objectStore(SimpleDB.SERIAL_LINE_OBJECT_STORE).openCursor(null, "prev");
        let done = false;

        request.onerror = (event) => {
            console.log(`getSomeRecentLines openCursor request error ${event}`);
        }
        request.onsuccess = (event) => {
            console.log(`getSomeRecentLines openCursor request complete: ${event}`);
            const cursor = request.result;
            if (cursor) {
                // cursor.key contains the key of the current record being iterated through
                // note that there is no cursor.value, unlike for openCursor
                // this is where you'd do something with the result
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
     * Return the json representation of the data that was inserted. Includes the generated primary key.
     * @param line
     */
    addLine(line: string) {
        const transaction = this.openTransactionClassic("readwrite");
        if (!transaction) {
            console.log(`${this.dbName} database not ready`);
            return {};
        }

        const record: SimpleDBRecord = {
            timestamp: new Date().toISOString(),
            data: line,
        };
        const request = transaction.objectStore(SimpleDB.SERIAL_LINE_OBJECT_STORE).add(record);
        request.onerror = (event) => {
            console.log(`addRecord request error ${event}`);
        }
        request.onsuccess = (event) => {
            console.log(`addRecord request complete: ${event}, new key is ${request.result}`);
        }
    }
}


/*
Stores data from results table.
 */

export class SimpleResultsDB extends AbstractDB {
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
    async createNewTest(timestamp: string): Promise<SimpleResultsDBRecord> {
        const transaction = this.openTransactionClassic("readwrite");
        if (!transaction) {
            console.log("database not ready");
            return new Promise((_resolve, reject) => reject(`${this.dbName} database not ready`));
        }

        const record = {
            Time: timestamp,
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
                resolve({ID: Number(request.result), ...record});
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
            request.onsuccess = (event) => {
                console.log(`updateTest request complete: ${JSON.stringify(event)}, record: ${JSON.stringify(record)}`);
                resolve({ID: request.result}); // todo: return something more appropriate for an update
            }
        });
    }
}

export const SETTINGS_DB = new SettingsDB();

