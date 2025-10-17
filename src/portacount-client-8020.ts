import {getLines} from "./datasource-helper.ts";
import {ReadableStreamDefaultReader} from "node:stream/web";
import {ExternalController, ExternalControlResponsePatterns} from "./external-control.ts";
import {formatDuration} from "src/utils.ts";
import {
    Activity,
    ConnectionStatus,
    ControlSource,
    DataTransmissionState,
    PortaCountState,
    SampleSource
} from "src/portacount/porta-count-state.ts";
import {BaudRateDetector} from "src/baud-rate-detector.ts";
import {AppSettings} from "src/app-settings-types.ts";
import {APP_SETTINGS_CONTEXT} from "src/app-settings.ts";


const Patterns = class {
    // some of these seem only available on bootup, eg. num exercises
    // PORTACOUNT PLUS PROM V1.7
    static readonly PORTACOUNT_VERSION = /^PORTACOUNT\s+PLUS\S+PROM\S+(?<version>.+)/i;
    static readonly COPYRIGHT = /^COPYRIGHT.+/i; // COPYRIGHT(c)1992 TSI INC
    static readonly LICENSE = /^ALL\s+RIGHTS\s+RESERVED/i; // ALL RIGHTS RESERVED
    static readonly SERIAL_NUMBER = /^Serial\s+Number\s+(?<serialNumber>\d+)/i; // Serial Number 17754
    static readonly PASS_LEVEL = /^FF\s+pass\s+level\s+(?<passLevel>\d+)/i; // FF pass level = 100
    static readonly NUM_EXERCISES = /^No\.\s+of\s+exers\s*=\s*(?<num_exercises>\d+)/i; // No. of exers  = 4
    static readonly AMBIENT_PURGE = /^Ambt\s+purge\s*=\s*(?<ambientPurgeTime>\d+)/i; // Ambt purge   = 4 sec.
    static readonly AMBIENT_SAMPLE = /^Ambt\s+sample\s*=\s*(?<ambientSampleTime>\d+)/i; // Ambt sample  = 5 sec.
    static readonly MASK_PURGE = /^Mask\s+purge\s*=\s*(?<maskPurgeTime>\d+)/i; // Mask purge  = 11 sec.
    // Mask sample 1 = 40 sec.
    static readonly MASK_SAMPLE = /^Mask\s+sample\s+(?<exerciseNumber>\d+)\s*=\s*(?<maskSampleTime>\d+)/i;
    static readonly DIP_SWITCH = /^DIP\s+switch\s+=\s+(?<dipSwitchBits>\d+)/i; // DIP switch  = 10111111

    // Conc.      0.00 #/cc
    static readonly COUNT_READING = /^(?<timestamp>\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d.\d{3}Z)?\s*Conc\.\s+(?<concentration>[\d.]+)/i;
    static readonly NEW_TEST = /^NEW\s+TEST\s+PASS\s*=\s*(?<passLevel>\d+)/i; // NEW TEST PASS =  100
    static readonly AMBIENT_READING = /^Ambient\s+(?<concentration>[\d.]+)/i; // Ambient   2290 #/cc
    static readonly MASK_READING = /^Mask\s+(?<concentration>[\d+.]+)/i; // Mask    5.62 #/cc
    // FF  1    352 PASS
    static readonly FIT_FACTOR = /^FF\s+(?<exerciseNumber>\d+)\s+(?<fitFactor>[\d.]+)\s+(?<result>.+)/;
    static readonly TEST_TERMINATED = /^Test\s+Terminated/i; // Test Terminated
    // Overall FF    89 FAIL
    static readonly OVERALL_FIT_FACTOR = /^Overall\s+FF\s+(?<fitFactor>[\d.]+)\s+(?<result>.+)/i;
    // 970/cc Low Particle Count
    static readonly LOW_PARTICLE_COUNT = /^(?<concentration>\d+)\/cc\s+Low\s+Particle\s+Count/i;
    static readonly BATTERY_AND_PULSE_STATUS = /^R(?<battery>.)(?<pulse>.)$/;  // RGG
    static readonly VOLTAGE_INFO = /^(?<component>C[SBTCLPD])(?<value>.+)$/;

    static readonly Setting = class {
        static readonly Timing = class {
            static readonly AMBIENT_PURGE = /^STPA\s+(?<duration>\d+)/i; // STPA 000vv
            static readonly MASK_PURGE = /^STPM\s+(?<duration>\d+)/i; // STPM 000vv
            static readonly AMBIENT_SAMPLE = /^STA\s+(?<duration>\d+)/i // STA  000vv
            static readonly MASK_SAMPLE = /^STM(?<exercise_num>\d\d)(?<duration>\d+)/i; // STMxx000vv
        }
        static readonly FF_PASS_LEVEL = /^SP\s+(?<index>\d\d)(?<score>\d+)/i;  // SP xxvvvvv
        static readonly SERIAL_NUMBER = /^SS\s+(?<serial_number>\d+)/i; // SS vvvvv
        static readonly RUN_TIME_SINCE_FACTORY_SERVICE = /^SR\s+(?<runtime>\d+)/i; // SR vvvvv
        static readonly LAST_SERVICE_DATE = /^SD\s+0(?<month>\d\d)(?<year>\d\d)/i; // SD 0MMYY
    }
}

