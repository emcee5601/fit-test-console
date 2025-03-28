import {RESULTS_DB, SimpleResultsDBRecord} from "./SimpleResultsDB.ts";
import {deepCopy} from "json-2-csv/lib/utils";
import stringifyDeterministically from "json-stringify-deterministic";

/**
 * When comparing records, ignore the ID since we could have merged data from different instances of the app.
 * IDs are unique only per instance of the app.
 * @param record
 */
export function getComparableRecord(record: Partial<SimpleResultsDBRecord>) {
    return stringifyDeterministically(sanitizeRecord(record));
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
    return await RESULTS_DB.getAllData();
}

/**
 * Integrate the newRecords into the local dataset. Avoid duplicates.
 * @param newRecords
 */
export async function updateStoredData(newRecords: SimpleResultsDBRecord[]) {
    const storedRecords = await getStoredData();
    const numOldRecords = storedRecords.length;
    const netNewRecords:SimpleResultsDBRecord[] = []

    // deduplicate
    for(const rawIncomingRecord of newRecords) {
        const incomingRecord = sanitizeRecord(rawIncomingRecord);
        if (!storedRecords.some((oldRecord) => {
            return getComparableRecord(oldRecord) === getComparableRecord(incomingRecord);
        })) {
            incomingRecord["source"] = "ext";
            netNewRecords.push(incomingRecord); // add to the set we'll return
        }
    }

    // save new records to db, update the ID
    for(const record of netNewRecords) {
        const newID = await RESULTS_DB.addRecord(record);
        record.ID = newID as number;
    }

    storedRecords.push(...netNewRecords); // todo: separate these out

    // localStorage.setItem("my-fit-test-results", JSON.stringify(myFitTestResults));
    console.log(`total records ${storedRecords.length}, new records ${netNewRecords.length}, old records ${numOldRecords}`);
    return storedRecords;
}

