import LZString from "lz-string";
import {useNavigate, useSearchParams} from "react-router";
import {useEffect, useState} from "react";
import {ResultsTable} from "./ResultsTable.tsx";
import {RESULTS_DB, SimpleResultsDBRecord} from "./SimpleResultsDB.ts";
import {getStoredData, updateStoredData} from "./results-transfer-util.ts";

export function ResultViewer() {
    const [results, setResults] = useState<SimpleResultsDBRecord[]>([])
    const [searchParams] = useSearchParams()
    const navigate = useNavigate();


    async function processUrlData() {
        const dataParam = searchParams.get("data");
        if (dataParam) {
            const dataFromUrl = LZString.decompressFromEncodedURIComponent(dataParam)

            // save results?
            // if save results, remove data from url?
            navigate("", {replace: true}) // remove data from the url
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
        // TODO: use context instead of results_db directly
        RESULTS_DB.open().then(() => processUrlData()).catch((error) => console.log(`error while opening db: ${error}`));
    }, []);

    async function deleteRows(rows: number[]) {
        await Promise.all(rows.map((id) => RESULTS_DB.deleteRecordById(id)));
        setResults(await getStoredData());
    }

    return (
        <>
            <ResultsTable tableData={results} setTableData={setResults}
                          deleteRowsCallback={deleteRows}/>
        </>
    );
}

