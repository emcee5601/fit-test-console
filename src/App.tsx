import React, {ChangeEvent, RefObject, useEffect, useState} from 'react'
import './App.css'
import {DataFilePushSource, getReadableStreamFromDataSource} from "./datasource-helper.ts";
import {DataCollector, DataCollectorPanel, DataCollectorStates} from "./data-collector.tsx";
import {EnableSpeechSwitch, SpeechVoiceSelector} from "./speech-voice-selector.tsx";
import {speech} from "./speech.ts"
import {ExternalController, ExternalControlPanel, ExternalControlStates} from "./external-control.tsx";
import {SimpleDB, SimpleResultsDB} from "./database.ts";
import {downloadData} from "./html-data-downloader.ts";
import {UsbSerialDrivers} from "./web-usb-serial-drivers.ts";
import {convertFitFactorToFiltrationEfficiency, formatFitFactor, getConnectionStatusCssClass, getFitFactorCssClass} from "./utils.ts";
import {SettingsSelect, SettingsToggleButton} from "./Settings.tsx";

// import ReactECharts from "echarts-for-react";
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import {GaugeChart, LineChart} from "echarts/charts";
import {
    AxisPointerComponent,
    DatasetComponent,
    DataZoomComponent,
    GridComponent,
    LegendComponent,
    MarkAreaComponent,
    SingleAxisComponent,
    TimelineComponent,
    TooltipComponent,
    VisualMapComponent
} from "echarts/components";
import {CanvasRenderer} from "echarts/renderers";

import {EChartsOption} from "echarts-for-react/src/types.ts";
import {deepCopy} from "json-2-csv/lib/utils";
import {ProtocolSelector, SimpleFitTestProtocolPanel} from "./simple-protocol-editor.tsx";
import {AppSettings, useDBSetting} from "./settings-db.ts";
import {CustomProtocolPanel} from "./custom-protocol-panel.tsx";
import {ProtocolExecutor} from "./protocol-executor.ts";
import {JSONContent} from "vanilla-jsoneditor";
import {ProtocolDefinition, ShortStageDefinition, StageDefinition} from "./simple-protocol.ts";
import {PortaCountClient8020, PortaCountListener} from "./portacount-client-8020.ts";
import {PortaCountState} from "./portacount-state.tsx";
import {useNavigate, useSearchParams} from "react-router";
import LZString from "lz-string";

echarts.use([DatasetComponent, LineChart, GaugeChart, GridComponent, SingleAxisComponent, TooltipComponent, AxisPointerComponent, TimelineComponent,
    MarkAreaComponent, LegendComponent, DataZoomComponent, VisualMapComponent, CanvasRenderer]);

export enum ConnectionStatus {
    DISCONNECTED = "Disconnected",
    WAITING = "Waiting for Portacount",
    RECEIVING = "Receiving data",
}

