import {QRCodeSVG} from "qrcode.react";
import {useState} from "react";
import {useSetting} from "src/use-setting.ts";
import {AppSettings} from "src/app-settings.ts";
import {SmartTextArea} from "src/SmartTextArea.tsx";

type Bookmarks = { [title: string]: string }

export function BookmarksPanel() {
    const [qrcodeUrl, setQrcodeUrl] = useState<string>("")
    const [label, setLabel] = useState<string>("")
    const [newBookmarkUrl, setNewBookmarkUrl] = useState<string>("")
    const [newBookmarkTitle, setNewBookmarkTitle] = useState<string>("")
    const [bookmarks, setBookmarks] = useSetting<Bookmarks>(AppSettings.BOOKMARKS)

    // todo: use a map, make url the key
    const urls: [label: string, url: string][] = [
        ["These bookmarks", window.location.href],
        ["Fit Test for Everyone Discord", "https://discord.gg/GeNhXx8Hxw"],
        ["Fit testing resources wiki", "https://github.com/emcee5601/fit-testing-resources/wiki"],
        ["MFTC app", "https://emcee5601.github.io/fit-test-console/"],
        ["MFTC old versions", "https://emcee5601.github.io/mftc-old/"],
        ["MFTC app source", "https://github.com/emcee5601/fit-test-console"],
        ["Breathesafe", "https://www.breathesafe.xyz/"]
    ]
    Object.entries(bookmarks).forEach(([title, url]) => urls.push([title, url]));

    function showUrlQR(url: string, label: string) {
        setQrcodeUrl(url);
        setLabel(label)
    }

    function safeToSaveBookmark() {
        return newBookmarkUrl && !Object.values(bookmarks).includes(newBookmarkUrl)
    }

    function saveBookmark() {
        if (!safeToSaveBookmark()) {
            return
        }
        const updatedBookmarks: Bookmarks = {}
        updatedBookmarks[newBookmarkTitle || newBookmarkUrl] = newBookmarkUrl
        Object.assign(updatedBookmarks, bookmarks)
        setBookmarks(updatedBookmarks)
    }

    function deleteBookmark(title: string) {
        const updatedBookmarks: Bookmarks = {}
        Object.entries(bookmarks).filter(([entryTitle]) => entryTitle !== title).forEach(([title, url]) => updatedBookmarks[title] = url)
        setBookmarks(updatedBookmarks)
    }

    return (
        <div id={"bookmarks"}
             style={{height: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "1em"}}>
            Bookmarks
            <div>
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

                <fieldset>
                    <legend>Add new bookmark</legend>
                    <div id={"bookmark-adder"} style={{display: "flex"}}>
                        <div style={{textAlign: "start", height: "100%", display:"flex", flexDirection:"column", gap:"0.3em"}}>
                            <div className={"thin-border-2"}>
                                <SmartTextArea
                                    id={"bookmark-title"}
                                    initialValue={newBookmarkTitle} placeholder={"Title"}
                                    onChange={(value) => setNewBookmarkTitle(value || "")}/>
                            </div>
                            <div className={"thin-border-2"}>
                                <SmartTextArea
                                    id={"bookmark-url"}
                                    initialValue={newBookmarkUrl} placeholder={"URL"}
                                    onChange={(value) => setNewBookmarkUrl(value || "")}/>
                            </div>
                        </div>
                        <div style={{height: "100%"}}>
                            <QRCodeSVG value={newBookmarkUrl}
                                       size={128}
                                       marginSize={4}
                                       title={newBookmarkUrl}
                                       onClick={() => showUrlQR(newBookmarkUrl, newBookmarkTitle)}
                                       visibility={newBookmarkUrl ? "visible" : "hidden"}
                            />
                        </div>

                        <button onClick={() => saveBookmark()} disabled={!safeToSaveBookmark()}>Save bookmark
                        </button>
                    </div>
                </fieldset>
                {urls.map(([label, url]) => {
                    return <div key={label}>
                        <fieldset style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                            <legend>{label}</legend>
                            <a href={url}>{url}</a>
                            <QRCodeSVG value={url}
                                       size={128}
                                       marginSize={4}
                                       title={label}
                                       onClick={() => showUrlQR(url, label)}
                            />
                            {label in bookmarks && <button onClick={() => deleteBookmark(label)}>delete</button>}
                        </fieldset>
                    </div>
                })}
            </div>
        </div>
    )
}
