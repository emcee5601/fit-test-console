import LZString from "lz-string";
import {useEffect, useState} from "react";
import {useNavigate, useSearchParams} from "react-router";
import {DetectIncognito} from "src/DetectIncognito.tsx";
import {ResultsTable} from "src/ResultsTable.tsx";
import {getStoredData, importRecords} from "./results-transfer-util.ts";
import {RESULTS_DB, SimpleResultsDBRecord} from "./SimpleResultsDB.ts";

export function ResultViewer() {
    const [searchParams] = useSearchParams()
    const [origUrl] = useState<string|null>(searchParams.get("data") ? window.location.href : null);
    const [results, setResults] = useState<SimpleResultsDBRecord[]>([])
    const navigate = useNavigate();

    async function processUrlData() {
        const dataParam = searchParams.get("data");
        if (dataParam) {
            const dataFromUrl = LZString.decompressFromEncodedURIComponent(dataParam)

            // save results?
            // if save results, remove data from url?
            navigate("", {replace: true}) // remove data from the url
            if (dataFromUrl) {
                // console.log(`got url data: ${dataFromUrl}`);
                const dataRecords = JSON.parse(dataFromUrl) as SimpleResultsDBRecord[];
                // console.log(`data records: ${JSON.stringify(dataRecords, null, 2)}`);
                const {allRecords} = await importRecords(dataRecords);
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
        <div style={{
            justifySelf: "center",
            maxWidth: "100%",
            height: "100%",
        }}>
            <DetectIncognito altUrl={origUrl}/>
            <ResultsTable tableData={results} setTableData={setResults} deleteRowsCallback={deleteRows}/>
        </div>
    );
}

