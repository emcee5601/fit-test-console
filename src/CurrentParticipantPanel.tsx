import {HiOutlineClipboardList} from "react-icons/hi";
import {IoPersonSharp} from "react-icons/io5";
import {PiFaceMask} from "react-icons/pi";
import {SimpleResultsDBRecord} from "./SimpleResultsDB.ts";
import {useSetting} from "./use-setting.ts";
import {MaskSelectorWidget} from "src/MaskSelectorWidget.tsx";
import {TodayParticipantSelectorWidget} from "src/TodayParticipantSelectorWidget.tsx";
import {TestNotesSelectorWidget} from "src/TestNotesSelectorWidget.tsx";
import {BsFastForwardBtnFill} from "react-icons/bs";
import {AppSettings} from "src/app-settings-types.ts";
import "./CurrentParticipantPanel.css"

type DisplayMode = "compact" | "editor" | "overlay-editor"

type CurrentParticipantPanelProps = {mode:DisplayMode}
export function CurrentParticipantPanel(props: CurrentParticipantPanelProps) {
    const [testTemplate, setTestTemplate, getTestTemplate] = useSetting<Partial<SimpleResultsDBRecord>>(AppSettings.TEST_TEMPLATE)

    function updateCurrentParticipant(value: string) {
        value = value.trim() // strip extraneous spaces
        updateTestTemplate({
            Participant: value,
            Time: testTemplate.Participant !== value
                ? new Date().toISOString() // todo: does this need to be localtime?
                : testTemplate.Time, // participant unchanged, don't change the time
        });
    }

    function updateCurrentMask(value: string) {
        updateTestTemplate({Mask: value});
    }

    function updateCurrentNotes(value: string) {
        updateTestTemplate({Notes: value});
    }

    function updateTestTemplate(props: Partial<SimpleResultsDBRecord>) {
        // propagate changes to settings (don't edit testTemplate directly since it's passed as reference from settings)
        const newTemplate = {}
        // get the realtime value of template here since changes otherwise propagate via useState is too slow.
        Object.assign(newTemplate, getTestTemplate()) // realtime
        Object.assign(newTemplate, props)
        console.debug(`updateTestTemplate -> ${JSON.stringify(newTemplate)}`);
        setTestTemplate(newTemplate) // copy to force React to see the update
        // update the template in realtime since propagation via useState is too slow.
        // settings.setTestTemplate(newTemplate) // realtime
    }

    function nextParticipant() {
        updateTestTemplate({Participant: "", Mask: "", Notes: ""})
    }

    function nextMask() {
        updateTestTemplate({Mask: "", Notes: ""})
    }


    // todo: 3 modes: compact display mode, editing mode, overlay editing mode
    return (
        <>
            <input className="participant-info-checkbox" id="participant-info-checkbox" type="checkbox"/>
            <label id="compact-participant-info" htmlFor="participant-info-checkbox"
                   style={{
                       display: props.mode === "compact" ? "inline-flex" : "none",
                       flexWrap: "nowrap",
                       overflow: "scroll",
                       gap: "0.7em",
                       width: "100%"
                   }}>
                <span className="svg-container"><IoPersonSharp/>{testTemplate.Participant}</span>
                <span className="svg-container" style={{textWrap: "nowrap"}}><PiFaceMask/>{testTemplate.Mask}</span>
                <span className="svg-container"
                      style={{textWrap: "nowrap"}}><HiOutlineClipboardList/>{testTemplate.Notes}</span>
            </label>
            <div id="current-participant-panel" className={props.mode === "editor" ? "" : "overlay-participant-info"}>
                <div>
                    <div id={"participant-parameters"}
                         style={{
                             display: "flex",
                             textAlign: "start",
                             flexDirection: "row",
                             flexWrap: "wrap",
                             gap: "2px",
                         }}>
                        <div className={`thin-border-2 participant-info`}>
                            <TodayParticipantSelectorWidget
                                value={testTemplate.Participant}
                                onChange={(value) => updateCurrentParticipant(value || "")}
                                label={
                                    <span id={`smart-text-area-participant-label`}
                                          className={"smart-text-area-label"}>Name <div className={"svg-container"}>
                                    <BsFastForwardBtnFill onClick={() => nextParticipant()}/>
                                </div></span>
                                }
                            />
                        </div>
                        <div className={`thin-border-2 participant-info`}>
                            <MaskSelectorWidget value={testTemplate.Mask}
                                                id={"mask"}
                                                onChange={(value) => updateCurrentMask(value || "")}
                                                label={
                                                    <span id={`smart-text-area-mask-label`}
                                                          className={"smart-text-area-label"}>Mask <div
                                                        className={"svg-container"}>
                                                    <BsFastForwardBtnFill onClick={() => nextMask()}/>
                                                </div></span>
                                                }
                            />
                        </div>
                        <div className={`thin-border-2 participant-info remainder`} style={{flexGrow: 1}}>
                            <TestNotesSelectorWidget value={testTemplate.Notes} label={"Notes"}
                                                     onChange={(value) => updateCurrentNotes(value || "")}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <label className="participant-checkbox-overlay" htmlFor="participant-info-checkbox"></label>
        </>
    )
}
