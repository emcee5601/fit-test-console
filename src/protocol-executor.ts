import {AppSettings, AppSettingType, ProtocolSegment, ValidSettings} from "src/app-settings-types.ts";
import {APP_SETTINGS_CONTEXT} from "src/app-settings.ts";
import {NO_PARTICLE_COUNT_STATS, ParticleCountStats} from "src/particle-count-stats.ts";
import {ParticleSampleCollector} from "src/particle-sample-collector.ts";
import {ControlSource, SampleSource} from "src/portacount/porta-count-state.ts";
import {ProtocolExecutionState} from "src/protocol-execution-state.ts";
import {
    CurrentSegmentChangedEvent,
    ProtocolAbortedEvent,
    ProtocolCompletedEvent,
    ProtocolExecutorEvent,
    ProtocolStartedEvent,
    SegmentDataUpdatedEvent
} from "src/protocol-executor/protocol-executor-event.ts";
import {ProtocolExecutorListener} from "src/protocol-executor/protocol-executor-listener.ts";
import {SegmentState} from "src/protocol-executor/segment-state.ts";
import {convertStagesToSegments} from "src/protocol-executor/utils.ts";
import {SPEECH} from "src/speech.ts";
import {
    avg,
    calculateSegmentConcentration,
    calculateSegmentConcentrationAndStddev
} from "src/utils.ts";
import {DataCollector} from "./data-collector.ts";
import {ExternalController} from "./external-control.ts";
import {ParticleConcentrationEvent, PortaCountClient8020, PortaCountListener} from "./portacount-client-8020.ts";

/**
 * Runs the provided protocol. Basically switches the valve between the ambient and sample side following a schedule.
 * todo: create a protocol observer that looks at response from portacount and the protocol executor state. basically,
 *  be able to support protocol progress for both externally controlled (via this class) or internally when
 *  the portacount is running the tests
 */
export class ProtocolExecutor {
    private readonly _portaCountClient: PortaCountClient8020;
    private readonly controller: ExternalController;
    private readonly listeners: ProtocolExecutorListener[] = []
    private _segments: ProtocolSegment[] = [];
    private _currentSegmentIndex?: number;
    private _lastAmbientSegment: ProtocolSegment | undefined;
    private dataCollector: DataCollector;
    private _protocolStartTime: Date | null = null
    private readonly ambientSampleCollector: ParticleSampleCollector;
    private readonly maskSampleCollector: ParticleSampleCollector;

    constructor(portaCountClient: PortaCountClient8020, dataCollector: DataCollector, ambientCollector: ParticleSampleCollector, maskCollector: ParticleSampleCollector) {
        this._portaCountClient = portaCountClient
        this.dataCollector = dataCollector
        this.controller = portaCountClient.externalController;
        this.ambientSampleCollector = ambientCollector
        this.maskSampleCollector = maskCollector
        this._portaCountClient.addListener(this.getPortaCountListener())
        this._portaCountClient.addListener(this.ambientSampleCollector)
        this._portaCountClient.addListener(this.maskSampleCollector)
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
                    return;
                }
                if (this.state === "Idle") {
                    // test not in progress ignore
                    return;
                }
                if (this.state === "Paused") {
                    // we're paused. do nothing.
                    return;
                }
                if (!this.currentSegment) {
                    console.warn(`protocol executor test is in progress but no current segment (shouldn't happen).`)
                    return;
                }

                // make sure we're in the expected state for this segment
                if (this.currentSegment.source !== concentrationEvent.sampleSource) {
                    console.debug(`segment expecting data to be from source ${this.currentSegment.source} but received data from ${concentrationEvent.sampleSource}. ignoring, and switching valve position`)
                    // todo: allow a grace period?
                    switch (this.currentSegment.source) {
                        case SampleSource.AMBIENT:
                            this.controller.sampleAmbient()
                            break;
                        case SampleSource.MASK:
                            this.controller.sampleMask()
                            break;
                    }
                    return
                }

                // todo: index into this.segments instead of using this.currentSegment?
                this.currentSegment.data.push(concentrationEvent);
                this.dispatch(new SegmentDataUpdatedEvent(this.currentSegment))

