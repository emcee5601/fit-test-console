import {SampleSource, StandardProtocolDefinition} from "./simple-protocol.ts";
import {calculateSegmentConcentration, ProtocolExecutorListener, SegmentState} from "./protocol-executor.ts";
import {HTMLAttributes, PropsWithChildren, ReactElement, useContext, useEffect, useRef, useState} from "react";
import {AppContext, createDeviceSynchronizedProtocol} from "./app-context.ts";
import {formatDuration, formatFitFactor} from "./utils.ts";
import {
    AppSettings,
    calculateProtocolDuration,
    convertStagesToSegments,
    isThisAnExerciseSegment,
    ProtocolSegment
} from "./app-settings.ts";
import {ControlSource} from "./control-source.ts";
import {FitFactorResultsEvent, PortaCountListener} from "./portacount-client-8020.ts";
import "./protocol-executor.css"
import {useAnimationFrame} from "./assets/use-animation-frame.ts";
import {ProtocolSelectorWidget0} from "./ProtocolSelectorWidget0.tsx";
import {useSetting} from "./use-setting.ts";
import {ImPlay2, ImStop} from "react-icons/im";
import {useTimingSignal} from "src/timing-signal.ts";
import {SimpleResultsDBRecord} from "src/SimpleResultsDB.ts";
import {DataCollectorListener} from "src/data-collector.ts";
import {BsWind} from "react-icons/bs";
import {PiFaceMask, PiWatch} from "react-icons/pi";
import {IoGlassesOutline} from "react-icons/io5";
import {IconType} from "react-icons";

/**
 * Helper type. Maps from stage indexes or segment indexes to durations
 */
type IndexedDurations = { [key: number]: number };

type IconTextProps = {
    icon?: IconType,
    text?: string
}

/**
 * Renders svg icons and text together. Makes sure svg takes up full the height of the line.
 * @param icon
 * @param text
 * @param children
 * @constructor
 */
function IconText({icon, text, children}: PropsWithChildren<IconTextProps>) {
    return (<div className={"icon-text svg-container thin-border blue-bg number-field"}
                 style={{display: "inline-flex", gap: "0.2em"}}>
        <div className={"wide-display"}>{text}</div>
        <div className={"narrow-display"}>{icon ? icon({}) : null}</div>
        {children}
    </div>)
}

/**
 * Controls for running a custom protocol.
 * @constructor
 */
