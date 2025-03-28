import {getLines} from "./datasource-helper.ts";
import {ReadableStreamDefaultReader} from "node:stream/web";
import {ExternalController} from "./external-control.tsx";
import {SampleSource} from "./simple-protocol.ts";
import {ControlSource} from "./control-source.ts";


class Patterns {
    static PORTACOUNT_VERSION = /^PORTACOUNT\s+PLUS\S+PROM\S+(?<version>.+)/i; // PORTACOUNT PLUS PROM V1.7
    static COPYRIGHT = /^COPYRIGHT.+/i; // COPYRIGHT(c)1992 TSI INC
    static LICENSE = /^ALL\s+RIGHTS\s+RESERVED/i; // ALL RIGHTS RESERVED
    static SERIAL_NUMBER = /^Serial\s+Number\s+(?<serialNumber>\d+)/i; // Serial Number 17754
    static PASS_LEVEL = /^FF\s+pass\s+level\s+(?<passLevel>\d+)/i; // FF pass level = 100
    static NUM_EXERCISES = /^No\.\s+of\s+exers\s*=\s*(?<numExercises>\d+)/i; // No. of exers  = 4
    static AMBIENT_PURGE = /^Ambt\s+purge\s*=\s*(?<ambientPurgeTime>\d+)/i; // Ambt purge   = 4 sec.
    static AMBIENT_SAMPLE = /^Ambt\s+sample\s*=\s*(?<ambientSampleTime>\d+)/i; // Ambt sample  = 5 sec.
    static MASK_PURGE = /^Mask\s+purge\s*=\s*(?<maskPurgeTime>\d+)/i; // Mask purge  = 11 sec.
    static MASK_SAMPLE = /^Mask\s+sample\s+(?<exerciseNumber>\d+)\s*=\s*(?<maskSampleTime>\d+)/i; // Mask sample 1 = 40 sec.
    static DIP_SWITCH = /^DIP\s+switch\s+=\s+(?<dipSwitchBits>\d+)/i; // DIP switch  = 10111111
    static COUNT_READING = /^(?<timestamp>\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d.\d{3}Z)?\s*Conc\.\s+(?<concentration>[\d.]+)/i; // Conc.      0.00 #/cc
    static NEW_TEST = /^NEW\s+TEST\s+PASS\s*=\s*(?<passLevel>\d+)/i; // NEW TEST PASS =  100
    static AMBIENT_READING = /^Ambient\s+(?<concentration>[\d.]+)/i; // Ambient   2290 #/cc
    static MASK_READING = /^Mask\s+(?<concentration>[\d+.]+)/i; // Mask    5.62 #/cc
    static FIT_FACTOR = /^FF\s+(?<exerciseNumber>\d+)\s+(?<fitFactor>[\d.]+)\s+(?<result>.+)/; // FF  1    352 PASS
    static TEST_TERMINATED = /^Test\s+Terminated/i; // Test Terminated
    static OVERALL_FIT_FACTOR = /^Overall\s+FF\s+(?<fitFactor>[\d.]+)\s+(?<result>.+)/i; // Overall FF    89 FAIL
    static LOW_PARTICLE_COUNT = /^(?<concentration>\d+)\/cc\s+Low\s+Particle\s+Count/i; // 970/cc Low Particle Count
}

export class ExternalControlPatterns {
    // external control response patterns
    // 2024-10-24T17:38:02.876Z 005138.88
    static PARTICLE_COUNT = /^(?<timestamp>\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d.\d{3}Z)?\s*(?<concentration>\d+\.\d+)\s*/; // 006408.45
    static SAMPLING_FROM_MASK = /^VF$/;  // VF
    static SAMPLING_FROM_AMBIENT = /^VN$/;  // VN
    static DATA_TRANSMISSION_DISABLED = /^ZD$/; // ZD
    static DATA_TRANSMISSION_ENABLED = /^ZE$/; // ZE
    static EXTERNAL_CONTROL = /^(OK|EJ)$/; // OK.  EJ seems to be if it's already in external control mode
    static INTERNAL_CONTROL = /^G$/; // G
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

