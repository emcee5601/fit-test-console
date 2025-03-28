import {PortaCountClient8020, PortaCountListener} from "./portacount-client-8020.ts";
import {useCallback, useContext, useEffect, useState} from "react";
import {AppContext} from "./app-context.ts";
import {PortaCountControlSourceWidget} from "./PortaCountControlSourceWidget.tsx";
import {PortaCountSampleSourceWidget} from "./PortaCountSampleSourceWidget.tsx";
import {PortaCountConnectionStatusWidget} from "./PortaCountConnectionStatusWidget.tsx";
import {PortaCountCurrentActivityWidget} from "./PortaCountCurrentActivityWidget.tsx";
import {PortaCountLastLineWidget} from "./PortaCountLastLineWidget.tsx";
import {PortaCountDataTransmissionWidget} from "./PortaCountDataTransmissionWidget.tsx";

/**
 * Displays current state and some controls.
 * @constructor
 */
export function PortaCountStatePanel() {
    const appContext = useContext(AppContext)
    const client: PortaCountClient8020 = appContext.portaCountClient

    // dummy state to allow forcing state to update so we can force a render
    const [, helpUpdateState] = useState({})
    const updateState = useCallback(() => {
        helpUpdateState({})
    }, []);

    useEffect(() => {
        const listener: PortaCountListener = {
            connectionStatusChanged() {
                updateState()
            },
            controlSourceChanged() {
                updateState()
            },
            sampleSourceChanged() {
                updateState()
            },
            testTerminated() {
                updateState();
            },
            dataTransmissionStateChanged() {
                updateState();
            },
            testStarted() {
                updateState()
            },
            lineReceived() {
                updateState()
            }
        };
        client.addListener(listener);
        return () => {
            client.removeListener(listener)
        };
    }, []);

    return (
        <div style={{display: "inline-block", width: "max-content"}}>
            <PortaCountConnectionStatusWidget/>
            <PortaCountControlSourceWidget/>
            <PortaCountSampleSourceWidget/>
            <PortaCountCurrentActivityWidget/>
            <PortaCountDataTransmissionWidget/>
            <PortaCountLastLineWidget/>
        </div>
    )
}
