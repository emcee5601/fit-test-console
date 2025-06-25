import {SampleSource, StandardStageDefinition} from "src/simple-protocol.ts";
import "./ProtocolStageElement.css"
import {SegmentState} from "src/protocol-executor.ts";
import {RefObject} from "react";

function ProtocolSegmentElement({duration, source, state}: {
    duration: number,
    state: SegmentState,
    source: SampleSource
}) {
    return <div
        className={`${source}-${state}-segment`}
        style={{
            flexBasis: `${duration}px`,
            flexGrow: duration,
            minWidth: "0px"
        }}
    >{source === SampleSource.MASK && state === SegmentState.SAMPLE && duration}</div>
}

export function ProtocolStageElement({stage, elementRef}: { stage: StandardStageDefinition, elementRef?: RefObject<HTMLDivElement> }) {
    const stageDuration = stage.ambient_purge + stage.ambient_sample + stage.mask_purge + stage.mask_sample;
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
                                        state={SegmentState.SAMPLE}/>
            </div>
        </div>
    )
}
