import {PortaCountClient8020, PortaCountListener} from "./portacount-client-8020.ts";
import {useCallback, useContext, useEffect, useState} from "react";
import {AppContext} from "./app-context.ts";

/**
 * Displays current activity
 * @constructor
 */
export function PortaCountCurrentActivityWidget() {
    const appContext = useContext(AppContext)
    const client: PortaCountClient8020 = appContext.portaCountClient

    // dummy state to allow forcing state to update so we can force a render
    const [, helpUpdateState] = useState({})
    const updateState = useCallback(() => {
        helpUpdateState({})
    }, []);

    useEffect(() => {
        const listener: PortaCountListener = {
            // todo: introduce an activityChanged event and callback
            // todo: protocol executor should have a way to update this state. maybe this shouldn't be a portacount activity, but an aggregate of portacount activity + protocol executor activity.
            connectionStatusChanged() {
                updateState()
            },
            sampleSourceChanged() {
                updateState()
            },
            testTerminated() {
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
        <fieldset className="info-box">
            <legend>Activity</legend>
            {client.state.activity}
        </fieldset>
    )
}
