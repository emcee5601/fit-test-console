/*
External control for the PortaCount 8020a
The technical addendum describes the interface. Starts on page 13.
 https://tsi.com/getmedia/0d5db6cd-c54d-4644-8c31-40cc8c9d8a9f/PortaCount_Model_8020_Technical_Addendum_US?ext=.pdf
 */

import {SPEECH} from "./speech.ts";

import {ControlSource} from "./control-source.ts";
import {SampleSource} from "./simple-protocol.ts";
import {PortaCountClient8020, PortaCountListener} from "./portacount-client-8020.ts";
import {APP_SETTINGS_CONTEXT, AppSettings} from "./app-settings.ts";

export class ExternalController {
    static INVOKE_EXTERNAL_CONTROL = "J";
    static RELEASE_FROM_EXTERNAL_CONTROL = "G";
    static TEST_TO_SEE_N95_COMPANION_IS_ATTACHED = "Q";
    static SWITCH_VALVE_ON = "VN"; // ambient
    static SWITCH_VALVE_OFF = "VF"; // sample
    static DISABLE_CONTINUOUS_DATA_TRANSMISSION = "ZD";
    static ENABLE_CONTINUOUS_DATA_TRANSMISSION = "ZE";
    static REQUEST_RUNTIME_STATUS_OF_BATTERY_AND_SIGNAL_PULSE = "R";
    static REQUEST_VOLTAGE_INFO = "C"; // this seems to be undocumented
    static REQUEST_SETTINGS = "S";
    static TURN_POWER_OFF = "Y";
    static SET_MASK_SAMPLE_TIME = "PTMxxvv";  // xx = exercise num [1..12], vv = time in seconds [10..99]
    static SET_AMBIENT_SAMPLE_TIME = "PTA00vv";  // vv = time in seconds [5..99]
    static SET_MASK_SAMPLE_PURGE_TIME = "PTPM0vv"; // vv = time in seconds [11..25]
    static SET_AMBIENT_SAMPLE_PURGE_TIME = "PTPA0vv"; // vv = time in seconds [4..25]
    static SET_FIT_FACTOR_PASS_LEVEL = "PPxxvvvvv"; // xx = memory location [1..12], vvvvv = pass level [0..64000]

    static DISPLAY_CONCENTRATION_ON_PORTACOUNT_PLUS = "Dxxxxxx.xx";
    static DISPLAY_FIT_FACTOR_PASS_LEVEL_ON_PORTACOUNT_PLUS = "Lxxxxxx";
    static DISPLAY_FIT_FACTOR_ON_PORTACOUNT_PLUS = "Fxxxxxx.x";
    static DISPLAY_OVERALL_FIT_FACTOR_ON_PORTACOUNT_PLUS = "Axxxxxx.x";
    static DISPLAY_EXERCISE_NUMBER_ON_PORTACOUNT_PLUS = "Ixxxxxxxx";
    static CLEAR_DISPLAY_ON_PORTACOUNT_PLUS = "K";
    static SOUND_BEEPER_INSIDE_THE_PORTACOUNT_PLUS = "Bxx";

    private writer: WritableStreamDefaultWriter<Uint8Array> | null = null;
    private encoder = new TextEncoder();
    private verifiedToBeExternallyControllable: boolean = false;
    private portaCountClient: PortaCountClient8020;

    constructor(portaCountClient: PortaCountClient8020) {
        this.portaCountClient = portaCountClient;
    }

    setWriter(writer: WritableStreamDefaultWriter<Uint8Array>) {
        this.writer = writer;
    }

    // todo: add retry mode. we know the expected response for each command. wait for the response within some timeout, then retry once.
    // this should account for sometimes extraneous characters being prefixed on the expected response values
    sendCommand(command: string) {
        const terminalCommand = `${command}\r`;
        const chunk = this.encoder.encode(terminalCommand);
        if (this.writer) {
            console.log(`sending ${command}`)
            this.writer.write(chunk);
        } else {
            console.log("writer not available")
        }
    }

    set controlSource(controlSource: ControlSource) {
        if(controlSource === ControlSource.Internal) {
            this.releaseManualControl();
        } else {
            // external
            this.assumeManualControl()
            if(!this.verifiedToBeExternallyControllable) {
                this.verifyExternalControllability()
            }
        }
    }

    set sampleSource(sampleSource: SampleSource) {
        if(sampleSource === SampleSource.AMBIENT) {
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
        // TODO: detect when we're already in internal control mode so the UI doesn't get stuck thinking it's in external
    }

    enableDataTransmission() {
        this.sendCommand(ExternalController.ENABLE_CONTINUOUS_DATA_TRANSMISSION);
    }

    disableDataTransmission() {
        this.sendCommand(ExternalController.DISABLE_CONTINUOUS_DATA_TRANSMISSION);
    }

    sampleAmbient() {
        this.sendCommand(ExternalController.SWITCH_VALVE_ON);
    }

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

    beep() {
        const tenthsOfSeconds = 2
        this.sendCommand(`B${String(tenthsOfSeconds).padStart(2, "0")}`);
    }

    /**
     * We verify that we can externally control the PortaCount by issuing a few commands and see if we continue to receive counts.
     * If there's something wrong, after a couple of commands, the PortaCount will stop responding.
     * @private
     */
    private verifyExternalControllability() {
        let lastLineReceivedTime = 0
        const verificationListener:PortaCountListener = {
            lineReceived() {
                lastLineReceivedTime = Date.now();
            }
        };
        this.portaCountClient.addListener(verificationListener)
        this.beep()
        this.beep()
        setTimeout(() => {
            this.portaCountClient.removeListener(verificationListener)
            if( Date.now() - lastLineReceivedTime > 3000) {
                // too much time since last received line, probably can't externally control
                console.log("Could not verify that we can externally control the device, disable external control mode")
                APP_SETTINGS_CONTEXT.saveSetting(AppSettings.SHOW_EXTERNAL_CONTROL, false); // disable
            } else {
                this.verifiedToBeExternallyControllable = true;
            }
        }, 5000) // 5 seconds
    }
}


