import Ajv from "ajv"
import {useContext, useState} from 'react';
import "./simple-protocol-editor.css";
import {useSetting} from "./use-setting.ts";
import {AppSettings} from "src/app-settings-types.ts";
import {AppContext} from "src/app-context.ts";

type JSONContent = { json: string };

export function SimpleFitTestProtocolPanel() {
    const [protocolInstructionSets, setProtocolInstructionSets] = useSetting<JSONContent>(AppSettings.PROTOCOL_INSTRUCTION_SETS)
    const appContext = useContext(AppContext)
    const [content, setContent] = useState<string>(JSON.stringify(protocolInstructionSets.json, null, 2))
    const [changesSaved, setChangesSaved] = useState<boolean>(true)
    const ajv = new Ajv()

    function resetToDefault() {
        console.debug("resetting protocols to defaults")
        setProtocolInstructionSets(appContext.settings.getDefault(AppSettings.PROTOCOL_INSTRUCTION_SETS))
    }

    const schema = {
        type: "object",
        properties: {},
        additionalProperties: {
            type: "array",
            items: {
                oneOf: [
                    {
                        // v1: list of instructions "vanilla"
                        type: "string"
                    },
                    {
                        oneOf: [
                            { // v3.1: instructions with the 4 combinations of ambient/mask + sample/purge "standardized"
                                type: "object",
                                properties: {
                                    "title": {type: "string"},
                                    "instructions": {type: "string"},
                                    "ambient_purge": {type: "integer", minimum: 0, maximum: 10},
                                    "ambient_sample": {type: "integer", minimum: 0, maximum: 60},
                                    "mask_purge": {type: "integer", minimum: 0, maximum: 10},
                                    "mask_sample": {type: "integer", minimum: 0, maximum: 600},
                                },
                                required: ["instructions"],
                                additionalProperties: false
                            },
                        ]
                    }
                ]
            }
        }
    }
    const validate = ajv.compile(schema)

    function valueChanged(newValue: string) {
        setContent(newValue);
        try {
            const parsedJson = JSON.parse(newValue);

            if (validate(parsedJson)) {
                setProtocolInstructionSets({json: parsedJson} as JSONContent)
                setChangesSaved(true)
            } else {
                console.error(validate.errors);
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
                <button id={"reset"} onDoubleClick={resetToDefault}>Reset to default (double click)</button>
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