function App() {
    const simulationSpeedsBytesPerSecond: number[] = [300, 1200, 14400, 28800, 56760];
    const [showSettings, setShowSettings] = useDBSetting<boolean>(AppSettings.SHOW_SETTINGS, false);
    const [dataSource, setDataSource] = useState<string>("web-serial")
    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(ConnectionStatus.DISCONNECTED)
    const [simulationSpeedBytesPerSecond, setSimulationSpeedBytesPerSecond] = useState<number>(simulationSpeedsBytesPerSecond[simulationSpeedsBytesPerSecond.length - 1]);
    const [dataToDownload, setDataToDownload] = useState<string>("all-raw-data")
    const [rawConsoleData, setRawConsoleData] = useState<string>("")
    const rawConsoleDataTextAreaRef = React.useRef<HTMLTextAreaElement>(null)
    const [logData, setLogData] = useState<string>("")
    const [processedData, setProcessedData] = useState<string>("")
    const fitTestDataTableRef = React.useRef<HTMLTableElement>(null)

    const [dataTransmissionMode, setDataTransmissionMode] = useState("Transmitting")
    const [valvePosition, setValvePosition] = useState("Sampling from Ambient")
    const [controlMode, setControlMode] = useState("Internal Control");

    const [baudRate, setBaudRate] = useDBSetting(AppSettings.BAUD_RATE, "1200")
    const [showAdvancedControls, setShowAdvancedControls] = useDBSetting(AppSettings.ADVANCED_MODE, false);
    const [showExternalControl, setShowExternalControl] = useDBSetting(AppSettings.SHOW_EXTERNAL_CONTROL, false);
    const [showSimpleProtocolEditor, setShowSimpleProtocolEditor] = useDBSetting(AppSettings.SHOW_SIMPLE_PROTOCOL_EDITOR, false);
    const [verboseSpeech, setVerboseSpeech] = useDBSetting(AppSettings.VERBOSE, false);
    const [sayParticleCount, setSayParticleCount] = useDBSetting(AppSettings.SAY_PARTICLE_COUNT, false)
    const [sayEstimatedFitFactor, setSayEstimatedFitFactor] = useDBSetting(AppSettings.SAY_ESTIMATED_FIT_FACTOR, true);
    const [autoEstimateFitFactor, setAutoEstimateFitFactor] = useDBSetting(AppSettings.AUTO_ESTIMATE_FIT_FACTOR, false);
    const [defaultToPreviousParticipant, setDefaultToPreviousParticipant] = useDBSetting(AppSettings.DEFAULT_TO_PREVIOUS_PARTICIPANT, false);
    const [protocolExecutor] = useState<ProtocolExecutor>(new ProtocolExecutor());
    const [protocolDefinitions] = useDBSetting<JSONContent>(AppSettings.PROTOCOL_INSTRUCTION_SETS)
    const [showLogPanels, setShowLogPanels] = useDBSetting(AppSettings.SHOW_LOG_PANELS, false)
    const [keepScreenAwake, setKeepScreenAwake] = useDBSetting<boolean>(AppSettings.KEEP_SCREEN_AWAKE, true);
    const wakeLock = React.useRef<WakeLockSentinel|null>(null)

    const [resultsDatabase] = useState(() => new SimpleResultsDB());
    const [rawDatabase] = useState(() => new SimpleDB());
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

    const [instructions, setInstructions] = useState<string>("")
    const [estimatedFitFactor, setEstimatedFitFactor] = useState<number>(NaN)
    const [ambientConcentration, setAmbientConcentration] = useState<number>(0)
    const [maskConcentration, setMaskConcentration] = useState<number>(-1) // -1 means unknown

    const initialChartOptions: EChartsOption = {
        axisPointer: {
            link: [
                {
                    xAxisIndex: 'all'
                }
            ],
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
            },
            valueFormatter: formatFitFactor,
            position: function (pos: Array<number>, _params: object | Array<object>, _el: HTMLElement, _elRect: object, size: {
                contentSize: number[],
                viewSize: number[]
            }) {
                // place tooltip on edges, moving it out of the way when cursor is near
                if (pos[0] < size.viewSize[0] / 2) {
                    return {bottom: 10, right: 30}
                } else {
                    return {bottom: 10, left: 30}
                }
            }
        },
        grid: [
            {bottom: '60%'},
            {top: '60%'},
        ],
        xAxis: [
            {
                type: 'time',
                gridIndex: 0,
            },
            {
                type: 'time',
                gridIndex: 1,
            },
        ],
        yAxis: [
            {
                name: 'concentration',
                position: 'left',
                type: 'value',
                gridIndex: 0,
                splitLine: {
                    show: true,
                },
                minorSplitLine: {
                    show: true,
                }
            },
            {
                name: 'estimated fit factor',
                position: 'left',
                type: 'value',
                gridIndex: 1,
            },
        ],
        dataZoom: [
            {
                id: 'dataZoomX',
                type: 'slider',
                xAxisIndex: [0, 1],
                filterMode: 'filter',   // Set as 'filter' so that the modification
                                        // of window of xAxis will effect the
                                        // window of yAxis.
            },
            {
                id: 'dataZoomY0',
                type: 'slider',
                yAxisIndex: [0],
                filterMode: 'empty',
            },
            {
                id: 'dataZoomY1',
                type: 'slider',
                yAxisIndex: [1],
                filterMode: 'empty',
            }
        ],
        series: [
            {
                name: 'concentration',
                type: 'line',
                encode: {
                    x: ['timestamp'],
                    y: ['concentration'],
                },
                yAxisIndex: 0,
                xAxisIndex: 0,
                lineStyle: {
                    type: "dotted",
                    width: 3,
                    opacity: 0, // hide
                },
                markArea: {
                    data: []
                }
            },
            {
                name: 'guestimated ambient level',
                type: 'line',
                encode: {
                    x: ['timestamp'],
                    y: ['guestimatedAmbient'],
                },
                yAxisIndex: 0,
                xAxisIndex: 0,
                lineStyle: {
                    color: "gray",
                    width: 3,
                },
                itemStyle: {
                    color: "gray",
                },
                showSymbol: false, // hides the point until mouseover
            },
            {
                name: 'EMA concentration',
                type: 'line',
                encode: {
                    x: ['timestamp'],
                    y: ['emaConcentration'],
                },
                yAxisIndex: 0,
                xAxisIndex: 0,
                lineStyle: {
                    color: "blue",
                    width: 3,
                },
                itemStyle: {
                    color: "blue",
                },
                showSymbol: false, // hides the point until mouseover
            },
            {
                name: 'EMA concentration in zone',
                type: 'line',
                encode: {
                    x: ['timestamp'],
                    y: ['emaConcentrationInZone'],
                },
                yAxisIndex: 0,
                xAxisIndex: 0,
                lineStyle: {
                    color: "blue",
                    width: 1,
                },
                itemStyle: {
                    color: "blue",
                },
                showSymbol: false, // hides the point until mouseover
            },
            {
                name: 'Zone FF',
                type: 'line',
                encode: {
                    x: ['timestamp'],
                    y: ['zoneFF'],
                },
                yAxisIndex: 1,
                xAxisIndex: 1,
                lineStyle: {
                    width: 1,
                },
                itemStyle: {
                    opacity: 0, // hidden
                },
                showSymbol: false, // hides the point until mouseover
            },
        ],
    };
    const [chartOptions, setChartOptions] = useState(initialChartOptions);
    const initialEstimatedFitFactorGaugeOptions: EChartsOption = {
        series: [
            {
                type: 'gauge',
                radius: '100%',
                min: 0,
                max: 200,
                detail: {
                    valueAnimation: true,
                    formatter: formatFitFactor,
                    color: 'inherit'
                },
                axisLabel: {
                    color: 'inherit',
                    distance: 10,
                },
                axisLine: {
                    lineStyle: {
                        width: 6,
                        color: [
                            [0.0999, 'darkred'],
                            [0.4999, 'darkorange'],
                            [1, 'green'],
                        ]
                    }
                },
                axisTick: {
                    show: false,
                    length: 2,
                    lineStyle: {
                        color: 'inherit',
                        width: 2
                    }
                },
                splitLine: {
                    distance: 0,
                    length: 5,
                    lineStyle: {
                        color: 'inherit',
                        width: 1
                    },
                },
                pointer: {
                    itemStyle: {
                        color: 'inherit',
                    }
                },
                data: [
                    {value: 88},
                ],
            }
        ]
    };
    const [estimatedFitFactorGaugeOptions, setEstimatedFitFactorGaugeOptions] = useState(initialEstimatedFitFactorGaugeOptions)

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
        defaultToPreviousParticipant: defaultToPreviousParticipant,
        chartOptions: initialChartOptions,
        setChartOptions: setChartOptions,
        gaugeOptions: initialEstimatedFitFactorGaugeOptions,
        setGaugeOptions: setEstimatedFitFactorGaugeOptions,
    };

    const [dataCollectorStates] = useState(initialDataCollectorState);
    const [dataCollector] = useState(() => new DataCollector(dataCollectorStates, logCallback, rawDataCallback,
        processedDataCallback, resultsDatabase))
    const [portaCountClient] = useState(new PortaCountClient8020())
    const [searchParams] = useSearchParams()
    const navigate = useNavigate();

    function processUrlData() {
        const dataParam = searchParams.get("data");
        if(!dataParam) {
            return;
        }
        const urlData = LZString.decompressFromUTF16(dataParam)
        if(urlData) {
            navigate(location.pathname, {replace: true}) // remove data from the url
            console.log(`got url data: ${urlData}`);
            appendRaw(urlData)
        }
    }

    async function requestWakeLock() {
        wakeLock.current = await navigator.wakeLock.request('screen');
    }

    useEffect(() => {
        portaCountClient.addListener(dataCollector);
        portaCountClient.addListener(externalController);

        // handle data sent via url
        processUrlData();

        return () => {
            portaCountClient.removeListener(dataCollector)
            portaCountClient.removeListener(externalController)
        };
    }, []);

    const handleVisibilityChange = () => {
        if (wakeLock.current !== null && document.visibilityState === 'visible') {
          requestWakeLock();
        }
      }

    useEffect(() => {
        if (keepScreenAwake) {
            requestWakeLock();
            document.addEventListener('visibilitychange', handleVisibilityChange);
        } else if (wakeLock.current !== null) {
            wakeLock.current.release().then(() => {
                wakeLock.current = null;
            })
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        }
    }, [keepScreenAwake]);

    useEffect(() => {
        console.log(`initializing raw logs db`)
        rawDatabase.open();

        return () => rawDatabase.close();
    }, [rawDatabase]);

    useEffect(() => {
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
        dataCollectorStates.verboseSpeech = verboseSpeech;
    }, [verboseSpeech, dataCollectorStates]);
    useEffect(() => {
        dataCollectorStates.sayEstimatedFitFactor = sayEstimatedFitFactor;
    }, [sayEstimatedFitFactor, dataCollectorStates]);
    useEffect(() => {
        dataCollectorStates.defaultToPreviousParticipant = defaultToPreviousParticipant;
    }, [defaultToPreviousParticipant, dataCollectorStates]);

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
        console.log(`connection status is now ${connectionStatus}`)
    }, [connectionStatus]);
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
                dataCollector.resetChart();
                connectViaSimulator()
                break;
            case "database":
                dataCollector.resetChart();
                connectViaDatabase();
                break;
            default:
                console.log(`unexpected dataSource : ${dataSource}`);
                break
        }
    }

    function downloadButtonClickHandler() {
        downloadAllRawDataAsJSON() // there's only 1 option at the moment
        switch (dataToDownload) {
            case "all-raw-data":
                // downloadRawData(rawConsoleData, "raw-fit-test-data");
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

    function connectViaWebUsbSerial() {
        const serial = new UsbSerialDrivers()
        serial.requestPort().then((port) => {
            port.open({baudRate: Number(baudRate)}).then(() => {
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
                port.open({baudRate: Number(baudRate)}).then((event) => {
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

    function connectViaDatabase() {
        throw new Error("implement me!")
    }

    function connectViaSimulator() {
        if ("showOpenFilePicker" in window) {
            // @ts-expect-error showOpenFilePicker is sometimes supported
            window.showOpenFilePicker({id: "simulator-files"}).then((fileHandles: FileSystemFileHandle[]) => {
                fileHandles[0].getFile().then((filehandle: File) => {
                    const fakeReader = getReadableStreamFromDataSource(new DataFilePushSource(filehandle, simulationSpeedBytesPerSecond)).getReader();
                    monitor(fakeReader, false); // don't save these to db since we already know the db save works and we don't need to pollute the db with simulated data.
                })
            })
        } else {
            const fakeReader = getReadableStreamFromDataSource(new DataFilePushSource("./fit-test-console/simulator-data/test-data.txt", simulationSpeedBytesPerSecond)).getReader();
            monitor(fakeReader, false); // don't save these to db since we already know the db save works and we don't need to pollute the db with simulated data.
        }
    }

    // module for parsing, module for controlling, module for displaying state and controls
    async function monitor(reader: ReadableStreamDefaultReader<Uint8Array>, saveToDb: boolean = true) {
        class LineListener implements PortaCountListener {
            lineReceived(line: string) {
                const timestamp = new Date().toISOString();
                if (line.trim().length > 0) {
                    // we only care about non-empty lines
                    appendRaw(`${timestamp} ${line}\n`); // not really raw anymore since we've re-chunked into lines.
                    if (saveToDb) {
                        rawDatabase?.addLine(line);
                    }
                    setConnectionStatus(ConnectionStatus.RECEIVING);
                }
            }
        }

        try {
            const listener = new LineListener();
            setConnectionStatus(ConnectionStatus.WAITING);
            portaCountClient.addListener(listener)
            await portaCountClient.monitor(reader);
            portaCountClient.removeListener(listener);
        }
        finally {
            setConnectionStatus(ConnectionStatus.DISCONNECTED);
        }
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


    function setSelectedProtocol(selectedProtocol: string) {
        dataCollector.setProtocol(selectedProtocol);
        const protocol = (protocolDefinitions.json as ProtocolDefinition)[selectedProtocol];
        const stages = protocol.map((item) => {
            let stageDefinition: StageDefinition;
            if (typeof item === "string") {
                stageDefinition = {
                    instructions: item,
                };
            } else if ((item as StageDefinition).instructions !== undefined) {
                stageDefinition = deepCopy(item) as StageDefinition
            } else if ((item as ShortStageDefinition).i !== undefined) {
                const ssd = item as ShortStageDefinition;
                stageDefinition = {
                    instructions: ssd.i,
                    purge_duration: ssd.p,
                    sample_duration: ssd.s
                }
            } else {
                console.error(`unexpected item in protocol definition: ${JSON.stringify(item)}`)
                return;
            }
            return stageDefinition;
        }).filter((value) => {
            return value !== undefined
        });
        protocolExecutor.setStages(stages)
    }

    return (
        <>
            <section id="data-source-baud-rate" style={{display: 'flex'}}>
                <fieldset>
                    {`mftc v${__APP_VERSION__} ${import.meta.env.MODE}`}
                </fieldset>
                <fieldset style={{flexGrow: "1", textAlign: "left"}}>
                    <div style={{display: "inline-block"}}>
                        <label htmlFor="data-source-selector">Data Source: </label>
                        <select id="data-source-selector" defaultValue={dataSource} onChange={dataSourceChanged}
                                disabled={connectionStatus !== ConnectionStatus.DISCONNECTED}>
                            <option value="web-serial">WebSerial</option>
                            <option value="web-usb-serial">Web USB Serial</option>
                            <option value="simulator">Simulator</option>
                            <option value="database">Database</option>
                        </select>
                    </div>
                    {dataSource === "simulator" ?
                        <div style={{display: "inline-block"}}>
                            <label htmlFor="simulation-speed-select">Speed: </label>
                            <select id="simulation-speed-select"
                                    value={simulationSpeedBytesPerSecond}
                                    onChange={(event) => setSimulationSpeedBytesPerSecond(Number(event.target.value))}>
                                {simulationSpeedsBytesPerSecond.map((bytesPerSecond: number) => <option key={bytesPerSecond}
                                                                                                        value={bytesPerSecond}>{bytesPerSecond} bps</option>)}
                            </select>
                        </div> : null}
                    <input className="button" type="button" value="Connect" id="connect-button"
                           hidden={connectionStatus !== ConnectionStatus.DISCONNECTED}
                           onClick={connectButtonClickHandler}/>
                    <div className={getConnectionStatusCssClass(connectionStatus)}>
                        {connectionStatus}
                    </div>
                    <ProtocolSelector
                        onChange={(selectedProtocol) => setSelectedProtocol(selectedProtocol)}/>&nbsp;&nbsp;

                    <select id="download-file-format-selector" defaultValue={dataToDownload}
                            onChange={downloadFileFormatChanged}>
                        <option value="all-raw-data">All Raw data as json</option>
                    </select>
                    <input className="button" type="button" value="Download!" id="download-button"
                           onClick={downloadButtonClickHandler}/>
                    <SettingsToggleButton trueLabel={"Show Settings"} value={showSettings} setValue={setShowSettings}/>
                </fieldset>
            </section>
            {showSettings ?
                <section id="settings">
                    <section id="basic-settings" style={{display: 'flex'}}>
                        <fieldset style={{width: "100%", textAlign: "left"}}>
                            <EnableSpeechSwitch/>
                            <SettingsToggleButton trueLabel={"Say particle count"}
                                                  value={sayParticleCount}
                                                  setValue={setSayParticleCount}/>
                            <SettingsToggleButton trueLabel={"Estimate fit factor"}
                                                  value={autoEstimateFitFactor}
                                                  setValue={setAutoEstimateFitFactor}/>
                            <SettingsToggleButton trueLabel={"Say estimated fit factor"}
                                                  value={sayEstimatedFitFactor}
                                                  setValue={setSayEstimatedFitFactor}/>
                            <SettingsToggleButton trueLabel={"Advanced settings"}
                                                  value={showAdvancedControls}
                                                  setValue={setShowAdvancedControls}/>
                        </fieldset>
                    </section>
                    {showAdvancedControls ?
                        <section id="advanced-settings" style={{display: "flex", width: "100%"}}>
                            <fieldset style={{width: "100%", textAlign: "left"}}>
                                <SettingsSelect label={"Baud Rate"} value={baudRate} setValue={setBaudRate}
                                                options={[
                                                    {"300": "300"},
                                                    {"600": "600"},
                                                    {"1200": "1200"},
                                                    {"2400": "2400"},
                                                    {"9600": "9600"}
                                                ]}/>
                                <SpeechVoiceSelector/>
                                <SettingsToggleButton trueLabel={"Verbose speech"}
                                                      value={verboseSpeech}
                                                      setValue={setVerboseSpeech}/>
                                <SettingsToggleButton trueLabel={"Copy prev participant"}
                                                      value={defaultToPreviousParticipant}
                                                      setValue={setDefaultToPreviousParticipant}/>
                                <SettingsToggleButton trueLabel={"Keep screen awake"}
                                                      value={keepScreenAwake}
                                                      setValue={setKeepScreenAwake}/>
                                <SettingsToggleButton trueLabel={"Show external control"}
                                                      value={showExternalControl}
                                                      setValue={setShowExternalControl}/>
                                <SettingsToggleButton trueLabel={"Show protocol editor"}
                                                      value={showSimpleProtocolEditor}
                                                      setValue={setShowSimpleProtocolEditor}/>
                                <SettingsToggleButton trueLabel={"Show raw data"} value={showLogPanels} setValue={setShowLogPanels}/>
                            </fieldset>
                        </section> : null}
                </section> : null}
            {showAdvancedControls ? <div style={{float: "left"}}>
                <PortaCountState client={portaCountClient}/>
            </div> : null}
            {showExternalControl ? <div style={{display: "flex", width: "100%"}}>
                <CustomProtocolPanel protocolExecutor={protocolExecutor}></CustomProtocolPanel>
                <ExternalControlPanel control={externalController}/>
            </div> : null}
            {showSimpleProtocolEditor ? <section style={{display: "flex", width: "100%"}}>
                <fieldset style={{width: "100%"}}>
                    <legend>fit test protocols</legend>
                    <SimpleFitTestProtocolPanel></SimpleFitTestProtocolPanel>
                </fieldset>
            </section> : null}
            {autoEstimateFitFactor ?
                <section style={{display: "inline-flex", width: "100%"}}>
                    <fieldset style={{display: "inline-block", float: "left"}}>
                        <legend>Estimated Fit Factor</legend>
                        <div style={{width: "100%"}}>
                            <fieldset style={{display: "inline-block"}}>
                                <legend>Ambient</legend>
                                <span>{Number(ambientConcentration).toFixed(0)}</span>
                            </fieldset>
                            <fieldset style={{display: "inline-block"}}>
                                <legend>Mask</legend>
                                <span>{maskConcentration < 0 ? "?" : Number(maskConcentration).toFixed(maskConcentration < 10 ? 1 : 0)}</span>
                            </fieldset>
                        </div>
                        <div className={getFitFactorCssClass(estimatedFitFactor)}
                             style={{
                                 boxSizing: "border-box",
                                 width: '100%',
                                 height: 'max-content',
                                 alignContent: 'center',
                                 fontSize: "1.7rem"
                             }}>
                            <span>{Number(estimatedFitFactor).toFixed(estimatedFitFactor < 10 ? 1 : 0)}</span>
                            <br/>
                            <span
                                style={{fontSize: "smaller"}}>({convertFitFactorToFiltrationEfficiency(estimatedFitFactor)}%)</span>
                        </div>
                        <ReactEChartsCore echarts={echarts} option={estimatedFitFactorGaugeOptions}/>
                    </fieldset>
                    <div style={{display: "inline-block", flexGrow: 1}}>
                        <ReactEChartsCore echarts={echarts} style={{height: "70vh"}}
                                          option={chartOptions}
                            // notMerge={false}
                            // lazyUpdate={true}
                        />
                    </div>
                </section> : null}
            <section style={{display: "inline-flex", width: "100%"}}>
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
            </section>
            <DataCollectorPanel dataCollector={dataCollector} showLogs={showLogPanels}></DataCollectorPanel>
        </>
    )
}

export default App
