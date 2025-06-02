import {QRCodeSVG} from "qrcode.react";
import {useState} from "react";

export function BookmarksPanel() {
    const [qrcodeUrl, setQrcodeUrl] = useState<string>("")
    const [label, setLabel] = useState<string>("")
    // todo: load from settings (json)
    const urls: [label: string, url: string][] = [
        ["Fit Test for Everyone Discord", "https://discord.gg/GeNhXx8Hxw"],
        ["Fit testing resources wiki", "https://github.com/emcee5601/fit-testing-resources/wiki"],
        ["MFTC app source", "https://github.com/emcee5601/fit-test-console"],
        ["MFTC app deployed", "https://emcee5601.github.io/fit-test-console/"],
    ]


    function showUrlQR(url: string, label: string) {
        setQrcodeUrl(url);
        setLabel(label)
    }

    return (
        <div id={"bookmarks"}
             style={{height: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap:"1em"}}>
            Shortcuts
            {qrcodeUrl &&
                <div className={"full-screen-overlay"}>
                    <div onClick={() => setQrcodeUrl("")} className="qrcode-container">
                        <span style={{display: "block"}}>{label}</span>
                        <span style={{display: "block"}}><a href={qrcodeUrl}>{qrcodeUrl}</a></span>
                        <QRCodeSVG value={qrcodeUrl}
                                   size={512}
                                   marginSize={4}
                                   title={label}/>
                    </div>
                </div>}
            {urls.map(([label, url]) => <button key={label} onClick={() => showUrlQR(url, label)}>{label}</button>)}
        </div>
    )
}