    constructor(concentration: number, sampleSource: SampleSource, controlSource: ControlSource) {
        super();
        this.concentration = concentration;
        this.sampleSource = sampleSource
        this.controlSource = controlSource;
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

class ConnectionStatusChangedEvent extends PortaCountEvent {
    public readonly connectionStatus: ConnectionStatus;

    constructor(connectionStatus: ConnectionStatus) {
        super();
        this.connectionStatus = connectionStatus;
    }
}

export enum DataTransmissionState {
    Paused = "Paused",
    Transmitting = "Transmitting",
}

export enum Activity {
    Idle = "Idle",
    Testing = "Testing",
    Counting = "Counting",
    Disconnected = "Disconnected",
}

export class PortaCountState {
    private _connectionStatus: ConnectionStatus = ConnectionStatus.DISCONNECTED;
    private _controlSource: ControlSource = ControlSource.Internal;
    private _sampleSource: SampleSource = SampleSource.MASK;
    private _dataTransmissionState: DataTransmissionState = DataTransmissionState.Transmitting;
    private _activity: Activity = Activity.Idle;
    private _lastLine: string = "";

    get connectionStatus(): ConnectionStatus {
        return this._connectionStatus;
    }

    set connectionStatus(value: ConnectionStatus) {
        this._connectionStatus = value;
    }

    get controlSource(): ControlSource {
        return this._controlSource;
    }

    set controlSource(value: ControlSource) {
        this._controlSource = value;
    }

    get sampleSource(): SampleSource {
        return this._sampleSource;
    }

    set sampleSource(value: SampleSource) {
        this._sampleSource = value;
    }

    get dataTransmissionState(): DataTransmissionState {
        return this._dataTransmissionState;
    }

    set dataTransmissionState(value: DataTransmissionState) {
        this._dataTransmissionState = value;
    }

    get activity(): Activity {
        return this._activity;
    }

    set activity(value: Activity) {
        this._activity = value;
    }

    get lastLine(): string {
        return this._lastLine;
    }

    set lastLine(value: string) {
        this._lastLine = value;
    }
}

/**
 * Looks like a SerialPort
 */
// export type SerialPortEtc = SerialPort | UsbSerialPort;
export type SerialPortLike = {
    open(options: SerialOptions): Promise<void>;
    getInfo(): SerialPortInfo;
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

    testTerminated?(): void;

    particleConcentrationReceived?(concentrationEvent: ParticleConcentrationEvent): void;

    connectionStatusChanged?(connectionStatus: ConnectionStatus): void;
}

export class PortaCountClient8020 {
    private readonly _externalController: ExternalController
    private readonly listeners: PortaCountListener[] = [];
    private _state: PortaCountState = new PortaCountState()

    constructor() {
        console.log("PortaCountClient8020 constructor called")
        this._externalController = new ExternalController(this)
        this.addListener(this.stateUpdatingListener) // todo: directly update state? since it's internal anyway?
    }

    get externalController(): ExternalController {
        return this._externalController;
    }

    get state(): PortaCountState {
        return this._state;
    }

    set state(value: PortaCountState) {
        this._state = value;
    }

    private readonly stateUpdatingListener: PortaCountListener = {
        connectionStatusChanged: (connectionStatus: ConnectionStatus) => {
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
        particleConcentrationReceived: (concentrationEvent: ParticleConcentrationEvent) => {
            this.updateActivity(concentrationEvent);
        },
        testTerminated: () => {
            this.state.activity = Activity.Idle;
        },
        testStarted: () => {
            this.state.activity = Activity.Testing;
        },
        fitFactorResultsReceived: () => {
            this.state.activity = Activity.Testing
        },
        lineReceived: (line: string) => {
            this.state.lastLine = line;
        }
    }

    private updateActivity(concentrationEvent: ParticleConcentrationEvent) {
        this.state.sampleSource = concentrationEvent.sampleSource;
        this.state.controlSource = concentrationEvent.controlSource;
        if (concentrationEvent.controlSource === ControlSource.Internal) {
            if (this.state.sampleSource === SampleSource.AMBIENT) {
                this.state.activity = Activity.Testing
            } else {
                // if source is mask, we don't know if it's testing or counting. probably need to have an indicator
            }
        } else {
            // external control mode. we need something else to determine if we're testing or just counting
        }
    }

    private async monitor(reader: ReadableStreamDefaultReader<Uint8Array>) {
        this.dispatch(new ConnectionStatusChangedEvent(ConnectionStatus.WAITING))
        for await (const line of getLines(reader)) {
            // todo: remove non-printable characters from line. sometimes these are received and mess up the parsing. usually they are leading characters
            if (this.state.connectionStatus === ConnectionStatus.WAITING) {
                this.dispatch(new ConnectionStatusChangedEvent(ConnectionStatus.RECEIVING))
            }
            if (line.trim().length > 0) {
                // we only care about non-empty lines
                this.dispatch(new LineReceivedEvent(line));
                this.processLine(line);
            }
        }
        this.state.activity = Activity.Disconnected
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
        console.log(`dispatch ${event.constructor.name}`);
        this.listeners.forEach((listener) => {
            // console.log(`dispatch event ${event.constructor.name}`)
            switch (event.constructor.name) {
                case ParticleConcentrationEvent.name: {
                    if (listener.particleConcentrationReceived) {
                        listener.particleConcentrationReceived((event as ParticleConcentrationEvent))
                    }
                    break;
                }
                case TestTerminatedEvent.name: {
                    if (listener.testTerminated) {
                        this.state.activity = Activity.Idle
                        listener.testTerminated();
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
                        this.state.activity = Activity.Testing;
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
                default: {
                    console.log(`unsupported event: ${JSON.stringify(event)}`)
                }
            }
        })
    }

    // visible-for-testing
    public processLine(line: string) {
        if (line.length === 0) {
            return;
        }
        // TODO: strip out (and process) timestamp if present. inject timestamp if missing

        let match;
        if (line.match(ExternalControlPatterns.SAMPLING_FROM_MASK)) {
            this.dispatch(new SampleSourceChangedEvent(SampleSource.MASK));
        } else if (line.match(ExternalControlPatterns.SAMPLING_FROM_AMBIENT)) {
            this.dispatch(new SampleSourceChangedEvent(SampleSource.AMBIENT));
        } else if (line.match(ExternalControlPatterns.DATA_TRANSMISSION_DISABLED)) {
            this.dispatch(new DataTransmissionStateChangedEvent(DataTransmissionState.Paused))
        } else if (line.match(ExternalControlPatterns.DATA_TRANSMISSION_ENABLED)) {
            this.dispatch(new DataTransmissionStateChangedEvent(DataTransmissionState.Transmitting));
        } else if (line.match(ExternalControlPatterns.EXTERNAL_CONTROL)) {
            this.dispatch(new ControlSourceChangedEvent(ControlSource.External))
        } else if (line.match(ExternalControlPatterns.INTERNAL_CONTROL)) {
            this.dispatch(new ControlSourceChangedEvent(ControlSource.Internal))
        } else if ((match = line.match(Patterns.NEW_TEST))) {
            this.state.activity = Activity.Testing
            this.dispatch(new TestStartedEvent());
        } else if ((match = line.match(Patterns.AMBIENT_READING))) {
            this.state.activity = Activity.Counting
            const concentration = match.groups?.concentration;
            if (concentration) {
                this.dispatch(new ParticleConcentrationEvent(Number(concentration), SampleSource.AMBIENT, ControlSource.Internal));
            }
        } else if ((match = line.match(Patterns.MASK_READING))) {
            this.state.activity = Activity.Counting
            const concentration = match.groups?.concentration;
            if (concentration) {
                this.dispatch(new ParticleConcentrationEvent(Number(concentration), SampleSource.AMBIENT, ControlSource.Internal));
            }
        } else if ((match = line.match(Patterns.FIT_FACTOR))) {
            this.state.activity = Activity.Testing
            const ff = Number(match.groups?.fitFactor);
            const exerciseNum = Number(match.groups?.exerciseNumber || -1);
            const result = match.groups?.result || "unknown";
            this.dispatch(new FitFactorResultsEvent(ff, exerciseNum, result));
        } else if ((match = line.match(Patterns.OVERALL_FIT_FACTOR))) {
            this.state.activity = Activity.Idle
            const ff = Number(match.groups?.fitFactor);
            const result: string = match.groups?.result || "";
            this.dispatch(new FitFactorResultsEvent(ff, "Final", result))
        } else if ((match = line.match(Patterns.TEST_TERMINATED))) {
            this.state.activity = Activity.Idle
            this.dispatch(new TestTerminatedEvent());
        } else if ((match = line.match(Patterns.COUNT_READING) || line.match(ExternalControlPatterns.PARTICLE_COUNT))) {
            this.state.activity = Activity.Counting
            const concentration = Number(match.groups?.concentration);
            const source = this.state.sampleSource
            const controlSource = line.match(ExternalControlPatterns.PARTICLE_COUNT) ? ControlSource.External : ControlSource.Internal
            const event = new ParticleConcentrationEvent(concentration, source, controlSource);
            const timestamp = match.groups?.timestamp;
            if (timestamp) {
                event.asOf(Date.parse(timestamp))
            }
            this.dispatch(event);
        }
    }

    /**
     * Main entry point. This is where we connect to the device.
     * @param port
     */
    public connect(port: SerialPortLike) {
        if (port.readable) {
            this.monitor(port.readable.getReader());
        }
        if (port.writable) {
            this.externalController.setWriter(port.writable.getWriter());
        }

    }
}

export enum ConnectionStatus {
    DISCONNECTED = "Disconnected",
    WAITING = "Waiting for PortaCount",
    RECEIVING = "Receiving data",
}

export const PORTACOUNT_CLIENT_8020 = new PortaCountClient8020()
