import {BsFastForwardBtnFill} from "react-icons/bs";
import {HiOutlineClipboardList} from "react-icons/hi";
import {IoPersonSharp} from "react-icons/io5";
import {PiFaceMask} from "react-icons/pi";
import {AppSettings} from "src/app-settings-types.ts";
import {MaskSelectorWidget} from "src/MaskSelectorWidget.tsx";
import {OverlayPanelWidget} from "src/OverlayPanelWidget.tsx";
import {TestNotesSelectorWidget} from "src/TestNotesSelectorWidget.tsx";
import {TodayParticipantSelectorWidget} from "src/TodayParticipantSelectorWidget.tsx";
import {TestTemplate} from "./SimpleResultsDB.ts";
import {useSetting} from "./use-setting.ts";

export function CurrentParticipantPanel() {
    const [testTemplate, setTestTemplate, getTestTemplate] = useSetting<TestTemplate>(AppSettings.TEST_TEMPLATE)

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

    function updateTestTemplate(props: TestTemplate) {
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


    return (
        <>
            <OverlayPanelWidget buttonIcon={<div id="compact-participant-info"
                                                   style={{
                                                       display: "inline-flex",
                                                       flexWrap: "nowrap",
                                                       overflowX: "scroll",
                                                       gap: "0.7em",
                                                       width: "100%",
                                                   }}>
                <span className="svg-container"><IoPersonSharp/>{testTemplate.Participant}</span>
                <span className="svg-container" style={{textWrap: "nowrap"}}><PiFaceMask/>{testTemplate.Mask}</span>
                <span className="svg-container"
                      style={{textWrap: "nowrap"}}><HiOutlineClipboardList/>{testTemplate.Notes}</span>
            </div>
            } position={"top"}>
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
            </OverlayPanelWidget>
        </>
    )
}
