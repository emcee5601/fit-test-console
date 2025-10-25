import {ReactElement, useContext, useEffect, useRef, useState} from "react";
import {AppSettings, ProtocolSegment} from "src/app-settings-types.ts";
import {DataCollectorListener} from "src/data-collector.ts";
import {Activity, ControlSource} from "src/portacount/porta-count-state.ts";
import {ProtocolExecutionState} from "src/protocol-execution-state.ts";
import {ProtocolExecutorListener} from "src/protocol-executor/protocol-executor-listener.ts";
import {ProtocolStageElement} from "src/ProtocolStageElement.tsx";
import {SimpleResultsDBRecord} from "src/SimpleResultsDB.ts";
import {useTimingSignal} from "src/timing-signal.ts";
import {updateBackgroundFillProgress} from "src/update-background-fill-progress.ts";
import {AppContext, createDeviceSynchronizedProtocol} from "./app-context.ts";
import {useAnimationFrame} from "./assets/use-animation-frame.ts";
import {FitFactorResultsEvent, PortaCountListener} from "./portacount-client-8020.ts";
import "./protocol-executor.css"
import {StandardProtocolDefinition} from "./simple-protocol.ts";
import {useSetting} from "./use-setting.ts";
import {calculateSegmentConcentration, formatFitFactor} from "./utils.ts";


/**
 * Controls for running a custom protocol.
 * @constructor
 */
