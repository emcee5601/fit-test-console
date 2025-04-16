import {SampleSource} from "./simple-protocol.ts";
import {ParticleConcentrationEvent, PortaCountClient8020, PortaCountListener} from "./portacount-client-8020.ts";
import {ExternalController} from "./external-control.ts";
import {DataCollector} from "./data-collector.ts";
import {ControlSource} from "./control-source.ts";
import {ProtocolSegment} from "./app-settings.ts";
import {avg, formatFitFactor} from "src/utils.ts";
import {deepCopy} from "json-2-csv/lib/utils";

export enum SegmentState {
    SAMPLE = "sample",
    PURGE = "purge",
    IDLE = "idle", // basically means we're not executing a protocol at the moment
}

export interface ProtocolExecutorListener {
    // todo: make these optional
    // todo: change this to segmentUpdated? and have it trigger when the current segment changes, or is updated with
    // new data.
    segmentDataUpdated?(segment: ProtocolSegment): void;
    segmentChanged?(segment: ProtocolSegment | undefined): void;
    cancelled?(): void;
    completed?(): void;
}

abstract class ProtocolExecutorEvent {
}

/**
 * The current segment was changed.
 */
class CurrentSegmentChanged extends ProtocolExecutorEvent {
    readonly newSegment?: ProtocolSegment;

    constructor(segment: ProtocolSegment | undefined) {
        super();
        this.newSegment = segment;
    }
}

/**
 * The data within the segment was updated.
 */
class SegmentDataUpdatedEvent extends ProtocolExecutorEvent {
    readonly segment: ProtocolSegment;

    constructor(segment: ProtocolSegment) {
        super();
        this.segment = segment;
    }
}

class ProtocolAbortedEvent extends ProtocolExecutorEvent {
}

class ProtocolCompletedEvent extends ProtocolExecutorEvent {
}

/**
 * Runs the provided protocol. Basically switches the valve between the ambient and sample side following a schedule.
 * todo: create a protocol observer that looks at response from portacount and the protocol executor state. basically,
 *  be able to support protocol progress for both externally controlled (via this class) or internally when
 *  the portacount is running the tests
 */
export class ProtocolExecutor {
    private readonly MILLIS_PER_SECOND = 1000;
    private readonly _portaCountClient: PortaCountClient8020;
    private readonly controller: ExternalController;
    private readonly listeners: ProtocolExecutorListener[] = []
    private _timerId?: NodeJS.Timeout;
    private _segments: ProtocolSegment[] = [];
    private _currentSegment?: ProtocolSegment;
    private _lastAmbientSegment: ProtocolSegment | undefined;
    private dataCollector: DataCollector;
    private _protocolStartTime: number | null = null

    constructor(portaCountClient: PortaCountClient8020, dataCollector: DataCollector) {
        this._portaCountClient = portaCountClient
        this.dataCollector = dataCollector
        this.controller = portaCountClient.externalController;
        this._portaCountClient.addListener(this.getPortaCountListener())
    }

    private getPortaCountListener(): PortaCountListener {
        const listener: PortaCountListener = {
            controlSourceChanged: (source: ControlSource) => {
                if (source === ControlSource.Internal) {
                    // abort protocol since we no longer have control.
                    // alternatively, switch back to external automagically?
                    this.cancel();
                }
            },
            particleConcentrationReceived: (concentrationEvent: ParticleConcentrationEvent) => {
                if (concentrationEvent.controlSource === ControlSource.Internal) {
                    // ignore internal control concentration events. We only want external concentration events because
                    // those are controlled via executor
                    // however, the estimator can use internal concentration numbers to guestimate results.
                    return;
                }
                if (!this.protocolStartTime) {
                    // test not in progress ignore
                    return;
                }
                if (!this.currentSegment) {
                    console.warn(`protocol executor test is in progress but no current segment (shouldn't happen).`)
                    return;
                }

                // make sure we're in the expected state for this segment
                if (this.currentSegment.source !== concentrationEvent.sampleSource) {
                    console.debug(`segment expecting data to be from source ${this.currentSegment.source} but received data from ${concentrationEvent.sampleSource}. ignoring.`)
                    return
                }

                if (this.currentSegment.data.length === 0) {
                    // received the first record from the expected source. we can start this segment
                    this.startSegment(this.currentSegment)
                }

                this.currentSegment.data.push(concentrationEvent);
                this.dispatch(new SegmentDataUpdatedEvent(this.currentSegment))
            }
        }
        return listener;
    }

