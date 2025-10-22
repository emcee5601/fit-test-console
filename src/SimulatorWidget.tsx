import {useState} from "react";
import {FaRobot} from "react-icons/fa";
import {AppSettings} from "src/app-settings-types.ts";
import {OverlayPanelWidget} from "src/OverlayPanelWidget.tsx";
import {useSetting} from "src/use-setting.ts";

export function SimulatorWidget() {
    const [enableSimulator] = useSetting<boolean>(AppSettings.ENABLE_SIMULATOR)
    const [enableTesterMode] = useSetting<boolean>(AppSettings.ENABLE_TESTER_MODE)
    const simulatorWidgetEnabled = enableSimulator && enableTesterMode;
    const [targetAmbientParticles, setTargetAmbientParticles] = useState<number>(2000)
    const [targetVariancePercentage, setTargetVariancePercentage] = useState<number>(5)
    const [targetFitFactor, setTargetFitFactor] = useState<number>(20)

    return (
        <>
            {simulatorWidgetEnabled &&
                <OverlayPanelWidget position={["top", "right"]} buttonIcon={<FaRobot className={"nav-icon"}/>}>
                    Simulator controls go here

                    <div style={{display: "grid"}}>
                        <input type="range" min={100} max={10000} value={targetAmbientParticles} step={100}
                               onChange={(event) => setTargetAmbientParticles(Number(event.target.value))}/>
                        <input type="range" min={0} max={100} value={targetVariancePercentage} step={0.01}
                               onChange={(e) => setTargetVariancePercentage(Number(e.target.value))}/>
                        <input type="range" min={1} max={1000} value={targetFitFactor} step={1}
                               onChange={(e) => setTargetFitFactor(Number(e.target.value))}/>
                    </div>
                </OverlayPanelWidget>
            }
        </>
    )
}
