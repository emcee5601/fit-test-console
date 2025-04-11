import {useContext, useEffect, useState} from "react";
import {AppContext} from "./app-context.ts";
import {AppSettings} from "./app-settings.ts";
import {PortaCountListener} from "./portacount-client-8020.ts";
import {ControlSource} from "./control-source.ts";
import {useSetting} from "./use-setting.ts";

/**
 * Protocol selector. Is aware of control source and removes disallowed protocols from selection if in internal control
 * mode.
 * @constructor
 */
export function ProtocolSelectorWidget0() {
    const appContext = useContext(AppContext)
    const protocols = appContext.settings.protocolDefinitions // pull these from here because these may be augmented
    const [selectedProtocol, setSelectedProtocol] = useSetting<string>(AppSettings.SELECTED_PROTOCOL)
    const [, setSelectedInternalProtocol] = useSetting<string>(AppSettings.SELECTED_INTERNAL_PROTOCOL)
    const [, setSelectedExternalProtocol] = useSetting<string>(AppSettings.SELECTED_EXTERNAL_PROTOCOL)
    const [controlSource, setControlSource] = useState(appContext.portaCountClient.state.controlSource)

    useEffect(() => {
        const listener: PortaCountListener = {
            controlSourceChanged(source: ControlSource) {
                setControlSource(source)
            }
        };
        appContext.portaCountClient.addListener(listener)
        return () => {
            appContext.portaCountClient.removeListener(listener)
        }
    }, []);

    const isInternalControl = controlSource === ControlSource.Internal;

    // keep only protocol names that are allowed for the selected control source
    const allowedProtocolNames = Object.keys(protocols as object).filter(() => {
        return true;
        // const allowed = !isInternalControl || protocols[protocolName].reduce((result, instructionOrStage) => {
        //     return result && typeof instructionOrStage === "string"
        // }, true)
        // return allowed
    }).sort();

    const setProtocol = (protocol: string) => {
        // we always need to set the global selected protocol (since this is what everything uses)
        const prevProtocol = selectedProtocol
        setSelectedProtocol(protocol)
        // then set the appropriate ex/internal selected protocol (so we can default to an appropriate one when control
        // source changes)
        if (isInternalControl) {
            setSelectedInternalProtocol(protocol)
        } else {
            setSelectedExternalProtocol(protocol)
        }

        if(prevProtocol !== protocol) {
            // protocol changed, stop executor if it's running
            if(appContext.protocolExecutor.isInProgress()) {
                appContext.protocolExecutor.cancel();
            }
        }
    }

    return (
        <select onChange={(event) => setProtocol(event.target.value)}
                value={selectedProtocol}>
            {allowedProtocolNames.map((protocolName) => <option key={protocolName}
                                                                value={protocolName}>{protocolName}</option>)}
        </select>
    )
}
