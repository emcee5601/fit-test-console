import {RESULTS_DB, SimpleResultsDBRecord} from "./SimpleResultsDB.ts";
import {deepCopy} from "json-2-csv/lib/utils";
import stringifyDeterministically from "json-stringify-deterministic";
import {Table} from "@tanstack/react-table";
import {downloadData} from "src/download-helper.ts";

/**
 * When comparing records, ignore the ID since we could have merged data from different instances of the app.
 * IDs are unique only per instance of the app.
 * @param record
 */
export function getComparableRecord(record: Partial<SimpleResultsDBRecord>) {
    return stringifyDeterministically(sanitizeRecord(record));
}

/**
 * Assume timestamp + recordID is enough to deduplicate across all app instances.  This isn't totally correct, but
 * collisions should be exceedingly small. Todo: incorporate device serial number into uniqueness key.
 * @param left
 * @param right
 */
export function isDuplicateRecord(left: Partial<SimpleResultsDBRecord>, right: Partial<SimpleResultsDBRecord>) {
    return left.Time === right.Time
        && (left.ID === right.ID
            || (
                // try to make sure we don't keep importing the same records. These won't have the same IDs as existing
                // data, but timestamp and other data would be the same.
                left.Final === right.Final
                && left["Ex 1"] === right["Ex 1"]
            ));
}

/**
 * Strip the metadata portion of the record: ID, import indicator
 * @param record
 */
export function sanitizeRecord(record: Partial<SimpleResultsDBRecord>) {
    const partial = deepCopy(record);
    delete partial.ID;
    delete partial["source"];
    return partial as SimpleResultsDBRecord;
}

export async function getStoredData() {
    return await RESULTS_DB.getData();
}

type ImportResults = {
    allRecords: SimpleResultsDBRecord[],
    newRecords: SimpleResultsDBRecord[],
    duplicateRecords: SimpleResultsDBRecord[],
    attemptedRecordCount: number, // number of records in the original input, including any garbage
    rejectedRecordCount: number,
};

/**
 * Integrate the newRecords into the local dataset. Avoid duplicates.
 * @param newRecords
 */
export async function importRecords(newRecords: SimpleResultsDBRecord[]): Promise<ImportResults> {
    // try to make sure new records are valid records and not garbage
    const attemptedRecordCount = newRecords.length;
    newRecords = newRecords.filter((record) => {
        return "Time" in record && "ID" in record && "Ex 1" in record;
    })
    const rejectedRecordCount = attemptedRecordCount - newRecords.length;

    const storedRecords = await getStoredData();
    const numOldRecords = storedRecords.length;
    const netNewRecords: SimpleResultsDBRecord[] = []
    const duplicateRecords: SimpleResultsDBRecord[] = [];

    // deduplicate
    for (const rawIncomingRecord of newRecords) {
        if (storedRecords.some((oldRecord) => {
            return isDuplicateRecord(oldRecord, rawIncomingRecord);
            // return getComparableRecord(oldRecord) === getComparableRecord(incomingRecord);
        })) {
            duplicateRecords.push(rawIncomingRecord);
        } else {
            // make sure we don't use whatever ID is in the incoming data.
            const incomingRecord = sanitizeRecord(rawIncomingRecord);
            incomingRecord["source"] = "ext";
            netNewRecords.push(incomingRecord);
        }
    }

    // save new records to db, update the ID
    for (const record of netNewRecords) {
        const newID = await RESULTS_DB.addRecord(record);
        record.ID = newID as number;
    }

    storedRecords.push(...netNewRecords);

    // localStorage.setItem("my-fit-test-results", JSON.stringify(myFitTestResults));
    console.log(`total records ${storedRecords.length}, new records ${netNewRecords.length}, old records ${numOldRecords}`);
    return {
        allRecords: storedRecords,
        newRecords: netNewRecords,
        duplicateRecords: duplicateRecords,
        attemptedRecordCount: attemptedRecordCount,
        rejectedRecordCount: rejectedRecordCount
    };
}


/**
 * @param table
 */
export function getRecordsToExport<T extends SimpleResultsDBRecord>(table: Table<T>) {
    return table.getRowModel().rows.map((row) => row.original);
}

export function exportFile<T extends SimpleResultsDBRecord>(table: Table<T>) {
    const records = getRecordsToExport(table)
    downloadData(JSON.stringify(records), "cft-results", "json")
}

export async function importFile(): Promise<ImportResults> {
    if (!("showOpenFilePicker" in window)) {
        const errorMsg = "showOpenFilePicker not supported. Unable to import file.";
        console.error(errorMsg)
        return Promise.reject(errorMsg);
    }
    // @ts-expect-error showOpenFilePicker is sometimes supported
    return window.showOpenFilePicker({id: "file-to-import"})
        .then((fileHandles: FileSystemFileHandle[]) => fileHandles[0].getFile())
        .then((filehandle: File) => filehandle.text())
        .then((fileContents: string) => JSON.parse(fileContents) as SimpleResultsDBRecord[])
        .then((jsonRecords: SimpleResultsDBRecord[]) => importRecords(jsonRecords))
        .then((result: ImportResults) => {
            console.debug(`imported ${result.newRecords.length} records of ${result.attemptedRecordCount}, ignored ${result.duplicateRecords.length} duplicates, rejected ${result.rejectedRecordCount}. total records: ${result.allRecords.length}`);
            return result
        })
        .catch((err: string) => {
            console.log("Error importing file", err)
        })
}
