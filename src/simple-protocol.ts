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
 * If there is no sample duration, there is no purge. Purge duration for a stage is the same for both sample and
 * ambient. If no purge duration is specified, it is taken from default.
 */
export type StandardStageDefinition = {
    instructions: ExerciseInstructions,
    ambient_purge: number,
    ambient_sample: number,
    mask_purge: number,
    mask_sample: number,
}
export type StandardShortStageDefinition = {
    i: ExerciseInstructions,
    ap: number,
    as: number,
    mp: number,
    ms: number,
}
export type StageDefinition = {
    instructions: ExerciseInstructions,
    ambient_duration?: number,
    purge_duration?: number,
    sample_duration?: number,
}
export type ShortStageDefinition = {
    i: ExerciseInstructions,
    a?: number,
    p?: number,
    s?: number,
}
export type InstructionOrStage = ExerciseInstructions | StandardStageDefinition | StageDefinition | ShortStageDefinition
/**
 * Legacy isn't a good name. todo: maybe rename to flexible? since we're allowing several formats.
 */
export type ProtocolDefinitions = {
    [protocol_name: string]: InstructionOrStage[]
}
export type StandardProtocolDefinition = StandardStageDefinition[]
export type StandardizedProtocolDefinitions = {
    [protocol_name: string]: StandardProtocolDefinition
}

export const ProtocolDefaults = {
    defaultAmbientPurgeDuration: 4,
    defaultAmbientSampleDuration: 5,
    defaultMaskPurgeDuration: 4, // todo: this should be calibrated for each device
    defaultMaskSampleDuration: 40,
}

function extractInstructions(item: InstructionOrStage) {
    return typeof item === "string"
        ? item as string
        : (item as StandardStageDefinition).instructions // preferred
        ?? (item as StandardShortStageDefinition).i // preferred
        ?? (item as StageDefinition).instructions // legacy
        ?? (item as ShortStageDefinition).i // legacy
        ?? "oops no instructions?!"
}

function extractAmbientSampleDuration(item: InstructionOrStage) {
    return typeof item === "string"
        ? ProtocolDefaults.defaultAmbientSampleDuration
        : (item as StandardStageDefinition).ambient_sample // preferred
        ?? (item as StandardShortStageDefinition).as // preferred
        ?? (item as StageDefinition).ambient_duration // legacy
        ?? (item as ShortStageDefinition).a // legacy
        ?? ProtocolDefaults.defaultAmbientSampleDuration
}

function extractMaskSampleDuration(item: InstructionOrStage) {
    return typeof item === "string"
        ? ProtocolDefaults.defaultMaskSampleDuration
        : (item as StandardStageDefinition).mask_sample // preferred
        ?? (item as StandardShortStageDefinition).ms // preferred
        ?? (item as StageDefinition).sample_duration // legacy
        ?? (item as ShortStageDefinition).s //legacy
        ?? ProtocolDefaults.defaultMaskSampleDuration
}

function extractAmbientPurgeDuration(item: InstructionOrStage) {
    // todo: handle legacy case where ambient_duration is specified and is zero. in this case, purge should also be zero
    if(typeof item === "string") {
        // vanilla
        return ProtocolDefaults.defaultAmbientPurgeDuration
    }
    let value: number | undefined
    if( (value=(item as StandardStageDefinition).ambient_purge) !== undefined) {
        // preferred
        return value
    }
    if((value=(item as StandardShortStageDefinition).ap) !== undefined ) {
        // preferred
        return value;
    }
    if((value=(item as StageDefinition).purge_duration) !== undefined) {
        // legacy
        return value;
    }
    if((value=(item as ShortStageDefinition).p) !== undefined ) {
        // legacy
        return value;
    }
    if((item as StageDefinition).ambient_duration === 0 || (item as ShortStageDefinition).a === 0) {
        // legacy spec has zero ambient duration, so purge should also be zero
        return 0;
    }
    return ProtocolDefaults.defaultAmbientPurgeDuration;
}

function extractMaskPurgeDuration(item: InstructionOrStage) {
    // todo: handle legacy case where sample_duration is specified and is zero. in this case, purge should also be zero
    if(typeof item === "string") {
        // vanilla
        return ProtocolDefaults.defaultMaskPurgeDuration
    }
    let value: number | undefined
    if( (value=(item as StandardStageDefinition).mask_purge) !== undefined) {
        // preferred
        return value
    }
    if((value=(item as StandardShortStageDefinition).mp) !== undefined ) {
        // preferred
        return value;
    }
    if((value=(item as StageDefinition).purge_duration) !== undefined) {
        // legacy
        return value;
    }
    if((value=(item as ShortStageDefinition).p) !== undefined ) {
        // legacy
        return value;
    }
    if((item as StageDefinition).sample_duration === 0 || (item as ShortStageDefinition).s === 0) {
        // legacy spec has zero mask (sample) duration, so purge should also be zero
        return 0;
    }
    return ProtocolDefaults.defaultMaskPurgeDuration
}

/**
 * returns true if anything other than instructions are specified in any stage.
 * @param instructionsOrStages
 */
function hasCustomizations(instructionsOrStages: InstructionOrStage[]): boolean {
    return instructionsOrStages.some((instructionOrStage:InstructionOrStage) => {
        return typeof instructionOrStage !== "string"
    })
}


/**
 * Convert instructions and short stage definitions to stage definitions.
 * @param protocols
 */
export function standardizeProtocolDefinitions(protocols: ProtocolDefinitions): StandardizedProtocolDefinitions {
    const standardizedProtocols: StandardizedProtocolDefinitions = {}
    Object.entries(protocols).forEach(([protocolName, instructionsOrStages]) => {
        const stages: StandardStageDefinition[] = [];
        standardizedProtocols[protocolName] = stages;

        instructionsOrStages.forEach((instructionOrStage) => {
            stages.push({
                instructions: extractInstructions(instructionOrStage),
                ambient_sample: extractAmbientSampleDuration(instructionOrStage),
                mask_sample: extractMaskSampleDuration(instructionOrStage),
                ambient_purge: extractAmbientPurgeDuration(instructionOrStage),
                mask_purge: extractMaskPurgeDuration(instructionOrStage),
            })
        });

        if (!hasCustomizations(instructionsOrStages)) {
            // todo: add a final ambient stage if every stage is an ExerciseInstruction since these are used as
            // shorthand use the ambient from the first non-zero ambient stage? no customizations, so we can add
            // default ambient stage at the end
            stages.push({
                instructions: "Finalizing",
                ambient_purge: ProtocolDefaults.defaultAmbientPurgeDuration,
                ambient_sample: ProtocolDefaults.defaultAmbientSampleDuration,
                mask_purge: 0,
                mask_sample: 0
            })

            // console.debug(`protocol '${protocolName}' is vanilla`)
        } else {
            // console.debug(`protocol '${protocolName}' has customizations`)
        }
    })
    return standardizedProtocols
}
