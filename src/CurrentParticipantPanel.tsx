import {useCallback, useContext, useEffect, useState} from "react";
import {SimpleResultsDBRecord} from "./SimpleResultsDB.ts";
import {AppSettings} from "./app-settings.ts";
import {LabeledSection} from "./LabeledSection.tsx";
import {useSetting} from "./use-setting.ts";
import {AppContext} from "src/app-context.ts";
import {ControlSource} from "src/control-source.ts";
import {MaskSelectorWidget} from "src/MaskSelectorWidget.tsx";
import {TodayParticipantSelectorWidget} from "src/TodayParticipantSelectorWidget.tsx";
import {TestNotesSelectorWidget} from "src/TestNotesSelectorWidget.tsx";

export function CurrentParticipantPanel() {
    const appContext = useContext(AppContext);
    const [testTemplate, setTestTemplate] = useSetting<Partial<SimpleResultsDBRecord>>(AppSettings.TEST_TEMPLATE)
    const [, helpUpdateState] = useState({})
    const updateState = useCallback(() => {
        helpUpdateState({})
    }, []);

    useEffect(() => {
        // update our ui state when the template updates
        updateState()
    }, [testTemplate]);

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
        Object.assign(newTemplate, testTemplate)
        Object.assign(newTemplate, props)
        console.debug(`updateTestTemplate -> ${JSON.stringify(newTemplate)}`);
        setTestTemplate(newTemplate) // copy to force React to see the update
    }

    function manualEntry() {
        appContext.dataCollector.recordTestStart(ControlSource.Manual)
    }

    return (
        <div id="current-participant-panel">
            <LabeledSection>
                <legend>Current Participant <button onClick={() => manualEntry()}>Manual Entry</button></legend>
                <div id={"participant-parameters"}
                     style={{
                         display: "flex",
                         textAlign: "start",
                         flexDirection: "row",
                         flexWrap: "wrap",
                         gap: "2px",
                     }}>
                    <div className={"thin-border-2"}>
                        <TodayParticipantSelectorWidget
                            value={testTemplate.Participant} label={"Participant"}
                            onChange={(value) => updateCurrentParticipant(value || "")}
                        />
                    </div>
                    <div className={"thin-border-2"}>
                        <MaskSelectorWidget value={testTemplate.Mask} label={"Mask"}
                                            onChange={(value) => updateCurrentMask(value || "")}/>
                    </div>
                    <div className={"thin-border-2"}>
                        <TestNotesSelectorWidget value={testTemplate.Notes} label={"Notes"}
                                                 onChange={(value) => updateCurrentNotes(value || "")}
                        />
                    </div>
                </div>
            </LabeledSection>
        </div>

    )
}
