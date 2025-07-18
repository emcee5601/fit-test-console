import {SampleSource, StandardStageDefinition} from "src/simple-protocol.ts";
import "./ProtocolStageElement.css"
import {SegmentState} from "src/protocol-executor.ts";
import {RefObject} from "react";
import {SimpleResultsDBRecord} from "src/SimpleResultsDB.ts";
import {formatDuration} from "src/utils.ts";

function ProtocolSegmentElement({duration, source, state, override}: {
    duration: number,
    state: SegmentState,
    source: SampleSource,
    override?: string,
}) {
    return <div
        className={`${source}-${state}-segment`}
        style={{
            flexBasis: `${duration}px`,
            flexGrow: duration,
            minWidth: "0px"
        }}
    >{(source === SampleSource.MASK && state === SegmentState.SAMPLE) && formatDuration(1000*duration)}{override && ` (${override})`}</div>
}

export function ProtocolStageElement({stage, elementRef, currentTestResults, exerciseNum, currentEstimate}: {
    stage: StandardStageDefinition,
    elementRef?: RefObject<HTMLDivElement>,
    currentTestResults?: SimpleResultsDBRecord,
    exerciseNum?: number,
    currentEstimate?: string,  // present if this is the current stage
}) {
    const stageDuration = stage.ambient_purge + stage.ambient_sample + stage.mask_purge + stage.mask_sample;
    const override = currentEstimate !== undefined
        ? currentEstimate // we are the current stage, show estimate
        : exerciseNum && currentTestResults // we're not the current stage, show results if any
            ? currentTestResults[`Ex ${exerciseNum}`] as string
            : undefined; // we don't have results for this stage
    return (
        <div className={"protocol-stage-element"}
             ref={elementRef}
             style={{
                 flexBasis: `${stageDuration}px`,
                 flexGrow: stageDuration,
                 overflow: "hidden",
             }}
        >
            <div className={"stage-instructions"}>{stage.instructions.split(".")[0]}</div>
            <div className={"stage-segments"}>
                <ProtocolSegmentElement duration={stage.ambient_purge} source={SampleSource.AMBIENT}
                                        state={SegmentState.PURGE}/>
                <ProtocolSegmentElement duration={stage.ambient_sample} source={SampleSource.AMBIENT}
                                        state={SegmentState.SAMPLE}/>
                <ProtocolSegmentElement duration={stage.mask_purge} source={SampleSource.MASK}
                                        state={SegmentState.PURGE}/>
                <ProtocolSegmentElement duration={stage.mask_sample} source={SampleSource.MASK}
                                        state={SegmentState.SAMPLE}
                                        override={override}/>
            </div>
        </div>
    )
}
