/*
Collect data from PortaCount 8020a
 */

// data output patterns
import {speech} from "./speech.ts";
import {AppSettings, SETTINGS_DB} from "./settings-db.ts";
import React, {RefObject, useEffect, useState} from "react";
import {ResultsTable} from "./ResultsTable.tsx";
import {EChartsOption} from "echarts-for-react/src/types.ts";
import {deepCopy} from "json-2-csv/lib/utils";
import MovingAverage from "moving-average"
import {JSONContent} from "vanilla-jsoneditor";
import {
    ControlSource,
    DataTransmissionState,
    FitFactorResultsEvent,
    ParticleConcentrationEvent,
    PortaCountListener
} from "./portacount-client-8020.ts";
import {SampleSource} from "./fit-test-protocol.ts";
import {formatFitFactor} from "./utils.ts";
import {RESULTS_DB, SimpleResultsDBRecord} from "./SimpleResultsDB.ts";

const FIVE_SECONDS_IN_MS: number = 5 * 1000;
const TWENTY_SECONDS_IN_MS: number = 20 * 1000;

enum SampleZone {
    MASK = "mask",
    AMBIENT = "ambient",
    UNKNOWN = "unknown",
    DON_DOFF = "purge",
}

/**
 * timestamp, concentration, estimated fit factor, guessed ambient level, EMA concentration, stddev
 */
type TimeseriesEntry = {
    // only timestamp and concentration are measured. everything else is derived from these.
    timestamp: Date, // timestamp from the clock
    concentration: number, // the particle count concentration reading from the device
    emaConcentration: number | undefined, // exponential moving average of the concentration
    emaConcentrationStdDev: number | undefined, // std dev
    guestimatedAmbient: number | undefined, // based on ema concentration and stddev, try to guess the ambient level
    sampleZone: SampleZone, // based on guestimatedAmbient, etc, classify which zone we're in (ambient, mask, unknown)
    emaConcentrationInZone: number | undefined, // based on guestimatedAmbient, only using data points in current zone
    estimatedFitFactor: number | undefined, // based on emaConcentrationInZone and guestimatedAmbient
    estimatedFitFactorBand: number | undefined, // +/- band calculated from applying stddev to emaConcentrationInZone
    estimatedFitFactorBandLower: number | undefined,
    zoneFF: number | undefined,
};

const timeSeriesEntryDerivedFields = {
    emaConcentration: undefined,
    emaConcentrationStdDev: undefined,
    guestimatedAmbient: undefined,
    sampleZone: SampleZone.UNKNOWN,
    emaConcentrationInZone: undefined,
    estimatedFitFactor: undefined,
    estimatedFitFactorBand: undefined,
    estimatedFitFactorBandLower: undefined,
    zoneFF: undefined,
}

