import {Scanner} from "@yudiel/react-qr-scanner";

export default function QRScanner() {
    return(<Scanner onScan={(result) => console.debug('QRScanner', result)}
                    sound={false}
    />)
}