abstract class PortaCountEvent {
    protected _timestamp: number

    protected constructor() {
        this._timestamp = Date.now()
    }

    get timestamp() {
        return this._timestamp;
    }

    asOf(timestamp: number) {
        this._timestamp = timestamp
        return this;
    }
}

class LineReceivedEvent extends PortaCountEvent {
    readonly line: string

    constructor(line: string) {
        super();
        this.line = line;
    }
}

class SampleSourceChangedEvent extends PortaCountEvent {
    readonly sampleSource: SampleSource;

    constructor(sampleSource: SampleSource) {
        super();
        this.sampleSource = sampleSource
    }
}

class DataTransmissionStateChangedEvent extends PortaCountEvent {
    readonly dataTransmissionState: DataTransmissionState;

    constructor(state: DataTransmissionState) {
        super();
        this.dataTransmissionState = state;
    }
}

class ControlSourceChangedEvent extends PortaCountEvent {
    readonly source: ControlSource;

    constructor(source: ControlSource) {
        super();
        this.source = source;
    }
}

class TestStartedEvent extends PortaCountEvent {
    constructor() {
        super();
    }
}

export class ParticleConcentrationEvent extends PortaCountEvent {
    readonly sampleSource: SampleSource
    readonly controlSource: ControlSource
    readonly concentration: number
    readonly stddev?: number;

    constructor(concentration: number, sampleSource: SampleSource, controlSource: ControlSource, stddev?: number) {
        super();
        this.concentration = concentration;
        this.sampleSource = sampleSource
        this.controlSource = controlSource;
        this.stddev = stddev
    }

}

export class FitFactorResultsEvent extends PortaCountEvent {
    public readonly ff: number;
    public readonly exerciseNum: number | "Final";
    public readonly result: string;

    constructor(ff: number, exerciseNum: number | "Final", result: string) {
        super();
        this.ff = ff;
        this.exerciseNum = exerciseNum;
        this.result = result;
    }
}

class TestTerminatedEvent extends PortaCountEvent {
    constructor() {
        super();
    }
}

class TestCompletedEvent extends PortaCountEvent {
    constructor() {
        super();
    }
}

class ConnectionStatusChangedEvent extends PortaCountEvent {
    public readonly connectionStatus: ConnectionStatus;

    constructor(connectionStatus: ConnectionStatus) {
        super();
        this.connectionStatus = connectionStatus;
    }
}

class ActivityChangedEvent extends PortaCountEvent {
    public readonly activity: Activity;

    constructor(activity: Activity) {
        super();
        this.activity = activity;
    }
}

class SettingsChangedEvent extends PortaCountEvent {
    public readonly settings: PortaCountSettings

    constructor(settings: PortaCountSettings) {
        super();
        this.settings = settings;
    }
}

class StateChangedEvent extends PortaCountEvent {
    public readonly state: PortaCountState;

    constructor(state: PortaCountState) {
        super();
        this.state = state;
    }
}

type MatchGroups = { [key: string]: string }

