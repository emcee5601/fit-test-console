import {createContext} from "react";
import {
    ParticleConcentrationEvent,
    PortaCountClient8020,
    PortaCountListener,
    SerialPortLike
} from "./portacount-client-8020.ts";
import {APP_SETTINGS_CONTEXT, AppSettings, calculateNumberOfExercises} from "./app-settings.ts";
import {DataCollector, DataCollectorListener} from "./data-collector.ts";
import {SPEECH} from "./speech.ts";
import {RESULTS_DB} from "./SimpleResultsDB.ts";
import {RAW_DB} from "./database.ts";
import {ProtocolExecutor, ProtocolExecutorListener} from "./protocol-executor.ts";
import {PortaCount8020Simulator} from "./porta-count-8020-simulator.ts";
import {ControlSource} from "./control-source.ts";
import {UsbSerialDrivers} from "./web-usb-serial-drivers.ts";
import {DataSource} from "./data-source.ts";
import {timingSignal} from "src/timing-signal.ts";
import {enCaseInsensitiveCollator} from "src/utils.ts";
import {Activity} from "src/activity.ts";
import {ConnectionStatus} from "src/connection-status.ts";
import {ProtocolDefaults, StandardProtocolDefinition, StandardStageDefinition} from "src/simple-protocol.ts";

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


/**
 * Create a protocol using the device's internal settings for timings with the selected protocol's instructions.
 * Todo: move to util class?
 * todo: handle the case where we're not connected and have no device timings
 */
export function createDeviceSynchronizedProtocol(protocolName:string): StandardProtocolDefinition {
    const protocolDefinition = settings.protocolDefinitions[protocolName];
    // we really want numExercises, but that's only available on device start. We infer it as we run tests. For now
    // if we don't have it, assume it's the same as the selected protocol
    const numProtocolExercises = calculateNumberOfExercises(protocolDefinition);
    const portaCountSettings = portaCountClient.settings;
    const numExercises = portaCountSettings.numExercises || numProtocolExercises;
    if(numExercises !== numProtocolExercises) {
        console.warn(`numExercises (${numExercises} does not match num exercise for protocol ${protocolName} (${numProtocolExercises})`)
        // todo: auto-select a compatible protocol? display a warning?
    }
    const dsProtocol:StandardProtocolDefinition = []
    let exerciseNum = 0;
    protocolDefinition.forEach((templateStage) => {
        if(templateStage.mask_sample) {
            exerciseNum++;
            const stage: StandardStageDefinition = {
                instructions: templateStage.instructions,
                ambient_purge: portaCountSettings.ambientPurge || ProtocolDefaults.defaultAmbientPurgeDuration,
                ambient_sample: portaCountSettings.ambientSample || ProtocolDefaults.defaultAmbientSampleDuration,
                mask_purge: portaCountSettings.maskPurge || ProtocolDefaults.defaultMaskPurgeDuration,
                mask_sample: portaCountSettings.maskSample.get(exerciseNum) || ProtocolDefaults.defaultMaskSampleDuration
            }
            dsProtocol.push(stage)
        }
    })
    dsProtocol.push({
        instructions: "finalize",
        ambient_purge: portaCountSettings.ambientPurge,
        ambient_sample: portaCountSettings.ambientSample,
        mask_purge: 0,
        mask_sample: 0
    })
    return dsProtocol
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
    adjustSelectedProtocol(portaCountClient.state.controlSource) // on startup this should always be internal
}

