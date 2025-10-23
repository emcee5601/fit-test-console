import MovingAverage from "moving-average";
import {useCallback, useContext, useEffect, useState} from "react";
import {BsCheckCircleFill, BsXCircleFill} from "react-icons/bs";
import {AppContext} from "src/app-context.ts";
import {AppSettings} from "src/app-settings-types.ts";
import {DriverSelectorWidget} from "src/DriverSelectorWidget.tsx";
import {InfoBox} from "src/InfoBox.tsx";
import {ParticleConcentrationEvent, PortaCountListener} from "src/portacount-client-8020.ts";
import {ConnectionStatus, SampleSource} from "src/portacount/porta-count-state.ts";
import {SPEECH} from "src/speech.ts";
import {useSetting} from "src/use-setting.ts";

type State =
    "idle"
    | "start"
    | "waiting-for-ambient-count-to-zero"
    | "done"

export function CleanupAssistant() {
    const appContext = useContext(AppContext);
    const portaCountClient = appContext.portaCountClient;
    const externalController = portaCountClient.externalController;
    const requiredAmbientSampleTimeMs = 15 * 1000;  // 5 second moving average
    const [ambientAverage, setAmbientAverage] = useState(MovingAverage(requiredAmbientSampleTimeMs))
    const [state, setState] = useState<State>("idle")
    const [particleCheckPassed, setParticleCheckPassed] = useState<boolean>(false)
    const [instructions, setInstructions] = useState<string>("Press start to begin Cleanup")
    const [uiNeedsUpdate, setUiNeedsUpdate] = useState({})
    const [connectionStatus] = useSetting<ConnectionStatus>(AppSettings.CONNECTION_STATUS)

    const updateUI = useCallback(() => {
        setUiNeedsUpdate({})
    }, []);

    useEffect(() => {
        SPEECH.sayIt(instructions)
    }, [instructions]);

    // todo: move state machine out of React?

    useEffect(() => {
        const portaCountListener: PortaCountListener = {
            particleConcentrationReceived: (concentrationEvent: ParticleConcentrationEvent) => {
                const concentration = concentrationEvent.concentration;
                if (concentrationEvent.sampleSource === SampleSource.AMBIENT) {
                    ambientAverage.push(concentrationEvent.timestamp, concentration)
                } else {
                    // mask: ignore
                }
                updateUI()
                console.debug(`state is ${state}`)
                switch (state) {
                    case "idle":
                        // nothing to do
                        break;
                    case "start":
                        // reset. todo: reset everything in case we're starting multiple times
                        setAmbientAverage(MovingAverage(requiredAmbientSampleTimeMs)) // reset

                        setInstructions("Remove alcohol cartridge, replace with sample plug.")
                        externalController.assumeManualControl()
                        externalController.beep()
                        externalController.sampleAmbient()
                        setState("waiting-for-ambient-count-to-zero")
                        break;
                    case "waiting-for-ambient-count-to-zero":
                        if(ambientAverage.movingAverage() < 1.0) {
                            setState("done")
                            setInstructions(`Cleanup complete. Powering off.`)
                            setParticleCheckPassed(true)
                            externalController.beep()
                            externalController.beep()
                            externalController.powerOff()
                        }
                        break;
                    case "done":
                        // nothing to do
                        break;
                    default:
                        console.error(`unhandled state ${state}`)
                }
            }
        }
        portaCountClient.addListener(portaCountListener);
        return () => {
            portaCountClient.removeListener(portaCountListener)
        };
    }, [uiNeedsUpdate]);

    function start() {
        setState("start")
    }

    function iconify(value: boolean) {
        return <div className={"svg-container"} style={{padding: "4px"}}>{value ? <BsCheckCircleFill color={"green"}/> :
            <BsXCircleFill color={"red"}/>}</div>
    }

    return (
        <div id={"daily-check-panel"} style={{width: "fit-content", justifySelf: "center"}}>
            <div>{instructions}</div>
            <div className={"inline-flex"}>
                <DriverSelectorWidget compact={true}/>
                <button onClick={() => start()} disabled={connectionStatus === ConnectionStatus.DISCONNECTED}>Press to
                    start
                </button>
            </div>
            <InfoBox label={"State"}>{state}</InfoBox>
            <InfoBox label={"Particle count check"}>{iconify(particleCheckPassed)}</InfoBox>
            <InfoBox label={"Ambient average"}>{(ambientAverage.movingAverage() ?? 0).toFixed(2)}</InfoBox>
        </div>
    )
}
