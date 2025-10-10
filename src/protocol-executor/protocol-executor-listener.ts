import {ProtocolSegment} from "src/app-settings-types.ts";

export interface ProtocolExecutorListener {
    segmentDataUpdated?(segment: ProtocolSegment): void;
    segmentChanged?(segment: ProtocolSegment | undefined): void;
    started?(): void;
    cancelled?(): void;
    completed?(): void;
}