async function autoConnect() {
    // todo: prioritize the selected data source
    // todo: optionally support auto-connecting to simulator
    // todo: need a way to pick good ports. for now, only keep ports with vendor info. it's possible to connect to a
    //  bad port, say a built-in bluetooth port, and auto-connect will try to connect to it
    // make sure to check for existence of navigator.serial, which doesn't exist on android
    const webSerialPorts: SerialPort[] = navigator.serial ? (await navigator.serial.getPorts()).filter((port => port.getInfo().usbVendorId)) : [];
    const usbSerialPorts = await UsbSerialDrivers.getPorts()
    const webUsbPort = usbSerialPorts.length > 0 ? usbSerialPorts[0] : null
    const webSerialPort = webSerialPorts.length > 0 ? webSerialPorts[0] : null

    // console.log(`autoConnect: available web serial ${JSON.stringify(webSerialPorts)}, available web usb serial ports: ${JSON.stringify(usbSerialPorts)}`);
    const lastDataSource: DataSource = settings.getSetting(AppSettings.SELECTED_DATA_SOURCE);

    let port: SerialPortLike | null = null;
    if (lastDataSource === DataSource.WebUsbSerial && webUsbPort) {
        port = webUsbPort
    } else if (lastDataSource === DataSource.WebSerial && webSerialPort) {
        port = webSerialPort
    } else if (webUsbPort) {
        port = webUsbPort
        settings.saveSetting(AppSettings.SELECTED_DATA_SOURCE, DataSource.WebUsbSerial)
    } else if (webSerialPort) {
        port = webSerialPort
        settings.saveSetting(AppSettings.SELECTED_DATA_SOURCE, DataSource.WebSerial)
    }
    if(port) {
        console.debug(`auto-connecting to port ${JSON.stringify(port)}`)
        portaCountClient.connect(port);
    } else {
        // console.debug("no eligible ports to auto-connect, setting up retry...")
        if(settings.getSetting(AppSettings.ENABLE_AUTO_CONNECT)) {
            // still enabled
            setTimeout(() => autoConnect(), 1500)
        }
    }
}

async function initMaskList() {
    // must do this only after settings have been loaded
    RESULTS_DB.getData().then((results) => {
        const dbMasks = results.reduce((masks, currentValue) => {
            // make sure mask has a value and strip that value of leading and trailing spaces
            masks.add(((currentValue.Mask as string) ?? "").trim())
            return masks;
        }, new Set<string>())
        settings.saveSetting(AppSettings.MASK_LIST, [...dbMasks].sort(enCaseInsensitiveCollator.compare))
    })
}

function initPortaCountClient() {
    portaCountClient.baudRate = settings.getSetting(AppSettings.BAUD_RATE)
    portaCountClient.syncOnConnect = settings.getSetting(AppSettings.SYNC_DEVICE_STATE_ON_CONNECT)
}

function initCurrentActivityListener() {
    let _protocolExecutorRunning = false;
    let _activity = Activity.Disconnected

    function updateActivity({executorRunning, activity}: { executorRunning?: boolean, activity?: Activity }) {
        if (executorRunning !== undefined) {
            _protocolExecutorRunning = executorRunning
        }
        if (activity !== undefined) {
            _activity = activity
        }
        settings.saveSetting(AppSettings.ACTIVITY, _protocolExecutorRunning ? Activity.Testing : _activity)
    }

    const combinedListener: ProtocolExecutorListener & PortaCountListener = {
        started() {
            updateActivity({executorRunning: true})
        },
        cancelled() {
            updateActivity({executorRunning: false})
        },
        completed() {
            updateActivity({executorRunning: false})
        },
        activityChanged(activity: Activity) {
            updateActivity({activity})
        },
        connectionStatusChanged(connectionStatus: ConnectionStatus) {
            switch (connectionStatus) {
                case ConnectionStatus.DISCONNECTED:
                    updateActivity({activity: Activity.Disconnected})
                    break;
                default:
                    updateActivity({activity: Activity.Idle})
                    break;
            }
        }
    }
    portaCountClient.addListener(combinedListener);
    protocolExecutor.addListener(combinedListener)
}

async function init() {
    await settings.loadAllSettings()
    await RESULTS_DB.open() // start init process
    await RAW_DB.open()
    initPortaCountClient()
    initSpeech();
    initDataCollector()
    await initMaskList();
    initPortaCountListener();
    initSelectedProtocol();
    initCurrentActivityListener();
    timingSignal.start();

    if (settings.getSetting<boolean>(AppSettings.ENABLE_AUTO_CONNECT)) {
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

