import {createContext} from "react";
import {ParticleConcentrationEvent, PORTACOUNT_CLIENT_8020} from "./portacount-client-8020.ts";
import {APP_SETTINGS_CONTEXT, AppSettings} from "./app-settings.ts";
import {DataCollector} from "./data-collector.ts";
import {SPEECH} from "./speech.ts";
import {RESULTS_DB} from "./SimpleResultsDB.ts";
import {RAW_DB} from "./database.ts";
import {ProtocolExecutor} from "./protocol-executor.ts";
import {PortaCount8020Simulator} from "./PortaCount8020Simulator.ts";
import {ControlSource} from "./control-source.ts";

/**
 * Global context.
 * There should be exactly 1 instance of the PortaCount client and Data Collector. These should be kept running
 * continuously so we don't lose data.
 */

const settings = APP_SETTINGS_CONTEXT;
const dataCollector = new DataCollector();
const portaCountClient = PORTACOUNT_CLIENT_8020;
const protocolExecutor = new ProtocolExecutor(portaCountClient, dataCollector);
const portaCountSimulator = new PortaCount8020Simulator()
function initDataCollector() {
    dataCollector.setPortaCountClient(portaCountClient)
}
function initSpeech() {
    PORTACOUNT_CLIENT_8020.addListener({
        particleConcentrationReceived(event: ParticleConcentrationEvent) {
            if(SPEECH.isSayingSomething()) {
                return;
            }
            if(settings.speechEnabled && settings.sayParticleCount) {
                const concentration = event.concentration;
                const intConcentration = Math.ceil(concentration);
                const roundedConcentration = intConcentration < 20 ? (Math.ceil(concentration * 10) / 10).toFixed(1) : intConcentration;
                const message = settings.verboseSpeech ? `Particle count is ${roundedConcentration}` : roundedConcentration.toString();
                SPEECH.sayIt(message);
            }
        }
    })
    dataCollector.addListener({
        instructionsChanged(instructions: string) {
            // say up to the first period in the instructions.
            const whatToSay = instructions.split(".", 2)[0]
            SPEECH.sayItLater(whatToSay); // make sure instructions are queued.
        },
        estimatedFitFactorChanged(estimate: number) {
            if(settings.sayEstimatedFitFactor) {
                SPEECH.sayItPolitely(`Estimated Fit Factor is ${estimate.toFixed(0)}`)
            }
        },
    })
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
    PORTACOUNT_CLIENT_8020.addListener({
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

function init() {
    initSpeech();
    initDataCollector()
    RESULTS_DB.open() // start init process
    RAW_DB.open()
    initPortaCountListener();
    initSelectedProtocol();
    // todo: make a ready callback
}
init()
// anything that needs to persist across tabs should be here
export const APP_CONTEXT = {
    portaCountClient: PORTACOUNT_CLIENT_8020,
    settings: settings,
    dataCollector: dataCollector,
    protocolExecutor: protocolExecutor,
    portaCountSimulator: portaCountSimulator,
    // logger
    // internal test interpreter
    // protocol executor interprets external tests
};
export const AppContext = createContext(APP_CONTEXT);

