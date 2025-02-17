import LZString from "lz-string";
import {useNavigate, useSearchParams} from "react-router";
import {useEffect, useState} from "react";
import {ResultsTable} from "./ResultsTable.tsx";
import {RESULTS_DB, SimpleResultsDBRecord} from "./SimpleResultsDB.ts";
import {getComparableRecord, sanitizeRecord} from "./results-transfer-util.ts";

export function ResultViewer() {
    const [results, setResults] = useState<SimpleResultsDBRecord[]>([])
    const [searchParams] = useSearchParams()
    const navigate = useNavigate();

    async function getStoredData() {
        return await RESULTS_DB.getAllData();
    }

    /**
     * Integrate the newRecords into the local dataset. Avoid duplicates.
     * @param newRecords
     */
    async function updateStoredData(newRecords: SimpleResultsDBRecord[]) {
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

    async function processUrlData() {
        const dataParam = searchParams.get("data");
        if (dataParam) {
            const dataFromUrl = LZString.decompressFromEncodedURIComponent(dataParam)

            // save results?
            // if save results, remove data from url?
            navigate(location.pathname, {replace: true}) // remove data from the url
            if (dataFromUrl) {
                console.log(`got url data: ${dataFromUrl}`);
                const dataRecords = JSON.parse(dataFromUrl) as SimpleResultsDBRecord[];
                console.log(`data records: ${JSON.stringify(dataRecords, null, 2)}`);
                const allRecords = await updateStoredData(dataRecords);
                setResults(allRecords)
            } else {
                console.log("no data from url")
                setResults(await getStoredData())
            }
        } else {
            console.log("no data parameter")
            setResults(await getStoredData())
        }
    }


    useEffect(() => {
        // handle data sent via url
        RESULTS_DB.open().then(() => processUrlData()).catch((error) => console.log(`error while opening db: ${error}`));
    }, []);

    return (
        <>
            <ResultsTable tableData={results} setTableData={setResults}/>
        </>
    );
}

