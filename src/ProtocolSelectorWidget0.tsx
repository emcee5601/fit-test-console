import {useContext} from "react";
import {AppContext} from "./app-context.ts";
import {useSetting} from "./use-setting.ts";
import {AppSettings} from "src/app-settings-types.ts";

/**
 * Protocol selector. Is aware of control source and removes disallowed protocols from selection if in internal control
 * mode.
 * @constructor
 */
export function ProtocolSelectorWidget0() {
    const appContext = useContext(AppContext)
    const protocolNames = appContext.settings.getProtocolNames()
    const [selectedProtocol, setSelectedProtocol] = useSetting<string>(AppSettings.SELECTED_PROTOCOL)

    const setProtocol = (protocol: string) => {
        // we always need to set the global selected protocol (since this is what everything uses)
        const prevProtocol = selectedProtocol
        setSelectedProtocol(protocol)

        if(prevProtocol !== protocol) {
            // protocol changed, stop executor if it's running
            if(appContext.protocolExecutor.protocolIsExecuting()) {
                appContext.protocolExecutor.cancel();
            }
        }
    }

    return (
        <select id={"protocol-select"} onChange={(event) => setProtocol(event.target.value)}
                value={selectedProtocol}>
            {protocolNames.map((protocolName) => <option key={protocolName}
                                                                value={protocolName}>{protocolName}</option>)}
        </select>
    )
}