export class DataCollector implements PortaCountListener {
    static PORTACOUNT_VERSION_PATTERN = /^PORTACOUNT\s+PLUS\S+PROM\S+(?<version>.+)/i; // PORTACOUNT PLUS PROM V1.7
    static COPYRIGHT_PATTERN = /^COPYRIGHT.+/i; // COPYRIGHT(c)1992 TSI INC
    static LICENSE_PATTERN = /^ALL\s+RIGHTS\s+RESERVED/i; // ALL RIGHTS RESERVED
    static SERIAL_NUMBER_PATTERN = /^Serial\s+Number\s+(?<serialNumber>\d+)/i; // Serial Number 17754
    static PASS_LEVEL_PATTERN = /^FF\s+pass\s+level\s+(?<passLevel>\d+)/i; // FF pass level = 100
    static NUM_EXERCISES_PATTERN = /^No\.\s+of\s+exers\s*=\s*(?<numExercises>\d+)/i; // No. of exers  = 4
    static AMBIENT_PURGE_PATTERN = /^Ambt\s+purge\s*=\s*(?<ambientPurgeTime>\d+)/i; // Ambt purge   = 4 sec.
    static AMBIENT_SAMPLE_PATTERN = /^Ambt\s+sample\s*=\s*(?<ambientSampleTime>\d+)/i; // Ambt sample  = 5 sec.
    static MASK_PURGE_PATTERN = /^Mask\s+purge\s*=\s*(?<maskPurgeTime>\d+)/i; // Mask purge  = 11 sec.
    static MASK_SAMPLE_PATTERN = /^Mask\s+sample\s+(?<exerciseNumber>\d+)\s*=\s*(?<maskSampleTime>\d+)/i; // Mask sample 1 = 40 sec.
    static DIP_SWITCH_PATTERN = /^DIP\s+switch\s+=\s+(?<dipSwitchBits>\d+)/i; // DIP switch  = 10111111
    static COUNT_READING_PATTERN = /^(?<timestamp>\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d.\d{3}Z)?\s*Conc\.\s+(?<concentration>[\d.]+)/i; // Conc.      0.00 #/cc
    static NEW_TEST_PATTERN = /^NEW\s+TEST\s+PASS\s*=\s*(?<passLevel>\d+)/i; // NEW TEST PASS =  100
    static AMBIENT_READING_PATTERN = /^Ambient\s+(?<concentration>[\d.]+)/i; // Ambient   2290 #/cc
    static MASK_READING_PATTERN = /^Mask\s+(?<concentration>[\d+.]+)/i; // Mask    5.62 #/cc
    static FIT_FACTOR_PATTERN = /^FF\s+(?<exerciseNumber>\d+)\s+(?<fitFactor>[\d.]+)\s+(?<result>.+)/; // FF  1    352 PASS
    static TEST_TERMINATED_PATTERN = /^Test\s+Terminated/i; // Test Terminated
    static OVERALL_FIT_FACTOR_PATTERN = /^Overall\s+FF\s+(?<fitFactor>[\d.]+)\s+(?<result>.+)/i; // Overall FF    89 FAIL
    static LOW_PARTICLE_COUNT_PATTERN = /^(?<concentration>\d+)\/cc\s+Low\s+Particle\s+Count/i; // 970/cc Low Particle Count

    // external control response patterns
    // 2024-10-24T17:38:02.876Z 005138.88
    static EXTERNAL_CONTROL_PARTICLE_COUNT_PATTERN = /^(?<timestamp>\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d.\d{3}Z)?\s*(?<concentration>\d+\.\d+)\s*/; // 006408.45
    static EXTERNAL_CONTROL_SAMPLING_FROM_MASK_PATTERN = /^VF$/;  // VF
    static EXTERNAL_CONTROL_SAMPLING_FROM_AMBIENT_PATTERN = /^VN$/;  // VN
    static EXTERNAL_CONTROL_DATA_TRANSMISSION_DISABLED_PATTERN = /^ZD$/; // ZD
    static EXTERNAL_CONTROL_DATA_TRANSMISSION_ENABLED_PATTERN = /^ZE$/; // ZE
    static EXTERNAL_CONTROL_EXTERNAL_CONTROL_PATTERN = /^(OK|EJ)$/; // OK.  EJ seems to be if it's already in external control mode
    static EXTERNAL_CONTROL_INTERNAL_CONTROL_PATTERN = /^G$/; // G

    static nextTabIndex = 100;
    resultsDatabase;
    settingsDatabase;
    logCallback;
    dataCallback;
    processedDataCallback;
    previousTestData: SimpleResultsDBRecord | null = null;
    currentTestData: SimpleResultsDBRecord | null = null;
    nextTestData: Partial<SimpleResultsDBRecord> | null = null;
    lastExerciseNum: number = 0;
    sampleSource: string = "undefined";
    states: DataCollectorStates;
    private setResults: React.Dispatch<React.SetStateAction<SimpleResultsDBRecord[]>> | undefined;

    private fullConcentrationHistory: TimeseriesEntry[] = []; // this is used far graphing
    private guestimatedAmbientConcentration: number = 0;
    // exponential moving average of the concentration
    private maCount5s: MovingAverage = MovingAverage(FIVE_SECONDS_IN_MS);
    private maZoneConcentration20s: MovingAverage = MovingAverage(TWENTY_SECONDS_IN_MS); // TODO: use arithmetic average within the zone so all particles count the same?
    private nextChartUpdateTime: number = 0; // next time (epoch time) that we should update the chart
    private selectedProtocol: string | undefined;
    private inProgressTestPromiseChain: Promise<void> | undefined;
    private controlSource: ControlSource = ControlSource.Internal;

