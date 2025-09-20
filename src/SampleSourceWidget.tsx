import {PortaCountClient8020, PortaCountListener} from "./portacount-client-8020.ts";
import {useContext, useEffect, useState} from "react";
import {AppContext} from "./app-context.ts";
import {PiFaceMask} from "react-icons/pi";
import {useSetting} from "src/use-setting.ts";
import {BsWind} from "react-icons/bs";
import {AppSettings} from "src/app-settings-types.ts";
import {SampleSource} from "src/portacount/porta-count-state.ts";

export function SampleSourceWidget() {
    const appContext = useContext(AppContext)
    const client: PortaCountClient8020 = appContext.portaCountClient
    const [sampleSource, setSampleSource] = useState(client.state.sampleSource)
    const [useCompactControls] = useSetting<boolean>(AppSettings.USE_COMPACT_UI);
    const [showExternalControl] = useSetting<boolean>(AppSettings.SHOW_EXTERNAL_CONTROL)

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

    function toggleSetting() {
        client.externalController.sampleSource = sampleSource == SampleSource.MASK ? SampleSource.AMBIENT : SampleSource.MASK
    }

    return (
        showExternalControl && useCompactControls ? <div id={"sample-source-widget"} onClick={toggleSetting} className={"svg-container"}>
            {sampleSource === SampleSource.AMBIENT && <BsWind/>}
            {sampleSource === SampleSource.MASK && <PiFaceMask/>}
        </div> : null
    )
}
