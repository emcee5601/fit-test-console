/*
Stores raw data lines from the data collector. Suitable for parsing with the updated simulator.
 */

import AbstractDB from "./abstract-db.ts";

export interface SimpleDBRecord {
    timestamp: string;
    data: string;
}

class SimpleDB extends AbstractDB {
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

    async getData(keep?:(item:SimpleDBRecord) => boolean): Promise<SimpleDBRecord[]> {
        return this.getDataFromDataSource(SimpleDB.SERIAL_LINE_OBJECT_STORE, keep);
    }

    /**
     * Return a recent contiguous block of lines. Look at the timestamp of the record. Stop when there is a gap of more
     * than 1 hour between timestamps. Don't return anything if the most recent record is more than 1 hour old.
     * @param callback
     */
    getSomeRecentLines(callback: ((keepLines: SimpleDBRecord) => void)) {
        const transaction = this.openTransactionClassic("readonly");
        if (!transaction) {
            console.debug(`${this.dbName} database not ready`);
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
            console.error(`addRecord request error ${event}`);
        }
        request.onsuccess = () => {
            // console.debug(`addRecord request complete: ${event}, new key is ${request.result}`);
        }
    }
}

export const RAW_DB = new SimpleDB()