    constructor(states: DataCollectorStates,
                logCallback: (message: string) => void,
                dataCallback: (message: string) => void,
                processedDataCallback: (message: string) => void
    ) {
        this.logCallback = logCallback;
        this.dataCallback = dataCallback;
        this.processedDataCallback = processedDataCallback;
        this.resultsDatabase = RESULTS_DB;
        this.settingsDatabase = SETTINGS_DB;
        this.states = states;
        console.log("DataCollector constructor called")
        this.resetChart();
    }

    // PortaCountListener interface
    sampleSourceChanged(source: SampleSource): void {
        console.log(`sampling from ${source}`)
        this.appendToLog(`sampling from ${source}\n`);
        this.sampleSource = source;
    }

    dataTransmissionStateChanged(dataTransmissionState: DataTransmissionState) {
        this.appendToLog(`data transmission state: ${dataTransmissionState}`)
    }

    testStarted(timestamp: number) {
        this.appendToProcessedData(`\nStarting a new test. ${new Date(timestamp).toLocaleString()}\n`);
        this.setInstructionsForExercise(1);
        this.inProgressTestPromiseChain = this.recordTestStart();
    }

    controlSourceChanged(source: ControlSource) {
        this.controlSource = source;
    }

    fitFactorResultsReceived(results: FitFactorResultsEvent) {
        const ff = results.ff
        const exerciseNum = results.exerciseNum
        const result = results.result
        this.recordExerciseResult(exerciseNum, ff);

        if (typeof exerciseNum === 'number') {
            this.appendToProcessedData(`Exercise ${exerciseNum}: Fit factor is ${ff}. Result: ${result}\n`)
            this.setInstructionsForExercise(exerciseNum + 1);
            speech.sayItLater(`Score was ${ff}`)
        } else {
            // test finished
            this.appendToProcessedData(`\nTest complete. ${result} with FF of ${ff}\n`);
            this.setInstructions(`Test complete. Score: ${ff}`);
            this.appendToLog(JSON.stringify(this.currentTestData) + "\n");
            this.recordTestComplete();
            speech.sayItLater(`Final score was ${ff}`)
        }
    }

    testTerminated() {
        this.appendToProcessedData(`\nTest aborted\n`);
        this.setInstructions("Breathe normally");
        this.recordTestAborted();
        this.recordTestComplete()
    }

    particleConcentrationReceived(event: ParticleConcentrationEvent) {
        this.appendToProcessedData(`${new Date(event.getTimestamp()).toISOString()}: ${event.source} concentration: ${event.concentration}\n`);

        // handle realtime
        // if we're in the middle of a test, ignore
        if (this.currentTestData) {
            // in the middle of a test. If it's a mask concentration, we're probably in a purge phase.
            if (event.source === SampleSource.Mask) {
                // todo: we don't technically need this.
                this.setInstructions("Breathe normally");
            }
            // no need to further process concentration.
            // TODO: if we're in custom protocol mode, we'd need to keep track
            return
        }
        const concentration = event.concentration;
        const timestamp = event.getTimestamp();
        if (!speech.isSayingSomething()) {
            if (this.states.sayParticleCount) {
                const intConcentration = Math.ceil(concentration);
                const roundedConcentration = intConcentration < 20 ? (Math.ceil(concentration * 10) / 10).toFixed(1) : intConcentration;
                const message = this.states.verboseSpeech ? `Particle count is ${roundedConcentration}` : roundedConcentration.toString();
                speech.sayIt(message);

            }
        }
        if (this.controlSource === ControlSource.External) {
            this.appendToProcessedData(`${this.sampleSource}: ${concentration}\n`)
        }

        // TODO: timestamp should always be present. check this
        this.processConcentration(concentration, timestamp ? new Date(timestamp) : new Date())
    }

    resetChart() {
        this.fullConcentrationHistory = [];
        this.guestimatedAmbientConcentration = 0;
        this.maCount5s = MovingAverage(FIVE_SECONDS_IN_MS);
        this.maZoneConcentration20s = MovingAverage(TWENTY_SECONDS_IN_MS);
        this.nextChartUpdateTime = 0;
    }

