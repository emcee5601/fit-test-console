/*
Collect data from PortaCount 8020a
 */

// data output patterns
import {SPEECH} from "./speech.ts";
import React from "react";
import {
    DataTransmissionState,
    FitFactorResultsEvent,
    ParticleConcentrationEvent,
    PortaCountClient8020,
    PortaCountListener
} from "./portacount-client-8020.ts";
import {RESULTS_DB, SimpleResultsDBRecord} from "./SimpleResultsDB.ts";
import {InstructionOrStage, SampleSource} from "./simple-protocol.ts";
import {APP_SETTINGS_CONTEXT} from "./app-settings.ts";
import {FitFactorEstimator} from "./fit-factor-estimator.ts";
import {
    CurrentTestUpdatedEvent,
    DataCollectorEvent,
    EstimatedAmbientConcentrationChangedEvent,
    EstimatedFitFactorChangedEvent,
    EstimatedMaskConcentrationChangedEvent,
    InstructionsChangedEvent,
    LogEvent,
    ProcessedDataEvent,
    RawLineEvent,
    TickEvent
} from "./data-collector-events.ts";
import {RAW_DB} from "./database.ts";
import {DataSource} from "./data-source.ts";
import {ControlSource} from "./control-source.ts";


export interface DataCollectorListener {
    instructionsChanged?(instructions: string): void,

    estimatedFitFactorChanged?(estimate: number): void,

    estimatedAmbientConcentrationChanged?(estimate: number): void,

    estimatedMaskConcentrationChanged?(estimate: number): void,

    tick?(): void

    logMessage?(message: string): void,

    logProcessedData?(data: string): void,

    logRawLine?(line: string): void,

    currentTestUpdated?(data: SimpleResultsDBRecord): void,
}

export class DataCollector {
    private readonly listeners: DataCollectorListener[] = [];
    resultsDatabase;
    // the last completed dataset
    previousTestData: SimpleResultsDBRecord | null = null;
    // the current in-progress dataset
    currentTestData: SimpleResultsDBRecord | null = null;
    lastExerciseNum: number = 0;
    sampleSource: SampleSource = SampleSource.MASK; // defaults to mask, but if we connect in the middle, we need to check
    private setResults: React.Dispatch<React.SetStateAction<SimpleResultsDBRecord[]>> | undefined;

    private inProgressTestPromiseChain: Promise<void> | undefined;
    private controlSource: ControlSource = ControlSource.Internal;
    private readonly settings;
    // collect these for log display
    private _rawLines: string = "";
    private _processedData: string = "";
    private _logLines: string = "";
    private _fitFactorEstimator: FitFactorEstimator;
    private _dataSource: DataSource = DataSource.NotInitialized;


    constructor() {
        this.settings = APP_SETTINGS_CONTEXT; // can't take this from appContext because appContext refers to data collector (this)
        this.resultsDatabase = RESULTS_DB;
        this._fitFactorEstimator = new FitFactorEstimator(this)
        this.fitFactorEstimator.resetChart();
    }

    get saveLinesToDb(): boolean {
        return this._dataSource !== DataSource.Simulator;
    }

    set dataSource(value: DataSource) {
        this._dataSource = value;
    }

    get dataSource(): DataSource {
        return this._dataSource;
    }

    get fitFactorEstimator(): FitFactorEstimator {
        return this._fitFactorEstimator;
    }

    set fitFactorEstimator(value: FitFactorEstimator) {
        this._fitFactorEstimator = value;
    }


    get rawLines() {
        return this._rawLines
    }

    get logLines(): string {
        return this._logLines;
    }

    get processedData(): string {
        return this._processedData;
    }

    appendToRaw(line: string) {
        this._rawLines += line + '\n';
        this.dispatch(new RawLineEvent(line))
    }

    appendToLog(message: string) {
        this._logLines += message;
        this.dispatch(new LogEvent(message))
    }

