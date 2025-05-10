/**
 * Display the amount of time with the current participant. Continous time only.
 */
import {formatDuration} from "src/utils.ts";
import {useSetting} from "src/use-setting.ts";
import {SimpleResultsDBRecord} from "src/SimpleResultsDB.ts";
import {AppSettings} from "src/app-settings.ts";
import {HTMLAttributes, useState} from "react";
import {useTimingSignal} from "src/timing-signal.ts";

export function CurrentParticipantTimeWidget({...props}: HTMLAttributes<HTMLDivElement>) {
    const [testTemplate] = useSetting<Partial<SimpleResultsDBRecord>>(AppSettings.TEST_TEMPLATE)
    const [minutesPerParticipant] = useSetting<number>(AppSettings.MINUTES_ALLOTTED_PER_PARTICIPANT)
    const [elapsedTimeString, setElapsedTimeString] = useState<string>("")

    function hasCurrentParticipant() {
        return !!testTemplate.Participant;
    }

    function getCurrentParticipantElapsedTimeMs(): number {
        if (hasCurrentParticipant() && testTemplate.Time) {
            return Date.now() - new Date(testTemplate.Time).getTime();
        }
        return 0;
    }

    function getParticipantElapsedTimeClass() {
        if (hasCurrentParticipant()) {
            if (testTemplate.Time) {
                const elapsedMs = getCurrentParticipantElapsedTimeMs();
                const elapsedMinutes = elapsedMs / 60 / 1000;
                const minutesLeft = minutesPerParticipant - elapsedMinutes;
                if (minutesLeft < 0) {
                    return "over-time"
                }
            }
            return "on-time"
        }
        return "idle"
    }

    function updateUi() {
        setElapsedTimeString(formatDuration(getCurrentParticipantElapsedTimeMs()))
    }

    useTimingSignal(updateUi)

    return (
        <div {...props} style={{display:"flex"}}
              className={`thin-border number-field smooth-background-change ${getParticipantElapsedTimeClass()}`}>
            <span className={"wide-time-trackers"}>Participant Time</span>
            <span className={"narrow-time-trackers"}>PT</span>: {elapsedTimeString}
        </div>
    )
}
