import {ConnectionStatus, PortaCountListener, SerialPortLike} from "./portacount-client-8020.ts";
import {useContext, useEffect, useState} from "react";
import {AppContext} from "./app-context.ts";
import {AppSettings, useSetting} from "./app-settings.ts";
import {DataSource} from "./data-source.ts";
import {UsbSerialDrivers} from "./web-usb-serial-drivers.ts";
import {DataFilePushSource, getReadableStreamFromDataSource} from "./datasource-helper.ts";
import {getConnectionStatusCssClass} from "./utils.ts";

/**
 * Control for selecting the driver to use to connect to the PortaCount. Or to a simulator. Shows connection status.
 * @constructor
 */
export function DriverSelectorWidget() {
    const appContext = useContext(AppContext)
    const [dataCollector] = useState(appContext.dataCollector)
    const [portaCountClient] = useState(appContext.portaCountClient)
    const [enableSimulator] = useSetting<boolean>(AppSettings.ENABLE_SIMULATOR);
    const [baudRate] = useSetting<string>(AppSettings.BAUD_RATE)
    const simulationSpeedsBytesPerSecond: number[] = [300, 1200, 14400, 28800, 56760];
    const [simulationSpeedBytesPerSecond, setSimulationSpeedBytesPerSecond] = useState<number>(simulationSpeedsBytesPerSecond[simulationSpeedsBytesPerSecond.length - 1]);
    const [dataSource, setDataSource] = useState<string>("web-serial")
    const [connectionStatus, setConnectionStatus] = useState(portaCountClient.state.connectionStatus)

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

    function connectViaWebUsbSerial() {
        dataCollector.dataSource = DataSource.WebUsbSerial
        const serial = new UsbSerialDrivers()
        serial.requestPort().then(serialPortConnectionHandler)
    }

    function serialPortConnectionHandler(port: SerialPortLike) {
        console.log(`got serial port ${port.toLocaleString()}, using baud rate ${baudRate}`)
        port.open({baudRate: Number(baudRate)}).then(() => {
            console.log(`opened ${port.getInfo()}`)
            portaCountClient.connect(port)
        })
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
                getInfo(): SerialPortInfo {
                    return {};
                },
                open(): Promise<void> {
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
        switch (dataSource) {
            case "web-usb-serial":
                connectViaWebUsbSerial();
                break;
            case "web-serial":
                connectViaWebSerial()
                break;
            case "simulator":
                dataCollector.fitFactorEstimator.resetChart();
                connectViaSimulator()
                break;
            case "simulator-file":
                dataCollector.fitFactorEstimator.resetChart();
                connectViaSimulatorFile()
                break;
            default:
                console.log(`unexpected dataSource : ${dataSource}`);
                break
        }
    }

    return (
        <fieldset className={"info-box"}>
            <legend>Data Source <span
                className={getConnectionStatusCssClass(connectionStatus)}>{connectionStatus}</span>
            </legend>
            <div style={{display: "inline-block"}}>
                <select id="data-source-selector"
                        defaultValue={dataSource}
                        onChange={(event) => setDataSource(event.target.value)}
                        disabled={portaCountClient.state.connectionStatus !== ConnectionStatus.DISCONNECTED}>
                    <option value="web-serial">WebSerial</option>
                    <option value="web-usb-serial">Web USB Serial</option>
                    {enableSimulator && <option value="simulator">Simulator</option>}
                </select>
            </div>
            {dataSource === "simulator-file" &&
                <div style={{display: "none"}}>
                    <label htmlFor="simulation-speed-select">Speed: </label>
                    <select id="simulation-speed-select"
                            value={simulationSpeedBytesPerSecond}
                            onChange={(event) => setSimulationSpeedBytesPerSecond(Number(event.target.value))}>
                        {simulationSpeedsBytesPerSecond.map((bytesPerSecond: number) => <option
                            key={bytesPerSecond}
                            value={bytesPerSecond}>{bytesPerSecond} bps</option>)}
                    </select>
                </div>}
            {/*todo: change connect button to "stop" or "disconnect" button once connected*/}
            <input className="button" type="button" value="Connect" id="connect-button"
                   disabled={portaCountClient.state.connectionStatus !== ConnectionStatus.DISCONNECTED}
                   onClick={connectButtonClickHandler}/>
        </fieldset>

    )
}