export class PortaCountSettings {
    numExercises: number = 4;
    ambientPurge: number = 0;
    maskPurge: number = 0;
    ambientSample: number = 0;
    maskSample: Map<number, number> = new Map(); // exercise number -> duration
    fitFactorPassLevel: Map<number, number> = new Map(); // index -> score
    serialNumber: string = "?";
    runTimeSinceFactoryServiceSeconds: number = 0; // convert this from 10 second increments to seconds
    lastServiceDate: Date = new Date(0); // convert this to a Date
}

/**
 * Looks like a SerialPort
 */
// export type SerialPortEtc = SerialPort | UsbSerialPort;
export type SerialPortLike = {
    open(options: SerialOptions): Promise<void>;
    getInfo(): SerialPortInfo;
    connected: boolean;
    readonly readable: ReadableStream<Uint8Array> | null;
    readonly writable: WritableStream<Uint8Array> | null;
}

export interface PortaCountListener {
    lineReceived?(line: string): void;
    sampleSourceChanged?(source: SampleSource): void;
    dataTransmissionStateChanged?(dataTransmissionState: DataTransmissionState): void;
    controlSourceChanged?(source: ControlSource): void;
    testStarted?(timestamp: number): void;
    fitFactorResultsReceived?(results: FitFactorResultsEvent): void;
    testTerminated?(): void; // aborted
    testCompleted?(): void; // completed normally
    particleConcentrationReceived?(concentrationEvent: ParticleConcentrationEvent): void;
    connectionStatusChanged?(connectionStatus: ConnectionStatus): void;
    activityChanged?(activity: Activity): void;
    stateChanged?(state: PortaCountState): void;
    settingsChanged?(settings: PortaCountSettings): void;
}

export class PortaCountClient8020 {
    private readonly _externalController: ExternalController
    private readonly listeners: PortaCountListener[] = [];
    private _state: PortaCountState = new PortaCountState()
    private _settings: PortaCountSettings = new PortaCountSettings()
    private _baudRate: number = 1200;
    private _syncOnConnect: boolean = false;
    private readonly baudRateDetector: BaudRateDetector;

    constructor() {
        console.log("PortaCountClient8020 constructor called")
        this._externalController = new ExternalController(this)
        this.addListener(this.stateUpdatingListener) // todo: directly update state? since it's internal anyway?
        this.baudRateDetector = new BaudRateDetector()
    }

    get baudRate(): number {
        return this._baudRate;
    }

    set baudRate(value: number) {
        this._baudRate = value;
    }

    get syncOnConnect(): boolean {
        return this._syncOnConnect;
    }

    set syncOnConnect(value: boolean) {
        this._syncOnConnect = value;
    }

    get externalController(): ExternalController {
        return this._externalController;
    }

    get settings(): PortaCountSettings {
        return this._settings;
    }

    get state(): PortaCountState {
        return this._state;
    }

    private setActivity(activity: Activity): void {
        this.state.activity = activity;
        this.dispatch(new ActivityChangedEvent(activity));
    }

    private readonly stateUpdatingListener: PortaCountListener = {
        // TODO: refactor this. listening to self is kinda weird.
        connectionStatusChanged: (connectionStatus: ConnectionStatus) => {
            APP_SETTINGS_CONTEXT.saveSetting(AppSettings.CONNECTION_STATUS, connectionStatus);
            this.state.connectionStatus = connectionStatus;
        },
        controlSourceChanged: (source: ControlSource) => {
            this.state.controlSource = source
        },
        sampleSourceChanged: (source: SampleSource) => {
            this.state.sampleSource = source
        },
        dataTransmissionStateChanged: (dataTransmissionState: DataTransmissionState) => {
            this.state.dataTransmissionState = dataTransmissionState;
        },
        lineReceived: (line: string) => {
            this.state.lastLine = line;
        }
    }

