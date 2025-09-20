import {useCallback, useContext, useEffect, useState} from "react";
import {AppContext} from "src/app-context.ts";
import {ParticleConcentrationEvent, PortaCountListener} from "src/portacount-client-8020.ts";
import MovingAverage from "moving-average";
import {InfoBox} from "src/InfoBox.tsx";
import {BsCheckCircleFill, BsXCircleFill} from "react-icons/bs";
import {formatFitFactor} from "src/utils.ts";
import {SampleSource} from "src/portacount/porta-count-state.ts";

type State =
    "idle"
    | "start"
    | "initial-mask-purge"
    | "waiting-for-particle-check"
    | "waiting-for-zero-check"
    | "purge-ambient-1"
    | "waiting-for-ambient-average"
    | "purge-mask"
    | "waiting-for-mask-average"
    | "purge-ambient-2"
    | "waiting-for-second-ambient-average"
    | "done"

export function DailyChecksPanel() {
    const purgeTimeMs = 7*1000 // should only need 4-5 seconds to purge, but we only have 1 second resolution on the data stream.
    const requiredMaskSampleTimeMs = 11 * 1000
    const requiredAmbientSampleTimeMs = 5 * 1000
    const minimumRequiredParticles = 1000;
    const minPassingFitFactor = 50000;
    const appContext = useContext(AppContext);
    const portaCountClient = appContext.portaCountClient;
    const externalController = portaCountClient.externalController;
    const [particleCheckPassed, setParticleCheckPassed] = useState<boolean>(false)
    const [zeroCheckPassed, setZeroCheckPassed] = useState<boolean>(false)
    const [maxFitFactorCheckPassed, setMaxFitFactorCheckPassed] = useState<boolean>(false)
    const [maxAmbientCount, setMaxAmbientCount] = useState<number>(0)
    const [maxMaskCount, setMaxMaskCount] = useState<number>(0)
    const [minMaskCount, setMinMaskCount] = useState<number>(1000)
    const [maskAverage, setMaskAverage] = useState(MovingAverage(requiredMaskSampleTimeMs))
    const [ambientAverage, setAmbientAverage] = useState(MovingAverage(requiredAmbientSampleTimeMs))
    // const maskAverage = useMemo(() => MovingAverage(requiredMaskSampleTime), []);
    // const ambientAverage = useMemo(() => MovingAverage(requiredAmbientSampleTime), [])
    const [state, setState] = useState<State>("idle")
    const [instructions, setInstructions] = useState<string>("Press start to begin")
    const [startTime, setStartTime] = useState<number>(0)
    const [firstAmbientCount, setFirstAmbientCount] = useState<number>(0)
    const [secondAmbientCount, setSecondAmbientCount] = useState<number>(0)
    const [maskCount, setMaskCount] = useState<number>(0)
    const [fitFactor, setFitFactor] = useState<number>(0)
    const [uiNeedsUpdate, setUiNeedsUpdate] = useState({})
    const updateUI = useCallback(() => {
        setUiNeedsUpdate({})
    }, []);

    // todo: use protocol executor to run a 1 exercise test for the max FF check.
    // todo: move state machine out of React?

    useEffect(() => {
        const portaCountListener: PortaCountListener = {
            particleConcentrationReceived: (concentrationEvent: ParticleConcentrationEvent) => {
                const concentration = concentrationEvent.concentration;
                if (concentrationEvent.sampleSource === SampleSource.AMBIENT) {
                    setMaxAmbientCount((prev) => prev > concentration ? prev : concentration)
                    ambientAverage.push(concentrationEvent.timestamp, concentration)
                } else {
                    // mask
                    setMaxMaskCount((prev) => prev > concentration ? prev : concentration)
                    setMinMaskCount((prev) => prev < concentration ? prev : concentration)
                    maskAverage.push(concentrationEvent.timestamp, concentration)
                }
                updateUI()
                console.debug(`state is ${state}`)
                switch (state) {
                    case "idle":
                        // nothing to do
                        break;
                    case "start":
                        // reset. todo: reset everything in case we're starting multiple times
                        setMaskAverage(MovingAverage(requiredMaskSampleTimeMs)) // reset
                        setAmbientAverage(MovingAverage(requiredAmbientSampleTimeMs)) // reset
                        setMinMaskCount(1000)
                        setMaxMaskCount(0)
                        setMaxAmbientCount(0)
                        setParticleCheckPassed(false)
                        setZeroCheckPassed(false)
                        setMaxFitFactorCheckPassed(false)
                        setFitFactor(0)

                        setInstructions("Remove zero filter if attached")
                        externalController.assumeManualControl()
                        externalController.beep()
                        externalController.sampleMask()
                        setState("initial-mask-purge")
                        setStartTime(Date.now())
                        break;
                    case "initial-mask-purge":
                        if (Date.now() - startTime > purgeTimeMs) {
                            setState("waiting-for-particle-check")
                            setStartTime(Date.now())
                        }
                        break;
                    case "waiting-for-particle-check":
                        console.debug(`max mask count: ${maxMaskCount}`)
                        if (maxMaskCount > minimumRequiredParticles) {
                            setState("waiting-for-zero-check")
                            setInstructions("Attach zero filter")
                            externalController.beep()
                            setParticleCheckPassed(true)
                            setMinMaskCount(1000) // reset
                        }
                        break;
                    case "waiting-for-zero-check":
                        if (minMaskCount === 0.00) {
                            // todo: wait a few seconds for this. use another moving average to check
                            setState("purge-ambient-1")
                            externalController.sampleAmbient()
                            setInstructions("reading from ambient")
                            setStartTime(Date.now())
                            setZeroCheckPassed(true)
                        }
                        break;
                    case "purge-ambient-1":
                        if (Date.now() - startTime > purgeTimeMs) {
                            setState("waiting-for-ambient-average")
                            setStartTime(Date.now())
                            setAmbientAverage(MovingAverage(requiredAmbientSampleTimeMs)) // reset
                        }
                        break;
                    case "waiting-for-ambient-average":
                        if (Date.now() - startTime > requiredAmbientSampleTimeMs + purgeTimeMs) {
                            setFirstAmbientCount(ambientAverage.movingAverage())
                            setState("purge-mask")
                            externalController.sampleMask()
                            setInstructions("reading from mask")
                            setStartTime(Date.now())
                        }
                        break;
                    case "purge-mask":
                        if (Date.now() - startTime > purgeTimeMs) {
                            setState("waiting-for-mask-average")
                            setStartTime(Date.now())
                            setMaskAverage(MovingAverage(requiredMaskSampleTimeMs)) // reset
                        }
                        break;
                    case "waiting-for-mask-average":
                        if (Date.now() - startTime > requiredMaskSampleTimeMs + purgeTimeMs) {
                            setMaskCount(maskAverage.movingAverage())
                            setState("purge-ambient-2")
                            externalController.sampleAmbient()
                            setInstructions("reading from ambient")
                            setStartTime(Date.now())
                        }
                        break;
                    case "purge-ambient-2":
                        if (Date.now() - startTime > purgeTimeMs) {
                            setState("waiting-for-second-ambient-average")
                            setStartTime(Date.now())
                            setAmbientAverage(MovingAverage(requiredAmbientSampleTimeMs)) // reset
                        }
                        break;
                    case "waiting-for-second-ambient-average":
                        if (Date.now() - startTime > requiredAmbientSampleTimeMs + purgeTimeMs) {
                            setSecondAmbientCount(ambientAverage.movingAverage())
                            setState("done")
                            setInstructions("done")
                            // make sure we don't have infinite ff
                            const ff = 0.5 * (firstAmbientCount + secondAmbientCount) / Math.max(0.01, maskCount);
                            setFitFactor(ff)
                            setMaxFitFactorCheckPassed(ff > minPassingFitFactor)
                            externalController.sampleMask()
                            externalController.beep()
                            externalController.beep()
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
        <div id={"daily-check-panel"} style={{width:"fit-content", justifySelf:"center"}}>
            <div>{instructions}</div>
            <button onClick={() => start()}>Press to start</button>
            <InfoBox label={"State"}>{state}</InfoBox>
            <InfoBox label={"Particle count check"}>{iconify(particleCheckPassed)}</InfoBox>
            <InfoBox label={"Zero check"}>{iconify(zeroCheckPassed)}</InfoBox>
            <InfoBox label={"Max fit factor check"}>{iconify(maxFitFactorCheckPassed)}</InfoBox>
            <InfoBox label={"Max ambient count"}>{maxAmbientCount}</InfoBox>
            <InfoBox label={"Ambient average"}>{(ambientAverage.movingAverage()??0).toFixed(2)}</InfoBox>
            <InfoBox label={"Max mask count"}>{maxMaskCount}</InfoBox>
            <InfoBox label={"Min mask count"}>{minMaskCount}</InfoBox>
            <InfoBox label={"Mask average"}>{(maskAverage.movingAverage()??0).toFixed(2)}</InfoBox>
            <InfoBox label={"Fit factor"}>{formatFitFactor(fitFactor)}</InfoBox>
        </div>
    )
}