                if (this.currentSegmentHasEnoughData()) {
                    // we got enough data. advance to the next segment
                    const nextSegmentIndex = this.closeSegment(this.currentSegment)
                    if (nextSegmentIndex) {
                        // console.debug("advancing to segment", nextSegmentIndex, "got data points",
                        // this.currentSegment.data.length)
                        this.executeSegment(nextSegmentIndex)
                    }
                }
            }
        }
        return listener;
    }

    /**
     * returns false if there is no current segment.
     * @private
     */
    private currentSegmentHasEnoughData() {
        return this.currentSegment && this.currentSegment.data.length >= this.currentSegment.duration;
    }

    // proxies
    private getSetting<T>(setting: ValidSettings): T {
        return APP_SETTINGS_CONTEXT.getSetting<T>(setting)
    }

    private saveSetting<T extends AppSettingType>(setting: ValidSettings, value: T) {
        APP_SETTINGS_CONTEXT.saveSetting<T>(setting, value)
    }

    private get state(): ProtocolExecutionState {
        return this.getSetting<ProtocolExecutionState>(AppSettings.PROTOCOL_EXECUTION_STATE);
    }

    private set state(value: ProtocolExecutionState) {
        this.saveSetting<ProtocolExecutionState>(AppSettings.PROTOCOL_EXECUTION_STATE, value)
    }

    get segments(): ProtocolSegment[] {
        return this._segments;
    }

    private set segments(segments: ProtocolSegment[]) {
        console.debug("protocol executor updating segments")
        this._segments = segments
    }

    get protocolStartTime(): Date | null {
        return this._protocolStartTime;
    }

    private set protocolStartTime(date: Date | null) {
        this._protocolStartTime = date;
    }

    get lastAmbientSegment(): ProtocolSegment | undefined {
        return this._lastAmbientSegment;
    }

    private set lastAmbientSegment(value: ProtocolSegment | undefined) {
        this._lastAmbientSegment = value;
    }

    get currentSegment(): ProtocolSegment | undefined {
        if (this._currentSegmentIndex === undefined) {
            return undefined;
        }
        if (this._currentSegmentIndex >= this.segments.length) {
            return undefined;
        }
        return this.segments[this._currentSegmentIndex];
    }

    private set currentSegmentIndex(index: number) {
        this._currentSegmentIndex = index;
        this.dispatch(new CurrentSegmentChangedEvent(this.currentSegment))
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

    private set protocol(protocolName: string) {
        if (this.state === "Executing") {
            console.warn("attempted to set protocol while protocol is executing. ignoring. this is not allowed.")
            return;
        }
        const protocolDefinition = APP_SETTINGS_CONTEXT.getProtocolDefinition(protocolName)
        this.segments = convertStagesToSegments(protocolDefinition);
    }

    public async executeProtocol(protocolName?: string) {
        if (this.state === "Executing") {
            console.log("protocol execution in progress (can't start another protocol)");
            return;
        }
        if (protocolName) {
            this.protocol = protocolName;
        }

        if (this.segments.length === 0) {
            console.debug(`trying to execute protocol, but no segments found, protocolName: ${protocolName}`);
            return;
        }

        this.lastAmbientSegment = undefined // reset
        this.protocolStartTime = new Date()
        this.controller.assumeManualControl() // make sure we're in control
        await this.dataCollector.recordTestStart(ControlSource.External, this.protocolStartTime.toLocaleString())

        let segmentToStart = 0;
        if (this.getSetting(AppSettings.USE_IDLE_AMBIENT_VALUES)) {
            console.debug("trying to use idle ambient values")
            if (this.segments.length > 2
                && this.segments[0].source === SampleSource.AMBIENT
                && this.segments[1].source === SampleSource.AMBIENT
                && this.segments[1].state === SegmentState.SAMPLE
            ) {
                // duration is in seconds. in external control mode, samples are 1 second appart.
                const minSamples = this.segments[1].duration;
                const idleAmbientEvents = this.ambientSampleCollector
                    .getEvents(60000) // only consider values within the last minute
                    .slice(-minSamples) // take the most recent values if we have more than we need
                if (idleAmbientEvents.length === minSamples) {
                    console.debug("using ambient values collected while idle")
                    this.segments[1].data.push(...idleAmbientEvents)
                    segmentToStart = this.closeSegment(this.segments[1])
                    this.controller.beep()
                }
            }
        }
        this.ambientSampleCollector.reset()
        this.maskSampleCollector.reset()
        this.executeSegment(segmentToStart)
        this.controller.beep()
        this.dispatch(new ProtocolStartedEvent());
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
                case CurrentSegmentChangedEvent.name: {
                    if (listener.segmentChanged) {
                        listener.segmentChanged((event as CurrentSegmentChangedEvent).newSegment)
                    }
                    break;
                }
                case ProtocolStartedEvent.name: {
                    if (listener.started) {
                        listener.started();
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
        if (segmentIndex >= this.segments.length) {
            console.warn("trying to execute invalid segment with index: ", segmentIndex)
            // invalid
            return;
        }
        this.state = "Executing"

        const segment: ProtocolSegment = this.segments[segmentIndex];
        segment.segmentStartTimeMs = Date.now();
        segment.data.splice(0) // make sure this is reset
        this.currentSegmentIndex = segmentIndex;
        this.saveSetting(AppSettings.CURRENT_STAGE_INDEX, segment.stageIndex)
        const isFirstSegmentInStage = segmentIndex === 0 || segment.stageIndex !== this.segments[segmentIndex - 1].stageIndex;
        if (isFirstSegmentInStage) {
            // this is the first segment of the stage.
            this.saveSetting(AppSettings.CURRENT_STAGE_INDEX, segment.stageIndex)
            this.saveSetting(AppSettings.STAGE_START_TIME, segment.segmentStartTimeMs)

            if (segment.exerciseNumber) {
                // this is where protocol executor updates the instructions, which in turn speaks the instructions
                SPEECH.sayIt(`Exercise ${segment.exerciseNumber}: ${segment.stage.instructions}`)
            } else {
                SPEECH.sayIt(segment.stage.instructions)
            }
        }

        // console.log(`staging segment`, segment);

        switch (segment.source) {
            case SampleSource.AMBIENT:
                this.controller.sampleAmbient()
                this.ambientSampleCollector.reset()
                break;
            case SampleSource.MASK:
                this.controller.sampleMask()
                this.maskSampleCollector.reset()
                break;
        }
    }

    private updateValvePosition() {
        if (this.getSetting(AppSettings.SAMPLE_MASK_WHEN_IDLE)) {
            // sample from mask when idle so we can get ff estimates
            this.controller.sampleMask()
            console.debug("sample mask when idle in effect")
        } else if (this.getSetting(AppSettings.USE_IDLE_AMBIENT_VALUES)) {
            // sample from ambient when idle so we can have tests start faster
            this.controller.sampleAmbient()
            console.debug("use idle ambient values in effect")
        }
    }

    public pause() {
        console.log("pausing protocol")
        // reset segment data since segment timers look at presence of data
        const currentStageIndex = this.currentSegment?.stageIndex
        if (currentStageIndex !== undefined) {
            this.segments.filter((segment) => segment.stageIndex === currentStageIndex).forEach((segment) => {
                segment?.data.splice(0) // reset data for segments in the current stage where we paused
            })
        }
        this.state = "Paused"
    }

    public resume() {
        const currentStageIndex = this.currentSegment?.stageIndex
        if (currentStageIndex === undefined) {
            console.debug("can't resume: no current stage")
            return
        }
        this.resumeFromStage(currentStageIndex);
    }

    private resumeFromStage(currentStageIndex: number) {
        const firstSegmentCurrentStage = this.segments.find((segment) => segment.stageIndex === currentStageIndex)
        if (firstSegmentCurrentStage === undefined) {
            console.debug("can't resume: can't determine first segment in current stage")
            return
        }
        console.debug(`resuming at segment ${firstSegmentCurrentStage.index} stage ${firstSegmentCurrentStage.stageIndex}`)
        this.dataCollector.setInstructions(""); // reset this so we can detect a change in instructions and say them
                                                // again
        this.saveSetting<ParticleCountStats>(AppSettings.CURRENT_MASK_AVERAGE, NO_PARTICLE_COUNT_STATS) // reset
        this.executeSegment(firstSegmentCurrentStage.index)
    }

    public restartFromExercise(exerciseNum: number) {
        if(this.state !== "Paused") {
            console.debug(`can only restartFrom when Paused, current state is ${this.state}`)
            return
        }
        // find the first segment of the target exercise
        const segmentForExercise = this.segments.find((segment) => segment.exerciseNumber === exerciseNum)
        if(segmentForExercise === undefined) {
            console.debug(`can't restart from ex ${exerciseNum}: can't determine stage for exercise ${exerciseNum}`)
            return
        }
        this.resumeFromStage(segmentForExercise.stageIndex)
    }

    /**
     * cancel the current protocol execution.
     */
    public cancel() {
        this.protocolStartTime = null;
        console.log("cancelling protocol")
        this.state = "Idle"
        this.dataCollector.recordTestAborted()
        this.dispatch(new ProtocolAbortedEvent())
        this.controller.beep()
        this.updateValvePosition();
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
     * @return the next segmentIndex or 0 if no more segments
     */
    private closeSegment(segment: ProtocolSegment) {
        const nextSegmentIndex = (this.segments.length + segment.index + 1) % this.segments.length;

        if (segment.state === SegmentState.PURGE) {
            // nothing to do for purge segments. these data are ignored.
            switch (segment.source) {
                case SampleSource.AMBIENT:
                    this.ambientSampleCollector.reset();
                    break;
                case SampleSource.MASK:
                    this.maskSampleCollector.reset();
                    break;
            }
            return nextSegmentIndex
        }
        // we're closing a sampling segment
        const {average: segmentConcentration, stddev} = calculateSegmentConcentrationAndStddev(segment);
        // round stddev to save space.
        this.dataCollector.recordParticleCount(new ParticleConcentrationEvent(segmentConcentration, segment.source, ControlSource.External, Math.round(stddev)))

        if (segment.source === SampleSource.AMBIENT) {
            if (this.lastAmbientSegment) {
                // we're closing the 2nd ambient for some mask samples.
                const averageAmbient = avg(calculateSegmentConcentration(this.lastAmbientSegment), segmentConcentration)

                // look at all mask segments between this at the previous ambient segments and (re)calculate their
                // results using the average of this and the previous ambient segment.
                for (let maskSegmentIndex = segment.index - 1; maskSegmentIndex > this.lastAmbientSegment.index; maskSegmentIndex--) {
                    // all the segments in this range are Mask segments
                    // we're in the contiguous segments before the latest one that is sourced from the mask side
                    const maskSegment = this.segments[maskSegmentIndex];
                    if (maskSegment.state === SegmentState.SAMPLE) {
                        const maskConcentration = calculateSegmentConcentration(maskSegment);
                        const ff2 = averageAmbient / maskConcentration
                        if (isNaN(ff2)) {
                            // make sure this doesn't update to NaN
                            console.debug(`ff2 is NaN. averageAmbient ${averageAmbient}, ambient1`, this.lastAmbientSegment, `, ambient2 ${segmentConcentration}, maskConcentration ${maskConcentration}, mask segment`, maskSegment, "all segments (getter)", this.segments, "all segments (direct)", this._segments)
                        } else {
                            console.debug(`updating ex ${maskSegment.exerciseNumber} score from ${maskSegment.calculatedScore} to ${ff2}`)
                            maskSegment.calculatedScore = ff2;
                            this.dataCollector.recordExerciseResult(maskSegment.exerciseNumber ?? 0, maskSegment.calculatedScore)
                        }
                    }
                }
            } else {
                // we're closing the first ambient
            }
            this.lastAmbientSegment = segment;
        } else if (segment.source === SampleSource.MASK) {
            if (this.lastAmbientSegment) {
                // todo: set a max on the FF based on the ambient reading. So we don't get to infinite FF with 0
                // concentration in the current segment
                segment.calculatedScore = calculateSegmentConcentration(this.lastAmbientSegment) / segmentConcentration
                this.dataCollector.recordExerciseResult(segment.exerciseNumber ?? 0, segment.calculatedScore)
                this.controller.beep()
            } else {
                console.error("mask segment completed, but there was no last ambient segment.")
            }
        }
        if (nextSegmentIndex === 0) {
            // we closed the last segment
            this.closeProtocol();
        }
        return nextSegmentIndex
    }

    private closeProtocol() {
        console.log("no more segments (test completed)")
        this.state = "Idle"
        const finalScore = this.calculateFinalFitFactor();
        this.dataCollector.recordTestComplete(finalScore)
        this.dispatch(new ProtocolCompletedEvent())
        this.controller.beep()
        this.controller.beep()
        this.updateValvePosition();
    }
}

