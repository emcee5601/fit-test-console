import {useCallback, useContext, useEffect, useState} from "react";
import {AppContext} from "src/app-context.ts";
import {AppSettings, AppSettingType} from "src/app-settings-types.ts";
import {SettingsListener} from "src/app-settings.ts";
import {LabeledSection} from "src/LabeledSection.tsx";
import {ManualEntryButton} from "src/ManualEntryButton.tsx";
import {ResultsTable} from "src/ResultsTable.tsx";
import {RESULTS_DB, SimpleResultsDBRecord, TestTemplate} from "src/SimpleResultsDB.ts";
import {useSetting} from "src/use-setting.ts";

export function CurrentParticipantResults() {
    const appContext = useContext(AppContext)

    // dummy state to allow forcing state to update so we can force a render
    const [, helpUpdateState] = useState({})
    const updateState = useCallback(() => {
        helpUpdateState({})
    }, []);

    const [selectedProtocol] = useSetting<string>(AppSettings.SELECTED_PROTOCOL)
    const [testTemplate] = useSetting<TestTemplate>(AppSettings.TEST_TEMPLATE)
    const [currentParticipantResults, setCurrentParticipantResults] = useState([] as SimpleResultsDBRecord[])

    useEffect(() => {
        const settingsListener: SettingsListener = {
            subscriptions: () => [AppSettings.TEST_TEMPLATE],
            settingsChanged(setting: AppSettings, value: AppSettingType) {
                // assume we're getting the correct
                console.log(`setting ${setting} changed to ${JSON.stringify(value)}`)
                updateCurrentParticipantTests((value as SimpleResultsDBRecord).Participant)
            }
        }
        appContext.settings.addListener(settingsListener)

        updateCurrentParticipantTests(testTemplate.Participant)

        return () => {
            appContext.settings.removeListener(settingsListener)
        }
    }, []);

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
        participant = (participant ?? "").trim()

        // convert time back to local time
        const todayYyyymmdd = new Date(today.getTime() - today.getTimezoneOffset() * 60 * 1000).toISOString().substring(0, 10)
        // const todayYyyymmdd = new Date().toISOString().substring(0, 10)
        // console.log(`yyyymmdd is ${todayYyyymmdd}, today is ${today.toISOString()}`)
        RESULTS_DB.getData((record: SimpleResultsDBRecord) => {
            const recordDate = new Date(record.Time);
            const recordTime = new Date(recordDate.getTime() - recordDate.getTimezoneOffset() * 60 * 1000).toISOString().substring(0, 10);
            // console.debug(`yyyymmdd is ${todayYyyymmdd}, record time is ${recordTime}; looking for
            // '${participant}', found '${record.Participant}'`)
            return (record.Participant ?? "").trim() === participant
                && recordTime.startsWith(todayYyyymmdd)
        }).then((results) => {
            setCurrentParticipantResults(results)
        })
    }

    async function deleteRows(rows: number[]) {
        await Promise.all(rows.map((id) => RESULTS_DB.deleteRecordById(id)));
        updateCurrentParticipantTests(testTemplate.Participant)
    }

    return (
        <div id="current-participant-info">
            <LabeledSection>
                <legend><div style={{display:"inline-flex", gap:"0.7em"}}>
                    Results{(testTemplate.Participant ? ` for ${testTemplate.Participant}` : "")} <ManualEntryButton text={"Manual Entry"}/>
                </div>
                </legend>
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
