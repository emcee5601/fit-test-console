/**
 * shows event time
 */
import {formatDuration} from "src/utils.ts";
import {HTMLAttributes, useContext, useState} from "react";
import {AppContext} from "src/app-context.ts";
import {useSetting} from "src/use-setting.ts";
import {AppSettings} from "src/app-settings.ts";
import {useTimingSignal} from "src/timing-signal.ts";

export function EventTimeWidget({...props}:HTMLAttributes<HTMLSpanElement>) {
    const appContext = useContext(AppContext)
    const [minutesPerParticipant] = useSetting<number>(AppSettings.MINUTES_ALLOTTED_PER_PARTICIPANT)
    const [eventTimeStr, setEventTimeStr] = useState<string>("")

    function getEventElapsedTimeMs(): number {
        return Date.now() - appContext.settings.eventEndTime.getTime();
    }

    function getEventElapsedTimeClass() {
        const elapsedMs = getEventElapsedTimeMs();
        const elapsedMinutes = elapsedMs / 60 / 1000;
        const minutesLeft = minutesPerParticipant - elapsedMinutes;
        if (minutesLeft < 0) {
            return "over-time"
        }
        return "on-time"
    }

    function updateUi() {
        setEventTimeStr(formatDuration(appContext.settings.eventEndTime.getTime() - Date.now()))
    }

    useTimingSignal(updateUi)

    return (
        // <fieldset className={`info-box-compact ${getEventElapsedTimeClass()}`}
        //           style={{
        //               textAlign: "center",
        //               transition: "background-color 1s ease-in-out"
        //           }}>
        //     {/*<legend>Event ends {formatTime(appContext.settings.eventEndTime)}</legend>*/}
        // </fieldset>
    <span {...props} className={`number-field thin-border smooth-background-change ${getEventElapsedTimeClass()}`}>Event Time: {eventTimeStr}</span>
)
}
