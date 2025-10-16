import {RefObject, useContext, useRef} from "react";
import {AppContext} from "src/app-context.ts";
import {useAnimationFrame} from "src/assets/use-animation-frame.ts";
import {SampleSource} from "src/portacount/porta-count-state.ts";
import {SegmentState} from "src/protocol-executor/segment-state.ts";
import {getStageDuration} from "src/protocol-executor/utils.ts";
import {ProtocolSegmentElement} from "src/ProtocolSegmentElement.tsx";
import {StandardStageDefinition} from "src/simple-protocol.ts";
import "./ProtocolStageElement.css"
import {SimpleResultsDBRecord} from "src/SimpleResultsDB.ts";
import {updateBackgroundFillProgress} from "src/update-background-fill-progress.ts";
import {formatDuration} from "src/utils.ts";

export function ProtocolStageElement({
    stage,
    elementRef,
    currentTestResults,
    exerciseNum,
    currentEstimate,
    stageIndex
}: {
    stage: StandardStageDefinition,
    elementRef?: RefObject<HTMLDivElement>,
    currentTestResults?: SimpleResultsDBRecord,
    exerciseNum?: number,
    currentEstimate?: string,  // present if this is the current stage
    stageIndex: number,
}) {
    const appContext = useContext(AppContext)
    const stageRef = useRef<HTMLDivElement>(null);
    const stageDuration = getStageDuration(stage);
    const override = currentEstimate !== undefined
        ? currentEstimate // we are the current stage, show estimate
        : exerciseNum && currentTestResults // we're not the current stage, show results if any
            ? currentTestResults[`Ex ${exerciseNum}`] as string
            : undefined; // we don't have results for this stage

    const durationSlug = formatDuration(1000 * (stage.ambient_purge + stage.ambient_sample + stage.mask_purge + stage.mask_sample))

    useAnimationFrame(() => {
        if (stageRef.current) {
            const segments = appContext.protocolExecutor.segments
            const [got, need] = segments.filter((segment) => segment.stageIndex === stageIndex).reduce(([got, need], segment) => [got + segment.data.length, need + segment.duration], [0, 0])

            const progress = got / need
            updateBackgroundFillProgress(stageRef, progress, undefined, "#ffffff00");
        }
    }, [stageRef])

    return (
        <div className={"protocol-stage-element"}
             ref={elementRef}
             style={{
                 position: "relative",
                 flexBasis: `${stageDuration}px`,
                 flexGrow: stageDuration,
                 overflow: "hidden",
             }}
        >
            <div ref={stageRef} style={{position: 'absolute', top: 0, left: 0, minWidth:0, maxWidth: "100%", width: "100%", opacity: "1"}}
                 className={"stage-name"}>{durationSlug} {exerciseNum ? `Ex ${exerciseNum}:` : null} {stage.instructions.split(".")[0]} {override && `(${override})`}
            </div>
            <div className={"stage-segments"}>
                <ProtocolSegmentElement duration={stage.ambient_purge} source={SampleSource.AMBIENT}
                                        state={SegmentState.PURGE}/>
                <ProtocolSegmentElement duration={stage.ambient_sample} source={SampleSource.AMBIENT}
                                        state={SegmentState.SAMPLE}/>
                <ProtocolSegmentElement duration={stage.mask_purge} source={SampleSource.MASK}
                                        state={SegmentState.PURGE}/>
                <ProtocolSegmentElement duration={stage.mask_sample} source={SampleSource.MASK}
                                        state={SegmentState.SAMPLE}/>
            </div>
        </div>
    )
}
