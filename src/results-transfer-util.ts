import {SimpleResultsDBRecord} from "./SimpleResultsDB.ts";
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

