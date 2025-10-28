import {useContext, useState} from 'react';
import "./simple-protocol-editor.css";
import {AppContext} from "src/app-context.ts";
import {AppSettings} from "src/app-settings-types.ts";
import {validateProtocols} from "src/protocol-validator.ts";
import {StandardizedProtocolDefinitions} from "src/simple-protocol.ts";
import {useSetting} from "./use-setting.ts";

export function SimpleFitTestProtocolPanel() {
    const [protocolInstructionSets, setProtocolInstructionSets] = useSetting<StandardizedProtocolDefinitions>(AppSettings.PROTOCOL_INSTRUCTION_SETS)
    const appContext = useContext(AppContext)
    const [content, setContent] = useState<string>(JSON.stringify(protocolInstructionSets, null, 2))
    const [changesSaved, setChangesSaved] = useState<boolean>(true)

    function valueChanged(newValue: string) {
        setContent(newValue);
        try {
            const parsedJson = JSON.parse(newValue);

            if (validateProtocols(parsedJson)) {
                setProtocolInstructionSets(parsedJson as StandardizedProtocolDefinitions)
                setChangesSaved(true)
            } else {
                console.error(validateProtocols.errors);
                setChangesSaved(false)
            }
        } catch (jsonParseError) {
            console.error("error parsing json:", jsonParseError);
            setChangesSaved(false)
        }
    }

    return (
        <>
            <section id={"controls"}>
                <button id={"reset"}
                        onDoubleClick={() => appContext.settings.resetToDefault(AppSettings.PROTOCOL_INSTRUCTION_SETS)}>Reset
                    to default (double click)
                </button>
            </section>
            <section id={"editor"} style={{display: "contents"}}>
                <textarea style={{
                    height: "90%",
                    width: "90%",
                    borderWidth: "10px",
                    borderColor: changesSaved ? "green" : "red"
                }} onChange={(e) => valueChanged(e.target.value)} value={content}>
                </textarea>
                {/*<JsonEditorPanel props={props} />*/}
            </section>
        </>
    )
}
