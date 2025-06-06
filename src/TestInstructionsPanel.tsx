import {useContext, useEffect, useRef, useState} from "react";
import {DataCollectorListener} from "./data-collector.ts";
import {AppContext} from "./app-context.ts";

export function TestInstructionsPanel() {
    const appContext = useContext(AppContext)
    const [dataCollector] = useState(appContext.dataCollector)
    const [instructions, setInstructions] = useState<string>("")
    const ref = useRef<HTMLTextAreaElement>(null)
    const [dimensions, setDimensions] = useState([0,0])

    /**
     * adjust font size so instructions fill the space available
     * @param instructions
     */
    function updateFontSize(instructions: string) {
        if (ref.current) {
            const area = ref.current.clientHeight * ref.current.clientWidth
            const areaPerChar = area / instructions.length
            const approxFontSize = Math.sqrt(areaPerChar) * 0.8
            // todo: account for long words: scale font size down so long word doesn't get wrapped?
            ref.current.style.fontSize = approxFontSize + 'px'
            console.debug(`setting font size to ${approxFontSize}`)
        }
    }

    const dataCollectorListener: DataCollectorListener = {
        instructionsChanged(instructions: string) {
            setInstructions(instructions.replace(/\./, ".\n"))
        },
    }

    useEffect(() => {
        dataCollector.addListener(dataCollectorListener)
        const ro = new ResizeObserver(([entry]) => {
            // assume it's just the one element we're observing
            setDimensions([entry.target.clientWidth, entry.target.clientHeight])
        })
        if(ref.current) {
            ro.observe(ref.current)
        }

        return () => {
            dataCollector.removeListener(dataCollectorListener)
            ro.disconnect()
        };
    }, []);

    useEffect(() => {
        updateFontSize(instructions)
    }, [instructions, dimensions]);

    return (
        <fieldset style={{display: "inline-block", flexGrow: 1, height: "inherit"}} className={"info-box-compact"}>
            <legend>Test Instructions</legend>
            <textarea id="test-instructions"
                      ref={ref}
                      style={{
                          width: "100%",
                          // height must not be relative to font size or updating fot size via ResizeObserver will infinite loop
                          minHeight: "16px",
                          height: "inherit",
                          fontSize: "2.3em",
                          overflow: "auto",
                          resize: "none",
                          border: "none",
                          alignContent: "center",
                          textAlign: "center",
                          // wordWrap: "normal", // this causes some infinite resizing loop when test is stopped in zoomed view
                          textWrap: "wrap",
                          whiteSpaceCollapse: "collapse",
                      }}
                      readOnly={true}
                      value={instructions}
                      onChange={() => null}
            ></textarea>
        </fieldset>
    )
}
