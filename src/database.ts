/*
Stores raw data lines from the data collector. Suitable for parsing with the updated simulator.
 */

export interface SimpleDBRecord {
    timestamp: string;
    data: string;
}

export interface SimpleResultsDBRecord {
    ID: number,

    [key: string]: string | number;
}

export interface AppSettings {
    ID: "settings",

    [key: string]: string | number,
}

export class SettingsDB {
    static DB_NAME = "settings-db";
    static OBJECT_STORE_NAME = "settings-data";
    dbName: string;
    db: IDBDatabase | undefined;

    constructor(name = SettingsDB.DB_NAME) {
        this.dbName = name;
        const request = window.indexedDB.open(name, 1);
        // use arrow here so `this` inside the callback points to the SimpleDB instance.
        request.onsuccess = () => this.onOpenSuccess(request); // function call to create a closure since we need "this"
        request.onerror = () => this.onOpenError(request);
        request.onupgradeneeded = () => this.onUpgradeNeeded(request);
    }

    onOpenSuccess(request: IDBOpenDBRequest) {
        this.db = request.result;
        console.log("Database Opened", this.db);
    }

    onOpenError(request: IDBOpenDBRequest) {
        console.error(`Database error: ${request.error?.message}`);
    }

    onUpgradeNeeded(request: IDBOpenDBRequest) {
        // Save the IDBDatabase interface
        const theDb = request.result;

        console.warn(`Database upgrade needed: ${theDb.name}`);
        // Create an objectStore for this database
        theDb.createObjectStore(SettingsDB.OBJECT_STORE_NAME, {keyPath: "ID"});
    }

    async getSettings() {
        const transaction = this.openTransaction("readonly");
        if (!transaction) {
            console.log("settings db not ready")
            return;
        }
        const request = transaction.objectStore(SettingsDB.OBJECT_STORE_NAME).get("settings")
        return new Promise((resolve, reject) => {
            request.onerror = (event) => {
                const errorMessage = `getSettings request error ${event}`;
                console.log(errorMessage);
                reject(errorMessage);
            }
            request.onsuccess = (event) => {
                console.log(`getSettings request complete: ${event}, result: ${request.result}`);
                resolve(request.result);
            }
        });
    }

    async saveSettings(settings: AppSettings) {
        const transaction = this.openTransaction("readwrite");
        if (!transaction) {
            console.log("settings db not ready")
            return;
        }
        const request = transaction.objectStore(SettingsDB.OBJECT_STORE_NAME).put(settings);
        return new Promise((resolve, reject) => {
            request.onerror = (event) => {
                const errorMessage = `saveSettings request error ${event}`;
                console.log(errorMessage);
                reject(errorMessage);
            }
            request.onsuccess = (event) => {
                console.log(`saveSettings request complete: ${event}, result: ${request.result}`);
                resolve(request.result);
            }
        });
    }


    openTransaction(mode: IDBTransactionMode) {
        if (!this.db) {
            console.log(`${this.dbName} database not ready`);
            return;
        }
        const transaction = this.db.transaction([SimpleDB.SERIAL_LINE_OBJECT_STORE], mode);
        transaction.oncomplete = (event) => {
            console.log(`SettingsDB transaction complete: ${event}`);
        }
        transaction.onerror = (event) => {
            console.log(`SettingsDB transaction error ${event}`);
        }
        return transaction;
    }
}


export class SimpleDB {
    static DEFAULT_DB_NAME = "raw-serial-line-data-db";
    static SERIAL_LINE_OBJECT_STORE = "serial-line-data";
    db: IDBDatabase | undefined;
    dbOpenRequest: IDBOpenDBRequest;
    dbName;

    constructor(name = SimpleDB.DEFAULT_DB_NAME) {
        this.dbName = name;
        this.dbOpenRequest = window.indexedDB.open(this.dbName, 1);
        // use arrow here so `this` inside the callback points to the SimpleDB instance.
        this.dbOpenRequest.onsuccess = () => this.onOpenSuccess(); // function call to create a closure since we need "this"
        this.dbOpenRequest.onerror = () => this.onOpenError();
        this.dbOpenRequest.onupgradeneeded = () => this.onUpgradeNeeded();
    }

    onOpenSuccess() {
        this.db = this.dbOpenRequest.result;
        console.log("Database Opened", this.db);
    }

    onOpenError() {
        console.error(`Database error: ${this.dbOpenRequest.error?.message}`);
    }

    onUpgradeNeeded() {
        // Save the IDBDatabase interface
        const theDb = this.dbOpenRequest.result;

        console.warn(`Database upgrade needed: ${theDb.name}`);
        // Create an objectStore for this database
        theDb.createObjectStore(SimpleDB.SERIAL_LINE_OBJECT_STORE, {autoIncrement: true, keyPath: "index"});
    }


    // TODO: wrap these into an object
    static ONE_HOUR = 60 * 60 * 1000;
    keepRecords: SimpleDBRecord[] = [];
    now = new Date(); // use .getTime() to get epoch time

