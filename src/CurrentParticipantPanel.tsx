import React, {useCallback, useContext, useEffect, useState} from "react";
import {RESULTS_DB, SimpleResultsDBRecord} from "./SimpleResultsDB.ts";
import {AppContext} from "./app-context.ts";
import {DebouncedTextArea} from "./DebouncedTextArea.tsx";
import {AppSettings, AppSettingType, SettingsListener, useSetting} from "./app-settings.ts";
import {deepCopy} from "json-2-csv/lib/utils";
import {ResultsTable} from "./ResultsTable.tsx";
import CreatableSelect from "react-select/creatable";
import {useInterval} from "./useInterval.ts";

export function CurrentParticipantPanel() {
    const appContext = useContext(AppContext)

    // dummy state to allow forcing state to update so we can force a render
    const [, helpUpdateState] = useState({})
    const updateState = useCallback(() => {
        helpUpdateState({})
    }, []);

    const [testTemplate, setTestTemplate] = useSetting<Partial<SimpleResultsDBRecord>>(AppSettings.TEST_TEMPLATE)
    const [currentParticipantResults, setCurrentParticipantResults] = useState([] as SimpleResultsDBRecord[])
    const [maskList, setMaskList] = useState<string[]>([]) // todo: usememo here, and force an update when new masks are created
    const [currentParticipantElapsedTime, setCurrentParticipantElapsedTime] = useState<string>("0:00")

    function hasCurrentParticipant() {
        return testTemplate.Participant;
    }

    function updateCurrentParticipant(value: string) {
        console.debug(`updating current participant -> ${value}`)
        if(testTemplate.Participant !== value) {
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
        setCurrentParticipantElapsedTime("0:00")
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
        calculateCurrentParticipantElapsedTime()
    }


    async function loadAllMasksFromDb() {
        await RESULTS_DB.open()
        RESULTS_DB.getAllData().then((results) => {
            const dbMasks = results.reduce((masks, currentValue) => {
                // make sure mask has a value and strip that value of leading and trailing spaces
                masks.add(((currentValue.Mask as string) ?? "").trim())
                return masks;
            }, new Set<string>())
            setMaskList([...dbMasks].sort())
        })
    }

    useEffect(() => {
        const settingsListener: SettingsListener = {
            subscriptions: () => [AppSettings.TEST_TEMPLATE],
            settingsChanged(setting: AppSettings, value: AppSettingType) {
                // assume we're getting the correct
                console.log(`setting ${setting} changed to ${value} with stages ${JSON.stringify(appContext.settings.protocolStages)}`)
                updateCurrentParticipantTests((value as SimpleResultsDBRecord).Participant)
            }
        }
        appContext.settings.addListener(settingsListener)
        loadAllMasksFromDb()

        return () => {
            appContext.settings.removeListener(settingsListener)
        }
    }, []);

    useEffect(() => {
        console.debug(`testTemplate updated (via useEffect): ${JSON.stringify(testTemplate)}`)
        updateState()
    }, [testTemplate]);


    /**
     * We want to display all tests for the current participant from today.
     * @param participant
     */
    function updateCurrentParticipantTests(participant: string | undefined) {
        const today = new Date();
        // convert time back to local time
        const todayYyyymmdd = new Date(today.getTime() - today.getTimezoneOffset() * 60 * 1000).toISOString().substring(0, 10)
        // const todayYyyymmdd = new Date().toISOString().substring(0, 10)
        // console.log(`yyyymmdd is ${todayYyyymmdd}, today is ${today.toISOString()}`)
        RESULTS_DB.getAllData().then((results) => {
            const filteredResults = results.filter((record) => {
                    // make sure both dates are formatted the same way
                    const recordDate = new Date(record.Time);
                    const recordTime = new Date(recordDate.getTime() - recordDate.getTimezoneOffset() * 60 * 1000).toISOString().substring(0, 10);
                    // console.debug(`yyyymmdd is ${todayYyyymmdd}, record time is ${recordTime}; looking for '${participant}', found '${record.Participant}'`)
                    return record.Participant === participant
                        && recordTime.startsWith(todayYyyymmdd)
                }
            )
            setCurrentParticipantResults(filteredResults)
        })
    }


    function calculateCurrentParticipantElapsedTime() {
        if( !hasCurrentParticipant()) {
            // this shouldn't happen because useInterval would be called with null delay
            setCurrentParticipantElapsedTime("0:00")
        } else if( testTemplate.Time) {
            const startTime = new Date(testTemplate.Time)
            const elapsedMs = new Date().getTime() - startTime.getTime()
            const elapsedSec = Math.round(elapsedMs / 1000);
            const elapsedTime = `${Math.round(elapsedSec / 60)}:${String(Math.round(elapsedSec % 60)).padStart(2,"0")}`
            console.debug(`elapsed time: ${elapsedTime}`)
            setCurrentParticipantElapsedTime(elapsedTime)
        } else {
            setCurrentParticipantElapsedTime("0:00")
        }
    }

    useInterval(calculateCurrentParticipantElapsedTime, hasCurrentParticipant()?1000: null)

    return (
        <div id="current-test-results">
            <fieldset>
                <legend>Template</legend>
                <div style={{display: "flex", flexDirection: "row"}}>
                    <input type={"button"} value={"Next Participant"} onClick={nextParticipant}/>
                    <input type={"button"} value={"Next Mask"} onClick={nextMask}/>
                    <span>{currentParticipantElapsedTime}</span>
                </div>
                <div style={{display: "inline-flex", textAlign: "start", float: "inline-start"}}>
                    <fieldset style={{minWidth:"max-content"}}>
                        <legend>Participant</legend>
                        <DebouncedTextArea className="table-cell-input" placeholder={"Click to add Participant"}
                                           value={testTemplate.Participant as string}
                                           onChange={(value) => updateCurrentParticipant(value)}
                                           onInput={updateHeight}/>
                    </fieldset>
                    <fieldset>
                        <legend>Mask</legend>
                        <CreatableSelect
                            name={"Mask"}
                            options={maskList.map((maskName) => {
                                return {
                                    value: maskName,
                                    label: maskName
                                }
                            })}
                            value={testTemplate.Mask ? {value: testTemplate.Mask, label: testTemplate.Mask} : null}
                            styles={{
                                menu: (baseStyles) => ({
                                    ...baseStyles,
                                    zIndex: 2
                                }),
                                singleValue: (baseStyles) => ({
                                    ...baseStyles,
                                    whiteSpace: "normal", // disable truncating with ellipses
                                }),
                            }}
                            onChange={(event) => updateCurrentMask(event?.value as string)}
                            allowCreateWhileLoading={true}
                            isSearchable={true}
                            placeholder={"Click to add Mask"}
                        />

                    </fieldset>
                    <fieldset>
                        <legend>Notes</legend>
                        <DebouncedTextArea className="table-cell-input" placeholder={"Click to add Notes"}
                                           value={testTemplate.Notes as string}
                                           onChange={(value) => updateCurrentNotes(value)}
                                           onInput={updateHeight}/>
                    </fieldset>
                </div>
            </fieldset>
            <ResultsTable tableData={currentParticipantResults} setTableData={setCurrentParticipantResults}
                          searchableColumns={[]} hideColumns={["Participant", "Time"]}/>
        </div>

    )
}
