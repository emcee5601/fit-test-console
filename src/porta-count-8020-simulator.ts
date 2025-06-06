/**
 * Pretends to be a PortaCount8020
 */
import {PortaCountState, SerialPortLike} from "./portacount-client-8020.ts";
import {logSource} from "./datasource-helper.ts";
import {SampleSource} from "./simple-protocol.ts";
import {ExternalController} from "./external-control.ts";
import {ControlSource} from "./control-source.ts";

class SimulatorPort {
    readable: ReadableStream;
    writable: WritableStream;
    connected: boolean = false;

    constructor(readable: ReadableStream, writable: WritableStream) {
        this.readable = readable;
        this.writable = writable;
    }

    getInfo(): SerialPortInfo {
        return {usbVendorId:-1337};
    }

    open(options: SerialOptions): Promise<void> {
        console.debug(`todo: set simulator baud rate to ${options.baudRate}`)

        this.connected = true
        return Promise.resolve();
    }
}

export class PortaCount8020Simulator {
    private readonly reader: ReadableStream<Uint8Array>;
    private _readerController: ReadableStreamDefaultController | undefined;
    private readonly writer: WritableStream<Uint8Array>;
    private readonly _port: SerialPortLike;
    private readonly _portaCountState: PortaCountState = new PortaCountState();
    private readonly encoder: TextEncoder = new TextEncoder();
    private _started: boolean = false;
    private bias: number = 0; // how much to shift concentration values returned by simulator. as a percentage. + or -
    private baseConcentration: number = 0;
    private lastCommandTimeMs: number = 0;
    private targetMaskFF: number = 100;


    constructor() {
        this.reader = this.createReader();
        this.writer = this.createWriter();
        this._port = new SimulatorPort(this.reader, this.writer);
    }

    get port(): SerialPortLike {
        this._started = true;
        return this._port;
    }

    stop(): void {
        this.reader.cancel("stop")
    }

    private sendResponse(response: string) {
        const message = this.encoder.encode(response);
        this._readerController?.enqueue(message)
    }

    private createReader(): ReadableStream<Uint8Array> {
        /**
         * - counts should be produced every second and enqueued
         * - count values should be dependent on sample source
         * - responses to commands should be enqueued on demand
         */
        // todo: have a way to stop and start the concentration generation. when a different source is connected,
        // disconnect from this one. when there are no readers, or readers are not reading, stop generating
        // concentrations
        let intervalId: NodeJS.Timeout;
        let isPulling: boolean = false;
        return new ReadableStream({
            pull: (controller: ReadableStreamDefaultController<Uint8Array>) => {
                // flag that pull was called
                // restart interval if there is no interval
                if (controller) {
                    // do nothing
                }
                isPulling = true;
            },

            start: (controller: ReadableStreamDefaultController<Uint8Array>) => {
                // this is an initializer
                console.debug("PortaCountSimulator started")
                this._readerController = controller;

                const loop = () =>  {
                    // todo: start and stop the interval instead
                    if (this._started) {
                        const concentration = this.generateConcentration();
                        console.debug(`simulator loop: ${concentration}, isPulling? ${isPulling}`)
                        if (isPulling) {
                            isPulling = false; // only enqueue if something wanted enqueuing
                            controller.enqueue(this.encoder.encode(`${concentration}\n`))
                        }
                    }
                }

                intervalId = setInterval(loop, 1000);
            },

            cancel() {
                logSource(`cancel() called on underlying source`);
                if (intervalId) {
                    clearInterval(intervalId)
                }
            },
        });
    }

    createWriter(): WritableStream<Uint8Array> {
        const queuingStrategy = new CountQueuingStrategy({highWaterMark: 1});
        const decoder = new TextDecoder();
        const simulator = this as PortaCount8020Simulator
        const newlineRegexp = /\r\n|\n|\r/gm;

        let accumulator: string = ""
        return new WritableStream(
            {
                // Implement the sink
                write: (chunk: Uint8Array) => {
                    const data: string = decoder.decode(chunk);
                    console.debug(`writer got ${data}`)
                    accumulator += data
                    // todo: check for multiple lines. look for last match, split everything before the last match by
                    // newlinesRecexp
                    const match = newlineRegexp.exec(accumulator);
                    if (match) {
                        const command = accumulator.substring(0, match.index);
                        accumulator = accumulator.substring(newlineRegexp.lastIndex)
                        newlineRegexp.lastIndex = 0 // reset
                        // parse command
                        simulator.executeCommand(command);
                    }

                },
                close() {
                },
                abort(err) {
                    console.debug(`abort: ${err}`)
                },
            },
            queuingStrategy
        );
    }

