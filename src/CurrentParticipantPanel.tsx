import {useContext, useEffect, useState} from "react";
import {SimpleResultsDBRecord} from "./SimpleResultsDB.ts";
import {DebouncedTextArea} from "./DebouncedTextArea.tsx";
import {AppSettings} from "./app-settings.ts";
import {deepCopy} from "json-2-csv/lib/utils";
import {LabeledSection} from "./LabeledSection.tsx";
import {useSetting} from "./use-setting.ts";
import {SimpleMaskSelector} from "src/SimpleMaskSelector.tsx";
import {AppContext} from "src/app-context.ts";
import {ControlSource} from "src/control-source.ts";

export function CurrentParticipantPanel() {
    const appContext = useContext(AppContext);
    const [testTemplate, setTestTemplate] = useSetting<Partial<SimpleResultsDBRecord>>(AppSettings.TEST_TEMPLATE)
    const [currentParticipant, setCurrentParticipant] = useState<string>(testTemplate.Participant ?? "")

    function updateCurrentParticipant(value: string) {
        value = value.trim() // strip extraneous spaces
        console.debug(`updating current participant -> '${value}'`)
        if (testTemplate.Participant !== value) {
            // participant name changed, update start time
            testTemplate.Time = new Date().toISOString(); // todo: does this need to be localtime?
        }
        testTemplate.Participant = value;
        updateTestTemplate();
    }

    function updateCurrentMask(value: string) {
        testTemplate.Mask = value ? value.trim() : "";
        updateTestTemplate();
    }

    function updateCurrentNotes(value: string) {
        testTemplate.Notes = value;
        updateTestTemplate();
    }

    function nextParticipant() {
        // latestResult is a const. just clear all its internals
        testTemplate.Participant = ""
        testTemplate.Mask = ""
        testTemplate.Notes = ""
        testTemplate.Time = new Date().toISOString(); // todo: does this need to be localtime?
        updateTestTemplate();
    }

    function nextMask() {
        // latestResult is a const. just clear all its internals
        testTemplate.Mask = ""
        testTemplate.Notes = ""
        updateTestTemplate();
    }

    function updateTestTemplate() {
        console.debug(`updateTestTemplate -> ${JSON.stringify(testTemplate)}`);
        setTestTemplate(deepCopy(testTemplate)) // copy to force React to see the update
    }

    useEffect(() => {
        console.debug(`testTemplate updated (via useEffect): ${JSON.stringify(testTemplate)}`)
        setCurrentParticipant(testTemplate.Participant ?? "")
    }, [testTemplate]);


    function manualEntry() {
        appContext.dataCollector.recordTestStart(ControlSource.Manual)
    }

    return (
        <div id="current-participant-panel">
            <LabeledSection>
                <legend>Current Participant <button onClick={() => manualEntry()}>Manual Entry</button></legend>
                <div style={{
                    display: "flex",
                    textAlign: "start",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifySelf: "center"
                }}>
                    <fieldset className={"info-box-compact"}>
                        <legend>Participant <input id={"next-participant-button"} type={"button"}
                                                   value={"Next participant"}
                                                   onClick={nextParticipant}/>
                        </legend>
                        <DebouncedTextArea className="table-cell-input" placeholder={"Click to add Participant"}
                                           value={currentParticipant}
                                           onChange={(value) => updateCurrentParticipant(value)}
                        />
                    </fieldset>
                    <fieldset className={"info-box-compact"} style={{width: "25ch"}}>
                        <legend>Mask <input id={"next-mask-button"} type={"button"} value={"Next mask"}
                                            onClick={nextMask}/>
                        </legend>
                        <SimpleMaskSelector value={testTemplate.Mask} onChange={(value) => updateCurrentMask(value)}
                                            allowCreate={true} showClearControl={true}/>
                    </fieldset>
                    <fieldset className={"info-box-compact"} style={{width: "25ch"}}>
                        <legend>Notes</legend>
                        <DebouncedTextArea className="table-cell-input" placeholder={"Click to add Notes"}
                                           value={testTemplate.Notes as string}
                                           onChange={(value) => updateCurrentNotes(value)}
                        />
                    </fieldset>
                </div>
            </LabeledSection>
        </div>

    )
}
