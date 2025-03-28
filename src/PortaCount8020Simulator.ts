/**
 * Pretends to be a PortaCount8020
 */
import {PortaCountState, SerialPortLike} from "./portacount-client-8020.ts";
import {logSource} from "./datasource-helper.ts";
import {SampleSource} from "./simple-protocol.ts";
import {ExternalController} from "./external-control.tsx";
import {ControlSource} from "./control-source.ts";

export class PortaCount8020Simulator {
    private readonly reader: ReadableStream<Uint8Array>;
    private _readerController: ReadableStreamDefaultController | undefined;
    private readonly writer: WritableStream<Uint8Array>;
    private readonly _port: SerialPortLike;
    private readonly _portaCountState: PortaCountState = new PortaCountState();
    private baudRate: number = 0
    private readonly encoder: TextEncoder = new TextEncoder();
    private _started: boolean = false;
    private bias: number = 0; // how much to shift concentration values returned by simulator. as a percentage. + or -

    constructor() {
        this.reader = this.createReader();
        this.writer = this.createWriter();
        this._port = {
            readable: this.reader,
            writable: this.writer,
            getInfo(): SerialPortInfo {
                return {};
            },
            open: (options: SerialOptions): Promise<void> => {
                if(!this.baudRate) {
                    this.baudRate = options.baudRate
                }
                return Promise.resolve();
            }
        }
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
        const simulator = this as PortaCount8020Simulator;
        // todo: have a way to stop and start the concentration generation. when a different source is connected, disconnect from this one.
        // when there are no readers, or readers are not reading, stop generating concentrations
        let intervalId: NodeJS.Timeout;
        let isPulling: boolean = false;
        return new ReadableStream({
            pull: (controller: ReadableStreamDefaultController<Uint8Array>) => {
                // flag that pull was called
                // restart interval if there is no interval
                if(controller) {
                    // do nothing
                }
                isPulling = true;
            },

            start: (controller: ReadableStreamDefaultController<Uint8Array>) => {
                // this is an initializer
                console.debug("PortaCountSimulator started")
                simulator._readerController = controller;

                function loop() {
                    // todo: start and stop the interval instead
                    if (simulator._started) {
                        const concentration = simulator.generateConcentration();
                        console.debug(`simulator loop: ${concentration}, isPulling? ${isPulling}`)
                        if(isPulling) {
                            isPulling = false; // only enqueue if something wanted enqueuing
                            controller.enqueue(simulator.encoder.encode(`${concentration}\n`))
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
                    // todo: check for multiple lines. look for last match, split everything before the last match by newlinesRecexp
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

    private randomizeBias() {
        const maxBias = 30; // percentage points
        this.bias = (Math.random() * maxBias - (maxBias/2))/100;
    }

    private executeCommand(command: string) {
        this.randomizeBias()
        switch(command) {
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
                if(this._portaCountState.controlSource === ControlSource.External) {
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
        }
    }


    private generateConcentration(): string {
        let concentration: number
        if (this._portaCountState.sampleSource === SampleSource.MASK) {
            // 100 +/- 10
            concentration = Math.round(Math.random() * 10 + 100)
        } else {
            // ambient
            // 10,000 +/- 200
            concentration = Math.round(Math.random() * 200 + 10000)
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
