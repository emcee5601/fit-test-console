import {
    Content,
    createAjvValidator,
    createJSONEditor,
    JSONContent,
    JsonEditor,
    JSONEditorPropsOptional,
    Mode,
    TextContent,
    toJSONContent,
    toTextContent
} from 'vanilla-jsoneditor';
import {useEffect, useRef} from 'react';
import "./simple-protocol-editor.css";
import {useDBSetting, AppSettings} from "./settings-db.ts";

export function ProtocolSelector({onChange}: { onChange: (value: string) => void }) {
    const [protocols] = useDBSetting<JSONContent>(AppSettings.PROTOCOL_INSTRUCTION_SETS)
    const protocolNames = Object.keys(protocols.json as object);
    const [protocol, setProtocol] = useDBSetting<string>(AppSettings.SELECTED_PROTOCOL, protocolNames[0])

    function updateProtocol(protocolName: string) {
        setProtocol(protocolName); // update this component's state
        onChange(protocolName); // update the data collector's state
    }

    useEffect(() => {
        if (!protocol) {
            updateProtocol(protocolNames[0])
        } else {
            // protocol list changed, but we have a selected protocol from settings
            updateProtocol(protocol);
        }
    }, [protocols]);
    return (<div style={{display:"inline-block", paddingInlineEnd:"0.5em"}}>
            Protocol:&nbsp;
            <select onChange={(event) => updateProtocol(event.target.value)}
                    value={protocol}>
                {protocolNames.map((protocolName) => <option key={protocolName}
                                                             value={protocolName}>{protocolName}</option>)}
            </select>
    </div>)
}

export function SimpleFitTestProtocolPanel(props: JSONEditorPropsOptional) {
    const [protocolInstructionSets, setProtocolInstructionSets] = useDBSetting<JSONContent>(AppSettings.PROTOCOL_INSTRUCTION_SETS)

    // map of string to list of strings. This represents sets of instructions keyed by the name of the sets.
    /*
    {
        "protocol-name": {
            [
                "breathe normally (v1 only has instructions)",
                {
                    "instructions": "heavy breathing (v2 includes purge and sample duration)",
                    "purge-duration": 4,
                    "sample-duration": 40,
                },
            ]
        }
    }
     */
    const schema = {
        type: "object",
        properties: {},
        additionalProperties: {
            type: "array",
            items: {
                oneOf: [
                    {
                        // v1: list of instructions
                        type: "string"
                    },
                    {
                        oneOf: [
                            {
                                // v2: list of instructions with stage durations
                                type: "object",
                                properties: {
                                    "instructions": {type: "string"},
                                    "purge_duration": {type: "integer", minimum: 4, maximum: 10},
                                    "sample_duration": {type: "integer", minimum: 4, maximum: 60},
                                },
                                required: ["instructions"],
                                additionalProperties: false
                            },
                            {
                                // TODO: construct this from the above instead of copy-pasta
                                // v2.1: abbreviated list of instructions with stage durations
                                type: "object",
                                properties: {
                                    "i": {type: "string"},
                                    "p": {type: "integer", minimum: 4, maximum: 10},
                                    "s": {type: "integer", minimum: 4, maximum: 60},
                                },
                                required: ["i"],
                                additionalProperties: false
                            }
                        ]
                    }
                ]
            }
        }
    }
    const validator = createAjvValidator({schema})

    props = {
        ...props,
        mode: props.mode || Mode.text,
        validator: props.validator || validator,
        content: toTextContent(protocolInstructionSets, 2),
        onChange: (content: Content, _previousContent, status) => {
            if (!status.contentErrors) {
                // only save if there were no errors
                const textContent = content as TextContent;
                // setProtocolInstructionSets(textContent)
                setProtocolInstructionSets(toJSONContent(textContent))
            }
        }
    } // defaults

    return JsonEditorPanel(props)
}

function JsonEditorPanel(props: JSONEditorPropsOptional) {
    const refContainer = useRef<HTMLDivElement | null>(null);
    const refEditor = useRef<JsonEditor | null>(null);
    const refPrevProps = useRef<JSONEditorPropsOptional>(props);

    useEffect(() => {
        // create editor
        console.log('create editor', refContainer.current);
        refEditor.current = createJSONEditor({
            target: refContainer.current as HTMLDivElement,
            props,
        });

        return () => {
            // destroy editor
            if (refEditor.current) {
                console.log('destroy editor');
                refEditor.current.destroy();
                refEditor.current = null;
            }
        };
    }, []);

    // update props
    useEffect(() => {
        if (refEditor.current) {
            // only pass the props that actually changed
            // since the last time to prevent syncing issues
            const changedProps = filterUnchangedProps(props, refPrevProps.current);
            console.log('update props', changedProps);
            refEditor.current.updateProps(changedProps);
            refPrevProps.current = props;
        }
    }, [props]);

    return (
        <>
            This simple editor just maps exercise number to instructions.
            <div className="simple-protocol-editor-container" ref={refContainer}>
            </div>
        </>
    );
}

function filterUnchangedProps(
    props: JSONEditorPropsOptional,
    prevProps: JSONEditorPropsOptional
): JSONEditorPropsOptional {
    return Object.fromEntries(
        Object.entries(props).filter(
            ([key, value]) =>
                value !== prevProps[key as keyof JSONEditorPropsOptional]
        )
    );
}