    private async monitor(reader: ReadableStreamDefaultReader<Uint8Array>) {
        this.dispatch(new ConnectionStatusChangedEvent(ConnectionStatus.WAITING))
        for await (const line of getLines(reader)) {
            if (this.state.connectionStatus === ConnectionStatus.WAITING) {
                // TODO: look at AppSettings.CONNECTION_STATUS instead? or wrap the status check in a util function
                this.dispatch(new ConnectionStatusChangedEvent(ConnectionStatus.RECEIVING))
            }
            // todo: remove non-printable characters from line. sometimes these are received and mess up the parsing.
            // usually they are leading characters
            if (line.trim().length > 0) {
                // we only care about non-empty lines
                this.dispatch(new LineReceivedEvent(line));
                this.processLine(line);
            }
        }
        this.setActivity(Activity.Disconnected)
        this.dispatch(new ConnectionStatusChangedEvent(ConnectionStatus.DISCONNECTED))
        console.log("monitor reached end of reader");
    }

    public addListener(listener: PortaCountListener): void {
        this.listeners.push(listener);
    }

    public removeListener(listener: PortaCountListener): void {
        this.listeners.filter((value, index, array) => {
            if (value === listener) {
                array.splice(index, 1);
                return true
            }
            return false;
        })
    }

    private dispatch(event: PortaCountEvent) {
        // console.debug(`dispatch ${event.constructor.name}`);
        this.listeners.forEach((listener) => {
            // console.debug(`dispatch event ${event.constructor.name}`)
            switch (event.constructor.name) {
                case ActivityChangedEvent.name: {
                    if (listener.activityChanged) {
                        listener.activityChanged((event as ActivityChangedEvent).activity)
                    }
                    break;
                }
                case ParticleConcentrationEvent.name: {
                    if (listener.particleConcentrationReceived) {
                        listener.particleConcentrationReceived((event as ParticleConcentrationEvent))
                    }
                    break;
                }
                case TestTerminatedEvent.name: {
                    this.setActivity(Activity.Idle)
                    if (listener.testTerminated) {
                        listener.testTerminated();
                    }
                    break;
                }
                case TestCompletedEvent.name: {
                    this.setActivity(Activity.Idle)
                    if (listener.testCompleted) {
                        listener.testCompleted();
                    }
                    break;
                }
                case FitFactorResultsEvent.name: {
                    if (listener.fitFactorResultsReceived) {
                        listener.fitFactorResultsReceived(event as FitFactorResultsEvent);
                    }
                    break;
                }
                case TestStartedEvent.name: {
                    if (listener.testStarted) {
                        listener.testStarted(event.timestamp)
                    }
                    break;
                }
                case ControlSourceChangedEvent.name: {
                    if (listener.controlSourceChanged) {
                        listener.controlSourceChanged((event as ControlSourceChangedEvent).source);
                    }
                    break;
                }
                case DataTransmissionStateChangedEvent.name: {
                    if (listener.dataTransmissionStateChanged) {
                        listener.dataTransmissionStateChanged((event as DataTransmissionStateChangedEvent).dataTransmissionState);
                    }
                    break;
                }
                case LineReceivedEvent.name: {
                    if (listener.lineReceived) {
                        listener.lineReceived((event as LineReceivedEvent).line);
                    }
                    break;
                }
                case SampleSourceChangedEvent.name: {
                    if (listener.sampleSourceChanged) {
                        listener.sampleSourceChanged((event as SampleSourceChangedEvent).sampleSource);
                    }
                    break;
                }
                case ConnectionStatusChangedEvent.name: {
                    if (listener.connectionStatusChanged) {
                        const csce = event as ConnectionStatusChangedEvent;
                        // NOTE: this event is triggered by the setter, so to avoid infinite loop, don't set state here
                        listener.connectionStatusChanged(csce.connectionStatus)
                    }
                    break;
                }
                case StateChangedEvent.name: {
                    if (listener.stateChanged) {
                        listener.stateChanged((event as StateChangedEvent).state);
                    }
                    break;
                }
                case SettingsChangedEvent.name: {
                    if (listener.settingsChanged) {
                        listener.settingsChanged((event as SettingsChangedEvent).settings)
                    }
                    break;
                }
                default: {
                    console.error(`unsupported event: ${JSON.stringify(event)}`)
                }
            }
        })
    }

