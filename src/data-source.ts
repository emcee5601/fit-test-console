/**
 * Where the data stream is coming from.
 */
export enum DataSource {
    NotInitialized = "NotInitialized",
    Simulator = "Simulator",
    SimulatorFile = "Simulator-file",
    WebSerial = "WebSerial",
    WebUsbSerial = "WebUsbSerial",
    Manual = "Manual", // a human typed it in
}
