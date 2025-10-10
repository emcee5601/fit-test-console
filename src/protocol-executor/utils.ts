import {ProtocolSegment} from "src/app-settings-types.ts";
import {SampleSource} from "src/portacount/porta-count-state.ts";
import {SegmentState} from "src/protocol-executor/segment-state.ts";
import {StandardStageDefinition} from "src/simple-protocol.ts";

export function convertStagesToSegments(stages: StandardStageDefinition[]): ProtocolSegment[] {
    const segments: ProtocolSegment[] = []
    let numExercisesSeen: number | null = null;
    let currentOffset: number = 0

    stages.forEach((stage: StandardStageDefinition, stageIndex: number) => {
        let stageOffset: number = 0
        if (stage.mask_sample > 0) {
            // increment the exercise number if this stage has a mask sample segment
            numExercisesSeen = (numExercisesSeen ?? 0) + 1; // increment; 1-based
        }
        // this stage's has an exercise num only if it has a mask sample segment. otherwise it has no exercise number
        // (either a prep or finalize stage)
        const thisStageExerciseNum = stage.mask_sample > 0 ? numExercisesSeen : null

        // allow any combination of ambient/mask/purge/sample. rely on the protocol standardizer to set these to
        // coherent values

        // ambient segments
        if (stage.ambient_purge > 0) {
            const ambientPurgeSegment: ProtocolSegment = {
                index: segments.length,
                stage: stage,
                stageIndex: stageIndex,
                exerciseNumber: thisStageExerciseNum,
                source: SampleSource.AMBIENT,
                state: SegmentState.PURGE,
                protocolStartTimeOffsetSeconds: currentOffset,
                stageStartTimeOffsetSeconds: stageOffset,
                duration: stage.ambient_purge,
                data: []
            };
            segments.push(ambientPurgeSegment);
            currentOffset += ambientPurgeSegment.duration;
            stageOffset += ambientPurgeSegment.duration;
        }

        if (stage.ambient_sample > 0) {
            const ambientSampleSegment: ProtocolSegment = {
                index: segments.length,
                stage: stage,
                stageIndex: stageIndex,
                exerciseNumber: thisStageExerciseNum,
                source: SampleSource.AMBIENT,
                state: SegmentState.SAMPLE,
                protocolStartTimeOffsetSeconds: currentOffset,
                stageStartTimeOffsetSeconds: stageOffset,
                duration: stage.ambient_sample,
                data: []
            };
            segments.push(ambientSampleSegment);
            currentOffset += ambientSampleSegment.duration;
            stageOffset += ambientSampleSegment.duration;
        }

        // mask segments
        if (stage.mask_purge > 0) {
            const maskPurgeSegment: ProtocolSegment = {
                index: segments.length,
                stage: stage,
                stageIndex: stageIndex,
                exerciseNumber: thisStageExerciseNum,
                source: SampleSource.MASK,
                state: SegmentState.PURGE,
                protocolStartTimeOffsetSeconds: currentOffset,
                stageStartTimeOffsetSeconds: stageOffset,
                duration: stage.mask_purge,
                data: []
            };
            segments.push(maskPurgeSegment);
            currentOffset += maskPurgeSegment.duration;
            stageOffset += maskPurgeSegment.duration;
        }

        if (stage.mask_sample > 0) {
            const maskSampleSegment: ProtocolSegment = {
                index: segments.length,
                stage: stage,
                stageIndex: stageIndex,
                exerciseNumber: thisStageExerciseNum,
                source: SampleSource.MASK,
                state: SegmentState.SAMPLE,
                protocolStartTimeOffsetSeconds: currentOffset,
                stageStartTimeOffsetSeconds: stageOffset,
                duration: stage.mask_sample,
                data: []
            };
            segments.push(maskSampleSegment);
            currentOffset += maskSampleSegment.duration;
        }
    });

    // console.log(`created segments: ${JSON.stringify(segments)}`);
    return segments;
}

export function getStageDuration(stage: StandardStageDefinition) {
    return stage.ambient_purge + stage.ambient_sample + stage.mask_purge + stage.mask_sample;
}