    /**
     * Return a recent contiguous block of lines. Look at the timestamp of the record. Stop when there is a gap of more than 1 hour between timestamps.
     * Don't return anything if the most recent record is more than 1 hour old.
     * @param callback
     */
    getSomeRecentLines(callback: ((keepLines: SimpleDBRecord) => void)) {
        const transaction = this.openTransaction("readonly");
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
        const transaction = this.openTransaction("readwrite");
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

    openTransaction(mode: IDBTransactionMode) {
        if (!this.db) {
            console.log(`${this.dbName} database not ready`);
            return;
        }
        const transaction = this.db.transaction([SimpleDB.SERIAL_LINE_OBJECT_STORE], mode);
        transaction.oncomplete = (event) => {
            console.log(`SimpleDB transaction complete: ${event}`);
        }
        transaction.onerror = (event) => {
            console.log(`SimpleDB transaction error ${event}`);
        }
        return transaction;
    }
}


/*
Stores data from results table.
 */

export class SimpleResultsDB {
    static DEFAULT_DB_NAME = "fit-test-data-db";
    static TEST_RESULTS_OBJECT_STORE = "test-results-table-data";
    db: IDBDatabase | undefined;
    dbName;

    // dbOpenDBRequest: IDBOpenDBRequest | undefined;
    constructor(name = SimpleResultsDB.DEFAULT_DB_NAME) {
        this.dbName = name;
        console.log("SimpleResultsDB constructor called")
    }

    async open() {
        const request = window.indexedDB.open(this.dbName, 2)
        return new Promise<SimpleResultsDB>((resolve, reject) => {
            // this.dbOpenDBRequest = request;
            // use arrow here so `this` inside the callback points to the SimpleResultsDB instance.
            request.onsuccess = () => {
                this.db = request.result;
                console.log(`${this.dbName} Database Opened`, this.db);
                resolve(this);
            }; // needs to be a function call to create a closure
            request.onerror = () => {
                const errorMessage = `${this.dbName} Database error: ${request?.error?.message}`;
                console.error(errorMessage);
                reject(errorMessage);
            }
            request.onupgradeneeded = () => {
                this.onUpgradeNeeded(request);
                // TODO: do we need to resolve here? or does this call onsuccess later?
            };
            console.log("SimpleResultsDB.open() called")
        })
    }

    close() {
        this.db?.close();
        console.log(`${this.dbName} closed`);
    }

    private onUpgradeNeeded(request: IDBOpenDBRequest) {
        // Save the IDBDatabase interface
        const theDb = request.result;

        console.warn(`${this.dbName} Database upgrade needed: ${theDb.name}`);
        // Create an objectStore for this database
        theDb.createObjectStore(SimpleResultsDB.TEST_RESULTS_OBJECT_STORE, {autoIncrement: true, keyPath: "ID"});
    }

    // TODO: wrap these into an object
    static ONE_HOUR = 60 * 60 * 1000;
    keepRecords: SimpleResultsDBRecord[] = [];
    now = new Date(); // use .getTime() to get epoch time


    /**
     * read the whole db
     */
    async getAllData() {
        return new Promise<SimpleResultsDBRecord[]>((resolve, reject) => {
            const transaction = this.openTransaction("readonly");
            const allRecords: SimpleResultsDBRecord[] = [];
            if (!transaction) {
                console.log(`${this.dbName} database not ready`);
                reject(`${this.dbName} database not ready`);
                return;
            }

            const request = transaction.objectStore(SimpleResultsDB.TEST_RESULTS_OBJECT_STORE).openCursor(null, "next");

            request.onerror = (event) => {
                console.log(`getAllData openCursor request error ${event}`);
                reject(`error ${event}`);
            }
            request.onsuccess = (event) => {
                // console.log(`getAllData openCursor request complete: ${event}`);
                const cursor = request.result;
                if (cursor) {
                    // console.log(`got key ${cursor.key}`);

                    allRecords.push(cursor.value);
                    cursor.continue();

                } else {
                    // no more results
                    console.log(`${this.dbName} cursor done ${event}. got ${allRecords.length} records`);
                    resolve(allRecords);
                }
            }
        });
    }

    /**
     * Return a recent contiguous block of data. Look at the timestamp of the record. Stop when there is a gap of more than 1 hour between timestamps.
     * Don't return anything if the most recent record is more than 1 hour old.
     * @param callback
     */
    getSomeRecentData(callback: ((data: SimpleResultsDBRecord) => void)) {
        const transaction = this.openTransaction("readonly");
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
        const transaction = this.openTransaction("readwrite");
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
            const transaction = this.openTransaction("readwrite");
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


    openTransaction(mode: IDBTransactionMode) {
        if (!this.db) {
            console.log(`${this.dbName} database not ready`);
            return;
        }
        const transaction = this.db.transaction([SimpleResultsDB.TEST_RESULTS_OBJECT_STORE], mode);
        transaction.oncomplete = (event) => {
            console.log(`SimpleResultsDB transaction complete: ${event.target}`);
        }
        transaction.onerror = (event) => {
            console.log(`SimpleResultsDB transaction error ${event}`);
        }
        return transaction;
    }
}