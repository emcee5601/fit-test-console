import {PortaCountClient8020, PortaCountListener} from "./portacount-client-8020.ts";
import {useContext, useEffect, useState} from "react";
import {AppContext} from "./app-context.ts";
import {SampleSource} from "./simple-protocol.ts";
import {PiFaceMaskLight} from "react-icons/pi";
import {MdAir} from "react-icons/md";
import {useSetting} from "src/use-setting.ts";
import {AppSettings} from "src/app-settings.ts";

export function SampleSourceWidget() {
    const appContext = useContext(AppContext)
    const client: PortaCountClient8020 = appContext.portaCountClient
    const [sampleSource, setSampleSource] = useState(client.state.sampleSource)
    const [sampleSourceInView] = useSetting<boolean>(AppSettings.SAMPLE_SOURCE_IN_VIEW)

    useEffect(() => {
        const listener: PortaCountListener = {
            sampleSourceChanged(source: SampleSource) {
                setSampleSource(source)
            },
        };
        client.addListener(listener);
        return () => {
            client.removeListener(listener)
        };
    }, []);

    return (
        !sampleSourceInView ? <div id={"sample-source-widget"}>
            {sampleSource === SampleSource.AMBIENT && <MdAir/>}
            {sampleSource === SampleSource.MASK && <PiFaceMaskLight/>}
        </div> : null
    )
}