    /**
     * handles incoming particle concentrations
     * @param matchGroups
     * @param controlSource
     * @private
     */
    private processConcentration(matchGroups: MatchGroups, controlSource: ControlSource) {
        if (this.state.activity !== Activity.Testing) {
            // in internal control mode, we get concentration readings used for each exercise
            this.setActivity(Activity.Counting)
        }
        const concentration = Number(matchGroups.concentration);
        const sampleSource = this.state.sampleSource
        const event = new ParticleConcentrationEvent(concentration, sampleSource, controlSource);
        const timestamp = matchGroups.timestamp;
        if (timestamp) {
            event.asOf(Date.parse(timestamp))
        }
        this.dispatch(event);
    }

    private readonly orderedLineProcessors: [RegExp, (matchGroups: MatchGroups) => void][] = [
        // order these with most frequent patterns first
        // external particle counts are every second
        [ExternalControlResponsePatterns.PARTICLE_COUNT, (matchGroups) => {
            this.processConcentration(matchGroups, ControlSource.External)
        }],
        // internal particle counts are every 2 seconds
        [Patterns.COUNT_READING, (matchGroups) => {
            this.processConcentration(matchGroups, ControlSource.Internal)
        }],
        // ambient, mask, and ff are about the same. one per exercise.
        [Patterns.AMBIENT_READING, (matchGroups) => {
            const concentration = matchGroups.concentration;
            if (concentration) {
                this.dispatch(new ParticleConcentrationEvent(Number(concentration), SampleSource.AMBIENT, ControlSource.Internal));
            }
        }],
        [Patterns.MASK_READING, (matchGroups) => {
            const concentration = matchGroups.concentration;
            if (concentration) {
                this.dispatch(new ParticleConcentrationEvent(Number(concentration), SampleSource.MASK, ControlSource.Internal));
            }
        }],
        [Patterns.FIT_FACTOR, (matchGroups) => {
            // internally driven exercise results received.
            this.setActivity(Activity.Testing)
            const ff = Number(matchGroups.fitFactor);
            const exerciseNum = Number(matchGroups.exerciseNumber);
            const result = matchGroups.result;
            this.dispatch(new FitFactorResultsEvent(ff, exerciseNum, result));
            if (this._settings.numExercises < exerciseNum) {
                // auto-detect num exercises since it's only available on boot
                this._settings.numExercises = exerciseNum;
                // maybe need a NumExercisesChangedEvent?
                this.dispatch(new SettingsChangedEvent(this._settings))
            }
        }],
        // one of these per test
        [Patterns.NEW_TEST, () => {
            this.setActivity(Activity.Testing)
            this.dispatch(new TestStartedEvent())
        }],
        [Patterns.TEST_TERMINATED, () => {
            // aborted
            this.setActivity(Activity.Idle)
            this.dispatch(new TestTerminatedEvent())
        }],
        [Patterns.OVERALL_FIT_FACTOR, (matchGroups) => {
            this.setActivity(Activity.Idle)
            const ff = Number(matchGroups.fitFactor);
            const result: string = matchGroups.result;
            this.dispatch(new FitFactorResultsEvent(ff, "Final", result))
            this.dispatch(new TestCompletedEvent())
        }],

        // switching sample source should be about the same. ranking with above depends on protocol and external use
        [ExternalControlResponsePatterns.SAMPLING_FROM_MASK, () => {
            this.dispatch(new SampleSourceChangedEvent(SampleSource.MASK))
        }],
        [ExternalControlResponsePatterns.SAMPLING_FROM_AMBIENT, () => {
            this.dispatch(new SampleSourceChangedEvent(SampleSource.AMBIENT))
        }],

        // these are rarely used
        [ExternalControlResponsePatterns.EXTERNAL_CONTROL, () => {
            this.dispatch(new ControlSourceChangedEvent(ControlSource.External))
        }],
        [ExternalControlResponsePatterns.INTERNAL_CONTROL, () => {
            this.dispatch(new ControlSourceChangedEvent(ControlSource.Internal))
        }],
        [ExternalControlResponsePatterns.DATA_TRANSMISSION_DISABLED, () => {
            this.dispatch(new DataTransmissionStateChangedEvent(DataTransmissionState.Paused))
        }],
        [ExternalControlResponsePatterns.DATA_TRANSMISSION_ENABLED, () => {
            this.dispatch(new DataTransmissionStateChangedEvent(DataTransmissionState.Transmitting))
        }],

        // settings are pulled once per connection normally
        // there are many pass levels and timings
        [Patterns.Setting.FF_PASS_LEVEL, (matchGroups) => {
            this._settings.fitFactorPassLevel.set(Number(matchGroups.index), Number(matchGroups.score))
            this.dispatch(new SettingsChangedEvent(this._settings))
        }],
        [Patterns.Setting.Timing.MASK_SAMPLE, (matchGroups) => {
            this._settings.maskSample.set(Number(matchGroups.exercise_num), Number(matchGroups.duration))
            this.dispatch(new SettingsChangedEvent(this._settings))
        }],
        // there are fewer component voltages than pass levels, exercise num
        [Patterns.VOLTAGE_INFO, (matchGroups) => {
            this._state.componentVoltages.set(matchGroups.component, Number(matchGroups.value))
            this.dispatch(new StateChangedEvent(this._state))
        }],
        // only line for each of these settings
        [Patterns.Setting.Timing.MASK_PURGE, (matchGroups) => {
            this._settings.maskPurge = Number(matchGroups.duration)
            this.dispatch(new SettingsChangedEvent(this._settings))
        }],
        [Patterns.Setting.Timing.AMBIENT_SAMPLE, (matchGroups) => {
            this._settings.ambientSample = Number(matchGroups.duration)
            this.dispatch(new SettingsChangedEvent(this._settings))
        }],
        [Patterns.Setting.Timing.AMBIENT_PURGE, (matchGroups) => {
            this._settings.ambientPurge = Number(matchGroups.duration)
            this.dispatch(new SettingsChangedEvent(this._settings))
        }],
        [Patterns.BATTERY_AND_PULSE_STATUS, (matchGroups) => {
            this._state.batteryStatus = matchGroups.battery === "G" ? "Good" : "Bad"
            this._state.pulseStatus = matchGroups.pulse === "G" ? "Good" : "Bad"
            this.dispatch(new StateChangedEvent(this._state))
        }],
        [Patterns.Setting.SERIAL_NUMBER, (matchGroups) => {
            this._settings.serialNumber = matchGroups.serial_number
            this.dispatch(new SettingsChangedEvent(this._settings))
        }],
        [Patterns.Setting.LAST_SERVICE_DATE, (matchGroups) => {
            const monthIndex = Number(matchGroups.month) - 1
            const yy = Number(matchGroups.year);
            const yearGuess = yy + (yy < 61 ? 2000 : 1900) // TSI founded in 1961; todo: revisit this after 2060
            this._settings.lastServiceDate = new Date(yearGuess, monthIndex)
            this.dispatch(new SettingsChangedEvent(this._settings))
        }],
        [Patterns.Setting.RUN_TIME_SINCE_FACTORY_SERVICE, (matchGroups) => {
            // this is in 10 minute increments
            this._settings.runTimeSinceFactoryServiceSeconds = 10 * 60 * Number(matchGroups.runtime)
            this.dispatch(new SettingsChangedEvent(this._settings))
        }],
        // these are only available as part of bootup sequence, so even more infrequent
        [Patterns.NUM_EXERCISES, (matchGroups) => {
            this._settings.numExercises = Number(matchGroups.num_exercises);
            this.dispatch(new SettingsChangedEvent(this._settings))
        }],
    ];


