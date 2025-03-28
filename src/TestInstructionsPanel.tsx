import {useContext, useEffect, useState} from "react";
import {DataCollectorListener} from "./data-collector.ts";
import {AppContext} from "./app-context.ts";

export function TestInstructionsPanel() {
    const appContext = useContext(AppContext)
    const [dataCollector] = useState(appContext.dataCollector)
    const [instructions, setInstructions] = useState<string>("")

    const dataCollectorListener: DataCollectorListener = {
        instructionsChanged(instructions: string) {
            setInstructions(instructions)
        },
    }

    useEffect(() => {
        dataCollector.addListener(dataCollectorListener)

        return () => {
            dataCollector.removeListener(dataCollectorListener)
        };
    }, []);

    return (
        <fieldset style={{display: "inline-block", flexGrow: 1}} className={"info-box"}>
            <legend>Test Instructions</legend>
            <textarea id="instructions" readOnly={true} style={{
                width: "100%",
                minHeight: "3rem",
                height: "fit-content",
                fontSize: "xxx-large",
                overflow: "auto",
                resize: "vertical",
                border: "none"
            }} value={instructions}></textarea>
        </fieldset>
    )
}
