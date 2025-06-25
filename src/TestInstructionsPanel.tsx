import {useContext, useEffect, useMemo, useRef, useState} from "react";
import {DataCollectorListener} from "./data-collector.ts";
import {AppContext} from "./app-context.ts";

export function TestInstructionsPanel() {
    const minFontSizePx: number = 30;
    const appContext = useContext(AppContext)
    const [dataCollector] = useState(appContext.dataCollector)
    const [instructions, setInstructions] = useState<string>("")
    const ref = useRef<HTMLTextAreaElement>(null)
    const [dimensions, setDimensions] = useState([0, 0])
    const startingHeight = useMemo(() => {
        if(!ref.current) {
            return minFontSizePx * 1.5
        } else {
            return ref.current.clientHeight;
        }
    }, [ref.current])

    /**
     * adjust font size so instructions fill the space available
     * @param instructions
     */
    function updateFontSize(instructions: string) {
        if (ref.current) {
            const calculatedFontSize = calculateFontSize(instructions)
            ref.current.style.fontSize = calculatedFontSize + 'px'
            // console.debug(`setting font size to ${calculatedFontSize}`)
        }
    }

    function calculateNumRowsAtFontSize(fontSize: number, instructions: string, width: number) {
        // todo: determine the width of each character instead of assuming all characters are the same width
        const words: string[] = instructions.split(/\s+/)
        let numRows: number = 0
        let curWidth: number = 0;
        words.forEach((word) => {
            const wordWidth = word.length * fontSize;
            if (curWidth + wordWidth < width) {
                curWidth += wordWidth + fontSize // include the space
            } else {
                numRows++;
                curWidth = wordWidth
            }
        })
        return numRows
    }

    function calculateFontSize(instructions: string) {
        let fontSize: number = 1;
        if (ref.current) {
            const maxHeight = ref.current.clientHeight > window.innerHeight * 0.7 ? ref.current.clientHeight : startingHeight
            console.debug(`calculateFontSize max height ${maxHeight}`)
            const width = ref.current.clientWidth;
            const numChars = instructions.length;
            const minFontSize = width / numChars  // fit everything onto 1 row
            const maxFontSize = Math.sqrt(width * maxHeight / numChars)
            for (let candidate = minFontSize; candidate < maxFontSize; candidate++) {
                const numRows = calculateNumRowsAtFontSize(candidate, instructions, width)
                const heightAtFontSize = numRows * candidate
                if (heightAtFontSize > maxHeight) {
                    // done
                    break;
                }
                fontSize = candidate;
            }
        }
        return Math.max(fontSize, minFontSizePx);
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
        if (ref.current) {
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
                          // height must not be relative to font size or updating fot size via ResizeObserver will
                          // infinite loop
                          minHeight: "1em",
                          height: "inherit",
                          overflow: "auto",
                          resize: "none",
                          border: "none",
                          alignContent: "center",
                          textAlign: "center",
                          // wordWrap: "normal", // this causes some infinite resizing loop when test is stopped in
                          // zoomed view
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
