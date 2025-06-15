import {SimpleResultsDBRecord} from "./SimpleResultsDB.ts";
import {deepCopy} from "json-2-csv/lib/utils";

/**
 * These are here so we don't create a dependency loop while refactoring FitFactorEstimator. Will probably need FitFactorEstimatorEvents at some point.
 */
export abstract class DataCollectorEvent {
}

export class InstructionsChangedEvent extends DataCollectorEvent {
    readonly instructions: string;

    constructor(newInstructions: string) {
        super();
        this.instructions = newInstructions
    }
}

abstract class EstimateChangedEvent extends DataCollectorEvent {
    readonly estimate: number;

    protected constructor(estimate: number) {
        super();
        this.estimate = estimate;
    }
}

export class EstimatedFitFactorChangedEvent extends EstimateChangedEvent {
    constructor(estimate: number) {
        super(estimate);
    }
}

export class EstimatedAmbientConcentrationChangedEvent extends EstimateChangedEvent {
    constructor(estimate: number) {
        super(estimate);
    }
}

export class EstimatedMaskConcentrationChangedEvent extends EstimateChangedEvent {
    constructor(estimate: number) {
        super(estimate);
    }
}

/**
 * This should just be the same event from PortaCountListener.
 */
export class RawLineEvent extends DataCollectorEvent {
    readonly line: string;

    constructor(line: string) {
        super();
        this.line = line;
    }
}

export class LogEvent extends DataCollectorEvent {
    readonly message: string;

    constructor(message: string) {
        super();
        this.message = message;
    }
}

export class ProcessedDataEvent extends DataCollectorEvent {
    readonly data: string;

    constructor(data: string) {
        super();
        this.data = data;
    }
}
export class NewTestStartedEvent extends DataCollectorEvent {
    readonly record: SimpleResultsDBRecord

    constructor(record: SimpleResultsDBRecord) {
        super();
        this.record = deepCopy(record) // pass by value
    }
}
export class CurrentTestUpdatedEvent extends DataCollectorEvent {
    readonly record: SimpleResultsDBRecord

    constructor(record: SimpleResultsDBRecord) {
        super();
        this.record = deepCopy(record) // pass by value
    }
}

/**
 * sent whenever data is updated
 */
export class TickEvent extends DataCollectorEvent {
}

