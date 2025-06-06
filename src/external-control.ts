/**
 External control for the PortaCount 8020a
 The technical addendum describes the interface. Starts on page 13.
 https://tsi.com/getmedia/0d5db6cd-c54d-4644-8c31-40cc8c9d8a9f/PortaCount_Model_8020_Technical_Addendum_US?ext=.pdf
 */

import {SPEECH} from "./speech.ts";

import {ControlSource} from "./control-source.ts";
import {SampleSource} from "./simple-protocol.ts";
import {PortaCountClient8020, PortaCountListener} from "./portacount-client-8020.ts";

export class ExternalControlResponsePatterns {
    // 2024-10-24T17:38:02.876Z 005138.88
    static readonly PARTICLE_COUNT = /^(?<timestamp>\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d.\d{3}Z)?\s*(?<concentration>\d+\.\d+)\s*/; // 006408.45
    static readonly SAMPLING_FROM_MASK = /^VF$/;  // VF (manual says this should be VO, but not seen IRL)
    static readonly SAMPLING_FROM_AMBIENT = /^VN$/;  // VN
    static readonly DATA_TRANSMISSION_DISABLED = /^ZD$/; // ZD
    static readonly DATA_TRANSMISSION_ENABLED = /^ZE$/; // ZE
    static readonly EXTERNAL_CONTROL = /^(OK|EJ)$/; // OK.  EJ seems to be if it's already in external control mode
    static readonly INTERNAL_CONTROL = /^G$/; // G
    static readonly TURN_POWER_OFF = /^Y$/; // Y
    static readonly N95_COMPANION_PATTERN = /^Q(?<connected>[YN])/i; // QY or QN
    static readonly SETTINGS_PATTERN = /^S.+$/; // settings seem to start with S
    // E prefix is an error. Offending command is echoed back: E<bad_command>
    // W prefix means write protection is preventing command from executing. need no flip dip switch 4
}

export class ExternalController {
    static readonly INVOKE_EXTERNAL_CONTROL = "J";
    static readonly RELEASE_FROM_EXTERNAL_CONTROL = "G";
    static readonly TEST_TO_SEE_N95_COMPANION_IS_ATTACHED = "Q";
    static readonly SWITCH_VALVE_ON = "VN"; // ambient
    static readonly SWITCH_VALVE_OFF = "VF"; // sample
    static readonly DISABLE_CONTINUOUS_DATA_TRANSMISSION = "ZD";
    static readonly ENABLE_CONTINUOUS_DATA_TRANSMISSION = "ZE";
    static readonly REQUEST_RUNTIME_STATUS_OF_BATTERY_AND_SIGNAL_PULSE = "R";
    static readonly REQUEST_VOLTAGE_INFO = "C"; // this seems to be undocumented
    static readonly REQUEST_SETTINGS = "S";
    static readonly TURN_POWER_OFF = "Y";
    static readonly SET_MASK_SAMPLE_TIME = "PTMxxvv";  // xx = exercise num [1..12], vv = time in seconds [10..99]
    static readonly SET_AMBIENT_SAMPLE_TIME = "PTA00vv";  // vv = time in seconds [5..99]
    static readonly SET_MASK_SAMPLE_PURGE_TIME = "PTPM0vv"; // vv = time in seconds [11..25]
    static readonly SET_AMBIENT_SAMPLE_PURGE_TIME = "PTPA0vv"; // vv = time in seconds [4..25]
    static readonly SET_FIT_FACTOR_PASS_LEVEL = "PPxxvvvvv"; // xx = memory location [1..12], vvvvv = pass level
                                                             // [0..64000]

    static readonly DISPLAY_CONCENTRATION_ON_PORTACOUNT_PLUS = "Dxxxxxx.xx";
    static readonly DISPLAY_FIT_FACTOR_PASS_LEVEL_ON_PORTACOUNT_PLUS = "Lxxxxxx";
    static readonly DISPLAY_FIT_FACTOR_ON_PORTACOUNT_PLUS = "Fxxxxxx.x";
    static readonly DISPLAY_OVERALL_FIT_FACTOR_ON_PORTACOUNT_PLUS = "Axxxxxx.x";
    static readonly DISPLAY_EXERCISE_NUMBER_ON_PORTACOUNT_PLUS = "Ixxxxxxxx";
    static readonly CLEAR_DISPLAY_ON_PORTACOUNT_PLUS = "K";
    static readonly SOUND_BEEPER_INSIDE_THE_PORTACOUNT_PLUS = "Bxx";

    // most commands are echoed back. only need to put exceptions here
    private static readonly expectedCommandResponses: Map<string, RegExp> = new Map([
        [ExternalController.INVOKE_EXTERNAL_CONTROL, ExternalControlResponsePatterns.EXTERNAL_CONTROL],
    ]);

    private writer: WritableStreamDefaultWriter<Uint8Array> | null = null;
    private encoder = new TextEncoder();
    private verifiedToBeExternallyControllable: boolean = false;
    private portaCountClient: PortaCountClient8020;
    private commandChain?: Promise<void>

    constructor(portaCountClient: PortaCountClient8020) {
        this.portaCountClient = portaCountClient;
    }

    setWriter(writer: WritableStreamDefaultWriter<Uint8Array>) {
        this.writer = writer;
    }

