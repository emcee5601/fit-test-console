export default abstract class AbstractDB {
    db: IDBDatabase | undefined;
    dbName: string;
    version: number;
    defaultDataStores: string[];

    protected constructor(dbName: string, defaultDataStores: string[] = [], version: number = 1) {
        this.dbName = dbName;
        this.version = version;
        this.defaultDataStores = defaultDataStores;
    }

    abstract onUpgradeNeeded(request: IDBOpenDBRequest): void;

    /**
     * read the whole db
     */
    protected async getAllDataFromDataSource<T>(dataStoreName: string): Promise<T[]> {
        return new Promise<T[]>((resolve, reject) => {
            const transaction = this.openTransactionClassic("readonly");
            const allRecords: T[] = [];
            if (!transaction) {
                console.log(`${this.dbName} database not ready`);
                reject(`${this.dbName} database not ready`);
                return;
            }

            const request = transaction.objectStore(dataStoreName).openCursor(null, "next");

            request.onerror = (event) => {
                console.log(`getAllDataFromDataSource openCursor request error ${event}`);
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

    private onOpenSuccess(request: IDBOpenDBRequest) {
        this.db = request.result;
        console.log(`${this.dbName} Database Opened`, this.db);
    }

    private onOpenError(request: IDBOpenDBRequest) {
        console.error(`${this.dbName} Database error: ${request.error?.message}`);
    }

    openTransactionClassic(mode: IDBTransactionMode, objectStoreNames: string[] = this.defaultDataStores) {
        if (!this.db) {
            console.log(`${this.dbName} database not ready`);
            return;
        }
        const transaction = this.db.transaction(objectStoreNames, mode);
        transaction.oncomplete = (event) => {
            console.log(`${this.dbName} transaction complete: ${event}`);
        }
        transaction.onerror = (event) => {
            console.log(`${this.dbName} transaction error ${event}`);
        }
        return transaction;
    }

    /**
     * Resolves to a IDBTransaction on success.
     * @param mode
     * @param objectStoreNames
     */
    private async openTransaction(mode: IDBTransactionMode, objectStoreNames: string[] = this.defaultDataStores) {
        return new Promise<IDBTransaction>((resolve, reject) => {
            if (!this.db) {
                console.log(`${this.dbName} database not ready`);
                reject(`${this.dbName} database not ready`)
                return
            }
            const transaction = this.db.transaction(objectStoreNames, mode);
            transaction.oncomplete = (event) => {
                console.log(`${this.dbName} transaction complete: ${JSON.stringify(event)}`);
            }
            transaction.onerror = (event) => {
                console.log(`${this.dbName} transaction error ${event}`);
            }
            resolve(transaction);
        })
    }

    async get(objectStore: string, key: string) {
        return new Promise((resolve, reject) => {
            this.openTransaction("readonly").then((transaction) => {
                const request = transaction.objectStore(objectStore).get(key);
                request.onsuccess = () => {
                    resolve(request.result);
                }
                request.onerror = (event) => {
                    const errorMessage = `${this.dbName} get(${key}) failed; error: ${event}`;
                    console.log(errorMessage);
                    reject(errorMessage);
                }
            });
        })
    }

    async put<T>(objectStore: string, value: T) {
        return new Promise((resolve, reject) => {
            this.openTransaction("readwrite").then((transaction) => {
                try {
                    const request = transaction.objectStore(objectStore).put(value);
                    request.onsuccess = () => {
                        resolve(request.result);
                    }
                    request.onerror = (event) => {
                        const errorMessage = `${this.dbName} put(${JSON.stringify(value)}) failed; error: ${event}`
                        console.log(errorMessage);
                        reject(errorMessage);
                    }
                } catch (error) {
                    reject(`${error} value: ${JSON.stringify(value)}`);
                }
            })
        })
    }

    async delete(objectStore: string, key: IDBValidKey) {
        return new Promise((resolve, reject) => {
            this.openTransaction("readwrite").then((transaction) => {
                try {
                    const request = transaction.objectStore(objectStore).delete(key);
                    request.onsuccess = () => {
                        // deletes seem to succeed even if key doesn't exist? (previously deleted?)
                        resolve(request.result);
                    }
                    request.onerror = (event) => {
                        const errorMessage = `${this.dbName} delete(${key}) failed; error: ${event}`
                        console.log(errorMessage);
                        reject(errorMessage);
                    }
                } catch(error) {
                    reject(`${error}, key: ${key}`);
                }
            });
        });
    }

    async open() {
        if(this.db) {
            // already opened
            console.log(`${this.dbName} database already opened`);
            return new Promise((resolve) => {
                resolve(this.db)
            })
        }
        return new Promise((resolve, reject) => {
            const request = window.indexedDB.open(this.dbName, this.version);
            request.onsuccess = () => {
                this.onOpenSuccess(request);
                resolve(this.db)
            };
            request.onerror = () => {
                this.onOpenError(request)
                reject(request.error?.message);
            };
            request.onupgradeneeded = () => {
                this.onUpgradeNeeded(request)
                reject("upgrade needed")
            };
        });
    }

    close() {
        this.db?.close();
        console.log(`${this.dbName} closed`);
    }
}