export function ProtocolExecutorPanel() {
    const appContext = useContext(AppContext)
    const protocolExecutor = appContext.protocolExecutor;
    const portaCountClient = appContext.portaCountClient;
    const dataCollector = appContext.dataCollector;
    const [currentSegment, setCurrentSegment] = useState<ProtocolSegment | undefined>()
    const [segmentStartTimeMs, setSegmentStartTimeMs] = useState(Date.now())
    // todo: save running state this to db so we can continue if the app reloads or navigating between tabs
    const [protocolExecutorState] = useSetting<ProtocolExecutionState>(AppSettings.PROTOCOL_EXECUTION_STATE);
    const [selectedProtocolName] = useSetting<string>(AppSettings.SELECTED_PROTOCOL)
    const [currentTestData, setCurrentTestData] = useState<SimpleResultsDBRecord>({} as SimpleResultsDBRecord)
    const [uiUpdateNeeded, setUiUpdateNeeded] = useState<boolean>(true)
    const [segments, setSegments] = useState<ProtocolSegment[]>([])
    const [stages, setStages] = useState<StandardProtocolDefinition>([])
    const [deviceTestInProgress, setDeviceTestInProgress] = useState<boolean>(false)

    const [protocolDurationSeconds, setProtocolDurationSeconds] = useState<number>(0)
    const protocolExecutorPanelRef = useRef<HTMLDivElement>(null);
    const currentStageDivRef = useRef<HTMLDivElement>(null);
    const protocolVisualizerContainerRef = useRef<HTMLDivElement>(null);
    const protocolTimeRef = useRef<HTMLDivElement>(null);
    const lastKnownAmbient = protocolExecutor.lastAmbientSegment ? calculateSegmentConcentration(protocolExecutor.lastAmbientSegment) : undefined
    const currentSegmentConcentration = currentSegment ? calculateSegmentConcentration(currentSegment) : undefined;
    const estimatedFitFactor = lastKnownAmbient && currentSegmentConcentration ? formatFitFactor(lastKnownAmbient / currentSegmentConcentration) : "?"
    const [enableInstructionsZoom] = useSetting<boolean>(AppSettings.ENABLE_TEST_INSTRUCTIONS_ZOOM);
    const [activity] = useSetting<Activity>(AppSettings.ACTIVITY)
    const [zoomInstructions, setZoomInstructions] = useSetting<boolean>(AppSettings.ZOOM_INSTRUCTIONS)

    useEffect(() => {
        // make sure current segment is visible
        if (currentStageDivRef.current) {
            currentStageDivRef.current.scrollIntoView({behavior: "smooth", inline: "nearest"})
        }
    }, [currentSegment, currentStageDivRef]);
    useEffect(() => {
        setZoomInstructions(enableInstructionsZoom && activity === Activity.Testing)
    }, [enableInstructionsZoom, activity]);


    function updateSegment(segment: ProtocolSegment) {
        setCurrentSegment(segment);
        setSegmentStartTimeMs(segment.segmentStartTimeMs || Date.now())
    }

    /**
     * todo: look at template's time (which is the start time of the test) and the selected protocol and determine if
     * we're in the middle of a test. if so, look up which segment we should be in and update the current segment to
     * it.
     */
    function maybeContinueProtocolExecution() {
        if (protocolExecutor.currentSegment) {
            setCurrentSegment(protocolExecutor.currentSegment);
        }
    }

    useEffect(() => {
        const deviceTestObserver: PortaCountListener = {
            testStarted(timestamp: number) {
                setDeviceTestInProgress(true)
                setCurrentSegment(segments[0])
                setSegmentStartTimeMs(timestamp)
                updateProtocol({source: ControlSource.Internal})
            },
            testTerminated() {
                // test aborted
                setDeviceTestInProgress(false)
                setCurrentSegment(undefined)
            },
            testCompleted() {
                setDeviceTestInProgress(false)
                setCurrentSegment(undefined)
            },
            fitFactorResultsReceived(results: FitFactorResultsEvent) {
                // got results. figure out the next segment.
                const nextSegment = segments.reduce((result: ProtocolSegment | null, candidate, index, segments) => {
                    if (result) {
                        return result; // found
                    }
                    if (candidate.exerciseNumber === results.exerciseNum as number + 1) {
                        return segments[index]
                    }
                    return null;
                }, null)
                // console.debug(`next segment is`, nextSegment, "segments:", segments)
                setCurrentSegment(nextSegment || undefined)
                setSegmentStartTimeMs(results.timestamp)
            },
        }
        portaCountClient.addListener(deviceTestObserver)
        return () => {
            portaCountClient.removeListener(deviceTestObserver)
        }
        // todo: listen for selected_protocol setting change instead
        // todo: get segment info from protocol executor
        // todo: move listener to default useEffect
    }, [segments]);

    useEffect(() => {
        const protocolExecutorListener: ProtocolExecutorListener = {
            segmentDataUpdated() {
                // todo: implement me
                // tick()
            },
            segmentChanged(segment: ProtocolSegment) {
                updateSegment(segment)
                // if segment.index == 0, we've started the protocol
            },
            cancelled() {
                setCurrentSegment(undefined)
            },
            completed() {
                setCurrentSegment(undefined)
                // todo: display the final result
            },
        };
        const dataCollectorListener: DataCollectorListener = {
            currentTestUpdated(data: SimpleResultsDBRecord) {
                setCurrentTestData(data)
                setUiUpdateNeeded(true)
            }
        };

        protocolExecutor.addListener(protocolExecutorListener)
        dataCollector.addListener(dataCollectorListener)
        // appContext.timingSignal.addListener(timingSignalListener)

        updateProtocol({})

        maybeContinueProtocolExecution();
        return () => {
            protocolExecutor.removeListener(protocolExecutorListener);
            dataCollector.removeListener(dataCollectorListener)
        }
    }, []);

    useEffect(() => {
        setCurrentTestData({} as SimpleResultsDBRecord)
        updateProtocol({})
        setUiUpdateNeeded(true)
        setProtocolDurationSeconds(appContext.settings.getProtocolDuration(selectedProtocolName))
    }, [selectedProtocolName]);

    useEffect(() => {
        protocolExecutorPanelRef.current?.classList.remove("idle", "in-progress", "paused")

        switch (protocolExecutorState) {
            case "Idle":
                protocolExecutorPanelRef.current?.classList.add("idle")
                break;
            case "Paused":
                protocolExecutorPanelRef.current?.classList.add("paused")
                break;
            case "Executing":
                protocolExecutorPanelRef.current?.classList.add("in-progress")
                break;
        }
    }, [protocolExecutorState]);

    useTimingSignal(updateUi)

    function updateProtocol({protocolName = selectedProtocolName, source = ControlSource.External}: {
        protocolName?: string,
        source?: ControlSource
    }) {
        // todo: note when timings are altered because we're syncing to internal timings
        // todo: add executor switch so both timings can be shown?
        const protocol = source === ControlSource.External
            ? appContext.settings.getProtocolDefinition(protocolName) // external control
            : createDeviceSynchronizedProtocol(protocolName) // internal control

        setSegments(protocolExecutor.segments)

        setStages(protocol);
        setUiUpdateNeeded(true)
    }

    function updateUi() {
        if (uiUpdateNeeded || currentSegment) {
            // setSegmentElapsedTimeMs(Math.round(Date.now() - segmentStartTimeMs))
            setUiUpdateNeeded(false)
        }
    }

    function calculateProtocolElapsedTimeMs(segmentDurationMs: number, capped: boolean = true) {
        const segmentElapsedTimeMs = Date.now() - segmentStartTimeMs;
        const cappedSegmentElapsedTimeMs = Math.min(segmentElapsedTimeMs, segmentDurationMs)
        return currentSegment ? currentSegment.protocolStartTimeOffsetSeconds * 1000 + (capped ? cappedSegmentElapsedTimeMs : segmentElapsedTimeMs) : 0;
    }

    useAnimationFrame(() => {
        const minProgress = 0.02
        if (protocolExecutorState === "Executing" || deviceTestInProgress) {
            // we don't care how far along the animation is. we just care that the pointer is at the right place vs the
            // time we started the segment/protocol
            const segmentDurationMs = 1000 * (currentSegment?.duration ?? 0);
            const protocolElapsedTimeMs = calculateProtocolElapsedTimeMs(segmentDurationMs, !deviceTestInProgress)

            const progress = Math.max(minProgress, Math.min(1, 0.001 * protocolElapsedTimeMs / protocolDurationSeconds));
            updateBackgroundFillProgress(protocolTimeRef, progress)
        } else if (protocolExecutorState === "Idle") {
            updateBackgroundFillProgress(protocolTimeRef, minProgress)
        } else {
            // paused. do nothing
        }
    }, [deviceTestInProgress, currentSegment, protocolExecutorState]);

    useEffect(() => {
        setZoomInstructions(enableInstructionsZoom && activity === Activity.Testing)
    }, [activity, enableInstructionsZoom]);


    function getProtocolStageElements() {
        const elements: ReactElement[] = []
        let exerciseNum = 0;
        stages.forEach((stage, stageIndex) => {
            if (stage.mask_sample) {
                exerciseNum++;
            }
            const isCurrentStage = currentSegment && currentSegment.stageIndex === stageIndex;
            const refParts = isCurrentStage ? {elementRef: currentStageDivRef} : {}
            elements.push(<ProtocolStageElement key={stageIndex} {...refParts}
                                                stage={stage}
                                                exerciseNum={stage.mask_sample ? exerciseNum : undefined}
                                                currentTestResults={currentTestData}
                                                currentEstimate={isCurrentStage ? estimatedFitFactor : undefined}
                                                stageIndex={stageIndex}
            />)
        });
        return elements;
    }

    return (
        <section id="custom-control-panel" style={{
            height: zoomInstructions ? "inherit" : "auto",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column"
        }}>
            <div id={"protocol-executor-panel-main"} ref={protocolExecutorPanelRef} className={"idle thin-border"}>
                <div id={"protocol-visualizer-container"} ref={protocolVisualizerContainerRef}>
                    {getProtocolStageElements()}
                </div>
            </div>
        </section>
    )
}
