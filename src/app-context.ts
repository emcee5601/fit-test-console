import {createContext} from "react";
import {ParticleConcentrationEvent, PortaCountClient8020} from "./portacount-client-8020.ts";
import {APP_SETTINGS_CONTEXT, AppSettings} from "./app-settings.ts";
import {DataCollector, DataCollectorListener} from "./data-collector.ts";
import {SPEECH} from "./speech.ts";
import {RESULTS_DB} from "./SimpleResultsDB.ts";
import {RAW_DB} from "./database.ts";
import {ProtocolExecutor} from "./protocol-executor.ts";
import {PortaCount8020Simulator} from "./PortaCount8020Simulator.ts";
import {ControlSource} from "./control-source.ts";
import {UsbSerialDrivers} from "./web-usb-serial-drivers.ts";
import {DataSource} from "./data-source.ts";
import {timingSignal} from "src/timing-signal.ts";

/**
 * Global context.
 * There should be exactly 1 instance of the PortaCount client and Data Collector. These should be kept running
 * continuously so we don't lose data.
 */

const settings = APP_SETTINGS_CONTEXT;
// todo: make sure we only have one of these when vite dynamically reloads classes
const dataCollector = new DataCollector();
const portaCountClient = new PortaCountClient8020();
const protocolExecutor = new ProtocolExecutor(portaCountClient, dataCollector);
const portaCountSimulator = new PortaCount8020Simulator()

function initDataCollector() {
    dataCollector.setPortaCountClient(portaCountClient)
}

function initSpeech() {
    portaCountClient.addListener({
        particleConcentrationReceived(event: ParticleConcentrationEvent) {
            if (SPEECH.isSayingSomething()) {
                return;
            }
            if (settings.speechEnabled && settings.sayParticleCount) {
                const concentration = event.concentration;
                const intConcentration = Math.ceil(concentration);
                const roundedConcentration = intConcentration < 20 ? (Math.ceil(concentration * 10) / 10).toFixed(1) : intConcentration;
                const message = settings.verboseSpeech ? `Particle count is ${roundedConcentration}` : roundedConcentration.toString();
                SPEECH.sayIt(message);
            }
        }
    })
    let prevInstructions: string = "";
    const dataCollectorListener: DataCollectorListener = {
        instructionsChanged(instructions: string) {
            // say up to the first period in the instructions.
            const whatToSay = instructions.split(".", 2)[0]
            if (prevInstructions !== instructions) {
                prevInstructions = instructions;
                SPEECH.sayItLater(whatToSay); // make sure instructions are queued.
            }
            // else, ignore
        },
        estimatedFitFactorChanged(estimate: number) {
            if (settings.sayEstimatedFitFactor) {
                SPEECH.sayItPolitely(`Estimated Fit Factor is ${estimate.toFixed(0)}`)
            }
        },
    };
    dataCollector.addListener(dataCollectorListener)
}

/**
 * switch selected protocol to match control source. in internal control mode, we don't allow custom protocols.
 * @param source
 */
function adjustSelectedProtocol(source: ControlSource) {
    if (source === ControlSource.Internal) {
        const internalProtocol = settings.getSetting(AppSettings.SELECTED_INTERNAL_PROTOCOL)
        settings.saveSetting(AppSettings.SELECTED_PROTOCOL, internalProtocol);
    } else {
        // external
        const externalProtocol = settings.getSetting(AppSettings.SELECTED_EXTERNAL_PROTOCOL)
        settings.saveSetting(AppSettings.SELECTED_PROTOCOL, externalProtocol);
    }
}

function initPortaCountListener() {
    portaCountClient.addListener({
        controlSourceChanged(source: ControlSource) {
            // link external/internal control to the appropriate protocol
            adjustSelectedProtocol(source);
        }
    })
}

function initSelectedProtocol() {
    settings.addListener({
        ready() {
            adjustSelectedProtocol(portaCountClient.state.controlSource) // on startup this should always be internal
        }
    })
}

async function autoConnect() {
    // todo: prioritize the selected data source
    // todo: optionally support auto-connecting to simulator
    // todo: need a way to pick good ports. for now, only keep ports with vendor info. it's possible to connect to a
    //  bad port, say a built-in bluetooth port, and auto-connect will try to connect to it
    // todo: update selected data source when auto-connecting
    // make sure to check for existence of navigator.serial, which doesn't exist on android
    const webSerialPorts: SerialPort[] = navigator.serial ? (await navigator.serial.getPorts()).filter((port => port.getInfo().usbVendorId)) : [];
    const usbSerialPorts = await UsbSerialDrivers.getPorts()
    console.log(`autoConnect: available web serial ${JSON.stringify(webSerialPorts)}, available web usb serial ports: ${JSON.stringify(usbSerialPorts)}`);
    // prefer webSerialPorts
    // todo: keep track of known devices that are portacounts?
    if (webSerialPorts.length > 0 && webSerialPorts[0].getInfo().usbVendorId) {
        const webSerialPort = webSerialPorts[0];
        console.debug(`auto-connect to web serial port ${JSON.stringify(webSerialPort)}`)
        portaCountClient.connect(webSerialPort);
        settings.saveSetting(AppSettings.SELECTED_DATA_SOURCE, DataSource.WebSerial)
    } else if (usbSerialPorts.length > 0) {
        const port = usbSerialPorts[0];
        console.debug(`auto-connect to usb serial port ${JSON.stringify(port)}`)
        portaCountClient.connect(port);
        settings.saveSetting(AppSettings.SELECTED_DATA_SOURCE, DataSource.WebUsbSerial)
    }
}

async function initMaskList() {
    // must do this only after settings have been loaded
    settings.addListener({
        async ready() {
            await RESULTS_DB.open()
            RESULTS_DB.getData().then((results) => {
                const dbMasks = results.reduce((masks, currentValue) => {
                    // make sure mask has a value and strip that value of leading and trailing spaces
                    masks.add(((currentValue.Mask as string) ?? "").trim())
                    return masks;
                }, new Set<string>())
                settings.saveSetting(AppSettings.MASK_LIST, [...dbMasks].sort())
            })
        }
    })
}

async function init() {
    initSpeech();
    initDataCollector()
    await RESULTS_DB.open() // start init process
    await RAW_DB.open()
    await initMaskList();
    initPortaCountListener();
    initSelectedProtocol();
    timingSignal.start();

    if (await settings.getActualSetting<boolean>(AppSettings.ENABLE_AUTO_CONNECT)) {
        // auto-connect is enabled
        await autoConnect();
    }
    // todo: make a ready callback (if await, we don't need to?)
}

await init()
// anything that needs to persist across tabs should be here
export const APP_CONTEXT = {
    portaCountClient: portaCountClient,
    settings: settings,
    dataCollector: dataCollector,
    protocolExecutor: protocolExecutor,
    portaCountSimulator: portaCountSimulator,
    timingSignal: timingSignal,
    // logger
    // internal test interpreter
    // protocol executor interprets external tests
};
export const AppContext = createContext(APP_CONTEXT);

