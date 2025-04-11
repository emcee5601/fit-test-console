import {useContext, useState} from "react";
import {ExternalController} from "./external-control.ts";
import {AppContext} from "./app-context.ts";
import CreatableSelect from "react-select/creatable";

export function PortaCountCommandWidget() {
    const appContext = useContext(AppContext)
    const control: ExternalController = appContext.portaCountClient.externalController
    const [commandInput, setCommandInput] = useState<string>("")

    function sendCommand() {
        control.sendCommand(commandInput);
        setCommandInput("")
    }

    const commands: { [key: string]: string } = {
        "": "",
        "Switch to App Control": ExternalController.INVOKE_EXTERNAL_CONTROL,
        "Switch to PortaCount Control": ExternalController.RELEASE_FROM_EXTERNAL_CONTROL,
        "Request Settings": ExternalController.REQUEST_SETTINGS,
        "Request Runtime Status": ExternalController.REQUEST_RUNTIME_STATUS_OF_BATTERY_AND_SIGNAL_PULSE,
        "Request Voltage Status": ExternalController.REQUEST_VOLTAGE_INFO,
        "Sample from Ambient": ExternalController.SWITCH_VALVE_ON,
        "Sample from Mask": ExternalController.SWITCH_VALVE_OFF,
        "Disable data transmission": ExternalController.DISABLE_CONTINUOUS_DATA_TRANSMISSION,
        "Enable data transmission": ExternalController.ENABLE_CONTINUOUS_DATA_TRANSMISSION,
        "Beep!": ExternalController.SOUND_BEEPER_INSIDE_THE_PORTACOUNT_PLUS.replace("xx", "02"), // hard code for now
        "Power Off": ExternalController.TURN_POWER_OFF
    }

    return (
        <div style={{display: "inline-flex", height:"fit-content"}}>
            <CreatableSelect
                name={"Mask"}
                options={Object.entries(commands).map(([label, value]) => {
                    return {
                        value: value,
                        label: label
                    }
                })}
                value={commandInput ? {value: commandInput, label: commandInput} : null}
                styles={{
                    menu: (baseStyles) => ({
                        ...baseStyles,
                        zIndex: 2,
                        width: "max-content",
                        textAlign: "left",
                    }),
                    singleValue: (baseStyles) => ({
                        ...baseStyles,
                        whiteSpace: "normal", // disable truncating with ellipses
                        width: "9rem", // todo: figure out how to calculate this based on menu width
                    }),
                    input: (baseStyles) => ({
                        ...baseStyles,
                        width: "9rem", // todo: figure out how to make this the same as singleValue's width
                    })
                }}
                onChange={(event) => setCommandInput(event?.value as string)}
                allowCreateWhileLoading={true}
                isSearchable={true}
                placeholder={"Type command..."}
            />
            <input type="button" value={"Send"} id={"send-command-button"}
                   onClick={sendCommand}/>
        </div>
    )
}