    appendToProcessedData(data: string) {
        this._processedData += data;
        this.dispatch(new ProcessedDataEvent(data))
    }

    setInstructions(message: string) {
        this.dispatch(new InstructionsChangedEvent(message))
    }

    setInstructionsForExercise(exerciseNum: number) {
        if (!this.settings.selectedProtocol) {
            // not ready. abort for now.
            return;
        }
        const selectedProtocol = this.settings.selectedProtocol;
        const protocolInstructionSet: InstructionOrStage[] = this.settings.protocolDefinitions[selectedProtocol]
        const instructionsOrStageInfo = protocolInstructionSet[exerciseNum - 1];
        const instructions = typeof instructionsOrStageInfo === "object"
            ? ("instructions" in instructionsOrStageInfo
                ? instructionsOrStageInfo["instructions"]
                : instructionsOrStageInfo["i"])
            : instructionsOrStageInfo as string

        if (instructions) {
            // We don't know the number of exercises the portacount will run. Just assume the currently selected protocol matches the portacount setting.
            // So if there are no more instructions for this exercise num, assume we're done.
            this.setInstructions(`Perform exercise ${exerciseNum}: ${instructions}`);
        }
    }

    recordTestComplete() {
        const fun = () => {
            console.log(`test complete, id ${this.currentTestData?.ID}`)
            this.previousTestData = this.currentTestData
            this.currentTestData = null; // flag done
        };
        this.chain(fun) // need to chain
    }

    recordTestAborted() {
        // todo: does this need to be chained with this.inProgressTestPromiseChain ?
        const fun = () => {
            if (!this.currentTestData) {
                console.log("no current row, ignoring");
                return;
            }
            this.currentTestData[`Ex ${this.lastExerciseNum + 1}`] = "aborted";
            this.setInstructions("Test cancelled.");
            this.updateCurrentRowInDatabase();
            console.log('test aborted')
        }
        this.chain(fun)
    }

    // chain a function to the end of the test sequence promise so these get processed sequentially.
    // should only be a problem when using the simulator because the datastream has no delay.
    private chain(fun: () => void) {
        if (this.inProgressTestPromiseChain) {
            this.inProgressTestPromiseChain = this.inProgressTestPromiseChain.then(fun)
        } else {
            fun()
        }
    }

    // todo:
    async recordTestStart(controlSource: ControlSource, timestamp = new Date().toLocaleString()) {
        if (!this.resultsDatabase) {
            console.log("database not ready");
            return;
        }
        if (!this.settings.selectedProtocol) {
            console.log("protocols not loaded (not ready)")
            return;
        }
        this.lastExerciseNum = 0;
        const newTestData = await this.resultsDatabase.createNewTest(timestamp, this.settings.selectedProtocol, controlSource, this.dataSource);
        this.currentTestData = newTestData;

        const testTemplate = this.settings.testTemplate
        for (const key in testTemplate) {
            if (key in newTestData) {
                // don't copy fields that were assigned
                continue;
            }
            if (key.startsWith("Ex ") || key.startsWith("Final")) {
                // don't copy exercise results
                continue
            }
            if (typeof testTemplate[key] === "string") {
                this.currentTestData[key] = testTemplate[key];
            }
        }

        console.log(`new test added: ${JSON.stringify(this.currentTestData)}`)
        this.dispatch(new CurrentTestUpdatedEvent(newTestData))
    }

    recordExerciseResult(exerciseNum: number | string, ff: number) {
        const fun = () => {
            if (!this.currentTestData) {
                console.log("no current row! ignoring");
                return
            }
            if (typeof exerciseNum === "number") {
                this.currentTestData[`Ex ${exerciseNum}`] = `${Math.floor(ff)}`
                this.lastExerciseNum = exerciseNum;
            } else {
                this.currentTestData[`${exerciseNum}`] = `${Math.floor(ff)}`; // probably "Final"
            }
            this.updateCurrentRowInDatabase();
        }
        this.chain(fun)
    }

