import {PortaCountClient8020, PortaCountListener} from "./portacount-client-8020.ts";
import {useContext, useEffect, useState} from "react";
import {AppContext} from "./app-context.ts";
import {formatTime} from "src/utils.ts";

/**
 * Displays the last line received by the PortaCount.
 * @constructor
 */
export function PortaCountLastLineWidget() {
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

    return (
        <fieldset className="info-box-compact" style={{width:"8rem"}}>
            <legend className={"number-field no-wrap"}>Last line {lastLine.trim().length>0 ? formatTime(new Date(), true): ""}</legend>
            <span className={"number-field no-wrap pre"}>{lastLine.trim().length==0?<>&nbsp;</>:lastLine}</span>
        </fieldset>
    )
}