    // visible-for-testing
    public processLine(rawLine: string) {
        if (rawLine.length === 0) {
            return;
        }

        const line: string = rawLine

        const firstMatch = this.orderedLineProcessors.find(([regexp, handler]) => {
            const match = regexp.exec(line)
            if (match) {
                // dispatch
                if (match.groups) {
                    handler(match.groups)
                } else {
                    // some patterns don't need groups
                    handler({})
                }
                return true
            } else {
                return false
            }
        })
        if (firstMatch) {
            return
        }

        // todo: handle errors and write protect errors
        if (line.match(/^E/)) {
            // error
            // todo: put this above in the main parser section?
            console.warn(`error: ${line}`)
        } else if (line.match(/^W/)) {
            // write protected
            console.warn(`write protected: ${line}`)
        } else {
            console.warn(`portacount client: no parser for line: ${line}`)
        }
    }

    /**
     * Main entry point. This is where we connect to the device.
     * @param port
     */
    public connect(port: SerialPortLike) {
        // todo: maybe break this out?
        console.debug(`portacount client connect(${JSON.stringify(port)})`)
        if (port.connected && port.readable) {
            // webserial ports seem to be connected even if not opened.
            // so also check that we have a readable here which indicates that we are opened.
            console.debug("portacount client connect, connected; setting up reader and writer")
            if (port.readable) {
                this.monitor(port.readable.getReader());
            }
            if (port.writable) {
                this.externalController.setWriter(port.writable.getWriter());
                if (this.syncOnConnect) {
                    console.debug("sync on connect")
                    this.waitUntilPortaCountIsReady()
                        .then(() => {
                            this.syncState()
                        })
                        .catch((err) => {
                            console.warn(err)
                        })
                }
            }
        } else {
            console.debug("portacount client connect not connected, attempting to connect...")

            if (APP_SETTINGS_CONTEXT.getSetting(AppSettings.AUTO_DETECT_BAUD_RATE) && port.readable) {
                this.baudRateDetector.openPortWithAutoDetectedBaudRate(port).then(() => {
                    this.connect(port)
                }).catch((err) => {console.log(err)})
            } else {

                port.open({baudRate: Number(this.baudRate)}).then(() => {
                    console.log(`port opened: ${JSON.stringify(port.getInfo())}`)
                    this.connect(port)
                })
            }
        }
    }