    /**
     * This is typically called when the UI is updating the test record.
     * @param record
     */
    updateTest(record: SimpleResultsDBRecord) {
        if (record.ID) {
            if (record.ID === this.currentTestData?.ID) {
                /*
                The record being updated by the UI is currently being populated by the currently running test.
                Point this.currentTestData to the record the UI is updating, and make sure the test results are copied over.
                 */
                const oldCurrentTestData = this.currentTestData
                this.currentTestData = record;
                // just make sure all the number fields have values
                Object.entries(oldCurrentTestData).forEach(([key, value]) => {
                    if (typeof value === "number" && this.currentTestData) {
                        if (this.currentTestData[key] !== value) {
                            this.currentTestData[key] = value;
                            if (this.setResults) {
                                this.setResults((prev) => [...prev]) // force an update by changing the ref
                            }
                        }
                    }
                })
            } else if (record.ID === this.previousTestData?.ID) {
                /*
                We're updating the previous record. If we don't have a current record, we must be updating the latest
                record. In this case, we should update the local copy of the previous record so if we're propagating
                the text fields over, we pick up these changes.
                 */
                this.previousTestData = record;
            }
            this.resultsDatabase.updateTest(record);
        } else {
            console.log(`updateTest() unexpected record with no ID: ${record}`)
        }
    }

    updateCurrentRowInDatabase() {
        if (!this.currentTestData) {
            // no current data row
            return;
        }
        this.resultsDatabase.updateTest(this.currentTestData);
        this.dispatch(new CurrentTestUpdatedEvent(this.currentTestData))
    }


    setProtocol(protocol: string) {
        console.log(`setProtocol ${protocol}`)
        this.settings.selectedProtocol = protocol;
    }

    public addListener(listener: DataCollectorListener): void {
        this.listeners.push(listener);
    }

    public removeListener(listener: DataCollectorListener): void {
        this.listeners.filter((value, index, array) => {
            if (value === listener) {
                array.splice(index, 1);
                return true
            }
            return false;
        })
    }

    // todo: make this private again after FitFactorEstimator is refactored
    public dispatch(event: DataCollectorEvent) {
        this.listeners.forEach((listener) => {
            // console.log(`dispatch event ${event.constructor.name}`)
            switch (event.constructor.name) {
                case CurrentTestUpdatedEvent.name: {
                    if (listener.currentTestUpdated) {
                        listener.currentTestUpdated((event as CurrentTestUpdatedEvent).record)
                    }
                    break;
                }
                case TickEvent.name: {
                    if (listener.tick) {
                        listener.tick();
                    }
                    break;
                }
                case RawLineEvent.name: {
                    if (listener.logRawLine) {
                        listener.logRawLine((event as RawLineEvent).line)
                    }
                    break;
                }
                case LogEvent.name: {
                    if (listener.logMessage) {
                        const e: LogEvent = event as LogEvent
                        listener.logMessage(e.message);
                    }
                    break;
                }
                case ProcessedDataEvent.name: {
                    if (listener.logProcessedData) {
                        const e: ProcessedDataEvent = event as ProcessedDataEvent
                        listener.logProcessedData(e.data);
                    }
                    break;
                }
                case EstimatedFitFactorChangedEvent.name: {
                    if (listener.estimatedFitFactorChanged) {
                        const effce: EstimatedFitFactorChangedEvent = event as EstimatedFitFactorChangedEvent;
                        listener.estimatedFitFactorChanged(effce.estimate)
                    }
                    break;
                }
                case EstimatedMaskConcentrationChangedEvent.name: {
                    if (listener.estimatedMaskConcentrationChanged) {
                        listener.estimatedMaskConcentrationChanged((event as EstimatedMaskConcentrationChangedEvent).estimate)
                    }
                    break;
                }
                case EstimatedAmbientConcentrationChangedEvent.name: {
                    if (listener.estimatedAmbientConcentrationChanged) {
                        listener.estimatedAmbientConcentrationChanged((event as EstimatedAmbientConcentrationChangedEvent).estimate)
                    }
                    break;
                }
                case InstructionsChangedEvent.name: {
                    if (listener.instructionsChanged) {
                        const ice: InstructionsChangedEvent = event as InstructionsChangedEvent;
                        listener.instructionsChanged(ice.instructions);
                    }
                    break;
                }
            }
        });
    }

