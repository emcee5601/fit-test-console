import {PortaCountListener, SerialPortLike} from "./portacount-client-8020.ts";
import {useContext, useEffect, useState} from "react";
import {AppContext} from "./app-context.ts";
import {AppSettings} from "./app-settings.ts";
import {DataSource} from "./data-source.ts";
import {UsbSerialDrivers} from "./web-usb-serial-drivers.ts";
import {DataFilePushSource, getReadableStreamFromDataSource} from "./datasource-helper.ts";
import {getConnectionStatusCssClass} from "./utils.ts";
import {useSetting} from "./use-setting.ts";
import {useInView} from "react-intersection-observer";
import {ConnectionStatus} from "src/connection-status.ts";
import {ActionMenuWidget} from "src/ActionMenuWidget.tsx";
import {HiLinkSlash} from "react-icons/hi2";
import {MdOutlinePending} from "react-icons/md";
import {HiLink} from "react-icons/hi";

/**
 * Control for selecting the driver to use to connect to the PortaCount. Or to a simulator. Shows connection status.
 * Putting notes here until there's a better home for it.
 * We can use the drivers available via web serial interface. These are limited to whatever is on the computer/browser.
 * These are labeled "WebSerial" or eventually "Computer's drivers". Alternatively, we can use our own drivers embedded
 * into the app through libraries or rolling our own. These are labeled "WebUsbSerial" because they use the WebUSB
 * interface and the serial interface sits on top of that. These will eventually be labeled "App's drivers".
 *
 * Depending on the quality of whatever driver we end up using, we may need a modified usb-serial adapter or
 * equivalent. Some drivers, notably the ones currently used by the app, don't set CTS properly as required by the
 * PortaCount in external control mode. The workaround to this seems to be to cut the CTS wire (via a modified
 * adapter). This, for instance, allows us to use the ch340 cable which shows up under the WebSerial set of drivers,
 * in external control mode.
 *
 * Symptoms of not having CTS set properly: the app can switch to external control mode, the PortaCount display goes
 * off, but the app does not see counts. Or the counts stop after issuing subsequent commands. The simplest way to
 * check for this is to send the beep command twice. If it cannot beep a second time, then CTS is probably not being
 * set properly by the driver. The simplest fix is to cut the CTS wire in the cable/adapter.
 * @constructor
 */