    /**
     * Wait until initial boot up is complete. Switch to External control mode.
     * @private
     */
    private async waitUntilPortaCountIsReady() {
        return new Promise<void>((resolve, reject) => {
            const startTime = Date.now();
            const intervalId = setInterval(() => {
                const elapsed = Date.now() - startTime;
                console.debug(`elapsed ${elapsed}`)
                if (elapsed > 65000) {
                    // more than 65 seconds have elapsed, something is wrong
                    clearInterval(intervalId)
                    reject(`waited too long for PortaCount to become ready. Elapsed ${formatDuration(elapsed)}.`)
                } else {
                    // todo: maybe can check for N95 companion since that doesn't change the control source
                    // this.externalController.sendCommand(ExternalController.TEST_TO_SEE_N95_COMPANION_IS_ATTACHED, 0)
                    this.externalController.sendCommand(ExternalController.INVOKE_EXTERNAL_CONTROL, 0)
                }
            }, 1000)
            const ready = () => {
                this.removeListener(connectedListener)
                clearInterval(intervalId)
                console.debug("PortaCount is ready.")
                resolve()

            }
            const connectedListener: PortaCountListener = {
                controlSourceChanged: (source: ControlSource) => {
                    if (source === ControlSource.External) {
                        // we're ready
                        ready()
                    }
                },
                lineReceived: (line) => {
                    // we're connected. could be during the startup sequence, or in normal operation
                    if (ExternalControlResponsePatterns.N95_COMPANION_PATTERN.exec(line)) {
                        // got a response to our command
                        ready()
                    }
                }
            };
            this.addListener(connectedListener)
        })
    }

    /**
     * todo: the app needs to see data from the portacount to know it's connected
     * properly. edge cases:
     *  1. connected to portacount already in external control mode, but data transmission is turned off
     * (won't receive data)
     *  2. connected to portacount in internal control mode, but is not counting (won't
     * receive data)
     *  3. connected to portacount in external control mode but driver doesn't support
     * setting CTS properly and cable has CTS line connected (won't receive data)
     *
     * Workaround for 1 and 2 is to switch to external control mode, then turn on data
     * transmission.
     */
    private syncState() {
        this.externalController.enableDataTransmission()
        this.externalController.requestRuntimeStatus()
        this.externalController.requestSettings()
        this.externalController.sendCommand(ExternalController.REQUEST_VOLTAGE_INFO)
        // try to detect when we're done with sync
        // todo: add listener for the beeps
        this.externalController.beep(1)
        this.externalController.beep(1)
        this.externalController.beep(1)
        // todo: use settings to determine: if we start in external or internal control
        // mode todo: synchronize state to portacount state by interrogation todo:
        // synchronize status to portacount (create a status widget)
    }
}

