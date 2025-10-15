import {SampleSource} from "src/portacount/porta-count-state.ts";
import {SegmentState} from "src/protocol-executor/segment-state.ts";

export function ProtocolSegmentElement({duration, source, state}: {
    duration: number,
    state: SegmentState,
    source: SampleSource,
}) {
    return <div
        className={`${source}-${state}-segment`}
        style={{
            flexBasis: `${duration}px`,
            flexGrow: duration,
            minWidth: "0px"
        }}
    >&nbsp;</div>
}