export function DriverSelectorWidget({compact = false}: { compact?: boolean }) {
    const appContext = useContext(AppContext)
    const [dataCollector] = useState(appContext.dataCollector)
    const [portaCountClient] = useState(appContext.portaCountClient)
    const [enableSimulator] = useSetting<boolean>(AppSettings.ENABLE_SIMULATOR);
    const [baudRate] = useSetting<number>(AppSettings.BAUD_RATE)
    const simulationSpeedsBytesPerSecond: number[] = [300, 1200, 14400, 28800, 56760];
    const [simulationSpeedBytesPerSecond, setSimulationSpeedBytesPerSecond] = useSetting<number>(AppSettings.SIMULATOR_FILE_SPEED)
    const [dataSource, setDataSource] = useSetting<DataSource>(AppSettings.SELECTED_DATA_SOURCE)
    const [connectionStatus, setConnectionStatus] = useState(portaCountClient.state.connectionStatus)
    const [, setConnectionStatusInView] = useSetting(AppSettings.CONNECTION_STATUS_IN_VIEW)
    const [enableWebSerialDrivers] = useSetting(AppSettings.ENABLE_WEB_SERIAL_DRIVERS)
    const {ref, inView} = useInView()

    useEffect(() => {
        const listener: PortaCountListener = {
            connectionStatusChanged(connectionStatus: ConnectionStatus) {
                setConnectionStatus(connectionStatus)
            }
        };
        portaCountClient.addListener(listener);
        return () => {
            portaCountClient.removeListener(listener)
        };
    }, []);
    useEffect(() => {
        setConnectionStatusInView(inView)
    }, [inView]);

    function connectViaWebUsbSerial() {
        dataCollector.dataSource = DataSource.WebUsbSerial
        const serial = new UsbSerialDrivers()
        serial.requestPort().then(serialPortConnectionHandler)
    }

    function serialPortConnectionHandler(port: SerialPortLike) {
        console.log(`got serial port ${port.toLocaleString()}, using baud rate ${baudRate}`)
        portaCountClient.connect(port)
        // port.open({baudRate: Number(baudRate)}).then(() => {
        //     console.log("opened", JSON.stringify(port.getInfo()))
        // })
    }

    function connectViaWebSerial() {
        dataCollector.dataSource = DataSource.WebSerial
        if ("serial" in navigator) {
            console.log("webserial supported!")
            navigator.serial.requestPort().then(serialPortConnectionHandler)
        } else {
            console.log("no serial support. As of this writing, web serial is only supported on desktop chrome.")
        }
    }

    function connectViaSimulator() {
        dataCollector.dataSource = DataSource.Simulator
        serialPortConnectionHandler(appContext.portaCountSimulator.port)
    }

    function connectViaSimulatorFile() {
        dataCollector.dataSource = DataSource.Simulator

        /**
         * helper for simulator
         * @param fakeReader
         * @param fakeWriter
         */
        function getSerialPortLike(fakeReader: ReadableStream<Uint8Array>, fakeWriter: WritableStream<Uint8Array> | null = null) {
            const fakeSerialPort: SerialPortLike = {
                readable: fakeReader,
                writable: fakeWriter,
                connected: false,
                getInfo(): SerialPortInfo {
                    return {};
                },
                open(): Promise<void> {
                    this.connected = true;
                    return Promise.resolve();
                }
            }
            return fakeSerialPort
        }

        // todo: configure line logger (portacount listener) to skip logging
        if ("showOpenFilePicker" in window) {
            // @ts-expect-error showOpenFilePicker is sometimes supported
            window.showOpenFilePicker({id: "simulator-files"}).then((fileHandles: FileSystemFileHandle[]) => {
                fileHandles[0].getFile().then((filehandle: File) => {
                    const fakeReader = getReadableStreamFromDataSource(new DataFilePushSource(filehandle, simulationSpeedBytesPerSecond));
                    const fakeSerialPort = getSerialPortLike(fakeReader, null)
                    serialPortConnectionHandler(fakeSerialPort)
                })
            })
        } else {
            const fakeReader = getReadableStreamFromDataSource(new DataFilePushSource("./fit-test-console/simulator-data/test-data.txt", simulationSpeedBytesPerSecond));
            const fakeSerialPort = getSerialPortLike(fakeReader, null)
            serialPortConnectionHandler(fakeSerialPort)
        }
    }

    function connectButtonClickHandler() {
        connect(dataSource)
    };

    function connect(dataSource: DataSource) {
        switch (dataSource) {
            case DataSource.WebUsbSerial:
                connectViaWebUsbSerial();
                break;
            case DataSource.WebSerial:
                connectViaWebSerial()
                break;
            case DataSource.Simulator:
                dataCollector.fitFactorEstimator.resetChart();
                connectViaSimulator()
                break;
            case DataSource.SimulatorFile:
                dataCollector.fitFactorEstimator.resetChart();
                connectViaSimulatorFile()
                break;
            default:
                console.log(`unexpected dataSource : ${dataSource}`);
                break
        }
    }

    function handleWidgetSelection(value: string) {
        connect(value as DataSource)
    }

    const options = [
        {
            value: DataSource.WebUsbSerial,
            label: "App drivers (webusb serial)"
        }
    ]
    if (enableWebSerialDrivers) {
        options.push(
            {
                value: DataSource.WebSerial,
                label: "Computer drivers (webserial)"
            },
        )
    }
    if (enableSimulator) {
        options.push(
            {
                value: DataSource.SimulatorFile,
                label: "Simulator (file)"
            },
            {
                value: DataSource.Simulator,
                label: "Simulator"
            }
        )
    }

    const compactWidget = <ActionMenuWidget options={options}
                                            onChange={(value) => handleWidgetSelection(value)}>
        {connectionStatus === ConnectionStatus.DISCONNECTED && <HiLinkSlash color={"red"}/>}
        {connectionStatus === ConnectionStatus.WAITING && <MdOutlinePending color={"orange"}/>}
        {connectionStatus === ConnectionStatus.RECEIVING && <HiLink color={"green"}/>}
    </ActionMenuWidget>

    return (
        compact
            ? compactWidget
            : <fieldset id="driver-selector-widget" className={"info-box-compact"} ref={ref}>
                <legend>Data Source <span
                    className={getConnectionStatusCssClass(connectionStatus)}>{connectionStatus}</span>
                </legend>
                <div style={{display: "inline-block"}}>
                    <select id="data-source-selector"
                            value={dataSource}
                            onChange={(event) => setDataSource(event.target.value as DataSource)}
                            disabled={portaCountClient.state.connectionStatus !== ConnectionStatus.DISCONNECTED}>
                        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </select>
                    {dataSource === DataSource.SimulatorFile &&
                        <div style={{display: "inline-block"}}>
                            <label htmlFor="simulation-speed-select"></label>
                            <select id="simulation-speed-select"
                                    value={simulationSpeedBytesPerSecond}
                                    onChange={(event) => setSimulationSpeedBytesPerSecond(Number(event.target.value))}>
                                {simulationSpeedsBytesPerSecond.map((bytesPerSecond: number) => <option
                                    key={bytesPerSecond}
                                    value={bytesPerSecond}>{bytesPerSecond} bps</option>)}
                            </select>
                        </div>}
                </div>
                {/*todo: change connect button to "stop" or "disconnect" button once connected*/}
                <input className="button" type="button" value="Connect" id="connect-button"
                       disabled={portaCountClient.state.connectionStatus !== ConnectionStatus.DISCONNECTED}
                       onClick={connectButtonClickHandler}/>
            </fieldset>

    )
}
