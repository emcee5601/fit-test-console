import {PortaCountClient8020, PortaCountListener} from "./portacount-client-8020.ts";
import {useContext, useEffect, useState} from "react";
import {AppContext} from "./app-context.ts";
import {ToggleButton} from "./ToggleButton.tsx";
import {useSetting} from "./use-setting.ts";
import {AppSettings} from "src/app-settings-types.ts";
import {ControlSource, SampleSource} from "src/portacount/porta-count-state.ts";

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

    return (
            <fieldset id={"portacount-sample-source-widget"} className="info-box-compact">
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