    appendToLog(message: string) {
        this.logCallback(message);
    }

    appendToProcessedData(data: string) {
        this.processedDataCallback(data);
    }

    setInstructions(message: string) {
        if (this.states.setInstructions) {
            // console.log(`setInstructions ${message}`)
            this.states.setInstructions(message)
        }
        speech.sayItLater(message); // make sure instructions are queued.
    }

    setInstructionsForExercise(exerciseNum: number) {
        if (!this.selectedProtocol) {
            // not ready. abort for now.
            return;
        }
        // TODO: cache this and don't read from db all the time (maybe the db layer can do the caching)
        const selectedProtocol = this.selectedProtocol;
        this.settingsDatabase.getSetting<JSONContent>(AppSettings.PROTOCOL_INSTRUCTION_SETS).then((protocolInstructionSets: JSONContent) => {
            const protocolInstructionSetsJson = protocolInstructionSets.json as { [key: string]: [] };
            const protocolInstructionSet = protocolInstructionSetsJson[selectedProtocol]
            const instructionsOrStageInfo = protocolInstructionSet[exerciseNum - 1];
            const instructions = typeof instructionsOrStageInfo === "object" ? instructionsOrStageInfo["instructions"] : instructionsOrStageInfo as string

            if (instructions) {
                // We don't know the number of exercises the portacount will run. Just assume the currently selected protocol matches the portacount setting.
                // So if there are no more instructions for this exercise num, assume we're done.
                this.setInstructions(`Perform exercise ${exerciseNum}: ${instructions}`);
            }
        });
    }

