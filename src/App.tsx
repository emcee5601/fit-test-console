import React, {ChangeEvent, RefObject, useEffect, useState} from 'react'
import './App.css'
import {DataFilePushSource, getLines, getReadableStreamFromDataSource} from "./datasource-helper.ts";
import {DataCollector, DataCollectorPanel, DataCollectorStates} from "./data-collector.tsx";
import {SpeechSynthesisPanel} from "./speech-synthesis-panel.tsx";
import {speech} from "./speech.ts"
import {ExternalController, ExternalControlPanel, ExternalControlStates} from "./external-control.tsx";
import {AppSettings, SimpleDB, SimpleResultsDB, useDBSetting} from "./database.ts";
import {downloadData} from "./html-data-downloader.ts";
import {json2csv} from "json-2-csv";
import {UsbSerialDrivers} from "./web-usb-serial-drivers.ts";
import {FitTestProtocolPanel} from "./FitTestProtocolPanel.tsx";
import {convertFitFactorToFiltrationEfficiency, getFitFactorCssClass} from "./utils.ts";


function App() {
    const [baudRate, setBaudRate] = useState<number>(1200)
    const [dataSource, setDataSource] = useState<string>("web-serial")
    const [dataToDownload, setDataToDownload] = useState<string>("all-results")
    const [rawConsoleData, setRawConsoleData] = useState<string>("")
    const rawConsoleDataTextAreaRef = React.useRef<HTMLTextAreaElement>(null)
    const [logData, setLogData] = useState<string>("")
    const [processedData, setProcessedData] = useState<string>("")
    const fitTestDataTableRef = React.useRef<HTMLTableElement>(null)

    const [dataTransmissionMode, setDataTransmissionMode] = useState("Transmitting")
    const [valvePosition, setValvePosition] = useState("Sampling from Ambient")
    const [controlMode, setControlMode] = useState("Internal Control");
    const [enableAdvancedControls, setEnableAdvancedControls] = useDBSetting<boolean>(AppSettings.ADVANCED_MODE, false);

    const initialState: ExternalControlStates = {
        dataTransmissionMode: dataTransmissionMode,
        setDataTransmissionMode: setDataTransmissionMode,
        valvePosition: valvePosition,
        setValvePosition: setValvePosition,
        controlMode: controlMode,
        setControlMode: setControlMode
    };
    const [externalControlStates] = useState(initialState);
    const [externalController] = useState(new ExternalController(externalControlStates));
    const [resultsDatabase] = useState(() => new SimpleResultsDB());
    const [rawDatabase] = useState(() => new SimpleDB());
    const [verboseSpeech, setVerboseSpeech] = useDBSetting<boolean>(AppSettings.VERBOSE, false);
    const [sayParticleCount, setSayParticleCount] = useDBSetting<boolean>(AppSettings.SAY_PARTICLE_COUNT, false);
    const [sayEstimatedFitFactor, setSayEstimatedFitFactor] = useDBSetting<boolean>(AppSettings.SAY_ESTIMATED_FIT_FACTOR, true);
    const [autoEstimateFitFactor, setAutoEstimateFitFactor] = useDBSetting<boolean>(AppSettings.AUTO_ESTIMATE_FIT_FACTOR, false)
    const [instructions, setInstructions] = useState<string>("")
    const [estimatedFitFactor, setEstimatedFitFactor] = useState<number>(1)
    const [ambientConcentration, setAmbientConcentration] = useState<number>(0)
    const [maskConcentration, setMaskConcentration] = useState<number>(-1) // -1 means unknown

    const initialDataCollectorState: DataCollectorStates = {
        setInstructions: setInstructions,
        logData: logData,
        setLogData: setLogData,
        rawConsoleData: rawConsoleData,
        setRawConsoleData: setRawConsoleData,
        processedData: processedData,
        setProcessedData: setProcessedData,
        fitTestDataTableRef: fitTestDataTableRef,
        verboseSpeech: verboseSpeech,
        sayParticleCount: sayParticleCount,
        setEstimatedFitFactor: setEstimatedFitFactor,
        setAmbientConcentration: setAmbientConcentration,
        setMaskConcentration: setMaskConcentration,
        autoEstimateFitFactor: autoEstimateFitFactor,
        sayEstimatedFitFactor: sayEstimatedFitFactor,
    };
    const [dataCollectorStates] = useState(initialDataCollectorState);
    const [dataCollector] = useState(() => new DataCollector(dataCollectorStates, logCallback, rawDataCallback,
        processedDataCallback, externalControlStates, resultsDatabase))

    useEffect(() => {
        console.log(`initializing raw logs db`)
        rawDatabase.open();

        return () => rawDatabase.close();
    }, [rawDatabase]);

    useEffect(() => {
        console.log(`estimated fit factor changed to ${estimatedFitFactor}`)
    }, [estimatedFitFactor]);

    useEffect(() => {
        // need to propagate these down?
        externalControlStates.valvePosition = valvePosition;
        speech.sayItLater(valvePosition);
    }, [valvePosition, externalControlStates]);
    useEffect(() => {
        externalControlStates.dataTransmissionMode = dataTransmissionMode;
        console.log(`dataTransmissionMode changed: ${dataTransmissionMode}`);
        speech.sayItLater(dataTransmissionMode);
    }, [dataTransmissionMode, externalControlStates]);
    useEffect(() => {
        externalControlStates.controlMode = controlMode;
        console.log(`control mode changed: ${controlMode}`);
        speech.sayItLater(controlMode);
    }, [controlMode, externalControlStates]);
    useEffect(() => {
        dataCollectorStates.sayParticleCount = sayParticleCount;
    }, [sayParticleCount, dataCollectorStates]);
    useEffect(() => {
        dataCollectorStates.sayEstimatedFitFactor = sayEstimatedFitFactor;
    }, [sayEstimatedFitFactor, dataCollectorStates]);

    // propagate states
    useEffect(() => {
        dataCollectorStates.logData = logData;
    }, [logData, dataCollectorStates]);
    useEffect(() => {
        dataCollectorStates.rawConsoleData = rawConsoleData;
    }, [rawConsoleData, dataCollectorStates]);
    useEffect(() => {
        dataCollectorStates.processedData = processedData;
    }, [processedData, dataCollectorStates]);
    useEffect(() => {
        dataCollectorStates.autoEstimateFitFactor = autoEstimateFitFactor;
    }, [autoEstimateFitFactor, dataCollectorStates]);

    useEffect(() => {
        console.log(`baud rate updated to ${baudRate}`)
        speech.sayIt(`baud rate is now ${baudRate}`)
    }, [baudRate])
    useEffect(() => {
        console.log(`datasource is now ${dataSource}`)
    }, [dataSource]);
    useEffect(() => {
        console.log(`Download File Format set to ${dataToDownload}`)
    }, [dataToDownload]);


    function logCallback(message: string) {
        setLogData((prev) => prev + message);
    }

    function rawDataCallback(message: string) {
        // shouldn't call this? since we don't want modified data going here?
        setRawConsoleData((prev) => prev + message);
    }

    function processedDataCallback(message: string) {
        const timestamp = new Date().toISOString(); // todo: want the timestamp to match up, so need to get it externally
        setProcessedData((prev) => prev + `${timestamp} ${message}`);
    }

    function baudRateChanged(event: ChangeEvent<HTMLSelectElement>) {
        console.log(`setting baud rate to ${event.target.value}`)
        setBaudRate(Number(event.target.value));
    }

    function dataSourceChanged(event: ChangeEvent<HTMLSelectElement>) {
        setDataSource(event.target.value);
    }

    function downloadFileFormatChanged(event: ChangeEvent<HTMLSelectElement>) {
        setDataToDownload(event.target.value);
    }

    function logit(message: string) {
        console.log(message);
        // this.dataCollector.appendToLog(message);
    }

    function connectButtonClickHandler() {
        switch (dataSource) {
            case "web-usb-serial":
                connectViaWebUsbSerial();
                break;
            case "web-serial":
                connectViaWebSerial()
                break;
            case "simulator":
                connectViaSimulator()
                break;
            case "web-usb":
                // this is our internal drivers
                break;
            // case "database":
            // don't update results from saved raw data since we don't have participant info
            //     loadFromSerialDataDatabase();
            //     break;
            default:
                console.log(`unexpected dataSource : ${dataSource}`);
                break
        }
    }

    function downloadButtonClickHandler() {
        switch (dataToDownload) {
            case "all-raw-data":
                // downloadRawData(rawConsoleData, "raw-fit-test-data");
                downloadAllRawDataAsJSON()
                break;
            case "all-results":
                // downloadTableAsCSV(table, "fit-test-results");
                downloadAllResultsAsCSV();
                break;
            default:
                console.log(`unsupported data to download: ${dataToDownload}`);
        }
    }

    function downloadAllRawDataAsJSON() {
        // grab all data from the database and download it
        rawDatabase.getAllData().then(data => {
            downloadData(JSON.stringify(data), "fit-test-all-raw-data", "json");
        })
    }

    function downloadAllResultsAsCSV() {
        // TODO: use the same column order as results table instead of hardcoding
        // "ID":39,"Time":"11/19/2024, 11:18:52 PM","Ex 1":"983","Ex 2":"425","Ex 3":"24","Ex 4":"832","Final":"89"}
        resultsDatabase.getAllData().then(data => {
            const csv = json2csv(data, {
                keys: ['ID', 'Time', 'Participant', 'Mask', 'Notes', 'Ex 1', 'Ex 2', 'Ex 3', 'Ex 4', 'Final'],
                emptyFieldValue: "",
            })
            downloadData(csv, "fit-test-all-results", "csv");
        });
    }


    function connectViaWebUsbSerial() {
        const serial = new UsbSerialDrivers()
        serial.requestPort().then((port) => {
            port.open({baudRate: baudRate}).then(() => {
                if (port.readable) {
                    monitor(port.readable.getReader());
                }
                if (port.writable) {
                    externalController.setWriter(port.writable.getWriter());
                }
            })
        })

    }

    function connectViaWebSerial() {
        if ("serial" in navigator) {
            logit("serial supported!")
            navigator.serial.requestPort().then((port) => {
                logit(`got serial port ${port.toLocaleString()}, using baud rate ${baudRate}`)
                port.open({baudRate: baudRate}).then((event) => {
                    logit(`opened ${event}`)
                    if (port.readable) {
                        monitor(port.readable.getReader());
                    }
                    if (port.writable) {
                        externalController.setWriter(port.writable.getWriter());
                    }
                })
            })
        } else {
            logit("no serial support. As of this writing, web serial is only supported on desktop chrome.")
        }
    }


    function connectViaSimulator() {
        const fakeReader = getReadableStreamFromDataSource(new DataFilePushSource("./fit-test-console/simulator-data/test-data.txt", 0)).getReader();
        monitor(fakeReader);
    }

    async function monitor(reader: ReadableStreamDefaultReader<Uint8Array>) {
        for await (const line of getLines(reader)) {
            const timestamp = new Date().toISOString();
            if (line.trim().length > 0) {
                // we only care about non-empty lines
                appendRaw(`${timestamp} ${line}\n`); // not really raw anymore since we've re-chunked into lines.
                rawDatabase?.addLine(line);
            }
            dataCollector?.processLine(line);
        }
        console.log("monitor reached end of reader");
    }


    function scrollToBottom(textAreaRef: RefObject<HTMLTextAreaElement>) {
        if (textAreaRef.current) {
            textAreaRef.current.scrollTop = textAreaRef.current.scrollHeight;
        }
    }

    function appendRaw(message: string) {
        setRawConsoleData((prev) => prev + message);
        scrollToBottom(rawConsoleDataTextAreaRef);
    }


    return (
        <>
            <fieldset style={{maxWidth: "fit-content", float: "left"}}>
                {`mftc v${__APP_VERSION__}`}&nbsp;
                <select id="baud-rate-selector" defaultValue={baudRate} onChange={baudRateChanged}>
                    <option value={300}>300</option>
                    <option value={600}>600</option>
                    <option value={1200}>1200 (default)</option>
                    <option value={2400}>2400</option>
                    <option value={9600}>9600</option>
                </select> Baud &nbsp; &nbsp;
                Data Source: &nbsp;
                <select id="data-source-selector" defaultValue={dataSource} onChange={dataSourceChanged}>
                    <option value="web-serial">WebSerial</option>
                    <option value="web-usb-serial">Web USB Serial</option>
                    <option value="simulator">Simulator</option>
                    <option value="database">Database</option>
                </select> &nbsp;
                <input type="button" value="Connect" id="connect-button" onClick={connectButtonClickHandler}/>
            </fieldset>
            <fieldset style={{maxWidth: "fit-content", float: "left"}}>
                <select id="download-file-format-selector" defaultValue={dataToDownload}
                        onChange={downloadFileFormatChanged}>
                    <option value="all-results">All Results as CSV</option>
                    <option value="all-raw-data">All Raw data as json</option>
                </select>
                <input type="button" value="Download!" id="download-button" onClick={downloadButtonClickHandler}/>
            </fieldset>
            <fieldset style={{maxWidth: "fit-content", float: "left"}}>
                <SpeechSynthesisPanel/>
                <div style={{display: "inline-block"}}>
                    <input type="checkbox" id="enable-verbose-speech-checkbox" checked={verboseSpeech}
                           onChange={event => {
                               setVerboseSpeech(event.target.checked)
                           }}/>
                    <label htmlFor="enable-verbose-speech-checkbox">Verbose</label>
                </div>
                <div style={{display: "inline-block"}}>
                    <input type="checkbox" id="speak-concentration-checkbox" checked={sayParticleCount}
                           onChange={event => {
                               setSayParticleCount(event.target.checked)
                           }}/>
                    <label htmlFor="speak-concentration-checkbox">Say particle count</label>
                </div>
                <div style={{display: "inline-block"}}>
                    <input type="checkbox" id="auto-estimate-fit-factor"
                           checked={autoEstimateFitFactor}
                           onChange={e => setAutoEstimateFitFactor(e.target.checked)}/>
                    <label htmlFor="auto-estimate-fit-factor">Auto-estimate FF</label>
                </div>
                <div style={{display: "inline-block"}}>
                    <input type="checkbox" id="say-estimated-ff-checkbox" checked={sayEstimatedFitFactor}
                           onChange={event => {
                               setSayEstimatedFitFactor(event.target.checked)
                           }}/>
                    <label htmlFor="say-estimated-ff-checkbox">Say estimated FF</label>
                </div>
                <div style={{display: "inline-block"}}>
                    <input type="checkbox" id="enable-advanced-controls"
                           checked={enableAdvancedControls}
                           onChange={e => setEnableAdvancedControls(e.target.checked)}/>
                    <label htmlFor="enable-advanced-controls">Advanced</label>
                </div>
            </fieldset>
            {enableAdvancedControls ?
                <section style={{display: "inline-block", width: "100%"}}>
                    <div style={{display: "inline-block", width: "100%"}}>
                        <ExternalControlPanel control={externalController}/>
                    </div>
                    <fieldset>
                        <legend>fit test protocols</legend>
                        <FitTestProtocolPanel></FitTestProtocolPanel>
                    </fieldset>
                </section> : null}
            {autoEstimateFitFactor ?
                <section style={{display: "inline-flex", width: "100%"}}>
                    <fieldset style={{display: "inline-block"}}>
                        <legend>Estimated Fit Factor</legend>
                        <fieldset style={{display: "inline-block"}}>
                            <legend>Ambient</legend>
                            <span>{Number(ambientConcentration).toFixed(0)}</span>
                        </fieldset>
                        <fieldset style={{display: "inline-block"}}>
                            <legend>Mask</legend>
                            <span>{maskConcentration<0? "?" : Number(maskConcentration).toFixed(maskConcentration < 10 ? 1 : 0)}</span>
                        </fieldset>
                        <div className={getFitFactorCssClass(estimatedFitFactor)}
                             style={{width: '100%', height: '100%', alignContent: 'center', fontSize: "1.7rem"}}>
                            <span>{Number(estimatedFitFactor).toFixed(estimatedFitFactor < 10 ? 1 : 0)}</span>
                            <br/>
                            <span
                                style={{fontSize: "smaller"}}>({convertFitFactorToFiltrationEfficiency(estimatedFitFactor)}%)</span>
                        </div>
                    </fieldset>
                    <fieldset style={{display: "inline-block", flexGrow: 1}}>
                        <legend>Instructions</legend>
                        <textarea id="instructions" readOnly={true} style={{
                            width: "100%",
                            minHeight: "3rem",
                            height: "fit-content",
                            fontSize: "xxx-large",
                            overflow: "auto",
                            resize: "vertical",
                            border: "none"
                        }} value={instructions}></textarea>
                    </fieldset>
                </section> : null}
            <DataCollectorPanel dataCollector={dataCollector}></DataCollectorPanel>
        </>
    )
}

export default App
