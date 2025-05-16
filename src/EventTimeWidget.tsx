/**
 * shows event time
 */
import {formatDuration} from "src/utils.ts";
import {HTMLAttributes, useContext, useState} from "react";
import {AppContext} from "src/app-context.ts";
import {useSetting} from "src/use-setting.ts";
import {AppSettings} from "src/app-settings.ts";
import {useTimingSignal} from "src/timing-signal.ts";
import {IoToday} from "react-icons/io5";

export function EventTimeWidget({...props}:HTMLAttributes<HTMLDivElement>) {
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
        setEventTimeStr(formatDuration(appContext.settings.eventEndTime.getTime() - Date.now(), false, false))
    }

    useTimingSignal(updateUi)

    props.style = {...props.style, ...{display:"flex", height:"inherit", gap:"0.3em"}}
    return (
    <div {...props}
         className={`number-field thin-border smooth-background-change ${getEventElapsedTimeClass()}`} >
        <span className={"wide-time-trackers"}>Event Time:</span>
        <span className={"narrow-time-trackers svg-container"}><IoToday /></span>{eventTimeStr}
    </div>
    )
}
