import {RefObject} from "react";
import {SampleSource} from "src/portacount/porta-count-state.ts";
import {SegmentState} from "src/protocol-executor/segment-state.ts";
import {getStageDuration} from "src/protocol-executor/utils.ts";
import {ProtocolSegmentElement} from "src/ProtocolSegmentElement.tsx";
import {StandardStageDefinition} from "src/simple-protocol.ts";
import "./ProtocolStageElement.css"
import {SimpleResultsDBRecord} from "src/SimpleResultsDB.ts";

export function ProtocolStageElement({stage, elementRef, currentTestResults, exerciseNum, currentEstimate}: {
    stage: StandardStageDefinition,
    elementRef?: RefObject<HTMLDivElement>,
    currentTestResults?: SimpleResultsDBRecord,
    exerciseNum?: number,
    currentEstimate?: string,  // present if this is the current stage
}) {
    const stageDuration = getStageDuration(stage);
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
            <div
                className={"stage-name"}>{exerciseNum ? `Ex ${exerciseNum}:` : null} {stage.instructions.split(".")[0]}</div>
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
