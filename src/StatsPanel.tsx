/**
 * Display some statistics
 */
import {RESULTS_DB, SimpleResultsDBRecord} from "src/SimpleResultsDB.ts";
import DatePicker from "react-datepicker";
import {useContext, useEffect, useState} from "react";
import {avgArray, formatDuration, median} from "src/utils.ts";
import {InfoBox} from "src/InfoBox.tsx";
import {AppContext} from "src/app-context.ts";
import {AppSettings} from "src/app-settings.ts";

type Tally = [string, number]

export function StatsPanel() {
    const appContext = useContext(AppContext)
    const [firstDate, setFirstDate] = useState<Date | null>(null);
    const [lastDate, setLastDate] = useState<Date | null>(null)
    const [numEvents, setNumEvents] = useState<number>(0)
    const [numTests, setNumTests] = useState<number>(0)
    const [numCompletedTests, setNumCompletedTests] = useState<number>(0)
    const [numEventParticipants, setNumEventParticipants] = useState<number>(0)
    const [totalEventTimeMs, setTotalEventTimeMs] = useState<number>(0)
    const [totalMasksTested, setTotalMasksTested] = useState<number>(0)
    const [topResults, setTopResults] = useState<SimpleResultsDBRecord[]>([])
    const [popularMasks, setPopularMasks] = useState<Tally[]>([])
    const [totalCompletedTestTimeSeconds, setTotalCompletedTestTimeSeconds] = useState<number>(0)
    const [medianTimePerTestMs, setMedianTimePerTestMs] = useState<number>(0)
    const [medianTimePerParticipantMs, setMedianTimePerParticipantMs] = useState<number>(0)
    const [medianMasksPerParticipant, setMedianMasksPerParticipant] = useState<number>(0)
    const [averageMasksPerParticipant, setAverageMasksPerParticipant] = useState<number>(0)

    function dateToLocalTime(date: Date) {
        return new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
    }

    function dateToLocalYyyymmdd(date: Date) {
        return dateToLocalTime(date).toISOString().substring(0, 10).replace(/-/g, "")
    }

    function getElapsedTimeMs(fromRecord: SimpleResultsDBRecord, toRecord: SimpleResultsDBRecord) {
        const elapsedMs = new Date(toRecord.Time ?? 0).getTime() - new Date(fromRecord.Time ?? 0).getTime();
        // console.debug(`elapsed time ${elapsedMs} from ${fromRecord.Time} to ${toRecord.Time}` );
        return elapsedMs
    }

    function isNewEventStart(prevRecord: SimpleResultsDBRecord, currentRecord: SimpleResultsDBRecord): boolean {
        return getElapsedTimeMs(prevRecord, currentRecord) > 1 * 60 * 60 * 1000
    }


    /**
     * return the local yyyymmdd representation of the record's Time field, or empty string if it's missing
     * todo: handle unparseable dates explicitly
     * @param record
     */
    function getEventYyyymmdd(record: SimpleResultsDBRecord) {
        return record.Time ? dateToLocalYyyymmdd(new Date(record.Time)) : "";
    }

    function calculateStats(results: SimpleResultsDBRecord[]) {
        // todo: ignore simulator tests. these are records where the time between tests is less than the expected
        // protocol duration.

        // make sure results are sorted by date so we don't get negative elapsed times
        const resultsSortedByTime = results.toSorted((a, b) => {
            return (a.Time ? dateToLocalTime(new Date(a.Time)).getTime() : 0) - (b.Time ? dateToLocalTime(new Date(b.Time)).getTime() : 0)
        })

        setTotalMasksTested(new Set(results.map((record: SimpleResultsDBRecord) => record.Mask)).size)
        setNumTests(resultsSortedByTime.length)
        setNumCompletedTests(resultsSortedByTime.reduce((total: number, record: SimpleResultsDBRecord) => total + (record.Final ? 1 : 0), 0))

        setNumEvents(resultsSortedByTime.reduce((result, cur, curIndex, array) => {
            const prev = array[curIndex - 1] ?? {};
            return result + (isNewEventStart(prev, cur) ? 1 : 0)
        }, 0));

        // each event-participant is a new participant for this metric
        setNumEventParticipants(new Set(resultsSortedByTime.map((record: SimpleResultsDBRecord) => `${getEventYyyymmdd(record)}-${record.Participant}`)).size)
        setTotalEventTimeMs(resultsSortedByTime.reduce((result, cur, curIndex, array) => {
            const prev = array[curIndex - 1] ?? {};
            if (!isNewEventStart(prev, cur)) {
                return result + getElapsedTimeMs(prev, cur)
            }
            return result
        }, 0));


        // median time per participant
        const eventParticipantTime: Map<string, number> = new Map();
        resultsSortedByTime.forEach((cur: SimpleResultsDBRecord, curIndex: number, array: SimpleResultsDBRecord[]) => {
            const prev = array[curIndex - 1] ?? {};
            if (isNewEventStart(prev, cur)) {
                // start of a new event. ignore the previous event's last test since we don't know when it ended.
                return null;
            }
            // not the start of a new event.
            const eventParticipant: string = `${getEventYyyymmdd(prev)}-${prev.Participant}`
            const elapsedTimeMs = getElapsedTimeMs(prev, cur);
            eventParticipantTime.set(eventParticipant, elapsedTimeMs + (eventParticipantTime.get(eventParticipant) || 0))
        })
        setMedianTimePerParticipantMs(median(new Array(...eventParticipantTime.values())))

        // median number of masks per participant
        const eventParticipantMasks: Map<string, Set<string>> = new Map();
        results.forEach((record: SimpleResultsDBRecord) => {
            const eventParticipant: string = `${getEventYyyymmdd(record)}-${record.Participant}`
            eventParticipantMasks.set(eventParticipant, (eventParticipantMasks.get(eventParticipant) ?? new Set()).add(record.Mask ?? "unknown mask"))
        })
        const eventParticipantMaskCount = [...eventParticipantMasks.values()].map((masks) => masks.size);
        setMedianMasksPerParticipant(median(eventParticipantMaskCount))
        setAverageMasksPerParticipant(avgArray(eventParticipantMaskCount))

        // median time per test
        setMedianTimePerTestMs(median(resultsSortedByTime.map((cur: SimpleResultsDBRecord, curIndex: number, array: SimpleResultsDBRecord[]) => {
            const prev = array[curIndex - 1] ?? {};
            if (isNewEventStart(prev, cur)) {
                // start of a new event. ignore the previous event's last test since we don't know when it ended. todo:
                // look at last raw data timestamp from portacount
                return null;
            }
            // not the start of a new event.
            if (!cur.Final) {
                // no Final score, so this test was aborted. ignore
                return null;
            }
            // a completed test
            return getElapsedTimeMs(prev, cur)
        }).filter((value) => value !== null)))

        // only count the time consumed by tests run to completion
        const defaultProtocolDuration = appContext.settings.getProtocolDuration(appContext.settings.getDefault(AppSettings.SELECTED_PROTOCOL))
        setTotalCompletedTestTimeSeconds(results.filter((record) => record.Final).reduce((total: number, record: SimpleResultsDBRecord) => total + (record.ProtocolName ? appContext.settings.getProtocolDuration(record.ProtocolName) : defaultProtocolDuration), 0))

        // top results
        setTopResults(results.toSorted((a, b) => {
            return (b.Final ?? 0) - (a.Final ?? 0)
        }).filter((record) => {
            // ignore some records
            if (record.Participant?.match(/zero\s+filter/i)) {
                // ignore zero filter
                return false
            }
            if (!record.Final) {
                // ignore aborted tests
                return false;
            }
            if (isNaN(record.Final) || isNaN(Number(record.Final))) {
                // not number.
                return false;
            }
            if (!isFinite(Number(record.Final))) {
                // not finite (in case record.Final is a string "Infinity")
                return false;
            }
            // console.debug(`number is ${record.Final}, type is ${typeof record.Final}, Number(${record.Final}) is
            // ${Number(record.Final)}`);
            return true;
        }).toSpliced(5)); // top 5

        // popular masks.
        // mask tally. each person at an event with the mask counts as 1. so we don't count same person same mask
        // multiple tests as more than 1 mask
        const eventParticipantMaskResults: { [key: string]: SimpleResultsDBRecord } = {}
        results.forEach((record: SimpleResultsDBRecord) => {
            const key = `${getEventYyyymmdd(record)}-${record.Participant}-${record.Mask}`;
            eventParticipantMaskResults[key] = record;
        })

        const masksTally: { [key: string]: number } = {}
        Object.values(eventParticipantMaskResults).forEach((record: SimpleResultsDBRecord) => {
            const mask = record.Mask ?? "";
            masksTally[mask] = 1 + (masksTally[mask] ?? 0)
        })
        console.debug(`mask tally: ${JSON.stringify(masksTally)}`)
        setPopularMasks(Object.entries(masksTally).toSorted((a, b) => b[1] - a[1]).toSpliced(5)); // top 5

        // todo: look at raw data timestamps to determine better event start/end times. still won't capture
        // setup/teardown time tho. todo: add one average test time to the end of event time to capture the last
        // test's time. maybe won't matter much.

        // median time per participant
    }

    function getResultsInRange() {
        // convert time back to local time
        // iso format is yyyy-mm-ddTHH:MM:ss
        const rangeStartYyyymmdd = Number(dateToLocalYyyymmdd(firstDate ?? new Date(0)));
        const rangeEndYyyymmdd = Number(dateToLocalYyyymmdd(lastDate ?? new Date())); // there shouldn't be any date in
                                                                                      // the future
        RESULTS_DB.getData((record: SimpleResultsDBRecord): boolean => {
            // make sure both dates are in localtime
            // record time should be in localtime. todo: check that this conversion is correct/required
            const recordYyyymmdd = Number(dateToLocalYyyymmdd(new Date(record.Time)))
            return rangeStartYyyymmdd <= recordYyyymmdd && recordYyyymmdd <= rangeEndYyyymmdd
        }).then(calculateStats)
    }

    useEffect(() => {
        getResultsInRange()
    }, [firstDate, lastDate]);

    return (<div id={"stats-panel"}>
        <section id={"stats-date-range-selection"}>
            from
            <DatePicker id={"stats-first-date-picker"}
                        className={"date-picker-input"} selected={firstDate}
                        showIcon={true}
                        dateFormat={"YYYY-MMM-dd"}
                        placeholderText={"Start date"}
                        onChange={(date) => setFirstDate(date)}
            />

            to
            <DatePicker id={"stats-last-date-from"}
                        className={"date-picker-input"} selected={lastDate}
                        showIcon={true}
                        dateFormat={"YYYY-MMM-dd"}
                        placeholderText={"End date"}
                        onChange={(date) => setLastDate(date)}
            />
        </section>
        <section id={"stats-display"} style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "stretch",
            width: "fit-content",
            justifySelf: "center"
        }}>
            {/*    todo: make these components*/}
            <InfoBox label={"For selected date range"}>
                <InfoBox label={"Num Events"}>{numEvents}</InfoBox>
                <InfoBox label={"Num Participants"}>{numEventParticipants}</InfoBox>
                <InfoBox label={"Num Masks Tested"}>{totalMasksTested}</InfoBox>
                <InfoBox label={"Num Tests Started"}>{numTests}</InfoBox>
                <InfoBox
                    label={"Num Tests Completed"}>{`${numCompletedTests} (${(100 * numCompletedTests / numTests).toFixed(1)}%)`}</InfoBox>
            </InfoBox>
            <hr/>
            {/*todo: use total device time including aborted tests and mask sampling time. try to exclude time when device is sampling but mask is not being worn. so at ambient levels. can look at raw data*/}
            <InfoBox
                label={"Total time from completed tests"}>{formatDuration(totalCompletedTestTimeSeconds * 1000)}</InfoBox>
            <InfoBox label={"Total event time (estimate)"}>{formatDuration(totalEventTimeMs)}</InfoBox>
            <InfoBox
                label={"Device utilization"}>{(100 * totalCompletedTestTimeSeconds * 1000 / totalEventTimeMs).toFixed(1)}%</InfoBox>
            <hr/>

            <InfoBox label={"Time spent per participant"}>
                <div className={"inline-flex"}>
                    <InfoBox
                        label={"Average"}>{formatDuration(totalEventTimeMs / numEventParticipants)}</InfoBox>
                    <InfoBox label={"Median"}>{formatDuration(medianTimePerParticipantMs)}</InfoBox>
                </div>
            </InfoBox>
            {/*todo: subtract out time expended for aborted tests?*/}
            <InfoBox label={"Time spent per completed test"}>
                <div className={"inline-flex"}>
                    <InfoBox
                        label={"Average"}>{formatDuration(totalEventTimeMs / numCompletedTests)}</InfoBox>
                    <InfoBox label={"Median"}>{formatDuration(medianTimePerTestMs)}</InfoBox>
                </div>
            </InfoBox>
            <hr/>
            <InfoBox label={"Num masks tested per participant"}>
                <div className={"inline-flex"}>
                    <InfoBox label={"Average"}>{averageMasksPerParticipant.toFixed(1)}</InfoBox>
                    <InfoBox label={"Median"}>{medianMasksPerParticipant.toFixed(1)}</InfoBox>
                </div>
            </InfoBox>
            <hr/>

            <InfoBox label={"Per Participant averages"}>
                <InfoBox label={"Num Tests Started"}>{(numTests / numEventParticipants).toFixed(1)}</InfoBox>
                <InfoBox label={"Num Tests Completed"}>{(numCompletedTests / numEventParticipants).toFixed(1)}</InfoBox>
            </InfoBox>
            <hr/>
            {/*rankings*/}
            <InfoBox label={"popular masks"}>{
                popularMasks.map(([mask, count]: Tally) => {
                    return <InfoBox key={mask}
                                    label={mask.trim().length === 0 ? "Unnamed mask" : mask}>{count}</InfoBox>
                })}
            </InfoBox>
            <hr/>
            <InfoBox label={"top overall scores"}>{
                topResults.map((record: SimpleResultsDBRecord) => {
                    return <InfoBox key={record.ID} label={record.Mask ?? "Unnamed mask"}>{record.Final}</InfoBox>
                })}
            </InfoBox>
            <hr/>
            <InfoBox label={"top individual scores"}>todo: look at this across all exercises</InfoBox>
            <hr/>
            <InfoBox label={"Per Event averages"}>
                <InfoBox label={"Time Spent"}>{formatDuration(totalEventTimeMs / numEvents)}</InfoBox>
                <InfoBox label={"Num Participants"}>{(numEventParticipants / numEvents).toFixed(1)}</InfoBox>
                <InfoBox label={"Num Masks Tested"}>todo</InfoBox>
                <InfoBox label={"Num Tests Started"}>{(numTests / numEvents).toFixed(1)}</InfoBox>
                <InfoBox
                    label={"Num Tests Completed"}>{(numCompletedTests / numEvents).toFixed(1)}</InfoBox>
            </InfoBox>
            {/*    popular mods */}
            {/*    participant appearing in the most events */}
            {/*    mask appearing in the most events */}
            {/*    mod appearing in the most events */}
        </section>
    </div>)
}
