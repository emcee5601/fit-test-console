import {useContext, useRef, useState} from "react";
import {AppSettings} from "src/app-settings-types.ts";
import {useAnimationFrame} from "src/assets/use-animation-frame.ts";
import {ProtocolExecutionState} from "src/protocol-execution-state.ts";
import {updateBackgroundFillProgress} from "src/update-background-fill-progress.ts";
import {formatDuration} from "src/utils.ts";
import {AppContext} from "./app-context.ts";
import {useSetting} from "./use-setting.ts";

/**
 * Protocol selector. Is aware of control source and removes disallowed protocols from selection if in internal control
 * mode.
 * @constructor
 */
export function ProtocolSelectorWidget0() {
    const appContext = useContext(AppContext)
    const protocolNames = appContext.settings.getProtocolNames()
    const [selectedProtocol, setSelectedProtocol] = useSetting<string>(AppSettings.SELECTED_PROTOCOL)
    const [protocolExecutionState] = useSetting<ProtocolExecutionState>(AppSettings.PROTOCOL_EXECUTION_STATE)
    const ref = useRef<HTMLSelectElement>(null);
    const [timeRemainingSlug, setTimeRemainingSlug] = useState("")

    const setProtocol = (protocol: string) => {
        // we always need to set the global selected protocol (since this is what everything uses)
        const prevProtocol = selectedProtocol
        setSelectedProtocol(protocol)

        if (prevProtocol !== protocol) {
            // protocol changed, stop executor if it's running
            appContext.protocolExecutor.cancel();
        }
    }

    useAnimationFrame(() => {
        const minProgress = 0.02
        if (protocolExecutionState === "Executing") {
            // we don't care how far along the animation is. we just care that the pointer is at the right place vs the
            // time we started the segment/protocol
            const protocolDurationMs = 1000 * appContext.settings.getProtocolDuration(selectedProtocol)
            const protocolTimeRemainingMs = appContext.settings.getProtocolTimeRemaining()
            const protocolProgressMs = protocolDurationMs - protocolTimeRemainingMs
            const progress = Math.max(minProgress, Math.min(1, protocolProgressMs / protocolDurationMs))
            updateBackgroundFillProgress(ref, progress)

            setTimeRemainingSlug(`${formatDuration(protocolProgressMs)} / ${formatDuration(protocolDurationMs)}`);

        } else if (protocolExecutionState === "Idle") {
            updateBackgroundFillProgress(ref, minProgress)
        } else {
            // paused. do nothing
        }
    }, [protocolExecutionState, selectedProtocol]);

    function getDecoratedSelectedProtocol() {
        if (protocolExecutionState === "Idle") {
            return getProtocolNameWithDuration(selectedProtocol)
        } else {
            // only text can appear in standard select. customized select can have styled content.
            return `${selectedProtocol} ${timeRemainingSlug}`
        }
    }

    function getProtocolNameWithDuration(protocol: string) {
        return `${protocol} - ${formatDuration(1000*appContext.settings.getProtocolDuration(protocol))}`
    }

    return (
        <select id={"protocol-select"} ref={ref}
                className={"thin-border no-dim-disabled"}
                onChange={(event) => setProtocol(event.target.value)}
                value={selectedProtocol}
                disabled={protocolExecutionState === "Executing"}
                style={{width: "calc(100% - 3px)", height: "inherit"}}
        >
            {protocolNames.map((protocolName) => <option key={protocolName}
                                                         value={protocolName}>{protocolName === selectedProtocol ? getDecoratedSelectedProtocol() : getProtocolNameWithDuration(protocolName)}</option>)}
        </select>
    )
}
