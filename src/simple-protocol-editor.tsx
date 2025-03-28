import {
    Content,
    createAjvValidator,
    createJSONEditor,
    JSONContent,
    JsonEditor,
    JSONEditorPropsOptional,
    Mode,
    toJSONContent,
    toTextContent
} from 'vanilla-jsoneditor';
import {useEffect, useRef} from 'react';
import "./simple-protocol-editor.css";
import {AppSettings, useSetting} from "./app-settings.ts";
import stringifyDeterministically from "json-stringify-deterministic";

export function SimpleFitTestProtocolPanel(props: JSONEditorPropsOptional) {
    // TODO: extract default
    const [protocolInstructionSets, setProtocolInstructionSets] = useSetting<JSONContent>(AppSettings.PROTOCOL_INSTRUCTION_SETS)

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
                                    "ambient_duration": {type: "integer", minimum: 0, maximum: 60},
                                    "sample_duration": {type: "integer", minimum: 0, maximum: 60},
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
                                    "a": {type: "integer", minimum: 0, maximum: 60},
                                    "s": {type: "integer", minimum: 0, maximum: 60},
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
        onChange: (content: Content,previousContent, status) => {
            if (!status.contentErrors) {
                // only save if there were no errors
                const jsonContent = toJSONContent(content);
                if(stringifyDeterministically(jsonContent.json) === stringifyDeterministically(toJSONContent(previousContent).json)) {
                    // only whitespace difference, ignore. otherwise updating the UI would remove the new whitespace
                    console.log("no non-whitespace change")
                    return;
                }
                setProtocolInstructionSets(jsonContent)
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