    private random(): number {
        if (Date.now() - this.lastCommandTimeMs > 3 * 60 * 1000) {
            // more than 3 minutes has elapsed since the last command. We can reset the start point
            this.baseConcentration = (1 + 5 * Math.random()) * 1000
            this.targetMaskFF = (10 + 300 * Math.random())
            console.debug(`simulator resetting baseConcentration to ${this.baseConcentration}, targetMaskFF to ${this.targetMaskFF}`)
        }

        this.baseConcentration += Math.round(Math.random() * 200)
        return this.baseConcentration;
    }

    private randomize() {
        const maxBias = 30; // percentage points
        this.bias = (Math.random() * maxBias - (maxBias / 2)) / 100;
        this.lastCommandTimeMs = Date.now();
    }

    private executeCommand(command: string) {
        this.randomize()
        switch (command) {
            case ExternalController.REQUEST_RUNTIME_STATUS_OF_BATTERY_AND_SIGNAL_PULSE: {
                this.sendResponse("RGG\n")
                break;
            }
            case ExternalController.REQUEST_VOLTAGE_INFO: {
                [
                    "CS191",
                    "CB483",
                    "CT236",
                    "CC065",
                    "CL614",
                    "CP255",
                    "CD068",
                ].forEach((value) => {this.sendResponse(`${value}\n`)})
                break;
            }
            case ExternalController.REQUEST_SETTINGS: {
                [
                    "STPA 00004",
                    "STA  00005",
                    "STPM 00011",
                    "STM0100040",
                    "STM0200040",
                    "STM0300040",
                    "STM0400040",
                    "STM0500040",
                    "STM0600040",
                    "STM0700040",
                    "STM0800040",
                    "STM0900040",
                    "STM1000040",
                    "STM1100040",
                    "STM1200040",
                    "STM1300040",
                    "SP 0100100",
                    "SP 0200250",
                    "SP 0300500",
                    "SP 0401000",
                    "SP 0501250",
                    "SP 0601667",
                    "SP 0702000",
                    "SP 0804000",
                    "SP 0905000",
                    "SP 1006667",
                    "SP 1110000",
                    "SP 1200000",
                    "SS   17754",
                    "SR   00722",
                    "SD   00519",
                ].forEach((value) => {this.sendResponse(`${value}\n`)})
                break;
            }
            case ExternalController.SWITCH_VALVE_OFF: {
                // switch to mask
                this._portaCountState.sampleSource = SampleSource.MASK;
                this.sendResponse(ExternalController.SWITCH_VALVE_OFF)
                this.sendResponse("\n")
                break;
            }
            case ExternalController.SWITCH_VALVE_ON: {
                // switch to ambient
                this._portaCountState.sampleSource = SampleSource.AMBIENT;
                this.sendResponse(ExternalController.SWITCH_VALVE_ON)
                this.sendResponse("\n")
                break;
            }
            case ExternalController.INVOKE_EXTERNAL_CONTROL: {
                if (this._portaCountState.controlSource === ControlSource.External) {
                    this.sendResponse("EJ\n"); // already in external control mode
                } else {
                    this._portaCountState.controlSource = ControlSource.External
                    this.sendResponse("OK\n"); // switch mode to external
                }
                break;
            }
            case ExternalController.RELEASE_FROM_EXTERNAL_CONTROL: {
                // internal
                this._portaCountState.controlSource = ControlSource.Internal
                this.sendResponse("G\n")
                break;
            }
            default: {
                console.debug(`echoing back: ${command}`)
                this.sendResponse(`${command}\n`)
            }
        }
    }


    /**
     * Generate increasing concentrations so we can verify math downstream.
     * @private
     */
    private generateConcentration(): string {
        let concentration: number
        if (this._portaCountState.sampleSource === SampleSource.MASK) {
            concentration = this.random() / this.targetMaskFF
        } else {
            // ambient
            concentration = this.random()
        }

        // apply bias
        concentration = (1.0 - this.bias) * concentration

        let response: string
        if (this._portaCountState.controlSource === ControlSource.External) {
            // 006408.45
            response = `${concentration.toFixed(2).padStart(9, '0')}`
        } else {
            // Internal
            // Conc.      0.00 #/cc
            // Conc.     10200 #/cc
            // -----123456789012345
            response = `Conc.${concentration.toFixed(concentration < 10 ? 2 : 0).padStart(10, ' ')} #/cc`
        }
        return response;
    }
}
