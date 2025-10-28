import {useContext, useEffect, useRef, useState} from "react";
import {AppSettings} from "src/app-settings-types.ts";
import {useAnimationFrame} from "src/assets/use-animation-frame.ts";
import {ProtocolExecutionState} from "src/protocol-execution-state.ts";
import {getStageDuration} from "src/protocol-executor/utils.ts";
import {TestTemplate} from "src/SimpleResultsDB.ts";
import {updateBackgroundFillProgress} from "src/update-background-fill-progress.ts";
import {useSetting} from "src/use-setting.ts";
import {AppContext} from "./app-context.ts";

const LOREM_IPSUM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

export function TestInstructionsPanel() {
    const appContext = useContext(AppContext)
    const [instructions, setInstructions] = useState<string>("")
    const [stageTitle, setStageTitle] = useState<string>("")
    const ref = useRef<HTMLTextAreaElement>(null)
    const [fontSizeSliderValue, setFontSizeSliderValue] = useState<number>(2)
    const [currentStageIndex] = useSetting<number>(AppSettings.CURRENT_STAGE_INDEX)
    const [stageStartTime] = useSetting<number>(AppSettings.STAGE_START_TIME)
    const [selectedProtocol] = useSetting<string>(AppSettings.SELECTED_PROTOCOL)
    const [protocolExecutionState] = useSetting<ProtocolExecutionState>(AppSettings.PROTOCOL_EXECUTION_STATE)
    const [testTemplate] = useSetting<TestTemplate>(AppSettings.TEST_TEMPLATE)

    useEffect(() => {
        if (ref.current) {
            ref.current.style.fontSize = `${fontSizeSliderValue}em`
        }
    }, [fontSizeSliderValue]);

    useEffect(() => {
        console.debug(`protocolExecutionState ${protocolExecutionState}`)
        if(protocolExecutionState === "Idle") {
            // done executing, show final result
            console.debug("test template is ", testTemplate)
            if(testTemplate.Final) {
                setInstructions(`Test complete. Final score is ${testTemplate.Final}.`)
                setStageTitle("Summary")
            }
            return;
        }
        const protocolDefinition = appContext.settings.getProtocolDefinition(selectedProtocol);
        const stage = protocolDefinition[currentStageIndex]
        if(stage.instructions) {
            setInstructions(stage.instructions.replace(/\.\s+/, ".\n"))
        } else {
            console.warn(`no instructions for protocol ${selectedProtocol} stage ${currentStageIndex}`)
            setInstructions("-")
        }
        if(stage.title) {
            setStageTitle(stage.title)
        }
    }, [currentStageIndex, selectedProtocol, protocolExecutionState, testTemplate]);


    useAnimationFrame(() => {
        switch (protocolExecutionState) {
            case "Idle":
                updateBackgroundFillProgress(ref, 0)
                break;
            case "Executing": {
                const stageDurationSeconds = getStageDuration(appContext.settings.getProtocolDefinition(selectedProtocol)[currentStageIndex])
                const elapsedMs = Date.now() - stageStartTime
                updateBackgroundFillProgress(ref, Math.min(1, 0.001 * elapsedMs / stageDurationSeconds))
                break;
            }
            case "Paused":
                // do nothing
                break
        }
    }, [stageStartTime, currentStageIndex, protocolExecutionState])

    return (
        <fieldset style={{display: "flex", flexDirection: "column", flexGrow: 1}} className={"info-box-compact"}>
            <legend>Instructions ({stageTitle}) <input type="range" min={1} max={5} value={fontSizeSliderValue} step={0.01}
                                        onChange={(event) => setFontSizeSliderValue(Number(event.target.value))}/>
            </legend>
            <textarea id="test-instructions"
                      ref={ref}
                      className={"no-focus-border"}
                      style={{
                          flexGrow: 1,
                          width: "100%",
                          // height must not be relative to font size or updating fot size via ResizeObserver will
                          // infinite loop
                          minHeight: "1em",
                          height: "inherit",
                          overflow: "auto",
                          resize: "none",
                          border: "none",
                          alignContent: "start",
                          textAlign: "start",
                          // wordWrap: "normal", // this causes some infinite resizing loop when test is stopped in
                          // zoomed view
                          textWrap: "wrap",
                          whiteSpaceCollapse: "collapse",
                      }}
                      readOnly={true}
                      value={instructions}
                      onChange={() => null}
                      placeholder={LOREM_IPSUM}
            ></textarea>
        </fieldset>
    )
}
