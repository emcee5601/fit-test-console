import {Segment, SampleSource, SegmentState, StageDefinition} from "./simple-protocol.ts";
import {
    ParticleConcentrationEvent,
    PortaCountClient8020,
    PortaCountListener
} from "./portacount-client-8020.ts";
import {ExternalController} from "./external-control.tsx";
import {DataCollector} from "./data-collector.ts";
import {ControlSource} from "./control-source.ts";

export interface ProtocolListener {
    segmentChanged(segment: Segment): void;

    cancelled(): void;

    completed(): void;
}

export class ProtocolExecutor {
    private readonly MILLIS_PER_SECOND = 1000;
    private readonly _portaCountClient: PortaCountClient8020;
    private readonly controller: ExternalController;
    private readonly listeners: ProtocolListener[] = []
    private timerId?: NodeJS.Timeout = undefined;
    private segments: Segment[] = [];
    private _currentSegment: Segment | undefined;
    private _lastAmbientSegment: Segment | undefined;
    private dataCollector: DataCollector;
    private _isTestInProgress: boolean = false;
    private stages: StageDefinition[] = [];
    private results: number[] = []; // calculated fit factors for each exercise

    constructor(portaCountClient: PortaCountClient8020, dataCollector: DataCollector) {
        this._portaCountClient = portaCountClient
        this.dataCollector = dataCollector
        this.controller = portaCountClient.externalController;
        this._portaCountClient.addListener(this.getPortaCountListener())
    }

