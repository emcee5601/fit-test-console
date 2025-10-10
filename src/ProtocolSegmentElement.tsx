import {SampleSource} from "src/portacount/porta-count-state.ts";
import {formatDuration} from "src/utils.ts";
import {SegmentState} from "src/protocol-executor/segment-state.ts";

export function ProtocolSegmentElement({duration, source, state, override}: {
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
    >{(source === SampleSource.MASK && state === SegmentState.SAMPLE) && formatDuration(1000 * duration)}{override && ` (${override})`}</div>
}