    // has retry support
    sendCommand(command: string, maxRetries: number = 1) {
        const terminalCommand = `${command}\r`;
        // most commands are echoed back
        const expectedResponse = ExternalController.expectedCommandResponses.get(command) || RegExp(`^${command}`)
        const chunk = this.encoder.encode(terminalCommand);
        if (this.writer) {
            const fun = () => {
                return new Promise<void>((resolve, reject) => {
                    let gotExpectedResponse = false;
                    let numRetriesRemaining = maxRetries;
                    let timerId: NodeJS.Timeout | undefined = undefined;

                    const cleanup = (): void => {
                        clearTimeout(timerId) // todo: try-catch?
                        this.portaCountClient.removeListener(listener)

                    }
                    const listener: PortaCountListener = {
                        lineReceived: (line: string) => {
                            if (expectedResponse ? expectedResponse.exec(line) : (command === line)) {
                                // got response, done looking. either regexp, or response exactly matches command
                                // (backup)
                                gotExpectedResponse = true;
                                cleanup()
                                // we can continue
                                resolve()
                                console.debug(`received expected response to command '${command}'`)
                            }
                        }
                    }
                    const attemptSendCommand = (): void => {
                        console.debug(`sending command '${command}', expecting '${expectedResponse}' in response, retries remaining ${numRetriesRemaining}`)
                        this.writer!.write(chunk) // catch and reject?
                    }
                    const setUpRetry = (): void => {
                        timerId = setTimeout(retryHandler, 3000) // 1 second to respond
                    }
                    const retryHandler = (): void => {
                        if (gotExpectedResponse) {
                            // timer triggered after we got the response, ignore
                            console.debug(`retry handler triggered but we've already received the expected response for command '${command}'`)
                            return;
                        }
                        if (numRetriesRemaining > 0) {
                            console.debug(`retrying command '${command}'`)
                            numRetriesRemaining--
                            attemptSendCommand()
                            setUpRetry()
                        } else {
                            // no retries left
                            if (expectedResponse) {
                                reject(`too many retries, giving up on command '${command}'`)
                            } else {
                                // don't have an explicit expected response; don't complain
                                console.debug(`no explicit expected response for command '${command}', but also didn't receive any other recognized response`)
                                resolve()
                            }
                            cleanup()
                        }
                    }

                    this.portaCountClient.addListener(listener)
                    attemptSendCommand()
                    if (numRetriesRemaining > 0) {
                        setUpRetry()
                    }
                })
            };
            if (this.commandChain) {
                console.debug(`chaining command ${command}`)
                this.commandChain = this.commandChain.then(fun).catch(() => {
                    // ignore
                });
            } else {
                this.commandChain = fun()
            }
        } else {
            console.log("writer not available")
        }
    }

    set controlSource(controlSource: ControlSource) {
        if (controlSource === ControlSource.Internal) {
            this.releaseManualControl();
        } else {
            // external
            this.assumeManualControl()
            if (!this.verifiedToBeExternallyControllable) {
                this.verifyExternalControllability()
            }
        }
    }

    set sampleSource(sampleSource: SampleSource) {
        if (sampleSource === SampleSource.AMBIENT) {
            this.sampleAmbient();
        } else {
            // mask
            this.sampleMask();
        }
    }

    assumeManualControl() {
        this.sendCommand(ExternalController.INVOKE_EXTERNAL_CONTROL);
    }

    releaseManualControl() {
        this.sendCommand(ExternalController.RELEASE_FROM_EXTERNAL_CONTROL);
        // TODO: detect when we're already in internal control mode so the UI doesn't get stuck thinking it's in
        // external
    }

    enableDataTransmission() {
        this.sendCommand(ExternalController.ENABLE_CONTINUOUS_DATA_TRANSMISSION);
    }

    disableDataTransmission() {
        this.sendCommand(ExternalController.DISABLE_CONTINUOUS_DATA_TRANSMISSION);
    }

    // todo: retry if state doesn't change
    sampleAmbient() {
        this.sendCommand(ExternalController.SWITCH_VALVE_ON);
    }

    // todo: retry if state doesn't change
    sampleMask() {
        this.sendCommand(ExternalController.SWITCH_VALVE_OFF);
    }

    requestSettings() {
        this.sendCommand(ExternalController.REQUEST_SETTINGS);
    }

    requestRuntimeStatus() {
        this.sendCommand(ExternalController.REQUEST_RUNTIME_STATUS_OF_BATTERY_AND_SIGNAL_PULSE);
    }

    powerOff() {
        this.sendCommand(ExternalController.TURN_POWER_OFF);
        SPEECH.sayItLater("Power off");
    }

    /**
     *
     */
    beep(tenthsOfSeconds:number = 2) {
        this.sendCommand(`B${String(tenthsOfSeconds).padStart(2, "0")}`);
    }

    /**
     * We verify that we can externally control the PortaCount by issuing a few commands and see if we continue to
     * receive counts. If there's something wrong, after a couple of commands, the PortaCount will stop responding.
     * @private
     */
    private verifyExternalControllability() {
        let lastLineReceivedTime = 0
        const verificationListener: PortaCountListener = {
            lineReceived() {
                lastLineReceivedTime = Date.now();
            }
        };
        this.portaCountClient.addListener(verificationListener)
        this.beep()
        this.beep()
        setTimeout(() => {
            this.portaCountClient.removeListener(verificationListener)
            if (Date.now() - lastLineReceivedTime > 3000) {
                // too much time since last received line, probably can't externally control
                console.log("Could not verify that we can externally control the device")
                // todo: don't do this. only advanced users should be getting here
                // APP_SETTINGS_CONTEXT.saveSetting(AppSettings.SHOW_EXTERNAL_CONTROL, false); // disable
            } else {
                this.verifiedToBeExternallyControllable = true;
            }
        }, 5000) // 5 seconds
    }
}