    recordTestComplete() {
        const fun = () => {
            console.log(`test complete, id ${this.currentTestData?.ID}`)
            this.previousTestData = this.currentTestData
            this.currentTestData = null; // flag done
            this.nextTestData = null; // need to clear this; todo: fill this with prev?
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

    async recordTestStart(timestamp = new Date().toLocaleString()) {
        if (!this.resultsDatabase) {
            console.log("database not ready");
            return;
        }
        if (!this.selectedProtocol) {
            console.log("protocols not loaded (not ready)")
            return;
        }
        this.lastExerciseNum = 0;
        const newTestData = await this.resultsDatabase.createNewTest(timestamp, this.selectedProtocol);
        this.currentTestData = newTestData;
        let sourceDataToCopy: Partial<SimpleResultsDBRecord> = {}

        if(this.nextTestData) {
            // todo: if copying from prev participant, pre-populate nextTestData
            sourceDataToCopy = this.nextTestData;
        } else if (this.states.defaultToPreviousParticipant && this.previousTestData) {
            // we want to copy prev data, and there was previous data
            sourceDataToCopy = this.previousTestData;
        }

        if (sourceDataToCopy) {
            for (const key in sourceDataToCopy) {
                if (key in newTestData) {
                    // don't copy fields that were assigned
                    continue;
                }
                if (key.startsWith("Ex ") || key.startsWith("Final")) {
                    // don't copy exercise results
                    continue
                }
                if (typeof sourceDataToCopy[key] === "string") {
                    this.currentTestData[key] = sourceDataToCopy[key];
                }
            }
        }

        console.log(`new test added: ${JSON.stringify(this.currentTestData)}`)
        if (this.setResults) {
            // this triggers an update
            this.setResults((prev) => [...prev, newTestData]);
        } else {
            // shouldn't happen, but setResults callback starts off uninitialized
            console.log("have current test data, but setResults callback hasn't been initialized. this shouldn't happen?")
        }
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
            this.updateResultsTable();
            this.updateCurrentRowInDatabase();
        }
        this.chain(fun)
    }

    /**
     * propagate changes so results table can see it
     * @private
     */
    private updateResultsTable() {
        if (this.setResults) {
            // update table data
            this.setResults((prev) => [...prev]) // force an update by changing the ref
        } else {
            // shouldn't happen, but setResults callback starts off uninitialized
            console.log("have current test data, but setResults callback hasn't been initialized. this shouldn't happen?")
        }
    }

    /**
     * Called when current test panel updates participant, mask, or notes field. The ID may or may not be populated.
     * @param record
     */
    recordTestUpdated(record: Partial<SimpleResultsDBRecord>) {
        if (!record.ID) {
            // no ID means data isn't in the DB. save for later
            this.nextTestData = record;
            return;
        }
        this.updateResultsTable();
        this.resultsDatabase.updateTest(record as SimpleResultsDBRecord);
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
    }


    /**
     * Assume mask and ambient concentration values will be at least 1 order of magnitude apart (ie. ambient will be at least 10x mask).
     * Assume ambient will be more stable than mask when well above zero.
     * Assume purge times 4-5 seconds. During this time concentration will sharply rise or fall.
     * Given this new concentration number, maybe update the auto-detected ambient value.
     * Ambient values are assumed to be higher than mask values. We'll assume that ambient numbers are also reasonably
     * stable.  So after 4 seconds or so of stable high values, we'll update the auto-detected ambient value.
     *
     * Margin of error at 95% confidence level is approximately 1/sqrt(sample_size).
     * Sample size here is particle count.
     * Need to understand this calculation more: https://www.qualtrics.com/experience-management/research/margin-of-error/
     *
     * @param concentration
     */
    processConcentration(concentration: number, timestamp: Date = new Date()) {
        if (isNaN(concentration)) {
            // try to avoid problems
            return;
        }
        // todo: consider moving median, see https://en.wikipedia.org/wiki/Moving_average#Moving_median
        const msSinceEpoch = timestamp.getTime();
        const prevRecord = this.fullConcentrationHistory.length > 0 ? this.fullConcentrationHistory[this.fullConcentrationHistory.length - 1] : undefined;
        let sampleZone: SampleZone;

        /**
         * todo: revisit this
         * Assumptions:
         * - Ambient levels are relatively stable. Assume stddev is within 10% of moving average
         * - Mask levels are at most half of ambient. ie. FF of at least 2.
         * - Whenever stddev is within 10% of moving average, and we're above 50% of previous ambient guess, update the ambient guess.
         * - Assume we're fully in the mask when concentration is within 50% of moving average concentration AND we're below 50% of ambient.
         * - Assume we're in the mask when stddev is > 10% of moving average concentration?
         */
        if (!this.guestimatedAmbientConcentration) {
            // we don't have an estimate yet.
            sampleZone = SampleZone.AMBIENT
        } else if (concentration > this.guestimatedAmbientConcentration) {
            // found a higher moving average, must be a new ambient
            sampleZone = SampleZone.AMBIENT
        } else if (this.maCount5s.movingAverage() < 0.5 * this.guestimatedAmbientConcentration) {
            // average count is less than half of ambient guess. probably mask
            if (prevRecord?.sampleZone !== SampleZone.MASK
                && this.maCount5s.deviation() > 1.5 * this.maCount5s.movingAverage()) {
                // TODO: re-evaluate this
                // if we're not in stable mask zone yet, and concentration is fluctuating too much, probably donning / doffing
                sampleZone = SampleZone.DON_DOFF;
            } else {
                sampleZone = SampleZone.MASK;
            }
        } else if (this.maCount5s.deviation() < 0.3 * this.guestimatedAmbientConcentration) {
            // stddev is "near" guestimate, assume we're still in ambient
            sampleZone = SampleZone.AMBIENT
        } else {
            sampleZone = SampleZone.UNKNOWN;
        }

        if (sampleZone === SampleZone.AMBIENT) {
            // if we're in the ambient zone, update the ambient guess
            this.guestimatedAmbientConcentration = this.maCount5s.movingAverage();
        }


        let zoneFF: number = NaN;
        // backfill to the beginning of the zone if we're in the mask zone
        if (prevRecord && prevRecord.sampleZone === SampleZone.MASK) {
            // todo: figure out how to determine purge zones. maybe look for first and last data points within stddev of the data in the zone?
            // or first leftmost/rightmost datapoint outside of stddev moving from midpoint? must be within 10% of the end?

            // if the previous zone was a mask zone, go back and fill in the FF data based on the full zone
            let concentrationSum = 0;
            // TODO: calculate purge segments. remove some leading and trailing data points within the zone
            let ii = this.fullConcentrationHistory.length - 1;
            let numRecords = 0;
            for (; ii >= 0 && this.fullConcentrationHistory[ii].sampleZone === SampleZone.MASK; ii--) {
                if (this.fullConcentrationHistory.length - ii > 5) {
                    // skip the last 5 data points (seconds)
                    concentrationSum += this.fullConcentrationHistory[ii].concentration;
                    numRecords++;
                }
            }
            // trim 5 data points from the front
            // for(let kk = 0; kk < 5; kk++ ) {
            //     concentrationSum -= this.fullConcentrationHistory[ii].concentration;
            //     ii++;
            // }
            if (concentrationSum) {
                zoneFF = numRecords * this.guestimatedAmbientConcentration / concentrationSum;
                // for( ; ii < this.fullConcentrationHistory.length; ii++) {
                //     this.fullConcentrationHistory[ii].zoneFF = zoneFF;
                // }
                if (prevRecord) {
                    prevRecord.zoneFF = zoneFF;
                    if (this.states.sayEstimatedFitFactor) {
                        speech.sayItPolitely(`Estimated Fit Factor is ${Number(zoneFF).toFixed(0)}`)
                    }
                }
            }
        }

        // update values
        this.states.setAmbientConcentration(this.guestimatedAmbientConcentration);
        if (sampleZone === SampleZone.MASK) {
            this.states.setMaskConcentration(concentration);
            // we're not in the mask, so there's no data to record for the mask.
            // this.maEstimatedFF.push(msSinceEpoch, 1)
            this.states.setEstimatedFitFactor(zoneFF)
            const newGaugeOptions = deepCopy(this.states.gaugeOptions)
            newGaugeOptions.series[0].data[0].value = formatFitFactor(zoneFF)
            this.states.setGaugeOptions(newGaugeOptions)

        } else {
            // we're not in the mask, so there's no data to record for the mask.
            this.states.setMaskConcentration(-1)
            this.states.setEstimatedFitFactor(NaN)
        }

        // update the chart
        const record: TimeseriesEntry = {
            ...timeSeriesEntryDerivedFields,
            timestamp: timestamp,
            concentration: concentration,
            guestimatedAmbient: this.guestimatedAmbientConcentration,
            emaConcentration: this.maCount5s.movingAverage(),
            emaConcentrationStdDev: this.maCount5s.deviation(),
            sampleZone: sampleZone,
            zoneFF: zoneFF,
        };


        if (sampleZone === SampleZone.MASK) {
            if (prevRecord && prevRecord.sampleZone === sampleZone) {
                // have previous records (and we're in the same zone type)
                record.emaConcentrationInZone = this.maZoneConcentration20s.movingAverage();
                // cap stddev at some value
                const emaZoneConcentrationStdDev = Math.min(0.3 * record.emaConcentrationInZone, this.maZoneConcentration20s.deviation());
                const guestimatedAmbient = record.guestimatedAmbient || 0;
                record.estimatedFitFactor = guestimatedAmbient / record.emaConcentrationInZone;
                record.estimatedFitFactorBand = (guestimatedAmbient / (record.emaConcentrationInZone - emaZoneConcentrationStdDev)) - (guestimatedAmbient / (record.emaConcentrationInZone + emaZoneConcentrationStdDev))
                record.estimatedFitFactorBandLower = guestimatedAmbient / (record.emaConcentrationInZone + emaZoneConcentrationStdDev);

            } else {
                // first record in the zone. no data is fine.
                this.maZoneConcentration20s = MovingAverage(TWENTY_SECONDS_IN_MS); // reset
            }
        }
        // append after we look backwards through history
        this.fullConcentrationHistory.push(record);

        // update moving averages after we've taken their snapshot
        this.maCount5s.push(msSinceEpoch, concentration);
        this.maZoneConcentration20s.push(msSinceEpoch, concentration);

        // TODO: try to merge in new data instead of rebuilding it every time data point? esp for simulator data
        const oldChartOptions: EChartsOption = this.states.chartOptions; //deepCopy(this.states.chartOptions)
        oldChartOptions.dataset = {
            dimensions: [
                'timestamp',
                'concentration',
                'guestimatedAmbient',
                'emaConcentration',
                'emaConcentrationStdDev',
                'sampleZone',
                'emaConcentrationInZone',
                'estimatedFitFactor',
                'estimatedFitFactorBand',
                'estimatedFitFactorBandLower',
                'zoneFF'
            ],

            source: this.fullConcentrationHistory
        }

        // need to manually calculate min and max for log scale when using line charts https://github.com/apache/echarts/issues/19818
        oldChartOptions.yAxis[0].type = 'log'
        oldChartOptions.yAxis[0].min = Math.min(...oldChartOptions.dataset.source.map((v: TimeseriesEntry) => v.concentration));
        oldChartOptions.yAxis[0].max = Math.max(...oldChartOptions.dataset.source.map((v: TimeseriesEntry) => v.concentration));

        oldChartOptions.yAxis[1].type = 'value'
        // oldChartOptions.yAxis[1].min = Math.min(...oldChartOptions.series[1].data.map(v => v[1]));
        // oldChartOptions.yAxis[1].max = Math.max(...oldChartOptions.series[1].data.map(v => v[1]));

        // update the zoom window
        oldChartOptions.dataZoom[0].endValue = record.timestamp
        oldChartOptions.dataZoom[0].startValue = record.timestamp.getTime() - 15 * 60 * 1000; // 15 minutes back


        if (this.guestimatedAmbientConcentration > 0) {
            // only map visually if we have an ambient candidate

            const concentrationVisualMapConfig = {
                type: "piecewise",
                show: false,
                seriesIndex: [0], // placeholder
                dimension: '', // placeholder
                pieces: [
                    {
                        // note: these ranges must be closed, eg. both upper and lower bounds must be specified
                        gte: 100,
                        lt: 100000,
                        color: 'green',
                    },
                    {
                        gte: 20,
                        lt: 100,
                        color: 'darkorange',
                    },
                    {
                        gte: 0,
                        lt: 20,
                        color: 'darkred',
                    },
                ],
                outOfRange: {
                    color: '#999'
                }
            };
            const estimatedFF = deepCopy(concentrationVisualMapConfig);
            estimatedFF.dimension = 'estimatedFitFactor';
            estimatedFF.seriesIndex = oldChartOptions.series.findIndex((series: {
                name: string
            }) => series.name === "estimated fit factor");
            const zoneFF = deepCopy(concentrationVisualMapConfig);
            zoneFF.dimension = 'zoneFF';
            zoneFF.seriesIndex = oldChartOptions.series.findIndex((series: {
                name: string
            }) => series.name === "Zone FF");

            oldChartOptions.visualMap = [
                estimatedFF,
                zoneFF,
            ]
        }

        this.updateMarkArea(oldChartOptions, record);

        // todo use a ref to get access to the underlying echart and call setOptions on it directly with only data
        if (Date.now() > this.nextChartUpdateTime) {
            // simple debounce
            this.nextChartUpdateTime = Date.now() + 1000; // 1 second later
            const newChartOptions = deepCopy(oldChartOptions); // make a new one so things that need to can see it's been updated
            this.states.setChartOptions(newChartOptions); // propagate this to the chart
            this.states.chartOptions = newChartOptions; // save state local to this class
        }

    }

    updateMarkArea(chartOptions: EChartsOption, datum: TimeseriesEntry) {
        const datumAreaName = datum.sampleZone
        const markAreaData = chartOptions.series[0].markArea.data
        const [start, end] = markAreaData.length > 0 ? markAreaData[markAreaData.length - 1] : [{}, {}]
        if (start.name === datumAreaName) {
            // still in the same block, extend it
            end.xAxis = datum.timestamp
        } else {
            // changed, or new. create new area
            const newArea = [
                {
                    xAxis: datum.timestamp,
                    name: datumAreaName,
                    itemStyle: {
                        color: (datum.sampleZone === SampleZone.MASK)
                            ? "wheat"
                            : (datum.sampleZone === SampleZone.AMBIENT)
                                ? "powderblue"
                                : "black",
                        opacity: 0.2,
                    }
                },
                {
                    xAxis: datum.timestamp
                },
            ];
            markAreaData.push(newArea)
        }
    }

    // todo: use DataCollectorStates instead
    setResultsCallback(callback: React.Dispatch<React.SetStateAction<SimpleResultsDBRecord[]>>) {
        this.setResults = callback
    }

    setProtocol(protocol: string) {
        console.log(`setProtocol ${protocol}`)
        this.selectedProtocol = protocol;
    }
}


export interface DataCollectorStates {
    setInstructions: React.Dispatch<React.SetStateAction<string>> | null,
    logData: string,
    setLogData: React.Dispatch<React.SetStateAction<string>>,
    rawConsoleData: string,
    setRawConsoleData: React.Dispatch<React.SetStateAction<string>>,
    processedData: string,
    setProcessedData: React.Dispatch<React.SetStateAction<string>>,
    fitTestDataTableRef: RefObject<HTMLTableElement>,
    sayParticleCount: boolean,
    sayEstimatedFitFactor: boolean;
    verboseSpeech: boolean,
    setEstimatedFitFactor: React.Dispatch<React.SetStateAction<number>>,
    setAmbientConcentration: React.Dispatch<React.SetStateAction<number>>,
    setMaskConcentration: React.Dispatch<React.SetStateAction<number>>,
    autoEstimateFitFactor: boolean,
    defaultToPreviousParticipant: boolean,
    chartOptions: EChartsOption,
    setChartOptions: React.Dispatch<React.SetStateAction<EChartsOption>>
    gaugeOptions: EChartsOption,
    setGaugeOptions: React.Dispatch<React.SetStateAction<EChartsOption>>
}

export function DataCollectorPanel({dataCollector, showLogs, showHistoricalTests}: {
    dataCollector: DataCollector,
    showLogs: boolean,
    showHistoricalTests: boolean,
}) {
    const [rawConsoleData, setRawConsoleData] = useState<string>("")
    const rawConsoleDataTextAreaRef = React.useRef<HTMLTextAreaElement>(null)
    const [logData, setLogData] = useState<string>("")
    const logDataTextAreaRef = React.useRef<HTMLTextAreaElement>(null)
    const [processedData, setProcessedData] = useState<string>("")
    const processedDataTextAreaRef = React.useRef<HTMLTextAreaElement>(null)
    const [results, setResults] = useState<SimpleResultsDBRecord[]>([])

    useEffect(() => {
        setRawConsoleData(dataCollector.states.rawConsoleData);
    }, [dataCollector.states.rawConsoleData]);
    useEffect(() => {
        setLogData(dataCollector.states.logData);
    }, [dataCollector.states.logData]);
    useEffect(() => {
        setProcessedData(dataCollector.states.processedData);
    }, [dataCollector.states.processedData]);

    return (
        <>
            {showHistoricalTests &&
            <section id="collected-data" style={{display: "inline-block", width: "100%"}}>
                <fieldset>
                    <legend>Fit Test Info</legend>
                    <ResultsTable dataCollector={dataCollector} tableData={results} setTableData={setResults}/>
                </fieldset>
            </section>
            }
            {showLogs ? <section style={{width: "100%", display: "flex"}}>
                <fieldset style={{flexGrow: 1}}>
                    <legend>Raw Data</legend>
                    <textarea id="raw-data" ref={rawConsoleDataTextAreaRef} readOnly
                              style={{width: "100%", height: "200px", border: "none", resize: "vertical"}}
                              tabIndex={1000}
                              value={rawConsoleData}/>
                </fieldset>
                <fieldset style={{flexGrow: 1}}>
                    <legend>Processed Data</legend>
                    <textarea id="interpreted-data" ref={processedDataTextAreaRef} readOnly
                              style={{width: "100%", height: "200px", border: "none", resize: "vertical"}}
                              tabIndex={1001}
                              value={processedData}/>
                </fieldset>
            </section> : null}
            {showLogs ? <section style={{width: "100%"}}>
                <fieldset>
                    <legend>Log</legend>
                    <textarea id="log-text-area" ref={logDataTextAreaRef} readOnly
                              style={{width: "100%", height: "200px", border: "none", resize: "vertical"}}
                              tabIndex={1002}
                              value={logData}
                    />
                </fieldset>
            </section> : null}
        </>
    )
}
