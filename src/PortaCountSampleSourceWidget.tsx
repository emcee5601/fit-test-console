import {PortaCountClient8020, PortaCountListener} from "./portacount-client-8020.ts";
import {useContext, useEffect, useState} from "react";
import {AppContext} from "./app-context.ts";
import {AppSettings} from "./app-settings.ts";
import {ToggleButton} from "./ToggleButton.tsx";
import {ControlSource} from "./control-source.ts";
import {SampleSource} from "./simple-protocol.ts";
import {useSetting} from "./use-setting.ts";
import {useInView} from "react-intersection-observer";

/**
 * Displays current state and some controls.
 * @constructor
 */
export function PortaCountSampleSourceWidget() {
    const appContext = useContext(AppContext)
    const client: PortaCountClient8020 = appContext.portaCountClient
    const [showExternalControl] = useSetting(AppSettings.SHOW_EXTERNAL_CONTROL)
    const [sampleSource, setSampleSource] = useState(client.state.sampleSource)
    function shouldBeDisabled(controlSource: ControlSource): boolean {
        return controlSource === ControlSource.Internal
    }
    const [disabled, setDisabled] = useState(shouldBeDisabled(client.state.controlSource))
    const {ref, inView} = useInView()
    const [, setSampleSourceInView] = useSetting(AppSettings.SAMPLE_SOURCE_IN_VIEW)

    useEffect(() => {
        const listener: PortaCountListener = {
            sampleSourceChanged(source: SampleSource) {
                setSampleSource(source)
            },
            controlSourceChanged(source: ControlSource) {
                setDisabled(shouldBeDisabled(source))
            }
        };
        client.addListener(listener);
        return () => {
            client.removeListener(listener)
        };
    }, []);

    useEffect(() => {
        setSampleSourceInView(inView)
    }, [inView]);


    return (
            <fieldset id={"portacount-sample-source-widget"} className="info-box-compact" ref={ref}>
                <legend>Source</legend>
                {/*<PiFaceMask/>*/}
                {showExternalControl
                    ? <ToggleButton trueLabel={SampleSource.MASK}
                                    falseLabel={SampleSource.AMBIENT}
                                    value={sampleSource}
                                    setValue={(val) => client.externalController.sampleSource = val}
                                    disabled={disabled}
                    />
                    : sampleSource
                }
            </fieldset>
    )
}
