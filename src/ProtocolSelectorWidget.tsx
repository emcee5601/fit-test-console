import {useContext, useEffect, useState} from "react";
import {AppContext} from "./app-context.ts";
import {AppSettings, useSetting} from "./app-settings.ts";
import {PortaCountListener} from "./portacount-client-8020.ts";
import {ControlSource} from "./control-source.ts";

/**
 * Protocol selector. Is aware of control source and removes disallowed protocols from selection if in internal control mode.
 * @constructor
 */
export function ProtocolSelectorWidget() {
    const appContext = useContext(AppContext)
    const protocols = appContext.settings.protocolDefinitions
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
    const allowedProtocolNames = Object.keys(protocols as object).filter((protocolName) => {
        const allowed = !isInternalControl || protocols[protocolName].reduce((result, instructionOrStage) => {
            return result && typeof instructionOrStage === "string"
        }, true)
        return allowed
    });

    const setProtocol = (protocol: string) => {
        // we always need to set the global selected protocol (since this is what everything uses)
        setSelectedProtocol(protocol)
        // then set the appropriate ex/internal selected protocol (so we can default to an appropriate one when control source changes)
        if (isInternalControl) {
            setSelectedInternalProtocol(protocol)
        } else {
            setSelectedExternalProtocol(protocol)
        }
    }

    return (
        <fieldset className={"info-box"}>
            <legend>Protocol</legend>
            <select onChange={(event) => setProtocol(event.target.value)}
                    value={selectedProtocol}>
                {allowedProtocolNames.map((protocolName) => <option key={protocolName}
                                                                    value={protocolName}>{protocolName}</option>)}
            </select>
        </fieldset>
    )
}
