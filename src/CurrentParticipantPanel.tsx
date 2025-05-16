import React, {useEffect, useState} from "react";
import {SimpleResultsDBRecord} from "./SimpleResultsDB.ts";
import {DebouncedTextArea} from "./DebouncedTextArea.tsx";
import {AppSettings} from "./app-settings.ts";
import {deepCopy} from "json-2-csv/lib/utils";
import {LabeledSection} from "./LabeledSection.tsx";
import {useSetting} from "./use-setting.ts";
import {SimpleMaskSelector} from "src/SimpleMaskSelector.tsx";

export function CurrentParticipantPanel() {
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

    function updateHeight(event: React.FormEvent<HTMLTextAreaElement>) {
        const textArea = event.target as HTMLTextAreaElement
        textArea.style.height = "auto";
        textArea.style.height = textArea.scrollHeight + "px";
        // console.log(`updateHeight, set to ${event.target.style.height}, should be ${event.target.scrollHeight}`)
    }

    function updateTestTemplate() {
        console.debug(`updateTestTemplate -> ${JSON.stringify(testTemplate)}`);
        setTestTemplate(deepCopy(testTemplate)) // copy to force React to see the update
    }

    useEffect(() => {
        console.debug(`testTemplate updated (via useEffect): ${JSON.stringify(testTemplate)}`)
        setCurrentParticipant(testTemplate.Participant??"")
    }, [testTemplate]);

    return (
        <div id="current-test-results">
            <LabeledSection>
                <legend>Current Participant
                    <input id={"next-participant-button"} type={"button"} value={"Next participant"}
                           onClick={nextParticipant}/>
                    <input id={"next-mask-button"} type={"button"} value={"Next mask"} onClick={nextMask}/></legend>
                <div style={{
                    display: "flex",
                    textAlign: "start",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifySelf: "center"
                }}>
                    {/*{showRemainingEventTime && <EventTimeWidget/>}*/}
                    {/*{showElapsedParticipantTime && <CurrentParticipantTimeWidget/>}*/}

                    <fieldset className={"info-box-compact"}>
                        <legend>Participant</legend>
                        <DebouncedTextArea className="table-cell-input" placeholder={"Click to add Participant"}
                                           value={currentParticipant}
                                           onChange={(value) => updateCurrentParticipant(value)}
                                           onInput={updateHeight}
                        />
                    </fieldset>
                    <fieldset className={"info-box-compact"} style={{width: "25ch"}}>
                        <legend>Mask</legend>
                        <SimpleMaskSelector value={testTemplate.Mask} onChange={(value) => updateCurrentMask(value)} allowCreate={true}/>
                    </fieldset>
                    <fieldset className={"info-box-compact"} style={{width: "25ch"}}>
                        <legend>Notes</legend>
                        <DebouncedTextArea className="table-cell-input" placeholder={"Click to add Notes"}
                                           value={testTemplate.Notes as string}
                                           onChange={(value) => updateCurrentNotes(value)}
                                           onInput={updateHeight}/>
                    </fieldset>
                </div>
            </LabeledSection>
        </div>

    )
}
