import React, {useCallback, useContext, useEffect, useState} from "react";
import {RESULTS_DB, SimpleResultsDBRecord} from "./SimpleResultsDB.ts";
import {AppContext} from "./app-context.ts";
import {DebouncedTextArea} from "./DebouncedTextArea.tsx";
import {AppSettings, AppSettingType, SettingsListener} from "./app-settings.ts";
import {deepCopy} from "json-2-csv/lib/utils";
import {ResultsTable} from "./ResultsTable.tsx";
import {LabeledSection} from "./LabeledSection.tsx";
import {useSetting} from "./use-setting.ts";
import {MaskCreatableSelect} from "src/MaskCreatableSelect.tsx";

export function CurrentParticipantPanel() {
    const appContext = useContext(AppContext)

    // dummy state to allow forcing state to update so we can force a render
    const [, helpUpdateState] = useState({})
    const updateState = useCallback(() => {
        helpUpdateState({})
    }, []);

    const [testTemplate, setTestTemplate] = useSetting<Partial<SimpleResultsDBRecord>>(AppSettings.TEST_TEMPLATE)
    const [currentParticipantResults, setCurrentParticipantResults] = useState([] as SimpleResultsDBRecord[])
    const [selectedProtocol] = useSetting<string>(AppSettings.SELECTED_PROTOCOL)
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
        updateCurrentParticipantTests(testTemplate.Participant)
    }

    useEffect(() => {
        const settingsListener: SettingsListener = {
            subscriptions: () => [AppSettings.TEST_TEMPLATE],
            settingsChanged(setting: AppSettings, value: AppSettingType) {
                // assume we're getting the correct
                console.log(`setting ${setting} changed to ${JSON.stringify(value)} with stages ${JSON.stringify(appContext.settings.protocolStages)}`)
                updateCurrentParticipantTests((value as SimpleResultsDBRecord).Participant)
            }
        }
        appContext.settings.addListener(settingsListener)

        return () => {
            appContext.settings.removeListener(settingsListener)
        }
    }, []);

    useEffect(() => {
        console.debug(`testTemplate updated (via useEffect): ${JSON.stringify(testTemplate)}`)
        setCurrentParticipant(testTemplate.Participant??"")
    }, [testTemplate]);

    useEffect(() => {
        console.debug(`selectedProtocolChanged, num exercises is ${appContext.settings.numExercises}`)
        updateState()
    }, [selectedProtocol]);


    /**
     * We want to display all tests for the current participant from today.
     * @param participant
     */
    function updateCurrentParticipantTests(participant: string | undefined) {
        const today = new Date();
        participant = (participant??"").trim()

        // convert time back to local time
        const todayYyyymmdd = new Date(today.getTime() - today.getTimezoneOffset() * 60 * 1000).toISOString().substring(0, 10)
        // const todayYyyymmdd = new Date().toISOString().substring(0, 10)
        // console.log(`yyyymmdd is ${todayYyyymmdd}, today is ${today.toISOString()}`)
        RESULTS_DB.getData((record: SimpleResultsDBRecord) => {
            const recordDate = new Date(record.Time);
            const recordTime = new Date(recordDate.getTime() - recordDate.getTimezoneOffset() * 60 * 1000).toISOString().substring(0, 10);
            // console.debug(`yyyymmdd is ${todayYyyymmdd}, record time is ${recordTime}; looking for
            // '${participant}', found '${record.Participant}'`)
            return (record.Participant??"").trim() === participant
                && recordTime.startsWith(todayYyyymmdd)
        }).then(setCurrentParticipantResults)
    }

    async function deleteRows(rows: number[]) {
        await Promise.all(rows.map((id) => RESULTS_DB.deleteRecordById(id)));
        updateCurrentParticipantTests(testTemplate.Participant)
    }

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
                        <MaskCreatableSelect value={testTemplate.Mask} onChange={(value) => updateCurrentMask(value)}/>
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
            <LabeledSection>
                <legend>Results{(testTemplate.Participant ? ` for ${testTemplate.Participant}` : "")}</legend>
                <div style={{justifySelf: "center", maxWidth: "100%"}}>
                    <ResultsTable tableData={currentParticipantResults} setTableData={setCurrentParticipantResults}
                                  searchableColumns={[]} hideColumns={["Participant", "Time"]}
                                  minExercisesToShow={appContext.settings.numExercises}
                                  columnSortingSettingKey={AppSettings.PARTICIPANT_RESULTS_TABLE_SORT}
                                  columnFilterSettingKey={AppSettings.PARTICIPANT_RESULTS_TABLE_FILTER}
                                  deleteRowsCallback={deleteRows}
                    />
                </div>
            </LabeledSection>
        </div>

    )
}
