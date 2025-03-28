import {ParticleConcentrationEvent} from "./portacount-client-8020.ts";

export type ExerciseInstructions = string

/**
 * Each stage is
 * - ambient purge
 * - ambient sample
 * - mask purge
 * - mask sample
 * - ambient calculation type (before, after, average)
 * Each duration can be zero.
 * If we want to average before and after ambients, we need an extra ending stage with no mask durations.
 * If we want quick test, we can have a ambient only stage before and after, and mask only stages in between.
 * If there is no sample duration, there is no purge. Purge duration for a stage is the same for both sample and ambient.
 * If no purge duration is specified, it is taken from default.
 */
export type StageDefinition = {
    instructions: ExerciseInstructions,
    ambient_duration?: number,
    purge_duration?: number,
    sample_duration?: number, // we're stuck with this naming for now. should be mask_duration if we get a chance to rename
}
export type ShortStageDefinition = {
    i: ExerciseInstructions,
    a?: number,
    p?: number,
    s?: number,
}
export type InstructionOrStage = ExerciseInstructions | StageDefinition | ShortStageDefinition
export type ProtocolDefinitions = {
    [protocol_name: string]: [InstructionOrStage]
}

export enum SegmentState {
    SAMPLE = "sample",
    PURGE = "purge",
    IDLE = "idle", // basically means we're not executing a protocol at the moment
}

export enum SampleSource {
    MASK = "mask",
    AMBIENT = "ambient"
}

export type Segment = {
    index: number, // segment index
    stageIndex: number,
    exerciseNumber: number|null, // this is usually stageIndex+1 (to be 1-based), but sometimes it's shifted by some amount, in order to skip 0-duration stages
    state: SegmentState,
    source: SampleSource,
    duration: number,
    data: ParticleConcentrationEvent[] // todo: trim this down to timestamp and concentration?
}