    private startSegment(segment: ProtocolSegment) {
        console.log(`starting segment ${JSON.stringify(segment)}`);
        // schedule next segment. We need this segment to complete. We'll figure out if there is a next segment in
        // executeSegment()
        this.startTimer(() => {
            this.closeSegment(segment)
            this.executeSegment(segment.index + 1)
        }, segment.duration)
    }

    get segments(): ProtocolSegment[] {
        return this._segments;
    }

    private set segments(segments: ProtocolSegment[]) {
        this._segments = deepCopy(segments); // deep copy so we can modify
    }

    get protocolStartTime(): number | null {
        return this._protocolStartTime;
    }

    private set protocolStartTime(timeMs: number | null) {
        this._protocolStartTime = timeMs;
    }

    get lastAmbientSegment(): ProtocolSegment | undefined {
        return this._lastAmbientSegment;
    }

    private set lastAmbientSegment(value: ProtocolSegment | undefined) {
        this._lastAmbientSegment = value;
    }

    get currentSegment(): ProtocolSegment | undefined {
        return this._currentSegment
    }

    private set currentSegment(segment: ProtocolSegment | undefined) {
        if (segment) {
            segment.segmentStartTimeMs = Date.now();
        }
        this._currentSegment = segment;
        this.dispatch(new CurrentSegmentChanged(segment))
    }

    // todo: on add, update states (segments)?
    public addListener(listener: ProtocolExecutorListener): void {
        this.listeners.push(listener);
    }

    public removeListener(listener: ProtocolExecutorListener): void {
        this.listeners.filter((value, index, array) => {
            if (value === listener) {
                array.splice(index, 1);
                return true
            }
            return false;
        })
    }

    private startTimer(callback: () => void, durationSeconds: number) {
        this._timerId = setTimeout(callback, durationSeconds * this.MILLIS_PER_SECOND);
    }


    private stopTimer() {
        clearTimeout(this._timerId);
        this._timerId = undefined;
    }

    isInProgress() {
        // console.debug(`isInProgress? ${this.protocolStartTime}, ${this._timerId}`)
        return this.protocolStartTime !== null && this._timerId !== undefined
    }

    public async executeProtocol(segments: ProtocolSegment[]) {
        // todo: be more explicit about marking in-progress protocol
        if (this.isInProgress()) {
            console.log("protocol execution in progress (can't start another protocol)");
            return;
        }
        this.lastAmbientSegment = undefined // reset
        this.segments = segments;
        const startTime = new Date();
        this.protocolStartTime = startTime.getTime()
        await this.dataCollector.recordTestStart(startTime.toLocaleString(), ControlSource.External)
        this.executeSegment(0)
        this.controller.beep()
    }

    private dispatch(event: ProtocolExecutorEvent) {
        this.listeners.forEach((listener: ProtocolExecutorListener) => {
            switch (event.constructor.name) {
                case SegmentDataUpdatedEvent.name: {
                    if (listener.segmentDataUpdated) {
                        listener.segmentDataUpdated((event as SegmentDataUpdatedEvent).segment)
                    }
                    break;
                }
                case CurrentSegmentChanged.name: {
                    if (listener.segmentChanged) {
                        listener.segmentChanged((event as CurrentSegmentChanged).newSegment)
                    }
                    break;
                }
                case ProtocolAbortedEvent.name: {
                    if (listener.cancelled) {
                        listener.cancelled()
                    }
                    break;
                }
                case ProtocolCompletedEvent.name: {
                    if (listener.completed) {
                        listener.completed()
                    }
                    break;
                }
                default:
                    console.warn(`Unhandled event in dispatcher: ${event.constructor.name}`)
            }
        })

    }

