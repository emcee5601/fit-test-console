import {useSetting} from "src/use-setting.ts";
import {Activity} from "src/activity.ts";
import {AppSettings} from "src/app-settings-types.ts";

/**
 * Displays current activity
 * @constructor
 */
export function CurrentActivityWidget({label = "Activity", border=true}: { label?: string, border?: boolean }) {
    const [activity] = useSetting<Activity>(AppSettings.ACTIVITY)

    return (
        label
            ? <fieldset className="info-box-compact">
                <legend>Activity</legend>
                {activity}
            </fieldset>
            : <div className={border?"thin-border":""}>{activity}</div>

    )
}
