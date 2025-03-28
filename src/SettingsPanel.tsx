import {SettingsSelect} from "./Settings.tsx";
import {EnableSpeechSwitch, SpeechVoiceSelector} from "./speech-voice-selector.tsx";
import {ChangeEvent, useState} from "react";
import {downloadData} from "./html-data-downloader.ts";
import {RESULTS_DB} from "./SimpleResultsDB.ts";
import {RAW_DB} from "./database.ts";
import {AppSettings, useSetting} from "./app-settings.ts";
import {BooleanToggleButton} from "./ToggleButton.tsx";

export function SettingsPanel() {
    const [baudRate, setBaudRate] = useSetting<string>(AppSettings.BAUD_RATE)
    const [showAdvancedControls, setShowAdvancedControls] = useSetting<boolean>(AppSettings.ADVANCED_MODE);
    const [showExternalControl, setShowExternalControl] = useSetting<boolean>(AppSettings.SHOW_EXTERNAL_CONTROL);
    const [verboseSpeech, setVerboseSpeech] = useSetting<boolean>(AppSettings.VERBOSE);
    const [sayParticleCount, setSayParticleCount] = useSetting<boolean>(AppSettings.SAY_PARTICLE_COUNT)
    const [sayEstimatedFitFactor, setSayEstimatedFitFactor] = useSetting<boolean>(AppSettings.SAY_ESTIMATED_FIT_FACTOR);
    const [keepScreenAwake, setKeepScreenAwake] = useSetting<boolean>(AppSettings.KEEP_SCREEN_AWAKE);
    const [enableSimulator, setEnableSimulator] = useSetting<boolean>(AppSettings.ENABLE_SIMULATOR);
    const [showDangerZoneSettings, setShowDangerZoneSettings] = useState<boolean>(false); // don't persist this setting
    const [dataToDownload, setDataToDownload] = useState<string>("all-raw-data")

    function downloadFileFormatChanged(event: ChangeEvent<HTMLSelectElement>) {
        setDataToDownload(event.target.value);
    }

    function downloadButtonClickHandler() {
        switch (dataToDownload) {
            case "all-raw-data":
                downloadAllRawDataAsJSON()
                break;
            case "all-results-as-json":
                downloadAllResultsAsJSON();
                break;
            default:
                console.log(`unsupported data to download: ${dataToDownload}`);
        }
    }

    async function downloadAllRawDataAsJSON() {
        // grab all data from the database and download it
        await RAW_DB.getAllData().then(data => {
            downloadData(JSON.stringify(data), "fit-test-all-raw-data", "json");
        })
    }

    function downloadAllResultsAsJSON() {
        RESULTS_DB.getAllData().then(data => {
            downloadData(JSON.stringify(data), "fit-test-all-results", "json");
        })
    }

    return (
        <div id="settings-panel">
            <fieldset>
                {`mftc v${__APP_VERSION__} ${import.meta.env.MODE}`}
            </fieldset>
            <fieldset>
                <legend>Settings</legend>
                <section id="settings">
                    <section id={"basic-controls"}>
                        <fieldset style={{display: "inline-block"}}>
                            <legend>Basic</legend>
                            <EnableSpeechSwitch/>
                            <BooleanToggleButton trueLabel={"Say particle count"}
                                          value={sayParticleCount}
                                          setValue={setSayParticleCount}/>
                            <BooleanToggleButton trueLabel={"Say estimated fit factor"}
                                          value={sayEstimatedFitFactor}
                                          setValue={setSayEstimatedFitFactor}/>
                            <div>
                                <select id="download-file-format-selector" defaultValue={dataToDownload}
                                        onChange={downloadFileFormatChanged}>
                                    <option value="all-raw-data">All Raw data as JSON</option>
                                    <option value="all-results-as-json">All results as JSON</option>
                                </select>
                                <input className="button" type="button" value="Download!" id="download-button"
                                       onClick={downloadButtonClickHandler}/>
                            </div>
                            <BooleanToggleButton trueLabel={"Advanced settings"}
                                          value={showAdvancedControls}
                                          setValue={setShowAdvancedControls}/>
                        </fieldset>
                    </section>
                    <section id={"advanced-controls"} style={{display: showAdvancedControls ? "inline-block" : "none"}}>
                        <fieldset>
                            <legend>Advanced</legend>
                            <SettingsSelect label={"Baud Rate"} value={baudRate} setValue={setBaudRate}
                                            options={[
                                                {"300": "300"},
                                                {"600": "600"},
                                                {"1200": "1200"},
                                                {"2400": "2400"},
                                                {"9600": "9600"}
                                            ]}/>
                            <SpeechVoiceSelector/>
                            <BooleanToggleButton trueLabel={"Verbose speech"}
                                          value={verboseSpeech}
                                          setValue={setVerboseSpeech}/>
                            <BooleanToggleButton trueLabel={"Show external control"}
                                          value={showExternalControl}
                                          setValue={setShowExternalControl}/>
                            <BooleanToggleButton trueLabel={"Keep screen awake"}
                                          value={keepScreenAwake}
                                          setValue={setKeepScreenAwake}/>
                            <BooleanToggleButton trueLabel={"Enable simulator"} value={enableSimulator}
                                          setValue={setEnableSimulator}/>
                            <BooleanToggleButton trueLabel={"Show Danger Zone"} value={showDangerZoneSettings}
                                          setValue={setShowDangerZoneSettings}/>
                        </fieldset>
                        {showDangerZoneSettings && <fieldset>
                            <legend>Danger Zone</legend>
                            <input type={"button"} value={"Clear Local Storage"}
                                   onClick={() => localStorage.clear()}/>
                        </fieldset>}
                    </section>
                </section>
            </fieldset>
        </div>)
}
