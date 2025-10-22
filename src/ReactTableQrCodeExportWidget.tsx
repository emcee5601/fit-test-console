import {Table} from "@tanstack/react-table";
import LZString from "lz-string";
import {QRCodeSVG} from "qrcode.react";
import React, {useEffect, useState} from "react";
import {useHref} from "react-router";
import {getRecordsToExport} from "./results-transfer-util.ts";
import {SimpleResultsDBRecord} from "./SimpleResultsDB.ts";

/**
 * A button that generatos a QR code for the given React Table to transfer to another instance of this app
 * @constructor
 */
export function ReactTableQrCodeExportWidget<T extends SimpleResultsDBRecord>({
    table,
    ...props
}: {
    table: Table<T>,
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'>) {
    const [qrcodeUrls, setQrcodeUrls] = useState<string[]>([])
    const origin = location.origin

    // const origin = "https://emcee5601.github.io"
    // sometimes location has a trailing '/', remove it so we don't get a '//'. This behavior is different between
    // local and prod for some reason
    // use useHref here so it can insert the # needed by HashRouter. HashRouter and BrowserRouter are not drop-in
    // replacements for each other, so maybe the hash can be hardcoded.
    const baseLocation = origin + location.pathname + useHref("/view-results");

    useEffect(() => {
        if (qrcodeUrls) {
            console.log("adding key listener")
            const keyListener = (keyEvent: KeyboardEvent) => {
                console.log(`key listener got event: ${JSON.stringify(keyEvent)}`)
                if (keyEvent.code === "Escape") {
                    setQrcodeUrls([]);
                }
            };
            window.addEventListener("keydown", keyListener)
            return () => {
                window.removeEventListener("keydown", keyListener)
                console.log("removed key listener")
            }
        }
    }, [qrcodeUrls]);


    function getUrlForData(recordsToExport: T[]) {
        return `${baseLocation}?data=${(LZString.compressToEncodedURIComponent(JSON.stringify(recordsToExport)))}`;
    }

    function generateQRCodes() {
        // first, extract data and compress it with lz-string
        const recordsToExport = getRecordsToExport(table);
        const urls = []

        while (recordsToExport.length > 0) {
            let url: string | null = null;
            let i: number = 1
            let candidateUrl: string | null = null;
            let candidates: T[] = []
            for (; i <= recordsToExport.length; i++) {
                candidates = recordsToExport.toSpliced(i)
                candidateUrl = getUrlForData(candidates)
                /**
                 * v40 codes can store 4296 alphanum, 2953 binary at ECC level L
                 */
                if (candidateUrl.length <= 2953) {
                    url = candidateUrl
                } else {
                    break
                }
            }
            if (url) {
                urls.push(url);
                recordsToExport.splice(0, i)
                // console.debug(`num records: ${candidates.length}`, candidates.map((record) => record.ID).join(", "))
            } else {
                // if we didn't get a url, it means the first record is too large to encode
                console.warn(`could not encode data. resulting url for 1 record is too long at ${candidateUrl?.length}`)
                break;
            }
        }

        setQrcodeUrls(urls);
    }

    /**
     * Returns a string summarising the filters in effect.
     */
    function getFilterSummary(): string {
        const columnFilters = table.getState().columnFilters
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
            {qrcodeUrls.length > 0 &&
                <div className={"full-screen-overlay"}>
                    <div style={{display: "flex", flexDirection: "column"}}>
                        {qrcodeUrls.map((url, index) =>
                            <div key={index} onClick={() => setQrcodeUrls([])} className="qrcode-container">
                                <a href={url}>
                                    <span
                                        style={{display: "block"}}>Fit test results {getFilterSummary()} ({index + 1} / {qrcodeUrls.length})</span>
                                </a>
                                <span style={{display: "block"}}>{baseLocation}</span>
                                <QRCodeSVG value={url}
                                           size={512}
                                           marginSize={4}
                                           title={"Fit Test Results"}/>
                            </div>)}
                    </div>
                </div>}
            <button {...props} onClick={() => generateQRCodes()}>QR Code</button>
        </>
    )
}
