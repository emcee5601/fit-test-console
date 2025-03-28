import {DataTransmissionState, PortaCountClient8020, PortaCountListener} from "./portacount-client-8020.ts";
import {useContext, useEffect, useState} from "react";
import {AppContext} from "./app-context.ts";

/**
 * Displays PortaCount data transmission setting.
 * @constructor
 */
export function PortaCountDataTransmissionWidget() {
    const appContext = useContext(AppContext)
    const client: PortaCountClient8020 = appContext.portaCountClient
    const [dataTransmissionState, setDataTransmissionState] = useState(client.state.dataTransmissionState)

    useEffect(() => {
        const listener: PortaCountListener = {
            dataTransmissionStateChanged(dataTransmissionState: DataTransmissionState) {
                setDataTransmissionState(dataTransmissionState)
            }
        };
        client.addListener(listener);
        return () => {
            client.removeListener(listener)
        };
    }, []);

    return (
        <fieldset className="info-box">
            <legend>Data</legend>
            {dataTransmissionState}
        </fieldset>
    )
}
