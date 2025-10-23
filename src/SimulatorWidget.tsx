import {useContext, useState} from "react";
import {FaRobot} from "react-icons/fa";
import {AppContext} from "src/app-context.ts";
import {AppSettings} from "src/app-settings-types.ts";
import {OverlayPanelWidget} from "src/OverlayPanelWidget.tsx";
import {PortaCountLastLineWidget} from "src/PortaCountLastLineWidget.tsx";
import {useSetting} from "src/use-setting.ts";


export function SimulatorWidget() {
    const appContext = useContext(AppContext)
    const simulator = appContext.portaCountSimulator
    const [enableSimulator] = useSetting<boolean>(AppSettings.ENABLE_SIMULATOR)
    const [enableTesterMode] = useSetting<boolean>(AppSettings.ENABLE_TESTER_MODE)
    const simulatorWidgetEnabled = enableSimulator && enableTesterMode;
    const [targetAmbientParticles, setTargetAmbientParticles] = useState<number>(simulator.targetCount)
    const [targetCountVariancePercentage, setTargetCountVariancePercentage] = useState<number>(simulator.targetCountVariancePct)
    const [targetFitFactor, setTargetFitFactor] = useState<number>(simulator.targetMaskFF)
    const [targetFFVariancePercentage, setTargetFFVariancePercentage] = useState<number>(simulator.targetMaskFFVariancePct)

    function setTargetAmbient(target:number) {
        simulator.targetCount = target;
        setTargetAmbientParticles(target);
    }
    function setTargetVariance(target:number) {
        simulator.targetCountVariancePct = target;
        setTargetCountVariancePercentage(target);
    }
    function setTargetFF(target:number) {
        simulator.targetMaskFF = target
        setTargetFitFactor(target)
    }
    function setTargetFFVariance(target:number) {
        simulator.targetMaskFFVariancePct = target;
        setTargetFFVariancePercentage(target);
    }

    return (
        <>
            {simulatorWidgetEnabled &&
                <OverlayPanelWidget position={["right"]} buttonIcon={<FaRobot className={"nav-icon"}/>}>
                    <span style={{fontSize: 'xx-large'}}>Simulator</span>

                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "max-content 1fr 5ch",
                        justifyItems: "start"
                    }}>
                        <span>Target Count:</span>
                        <input type="range" min={0} max={10000} value={targetAmbientParticles} step={100}
                               onChange={(event) => setTargetAmbient(Number(event.target.value))}/>
                        <span>{targetAmbientParticles}</span>

                        <span>Count Variance:</span>
                        <input type="range" min={0} max={100} value={targetCountVariancePercentage} step={1}
                               onChange={(e) => setTargetVariance(Number(e.target.value))}/>
                        <span>{targetCountVariancePercentage}</span>

                        <span>Target FF:</span>
                        <input type="range" min={1} max={1000} value={targetFitFactor} step={1}
                               onChange={(e) => setTargetFF(Number(e.target.value))}/>
                        <span>{targetFitFactor}</span>

                        <span>FF Variance:</span>
                        <input type="range" min={0} max={100} value={targetFFVariancePercentage} step={1}
                               onChange={(e) => setTargetFFVariance(Number(e.target.value))}/>
                        <span>{targetFFVariancePercentage}</span>
                    </div>
                    <PortaCountLastLineWidget/>
                </OverlayPanelWidget>
            }
        </>
    )
}