    /**
     * Prepares the device for the specified segment. Basically this is switching to the correct sampling source.
     * @param segmentIndex
     * @private
     */
    private executeSegment(segmentIndex: number) {
        if (segmentIndex >= this._segments.length) {
            console.log("no more segments (test completed)")
            this.stopTimer()
            const finalScore = this.calculateFinalFitFactor();
            this.dataCollector.recordExerciseResult("Final", finalScore)
            this.dataCollector.recordTestComplete()
            this.dataCollector.setInstructions(`Test completed; final score: ${formatFitFactor(finalScore)}`)
            this.dispatch(new ProtocolCompletedEvent())
            this.controller.beep()
            this.controller.beep()
            return;
        }

        const segment: ProtocolSegment = this._segments[segmentIndex];
        this.currentSegment = segment;

        console.log(`staging segment ${JSON.stringify(segment)}`);

        if (segment.source === SampleSource.AMBIENT) {
            this.controller.sampleAmbient()
        } else if (segment.source === SampleSource.MASK) {
            this.controller.sampleMask()
        } else {
            // shouldn't happen
            console.warn(`executeSegment(): unexpected source: ${segment.source}`)
        }

        if (segment.duration > 0) {
            this.dataCollector.setInstructions(segment.instructions ?? "rest")
        }
    }

    public cancel() {
        this.stopTimer()
        this.protocolStartTime = null;
        console.log("cancelling protocol")
        this.dataCollector.recordTestAborted()
        this.dispatch(new ProtocolAbortedEvent())
        this.controller.beep()
    }

    private calculateFinalFitFactor(): number {
        // harmonic mean of results
        const exerciseSegments = this.segments.filter((segment) => segment.calculatedScore !== undefined);
        return exerciseSegments.length / exerciseSegments.reduce((result: number, segment: ProtocolSegment) => result + 1 / segment.calculatedScore!, 0)
    }

    /**
     * This segment finished executing. todo: Emit an event.
     * If closing a mask sampling segment, record exercise results to data collector using the last ambient.
     * If closing an ambient sampling segment, (re-)record exercise results to the data collector for all mask segments
     * between this ambient segment and the last ambient segment using the average of the 2 ambient segments.
     * todo: use weighted average ambient based on mask segment's position in time between the ambient segments.
     * @param segment
     * @private
     */
    private closeSegment(segment: ProtocolSegment) {
        if (segment.source === SampleSource.AMBIENT) {
            if (segment.state === SegmentState.SAMPLE) {
                if (this.lastAmbientSegment) {
                    // we're closing the 2nd ambient for some mask samples.
                    const averageAmbient = avg(calculateSegmentConcentration(this.lastAmbientSegment), calculateSegmentConcentration(segment))

                    // look at all mask segments between this at the previous ambient segments and (re)calculate their
                    // results using the average of this and the previous ambient segment.
                    for (let maskSegmentIndex = segment.index - 1; maskSegmentIndex > this.lastAmbientSegment.index; maskSegmentIndex--) {
                        // all the segments in this range are Mask segments
                        // we're in the contiguous segments before the latest one that is sourced from the mask side
                        const maskSegment = this.segments[maskSegmentIndex];
                        if (maskSegment.state === SegmentState.SAMPLE) {
                            const ff2 = averageAmbient / calculateSegmentConcentration(maskSegment)
                            console.debug(`updating ex ${maskSegment.exerciseNumber} score from ${maskSegment.calculatedScore} to ${ff2}`)
                            maskSegment.calculatedScore = ff2;
                            this.dataCollector.recordExerciseResult(maskSegment.exerciseNumber ?? 0, maskSegment.calculatedScore)
                        }
                    }
                } else {
                    // we're closing the first ambient
                }
                this.lastAmbientSegment = segment;
            } else {
                // purging
            }
        } else if (segment.source === SampleSource.MASK) {
            if (segment.state === SegmentState.SAMPLE) {
                // todo: if next segment is ambient, wait for the next ambient and use an average before+after ambient
                if (this.lastAmbientSegment) {
                    // todo: set a max on the FF based on the ambient reading. So we don't get to infinite FF with 0
                    // concentration in the current segment
                    segment.calculatedScore = calculateSegmentConcentration(this.lastAmbientSegment) / calculateSegmentConcentration(segment)
                    this.dataCollector.recordExerciseResult(segment.exerciseNumber ?? 0, segment.calculatedScore)
                    this.controller.beep()
                } else {
                    console.error("mask segment completed, but there was no last ambient segment.")
                }
            } else {
                // purging
            }
        }
    }
}

export function calculateSegmentConcentration(segment: ProtocolSegment): number {
    // don't round this here
    return segment.data.reduce((sum, currentValue: ParticleConcentrationEvent) => sum + currentValue.concentration, 0) / segment.data.length;
}
