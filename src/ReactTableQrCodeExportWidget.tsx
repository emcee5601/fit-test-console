import {ColumnFiltersState, Table} from "@tanstack/react-table";
import React, {useEffect, useState} from "react";
import {SimpleResultsDBRecord} from "./SimpleResultsDB.ts";
import {sanitizeRecord} from "./results-transfer-util.ts";
import LZString from "lz-string";
import {useHref} from "react-router";
import {QRCodeSVG} from "qrcode.react";

/**
 * A button that generatos a QR code for the given React Table to transfer to another instance of this app
 * @constructor
 */
export function ReactTableQrCodeExportWidget<T extends SimpleResultsDBRecord>({
    table,
    tableData,
    columnFilters,
    ...props
}: {
    table: Table<T>,
    tableData: T[],
    columnFilters: ColumnFiltersState
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'>) {
    const [qrcodeUrl, setQrcodeUrl] = useState<string>("")
    const appBasePath = useHref("/")

    useEffect(() => {
        if (qrcodeUrl) {
            console.log("adding key listener")
            const keyListener = (keyEvent: KeyboardEvent) => {
                console.log(`key listener got event: ${JSON.stringify(keyEvent)}`)
                if (keyEvent.code === "Escape") {
                    setQrcodeUrl("");
                }
            };
            window.addEventListener("keydown", keyListener)
            return () => {
                window.removeEventListener("keydown", keyListener)
                console.log("removed key listener")
            }
        }
    }, [qrcodeUrl]);

    function generateQRCode() {
        // first, extract data and compress it with lz-string

        // The table is filtered, so look at the filtered table data for which record IDs to include. Then grab these
        // from localTableData
        const rows = table.getSortedRowModel().rows
        const rowData = rows.map((row) => row.original)
        const recordIdsToInclude: number[] = rowData.map(rd => rd.ID)

        const recordsToExport: SimpleResultsDBRecord[] = tableData
            .filter((row) => recordIdsToInclude.includes(row.ID))
            .map((record) => sanitizeRecord(record));

        const str = LZString.compressToEncodedURIComponent(JSON.stringify(recordsToExport));
        // sometimes location has a trailing '/', remove it so we don't get a '//'. This behavior is different between
        // local and prod for some reason

        const origin = location.origin
        // const origin = "https://emcee5601.github.io"
        const baseLocation = origin + appBasePath.replace(/\/$/, '')
        const url = `${baseLocation}/view-results?data=${str}`;
        console.log(`url is: ${url}`)
        console.log(`url length is ${url.length}`);
        if (url.length > 4296) {
            console.log("url is too long")
        } else {
            setQrcodeUrl(url);
        }
    }

    /**
     * Returns a string summarising the filters in effect.
     */
    function getFilterSummary(): string {
        let dateFilter = "";
        let participantFilter = "";
        columnFilters.forEach((columnFilter) => {
            if ("Time" === columnFilter.id) {
                dateFilter = columnFilter.value as string;
            }
            if ("Participant" === columnFilter.id) {
                participantFilter = columnFilter.value as string;
            }
        })
        return [participantFilter && `for ${participantFilter}`, dateFilter && `on ${dateFilter}`].join(" ")
    }

    // todo: use <button/>. for now use <input/>
    return (
        <>
            {qrcodeUrl &&
                <div className={"full-screen-overlay"}>
                    <div onClick={() => setQrcodeUrl("")} id="results-qrcode">
                        <span style={{display: "block"}}>Fit test results {getFilterSummary()}</span>
                        <QRCodeSVG value={qrcodeUrl}
                                   size={512}
                                   marginSize={4}
                                   title={"Fit Test Results"}/>
                    </div>
                </div>}
            <button {...props} onClick={() => generateQRCode()}>QR Code</button>
        </>)
}