    private readonly portaCountListener: PortaCountListener = {
        lineReceived: (line: string) => {
            if (line.trim().length > 0) {
                // we only care about non-empty lines
                this.appendToRaw(line);
                if (this.saveLinesToDb) {
                    RAW_DB.addLine(line);
                }
            }
        },

        sampleSourceChanged: (source: SampleSource) => {
            console.log(`sampling from ${source}`)
            this.appendToLog(`sampling from ${source}\n`);
            this.sampleSource = source;
        },

        dataTransmissionStateChanged: (dataTransmissionState: DataTransmissionState) => {
            this.appendToLog(`data transmission state: ${dataTransmissionState}`)
        },

        testStarted: (timestamp: number) => {
            this.appendToProcessedData(`\nStarting a new test. ${new Date(timestamp).toLocaleString()}\n`);
            this.setInstructionsForExercise(1);
            this.inProgressTestPromiseChain = this.recordTestStart(ControlSource.Internal, new Date(timestamp).toLocaleString());
        },

        controlSourceChanged: (source: ControlSource) => {
            this.controlSource = source;
        },

        fitFactorResultsReceived: (results: FitFactorResultsEvent) => {
            const ff = results.ff
            const exerciseNum = results.exerciseNum
            const result = results.result
            this.recordExerciseResult(exerciseNum, ff);

            if (typeof exerciseNum === 'number') {
                this.appendToProcessedData(`Exercise ${exerciseNum}: Fit factor is ${ff}. Result: ${result}\n`)
                this.setInstructionsForExercise(exerciseNum + 1);
                SPEECH.sayItLater(`Score was ${ff}`)
            } else {
                // test finished
                this.appendToProcessedData(`\nTest complete. ${result} with FF of ${ff}\n`);
                this.setInstructions(`Test complete. Score: ${ff}`);
                this.appendToLog(JSON.stringify(this.currentTestData) + "\n");
                this.recordTestComplete();
                SPEECH.sayItLater(`Final score was ${ff}`)
            }
        },

        testTerminated: () => {
            this.appendToProcessedData(`\nTest aborted\n`);
            // this.setInstructions("Breathe normally");
            this.recordTestAborted();
            this.recordTestComplete()
        },

        particleConcentrationReceived: (event: ParticleConcentrationEvent) => {
            // handle realtime
            // if we're in the middle of a test, ignore
            const fun = () => {
                if (this.currentTestData) {
                    if (event.controlSource === ControlSource.Internal) {
                        // we got the mask or ambient concentration for a segment. record it.
                        this.recordParticleCount(event);
                    }
                    return
                }
                const concentration = event.concentration;
                const timestamp = event.timestamp;
                if (this.controlSource === ControlSource.External) {
                    this.appendToProcessedData(`${this.sampleSource}: ${concentration}\n`)
                }

                // TODO: timestamp should always be present. check this
                this.fitFactorEstimator.processConcentration(concentration, timestamp ? new Date(timestamp) : new Date())
            }
            this.chain(fun)
        }
    }

    recordParticleCount(event: ParticleConcentrationEvent) {
        if(!this.currentTestData) {
            return
        }
        if (!this.currentTestData.ParticleCounts) {
            this.currentTestData.ParticleCounts = []
        }
        this.currentTestData.ParticleCounts.push({type: event.sampleSource, count: event.concentration})
        this.updateCurrentRowInDatabase()
    }

    setPortaCountClient(portaCountClient: PortaCountClient8020) {
        portaCountClient.addListener(this.portaCountListener)
    }
}
