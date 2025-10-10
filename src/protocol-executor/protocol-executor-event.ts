import {ProtocolSegment} from "src/app-settings-types.ts";

export abstract class ProtocolExecutorEvent {
}

/**
 * The current segment was changed.
 */
export class CurrentSegmentChangedEvent extends ProtocolExecutorEvent {
    readonly newSegment?: ProtocolSegment;

    constructor(segment: ProtocolSegment | undefined) {
        super();
        this.newSegment = segment;
    }
}

/**
 * The data within the segment was updated.
 */
export class SegmentDataUpdatedEvent extends ProtocolExecutorEvent {
    readonly segment: ProtocolSegment;

    constructor(segment: ProtocolSegment) {
        super();
        this.segment = segment;
    }
}

export class ProtocolStartedEvent extends ProtocolExecutorEvent {
}

export class ProtocolAbortedEvent extends ProtocolExecutorEvent {
}

export class ProtocolCompletedEvent extends ProtocolExecutorEvent {
}