    private getPortaCountListener(): PortaCountListener {
        const listener: PortaCountListener = {
            particleConcentrationReceived: (concentrationEvent: ParticleConcentrationEvent) => {
                if (concentrationEvent.controlSource === ControlSource.Internal) {
                    // ignore internal control concentration events. We only want external concentration events because
                    // those are controlled via executor
                    // however, the estimator can use internal concentration numbers to guestimate results.
                    return;
                }
                if (!this.isTestInProgress) {
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
            }
        }
        return listener;
    }

    private startSegment(segment: Segment) {
        console.log(`starting segment ${JSON.stringify(segment)}`);
        // schedule next segment. We need this segment to complete. We'll figure out if there is a next segment in executeSegment()
        this.timerId = setTimeout(() => {
            this.closeSegment(segment)
            this.executeSegment(segment.index + 1)
        }, segment.duration * this.MILLIS_PER_SECOND);

    }


    get isTestInProgress(): boolean {
        return this._isTestInProgress;
    }

    private set isTestInProgress(value: boolean) {
        this._isTestInProgress = value;
    }

    get lastAmbientSegment(): Segment | undefined {
        return this._lastAmbientSegment;
    }

    private set lastAmbientSegment(value: Segment | undefined) {
        this._lastAmbientSegment = value;
    }

    get currentSegment(): Segment | undefined {
        return this._currentSegment
    }

    private set currentSegment(value: Segment | undefined) {
        this._currentSegment = value;
    }

    // todo: on add, update states (segments)?
    public addListener(listener: ProtocolListener): void {
        this.listeners.push(listener);
    }

    public removeListener(listener: ProtocolListener): void {
        this.listeners.filter((value, index, array) => {
            if (value === listener) {
                array.splice(index, 1);
                return true
            }
            return false;
        })
    }

    private setStages(stages: StageDefinition[]) {
        this.stages = stages;
        this.segments = this.convertStagesToSegments(stages);
        this.results = []; // reset this
    }

    public async executeProtocol(stages: StageDefinition[]) {
        // todo: be more explicit about marking in-progress protocol
        if (this.isTestInProgress) {
            // in progress
            console.log("protocol execution in progress (can't start another protocol)");
            return;
        }
        this.setStages(stages);
        await this.dataCollector.recordTestStart(new Date().toLocaleString(), ControlSource.External)
        this.executeSegment(0)
        this.controller.beep()
    }

    private convertStagesToSegments(stages: StageDefinition[]): Segment[] {
        // todo: read these from config
        const defaultPurgeDuration = 4;
        const defaultSampleDuration = 40;
        const defaultAmbientDuration = 5;
        const segments: Segment[] = []
        let exerciseNumber: number | null = null;
        stages.forEach((stage, stageIndex) => {
            if (stage.sample_duration !== 0) {
                exerciseNumber = (exerciseNumber ?? 0) + 1; // increment; 1-based
            }
            if (stage.ambient_duration !== 0) {
                // ambient segments
                segments.push({
                    index: segments.length,
                    stageIndex: stageIndex,
                    exerciseNumber: exerciseNumber,
                    source: SampleSource.AMBIENT,
                    state: SegmentState.PURGE,
                    duration: stage.purge_duration || defaultPurgeDuration,
                    data: []
                });
                segments.push({
                    index: segments.length,
                    stageIndex: stageIndex,
                    exerciseNumber: exerciseNumber,
                    source: SampleSource.AMBIENT,
                    state: SegmentState.SAMPLE,
                    duration: stage.ambient_duration || defaultAmbientDuration,
                    data: []
                });
            } else {
                // ambient duration is zero, so just skip it completely
            }

            if (stage.sample_duration !== 0) {
                // mask segments
                segments.push({
                    index: segments.length,
                    stageIndex: stageIndex,
                    exerciseNumber: exerciseNumber,
                    source: SampleSource.MASK,
                    state: SegmentState.PURGE,
                    duration: stage.purge_duration || defaultPurgeDuration,
                    data: []
                });
                segments.push({
                    index: segments.length,
                    stageIndex: stageIndex,
                    exerciseNumber: exerciseNumber,
                    source: SampleSource.MASK,
                    state: SegmentState.SAMPLE,
                    duration: stage.sample_duration || defaultSampleDuration,
                    data: []
                });
            } else {
                // mask duration is zero, skip
            }
        });
        // console.log(`created segments: ${JSON.stringify(segments)}`);
        return segments;
    }

    public cancel() {
        clearTimeout(this.timerId);
        this.timerId = undefined; // reset
        this.isTestInProgress = false;
        console.log("cancelling protocol")
        this.dataCollector.recordTestAborted()
        // todo: dispatch events centrally instead
        this.listeners.forEach((listener: ProtocolListener) => {
            listener.cancelled()
        })
        this.controller.beep()
    }

    private calculateFinalFitFactor(): number {
        // harmonic mean of results
        return this.results.length / this.results.reduce((result: number, current: number) => result + 1 / current, 0);
    }

    private executeSegment(segmentIndex: number) {
        if (segmentIndex >= this.segments.length) {
            this.isTestInProgress = false
            this.timerId = undefined; // todo: clear this centrally
            console.log("no more segments (test completed)")
            // todo: record final results
            this.dataCollector.recordExerciseResult("Final", this.calculateFinalFitFactor())
            this.dataCollector.recordTestComplete()
            this.dataCollector.setInstructions("Test complete")
            this.listeners.forEach((listener: ProtocolListener) => {
                listener.completed()
            })
            this.controller.beep()
            this.controller.beep()
            return;
        }

        this.isTestInProgress = true
        const segment: Segment = this.segments[segmentIndex];
        this.updateSegment(segment);

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
            this.dataCollector.setInstructions(this.stages[segment.stageIndex].instructions)
        }
    }

    private updateSegment(segment: Segment) {
        this.currentSegment = segment;
        this.listeners.forEach((listener) => {
            listener.segmentChanged(segment)
        })
    }

    /**
     * This segment finished executing. Emit an event.
     * todo: handle averaging before and after ambients to calculate results.
     * @param segment
     * @private
     */
    private closeSegment(segment: Segment) {
        if (segment.source === SampleSource.AMBIENT) {
            if (segment.state === SegmentState.SAMPLE) {
                this.lastAmbientSegment = segment;
            } else {
                // purging
            }
        } else if (segment.source === SampleSource.MASK) {
            if (segment.state === SegmentState.SAMPLE) {
                // todo: if next segment is ambient, wait for the next ambient and use an average before+after ambient
                if (this.lastAmbientSegment) {
                    // todo: set a max on the FF based on the ambient reading. So we don't get to infinite FF with 0 concentration in the current segment
                    const exerciseResult: number = calculateSegmentConcentration(this.lastAmbientSegment) / calculateSegmentConcentration(segment);
                    this.results.push(exerciseResult)
                    this.dataCollector.recordExerciseResult(segment.exerciseNumber ?? 0, exerciseResult)
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

export function calculateSegmentConcentration(segment: Segment): number {
    return Math.round(segment.data.reduce((sum, currentValue: ParticleConcentrationEvent) => sum + currentValue.concentration, 0) / segment.data.length);
}
