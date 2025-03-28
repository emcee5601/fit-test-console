import {SampleSource, Segment, SegmentState} from "./simple-protocol.ts";
import {calculateSegmentConcentration, ProtocolListener} from "./protocol-executor.ts";
import {useContext, useEffect, useState} from "react";
import {AppContext} from "./app-context.ts";
import {useInterval} from "./useInterval.ts";
import {formatFitFactor} from "./utils.ts";
import {AppSettings, useSetting} from "./app-settings.ts";
import {ControlSource} from "./control-source.ts";
import {PortaCountListener} from "./portacount-client-8020.ts";

/**
 * Controls for running a custom protocol.
 * @constructor
 */
export function ProtocolExecutorPanel() {
    const appContext = useContext(AppContext)
    const protocolExecutor = appContext.protocolExecutor;
    const portaCountClient = appContext.portaCountClient;
    const [segment, setSegment] = useState<Segment | undefined>()
    const [segmentElapsedTime, setSegmentElapsedTime] = useState(0)
    const [segmentStartTime, setSegmentStartTime] = useState(Date.now())
    // todo: save running state this to db so we can continue if the app reloads or navigating between tabs
    const [protocolRunning, setProtocolRunning] = useState<boolean>(false)
    const [selectedProtocol] = useSetting(AppSettings.SELECTED_PROTOCOL)
    function shouldEnableStartButton(controlSource: ControlSource): boolean {
        return controlSource === ControlSource.External && !protocolExecutor.isTestInProgress
    }
    const [enableStartButton, setEnableStartButton] = useState(shouldEnableStartButton(portaCountClient.state.controlSource))

    function updateSegment(segment: Segment) {
        setSegment(segment);
        setSegmentElapsedTime(0)
        setSegmentStartTime(Date.now())
        setProtocolRunning(true)
    }

    /**
     * todo: look at template's time (which is the start time of the test) and the selected protocol and determine if we're in the middle of a test.
     * if so, look up which segment we should be in and update the current segment to it.
     */
    function maybeContinueProtocolExecution() {
        if (protocolExecutor.currentSegment) {
            setSegment(protocolExecutor.currentSegment);
        }
    }

    useEffect(() => {
        const portaCountListener: PortaCountListener = {
            controlSourceChanged(source: ControlSource) {
                setEnableStartButton(shouldEnableStartButton(source))
            }
        }
        const listener: ProtocolListener = {
            segmentChanged(segment: Segment) {
                updateSegment(segment)
            },
            cancelled() {
                setSegmentElapsedTime(0)
                setProtocolRunning(false)
                setSegment(undefined)
            },
            completed() {
                setSegmentElapsedTime(0)
                setProtocolRunning(false)
                setSegment(undefined)
                // todo: display the final result
            },
        };
        maybeContinueProtocolExecution();
        protocolExecutor.addListener(listener)
        portaCountClient.addListener(portaCountListener)
        return () => {
            protocolExecutor.removeListener(listener);
            portaCountClient.removeListener(portaCountListener)
        }
    }, []);

    function tick() {
        if (segment && segment.state && segment.state !== SegmentState.IDLE) {
            // only update if we're not idle
            setSegmentElapsedTime(Math.round((Date.now() - segmentStartTime) / 1000))
        }
    }

    useInterval(tick, protocolRunning ? 1000 : null)
    const lastKnownAmbient = protocolExecutor.lastAmbientSegment ? calculateSegmentConcentration(protocolExecutor.lastAmbientSegment) : undefined
    const currentSegmentConcentration = segment ? calculateSegmentConcentration(segment) : undefined;
    const estimatedFitFactor = lastKnownAmbient && currentSegmentConcentration ? formatFitFactor(lastKnownAmbient / currentSegmentConcentration) : undefined
    const numExercises = appContext.settings.protocolStages.reduce((num, stage) => num + (stage.sample_duration !== 0 ? 1 : 0), 0)
    return (
        <section id="custom-control-panel">
            <fieldset>
                <legend>Protocol Executor ({selectedProtocol as string})</legend>
                <div style={{display: "block", paddingInline: "2rem"}}>
                    <input type="button" value="Start" id="start-protocol-button"
                           disabled={!enableStartButton}
                           onClick={() => protocolExecutor.executeProtocol(appContext.settings.protocolStages)}/>
                    <input type="button" value="Stop" id="stop-protocol-button"
                           onClick={() => protocolExecutor.cancel()}/>
                </div>
                <div style={{display: "flex", flexDirection: "column", width: "100%", textAlign: "start"}}>
                    <span>Stage: {segment ? segment.stageIndex + 1 : "?"} / {appContext.settings.protocolStages.length}</span>
                    <span>Exercise: {segment ? segment.exerciseNumber : "?"} / {numExercises}</span>
                    <span>Source: {(segment?.source) || "?"}</span>
                    <span>State: {(segment?.state) || "?"}</span>
                    <span>Duration: {segment ? segmentElapsedTime : "?"} / {(segment?.duration) || "?"}</span>
                    <span>Ambient: {segment ? lastKnownAmbient : "?"}</span>
                    <span>Mask: {segment?.source === SampleSource.MASK ? currentSegmentConcentration ?? ":" : "?"}</span>
                    <span>Estimate: {estimatedFitFactor}</span>
                </div>
            </fieldset>
        </section>
    )
}
