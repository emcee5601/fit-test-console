import {PortaCountClient8020, PortaCountListener} from "./portacount-client-8020.ts";
import {useContext, useEffect, useState} from "react";
import {AppContext} from "./app-context.ts";
import {formatTime} from "src/utils.ts";

/**
 * Displays the last line received by the PortaCount.
 * @constructor
 */
export function PortaCountLastLineWidget({label = "Last line", border = true}: { label?: string, border?: boolean }) {
    const appContext = useContext(AppContext)
    const client: PortaCountClient8020 = appContext.portaCountClient
    const [lastLine, setLastLine] = useState<string>(client.state.lastLine)

    useEffect(() => {
        const listener: PortaCountListener = {
            lineReceived(line: string) {
                setLastLine(line)
            }
        };
        client.addListener(listener);
        return () => {
            client.removeListener(listener)
        };
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setLastLine("")
            console.debug("last line timeout expired")
            // 3 second here. In count mode, we either get data every 1 second (external control) or every 2 seconds
            // (internal control). if we're testing, there can be a longer delay
        }, 3000)

        return () => clearTimeout(timeout)
    }, [lastLine]);

    const spanContent = <>{lastLine.trim().length == 0 ? "" : lastLine}</>;
    return (
        label
            ? <fieldset className="info-box-compact" style={{width: "8rem"}}>
                <legend
                    className={"number-field no-wrap"}>{label} {lastLine.trim().length > 0 ? formatTime(new Date(), true) : ""}</legend>
                <div className={"console-8020"}>{spanContent}</div>
            </fieldset>
            : <div className={`console-8020 ${border && "thin-border"}`}>{spanContent}</div>

    )
}
