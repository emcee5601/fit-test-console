import {IDetectedBarcode, Scanner} from "@yudiel/react-qr-scanner";
import {useState} from "react";
import {BooleanToggleButton} from "src/ToggleButton.tsx";

export default function QRScanner() {
    const [scannedPayloads, setScannedPayloads] = useState<string[]>([])
    const [enabled, setEnabled] = useState<boolean>(false)

    function handleOnScan(detectedCodes: IDetectedBarcode[]) {
        detectedCodes.forEach((detectedCode) => {
            setScannedPayloads((prev) => {
                if (!prev.includes(detectedCode.rawValue)) {
                    return [...prev, detectedCode.rawValue]
                } else {
                    // not new
                    return prev
                }
            })
        })
        console.debug('QRScanner', detectedCodes);
    }

    return (
        <div>
            <fieldset id={"qr-scanner-container"} style={{
                width: "calc(min(70vh, 70vw))",
                justifySelf: "anchor-center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
            }}>
                <legend style={{display:"flex", gap:"1em"}}><BooleanToggleButton trueLabel={"Enable QR Scanner"} value={enabled} setValue={setEnabled}/></legend>
                <Scanner onScan={handleOnScan} sound={false} allowMultiple={true} paused={!enabled}/>
            </fieldset>
            <fieldset>
                <legend>Scanned payloads:</legend>
                <ol style={{textAlign:"start"}}>
                    {scannedPayloads.map((value) => <li key={value}>{value}</li>)}
                </ol>
            </fieldset>
        </div>
    )
}
