type GoodBad = "Good" | "Bad" | "?"

export enum DataTransmissionState {
    Paused = "Paused",
    Transmitting = "Transmitting",
}

export enum ConnectionStatus {
    DISCONNECTED = "Disconnected",
    WAITING = "Waiting for PortaCount",
    RECEIVING = "Receiving data",
}

export enum Activity {
    Idle = "Idle",
    Testing = "Testing",
    Counting = "Counting",
    Disconnected = "Disconnected",
}

export enum SampleSource {
    MASK = "mask",
    AMBIENT = "ambient"
}

/**
 * Internal = PortaCount controls
 * External = External App controls
 * Manual = Human controls, most likely, manually entiring the results into the db
 */
export enum ControlSource {
    External = "External",
    Internal = "Internal",
    Manual = "Manual",
}

export class PortaCountState {
    private _connectionStatus: ConnectionStatus = ConnectionStatus.DISCONNECTED;
    private _controlSource: ControlSource = ControlSource.Internal;
    private _sampleSource: SampleSource = SampleSource.MASK;
    private _dataTransmissionState: DataTransmissionState = DataTransmissionState.Transmitting;

    private _batteryStatus: GoodBad = "?";
    private _pulseStatus: GoodBad = "?";
    private _componentVoltages: Map<string, number> = new Map()

    // derived
    private _lastLine: string = "";
    private _activity: Activity = Activity.Disconnected;

    get componentVoltages(): Map<string, number> {
        return this._componentVoltages;
    }

    get batteryStatus(): GoodBad {
        return this._batteryStatus;
    }

    set batteryStatus(value: GoodBad) {
        this._batteryStatus = value;
    }

    get pulseStatus(): GoodBad {
        return this._pulseStatus;
    }

    set pulseStatus(value: GoodBad) {
        this._pulseStatus = value;
    }

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
        // console.debug(`activity is now ${value}`)
    }

    get lastLine(): string {
        return this._lastLine;
    }

    set lastLine(value: string) {
        this._lastLine = value;
    }
}