export function ProtocolExecutorPanel({...props}: {} & HTMLAttributes<HTMLElement>) {
    const appContext = useContext(AppContext)
    const protocolExecutor = appContext.protocolExecutor;
    const portaCountClient = appContext.portaCountClient;
    const dataCollector = appContext.dataCollector;
    const [currentSegment, setCurrentSegment] = useState<ProtocolSegment | undefined>()
    const [segmentStartTimeMs, setSegmentStartTimeMs] = useState(Date.now())
    // todo: save running state this to db so we can continue if the app reloads or navigating between tabs
    const [isProtocolRunning, setIsProtocolRunning] = useState<boolean>(false)
    const [selectedProtocolName] = useSetting<string>(AppSettings.SELECTED_PROTOCOL)
    const [currentTestData, setCurrentTestData] = useState<SimpleResultsDBRecord>({} as SimpleResultsDBRecord)
    const [uiUpdateNeeded, setUiUpdateNeeded] = useState<boolean>(true)
    const [segments, setSegments] = useState<ProtocolSegment[]>([])
    const [stages, setStages] = useState<StandardProtocolDefinition>([])
    const [deviceTestInProgress, setDeviceTestInProgress] = useState<boolean>(false)

    const [protocolDuration, setProtocolDuration] = useState<number>(0)
    const [segmentElements, setSegmentElements] = useState<ReactElement[]>([])
    const [stageElements, setStageElements] = useState<ReactElement[]>([])
    const [formattedProtocolElapsedTime, setFormattedProtocolElapsedTime] = useState<string>(formatDuration(0))
    const protocolPosPointerRef = useRef<HTMLDivElement>(null);
    const protocolExecutorPanelRef = useRef<HTMLFieldSetElement>(null);
    const lastKnownAmbient = protocolExecutor.lastAmbientSegment ? calculateSegmentConcentration(protocolExecutor.lastAmbientSegment) : undefined
    const currentSegmentConcentration = currentSegment ? calculateSegmentConcentration(currentSegment) : undefined;
    const estimatedFitFactor = lastKnownAmbient && currentSegmentConcentration ? formatFitFactor(lastKnownAmbient / currentSegmentConcentration) : "?"

    function getSegmentText(segment: ProtocolSegment) {
        const isExerciseSegment = isThisAnExerciseSegment(segment);
        const isCurrentSegment = segment.index === currentSegment?.index;
        const segmentRemainingTimeMs = segment.duration * 1000 - (Date.now() - segmentStartTimeMs);
        if (!isExerciseSegment) {
            return ""
        }
        const segmentResult = currentTestData[`Ex ${segment.exerciseNumber}`];
        if (segmentResult) {
            // this segment was completed
            return `done - ${segmentResult}`
        }
        if (!isCurrentSegment) {
            // future segment
            return formatDuration(1000 * segment.duration)
        }
        if (segmentRemainingTimeMs > 0) {
            // current segment in progress
            return `${formatDuration(segmentRemainingTimeMs)} (${estimatedFitFactor})`;
        }
        // these might be negative times. shouldn't generally get here since we'd have a result instead
        return `${formatDuration(segmentRemainingTimeMs)} (${estimatedFitFactor})`;
    }

    /**
     * Calculates total time, stage times, segment times.
     */
    function calculateTotalExpectedProtocolTime() {
        const stageTimes: IndexedDurations = {}
        const segmentTimes: IndexedDurations = {}
        const segmentDivs: ReactElement[] = []
        const stageExerciseNum: (null | number)[] = [] // the exercise num of the stage, or null if the stage is not an
                                                       // exercise stage
        // protocolExecutor does not set segments or stages until execution starts.
        const protocolTime: number = calculateProtocolDuration(segments)
        segments.forEach((segment: ProtocolSegment) => {
            // console.debug("rebuilding segment divs")
            segmentTimes[segment.index] = segment.duration
            stageTimes[segment.stageIndex] = (stageTimes[segment.stageIndex] ?? 0) + segment.duration
            // seems flex items won't shrink smaller than 1 character if there is text inside
            const isCurrentSegment = segment.index === currentSegment?.index;
            // display segment time, time remaining, or fit factor for this stage.
            segmentDivs.push(<div className={`segment-${segment.state} sample-source-${segment.source}`}
                                  key={`segment-${segment.index}`}
                                  style={{
                                      display: "block",
                                      flexGrow: `${segment.duration}`,
                                      // flexShrink: `${segment.duration}`,
                                      flexBasis: `${segment.duration}px`,
                                      minWidth: "2px",
                                      overflow: "clip",
                                      animation: isCurrentSegment ? "pulse-background infinite 1s ease-in-out alternate" : ""
                                  }}>{getSegmentText(segment)}</div>)
            stageExerciseNum[segment.stageIndex] = segment.exerciseNumber
        })

        const stageDivs: ReactElement[] = []
        Object.entries(stageTimes).forEach(([index, duration]) => {
            const stageIndex = Number(index);
            // protocols with no customizations are of the form ambient-mask-....-ambient, so make sure we account for
            // the auto-injected final ambient stage
            stageDivs.push(<div key={`stage-${index}`} style={{
                border: "1px solid black",
                display: "inline-block",
                flexGrow: `${duration}`,
                // flexShrink: `${duration}`,
                flexBasis: `${duration}px`,
                minWidth: "1px",
                maxHeight: "3rem",
                overflow: "clip",
            }}>{stageExerciseNum[stageIndex] ? `Ex ${stageExerciseNum[stageIndex]}: ` : ""}{stages[stageIndex].instructions.split(".")[0]}</div>)
        })

        setProtocolDuration(protocolTime)
        setSegmentElements(segmentDivs)
        setStageElements(stageDivs)
    }

    function updateSegment(segment: ProtocolSegment) {
        if (segment.index === 0) {
            // started
            // todo: executor should dispatch these as separate events
            calculateTotalExpectedProtocolTime()
        }
        setCurrentSegment(segment);
        setSegmentStartTimeMs(segment.segmentStartTimeMs || Date.now())
        setIsProtocolRunning(true) // in case the component is reloaded mid-protocol
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
            fitFactorResultsReceived(results: FitFactorResultsEvent) {
                if (results.exerciseNum === "Final") {
                    // done
                    setDeviceTestInProgress(false)
                    setCurrentSegment(undefined)
                } else {
                    // got results. figure out the next segment.
                    const nextSegment = segments.reduce((result:ProtocolSegment|null, candidate, index, segments) => {
                        if(result) {
                            return result; // found
                        }
                        if(candidate.exerciseNumber === results.exerciseNum as number +1) {
                            return segments[index]
                        }
                        return null;
                    }, null)
                    console.debug(`next segment is`, nextSegment, "segments:", segments)
                    setCurrentSegment(nextSegment|| undefined)
                    setSegmentStartTimeMs(results.timestamp)
                }
            },
        }
        portaCountClient.addListener(deviceTestObserver)
        return () => {portaCountClient.removeListener(deviceTestObserver)}
    }, [segments]);

    useEffect(() => {
        const protocolExecutorListener: ProtocolExecutorListener = {
            started() {
                setIsProtocolRunning(true)
            },
            segmentDataUpdated() {
                // todo: implement me
                // tick()
            },
            segmentChanged(segment: ProtocolSegment) {
                updateSegment(segment)
                // if segment.index == 0, we've started the protocol
            },
            cancelled() {
                if (protocolPosPointerRef.current) {
                    // todo: consolidate this call with the above
                    protocolPosPointerRef.current.classList.replace("in-progress", "paused")
                }
                setIsProtocolRunning(false)
                setCurrentSegment(undefined)
            },
            completed() {
                setIsProtocolRunning(false)
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
    }, [selectedProtocolName]);

    useEffect(() => {
        if (isProtocolRunning) {
            protocolExecutorPanelRef.current?.classList.replace("idle", "in-progress")
        } else {
            protocolExecutorPanelRef.current?.classList.replace("in-progress", "idle")
        }
    }, [isProtocolRunning]);

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
        setStages(protocol);
        setSegments(convertStagesToSegments(protocol))
        setUiUpdateNeeded(true)
    }

    function updateUi() {
        if (uiUpdateNeeded || currentSegment && currentSegment.state && currentSegment.state !== SegmentState.IDLE) {
            // only update if we're not idle
            setFormattedProtocolElapsedTime(formatDuration(calculateProtocolElapsedTimeMs(1000 * (currentSegment?.duration ?? 0))))
            // setSegmentElapsedTimeMs(Math.round(Date.now() - segmentStartTimeMs))
            calculateTotalExpectedProtocolTime()
            setUiUpdateNeeded(false)
        }
    }

    function calculateProtocolElapsedTimeMs(segmentDurationMs: number, capped:boolean = true) {
        const segmentElapsedTimeMs = Date.now() - segmentStartTimeMs;
        const cappedSegmentElapsedTimeMs = Math.min(segmentElapsedTimeMs, segmentDurationMs)
        return currentSegment ? currentSegment.protocolStartTimeOffsetSeconds * 1000 + (capped?cappedSegmentElapsedTimeMs:segmentElapsedTimeMs) : 0;
    }

    useAnimationFrame(() => {
        if (!isProtocolRunning && !deviceTestInProgress) {
            return;
        }
        // we don't care how far along the animation is. we just care that the pointer is at the right place vs the
        // time we started the segment/protocol
        if (protocolPosPointerRef.current) {
            const segmentDurationMs = 1000 * (currentSegment?.duration ?? 0);
            const protocolElapsedTimeMs = calculateProtocolElapsedTimeMs(segmentDurationMs, !deviceTestInProgress)
            // if we're capped, change the style of the pointer
            const segmentElapsedTimeMs = Date.now() - segmentStartTimeMs;
            if (segmentElapsedTimeMs >= segmentDurationMs) {
                // we seem to be at the end of the segment
                protocolPosPointerRef.current.classList.replace("in-progress", "paused")
            } else {
                protocolPosPointerRef.current.classList.replace("paused", "in-progress")
            }
            protocolPosPointerRef.current.style.right = `${100 - 0.1 * protocolElapsedTimeMs / protocolDuration}%`
        }
    }, [protocolDuration, segmentStartTimeMs])

    function handleStopButtonClick() {
        protocolExecutor.cancel();
    }

    function getMaskConcentrationFormatted(): string {
        if (!currentSegment) {
            return "?"
        }
        if (currentSegment.source === SampleSource.MASK) {
            if (currentSegmentConcentration && !isNaN(currentSegmentConcentration)) {
                return currentSegmentConcentration.toFixed(currentSegmentConcentration < 100 ? 1 : 0);
            }
        }
        return "?"
    }

    function getAmbientConcentrationFormatted(): string {
        if (!currentSegment) {
            return "?"
        }
        if (currentSegment.source === SampleSource.AMBIENT) {
            const ambient = calculateSegmentConcentration(currentSegment);
            if (ambient) {
                return ambient.toFixed(0);
            }
        }
        return lastKnownAmbient ? lastKnownAmbient.toFixed(0) : "?"
    }

    return (
        <section id="custom-control-panel" {...props}>
            <fieldset id={"protocol-executor-panel-main"} ref={protocolExecutorPanelRef} className={"idle"}
                      style={{minWidth: 0, overflow: "auto", paddingBottom: "0.2em"}}>
                <legend style={{
                    textAlign: "start",
                    display: "inline-flex",
                    flexWrap: "wrap",
                    paddingInline: "0.5rem",
                }}>Protocol <ProtocolSelectorWidget0/>
                    <button disabled={isProtocolRunning} className={"start"}
                            onClick={() => protocolExecutor.executeProtocol(segments)}>Start <ImPlay2/>
                    </button>
                    <button disabled={!isProtocolRunning} onClick={() => handleStopButtonClick()}
                            className={"stop"}>Stop <ImStop/></button>
                    <div style={{display: "inline-flex"}}>
                        <IconText icon={PiWatch}
                                  text="Time:">{formattedProtocolElapsedTime} / {formatDuration(protocolDuration * 1000)}</IconText>
                        <IconText icon={BsWind} text={"Ambient:"}>{getAmbientConcentrationFormatted()}</IconText>
                        <IconText icon={PiFaceMask} text="Mask:">{getMaskConcentrationFormatted()}</IconText>
                        <IconText icon={IoGlassesOutline} text={"Estimate:"}>{estimatedFitFactor}</IconText>
                    </div>
                </legend>
                <div id="protocol-visualizer-container" style={{minWidth: "fit-content"}}>
                    <section id={"protocol-visualizer"} style={{position: 'relative'}}>
                        <div id={"protocol-pos-pointer"} ref={protocolPosPointerRef}
                             className={"protocol-position-pointer paused"}
                             style={{
                                 float: "inline-start",
                                 zIndex: 1,
                             }}>
                        </div>
                        <div style={{
                            display: "flex",
                            flexWrap: "nowrap",
                            width: "100%",
                            minWidth: "100%",
                            backgroundColor: "lightgray",
                            height: "fit-content",
                            minHeight: "1rem"
                        }}>{stageElements}</div>
                        <div style={{
                            display: "flex",
                            flexWrap: "nowrap",
                            width: "100%",
                            minWidth: "100%",
                            backgroundColor: "lightgray",
                            height: "fit-content",
                            minHeight: "1rem"
                        }}>{segmentElements}</div>
                    </section>
                </div>
            </fieldset>
        </section>
    )
}
