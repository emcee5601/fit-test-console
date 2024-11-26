/*
External control for the PortaCount 8020a
The technical addendum describes the interface. Starts on page 13.
 https://tsi.com/getmedia/0d5db6cd-c54d-4644-8c31-40cc8c9d8a9f/PortaCount_Model_8020_Technical_Addendum_US?ext=.pdf
 */
import React, {useEffect, useRef} from "react";
import {speech} from "./speech.ts";

export interface ExternalControlStates {
    dataTransmissionMode: string;
    readonly setDataTransmissionMode: React.Dispatch<React.SetStateAction<string>>;
    valvePosition: string;
    readonly setValvePosition: React.Dispatch<React.SetStateAction<string>>;
    controlMode: string;
    readonly setControlMode: React.Dispatch<React.SetStateAction<string>>;
}

export class ExternalController {
    static INVOKE_EXTERNAL_CONTROL = "J";
    static RELEASE_FROM_EXTERNAL_CONTROL = "G";
    static TEST_TO_SEE_N95_COMPANION_IS_ATTACHED = "Q";
    static SWITCH_VALVE_ON = "VN"; // ambient
    static SWITCH_VALVE_OFF = "VF"; // sample
    static DISABLE_CONTINUOUS_DATA_TRANSMISSION = "ZD";
    static ENABLE_CONTINUOUS_DATA_TRANSMISSION = "ZE";
    static REQUEST_RUNTIME_STATUS_OF_BATTERY_AND_SIGNAL_PULSE = "R";
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


    writer: WritableStreamDefaultWriter<Uint8Array> | null = null;
    encoder = new TextEncoder();
    states: ExternalControlStates;

    constructor(externalControlStates: ExternalControlStates) {
        this.states = externalControlStates;
    }

    setWriter(writer: WritableStreamDefaultWriter<Uint8Array>) {
        this.writer = writer;
    }

    sendCommand(command: string) {
        const terminalCommand = `${command}\r`;
        const chunk = this.encoder.encode(terminalCommand);
        if (this.writer) {
            this.writer.write(chunk);
        } else {
            console.log("writer not available")
        }
    }
}


export function ExternalControlPanel({control}: { control: ExternalController }) {
    const controlModeButtonRef = useRef<HTMLInputElement>(null)
    const dataTransmissionModeButtonRef = useRef<HTMLInputElement>(null)
    const valvePositionButtonRef = useRef<HTMLInputElement>(null)
    const beepButtonRef = useRef<HTMLInputElement>(null);
    const requestSettingsButtonRef = useRef<HTMLInputElement>(null);
    const powerOffButtonRef = useRef<HTMLInputElement>(null);

    const controlButtonRefs: React.RefObject<HTMLInputElement>[] = [valvePositionButtonRef, dataTransmissionModeButtonRef,
        beepButtonRef, requestSettingsButtonRef, powerOffButtonRef];

    // todo: try to receive commands via an array with useState. use it like a queue. append during the set, consume in useUeffect

    useEffect(() => {
        console.log(`controlMode changed to ${control.states.controlMode}`)
        if (controlModeButtonRef.current) {
            controlModeButtonRef.current.style.backgroundColor = control.states.controlMode === "Internal Control" ? "yellow" : "green"
        }
        if (control.states.controlMode === "External Control") {
            enableButtons();
        } else {
            disableButtons();
        }
    }, [control.states.controlMode]);
    useEffect(() => {
        if (valvePositionButtonRef.current) {
            valvePositionButtonRef.current.style.backgroundColor = control.states.valvePosition === "Sampling from Ambient" ? "yellow" : "green"
        }
    }, [control.states.valvePosition]);
    useEffect(() => {
        if (dataTransmissionModeButtonRef.current) {
            dataTransmissionModeButtonRef.current.style.backgroundColor = control.states.dataTransmissionMode === "Paused" ? "yellow" : "green"
        }
    }, [control.states.dataTransmissionMode]);


    /**
     * Disable buttons when in internal control mode
     */
    function disableButtons() {
        setButtonStates(false, ...controlButtonRefs);
    }

    function enableButtons() {
        setButtonStates(true, ...controlButtonRefs);
    }

    function setButtonStates(enabled: boolean, ...buttonRefs: React.RefObject<HTMLInputElement>[]) {
        for (const buttonRef of buttonRefs) {
            if (buttonRef.current) {
                buttonRef.current.disabled = !enabled;
            }
        }
    }

    function toggleControlMode() {
        if (control.states.controlMode === "Internal Control") {
            assumeManualControl();
        } else {
            releaseManualControl();
        }
    }

    function toggleValvePosition() {
        if (control.states.valvePosition === "Sampling from Ambient") {
            sampleMask();
        } else {
            sampleAmbient();
        }
    }

    function dataTransmitModeButtonClicked() {
        if (control.states.dataTransmissionMode === "Paused") {
            enableDataTransmission();
        } else {
            disableDataTransmission()
        }
    }

    function assumeManualControl() {
        control.sendCommand(ExternalController.INVOKE_EXTERNAL_CONTROL);
    }

    function releaseManualControl() {
        control.sendCommand(ExternalController.RELEASE_FROM_EXTERNAL_CONTROL);
        // TODO: detect when we're already in internal control mode so the UI doesn't get stuck thinking it's in external
    }

    function enableDataTransmission() {
        control.sendCommand(ExternalController.ENABLE_CONTINUOUS_DATA_TRANSMISSION);
    }

    function disableDataTransmission() {
        control.sendCommand(ExternalController.DISABLE_CONTINUOUS_DATA_TRANSMISSION);
    }

    function sampleAmbient() {
        control.sendCommand(ExternalController.SWITCH_VALVE_ON);
    }

    function sampleMask() {
        control.sendCommand(ExternalController.SWITCH_VALVE_OFF);
    }

    function requestSettings() {
        control.sendCommand(ExternalController.REQUEST_SETTINGS);
    }

    function powerOff() {
        control.sendCommand(ExternalController.TURN_POWER_OFF);
        speech.sayItLater("Power off");
    }

    function beep() {
        const tenthsOfSeconds = 2
        control.sendCommand(`B${String(tenthsOfSeconds).padStart(2, "0")}`);
    }


    return (
        <>
            <fieldset id="portacount-controls-fieldset" style={{display: "inline-block", float:"inline-start"}}>
                <legend>PortaCount control</legend>
                {<input type="button" ref={controlModeButtonRef} value={control.states.controlMode}
                        id={"control-mode-button"}
                        onClick={toggleControlMode}/>}
                {<input type="button" ref={valvePositionButtonRef} value={control.states.valvePosition}
                        id={"valve-position-button"}
                        onClick={toggleValvePosition}/>}
                {<input type="button" ref={dataTransmissionModeButtonRef} value={control.states.dataTransmissionMode}
                        id={"data-transmit-mode-button"}
                        onClick={dataTransmitModeButtonClicked}/>}
                {<input type="button" ref={requestSettingsButtonRef} value={"Request Settings"}
                        id={"request-settings-button"}
                        onClick={requestSettings}/>}
                {<input type="button" ref={beepButtonRef} value={"Beep!"} id={"beep-button"} onClick={beep}/>}
                {<input type="button" ref={powerOffButtonRef} value={"Power Off"} id={"power-off-button"}
                        onClick={powerOff}/>}
            </fieldset>
        </>
    )
}