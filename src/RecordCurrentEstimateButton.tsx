import {useContext, useEffect, useState} from "react";
import {BsRecordCircle} from "react-icons/bs";
import {AppContext} from "src/app-context.ts";
import {AppSettings} from "src/app-settings-types.ts";
import {ParticleCountStats} from "src/particle-count-stats.ts";
import {ParticleConcentrationEvent} from "src/portacount-client-8020.ts";
import {ConnectionStatus, ControlSource, SampleSource} from "src/portacount/porta-count-state.ts";
import {ProtocolExecutionState} from "src/protocol-execution-state.ts";
import {TestTemplate} from "src/SimpleResultsDB.ts";
import {useSetting} from "src/use-setting.ts";

export function RecordCurrentEstimateButton() {
    const appContext = useContext(AppContext)
    const [currentAmbientAverage] = useSetting<ParticleCountStats>(AppSettings.CURRENT_AMBIENT_AVERAGE)
    const [currentMaskAverage] = useSetting<ParticleCountStats>(AppSettings.CURRENT_MASK_AVERAGE)
    const dataCollector = appContext.dataCollector;
    const [protocolExecutorState] = useSetting<ProtocolExecutionState>(AppSettings.PROTOCOL_EXECUTION_STATE)
    const [connectionStatus] = useSetting<ConnectionStatus>(AppSettings.CONNECTION_STATUS)
    const [testTemplate] = useSetting<TestTemplate>(AppSettings.TEST_TEMPLATE)
    const [startNewTestOnClick, setStartNewTestOnClick] = useState<boolean>(true)
    const shouldBeDisabled = protocolExecutorState !== "Idle" || connectionStatus !== ConnectionStatus.RECEIVING;

    useEffect(() => {
        // if mask, participant, or notes change, move on to a new test.
        console.debug("template updated")
        setStartNewTestOnClick(true)
    }, [testTemplate, testTemplate.Participant, testTemplate.Mask, testTemplate.Notes]);

    async function handleOnClick() {
        if (shouldBeDisabled) {
            // protocol in progress or portacount not ready
            return;
        }
        if (!dataCollector.hasCurrentTestData() || startNewTestOnClick) {
            // allow multiple manual entries per test
            await dataCollector.recordTestStart(ControlSource.Manual, undefined, "Estimated")
            setStartNewTestOnClick(false)
        }
        dataCollector.recordParticleCount(new ParticleConcentrationEvent(currentAmbientAverage.mean, SampleSource.AMBIENT, ControlSource.Manual, currentAmbientAverage.stddev))
        dataCollector.recordParticleCount(new ParticleConcentrationEvent(currentMaskAverage.mean, SampleSource.MASK, ControlSource.Manual))
        dataCollector.recordNextExerciseResult(currentAmbientAverage.mean / Math.max(0.01, currentMaskAverage.mean))
    }

    return (
        <div id={"record-current-estimate"} onClick={handleOnClick}
             className={`svg-container icon-button ${shouldBeDisabled ? "disabled" : ""}`}>
            <BsRecordCircle/></div>
    )
}
