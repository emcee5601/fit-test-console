import {useContext, useEffect, useRef, useState} from "react";
import {AiTwotoneExperiment} from "react-icons/ai";
import {MdOutlinePending} from "react-icons/md";
import {PiFaceMask} from "react-icons/pi";
import {TbLeaf2} from "react-icons/tb";
import "src/estimated-fit-factor-widget.css"
import {AppContext} from "src/app-context.ts";
import {AppSettings} from "src/app-settings-types.ts";
import {ParticleCountStats} from "src/particle-count-stats.ts";
import {ProtocolExecutionState} from "src/protocol-execution-state.ts";
import {useScoreBasedColors} from "src/use-score-based-colors.ts";
import {useSetting} from "src/use-setting.ts";
import {convertFitFactorToFiltrationEfficiency, formatFitFactor, formatInteger4} from "src/utils.ts";


export function EstimatedFitFactorWidget() {
    const appContext = useContext(AppContext);
    const [protocolExecutionState] = useSetting<ProtocolExecutionState>(AppSettings.PROTOCOL_EXECUTION_STATE)
    const divRef = useRef<HTMLDivElement>(null);
    const [currentAmbientAverage] = useSetting<ParticleCountStats>(AppSettings.CURRENT_AMBIENT_AVERAGE)
    const [currentMaskAverage] = useSetting<ParticleCountStats>(AppSettings.CURRENT_MASK_AVERAGE)
    const [score, setScore] = useState<number>(calculateScore(currentAmbientAverage, currentMaskAverage))

    useEffect(() => {
        const newScore = calculateScore(currentAmbientAverage, currentMaskAverage);
        // console.debug("effect score inputs changed, new score is ", newScore, "new bg color is ", newBgColor)
        setScore(newScore)
    }, [currentAmbientAverage, currentMaskAverage]);

    useScoreBasedColors(divRef, score);

    function calculateScore(ambient: ParticleCountStats, mask: ParticleCountStats) {
        return ambient.mean / Math.max(0.01, mask.mean);
    }

    function maybeResetAmbient() {
        if (protocolExecutionState === "Idle") {
            console.debug("resetting ambient collector (reset button pressed)")
            appContext.ambientSampleCollector.reset(5 * 1000)
        } else {
            console.debug(`protocol execution state is ${protocolExecutionState}, ambient sample collector cannot be reset unless Idle`)
        }
    }
    function isAmbientPurging() {
        return appContext.ambientSampleCollector.isPurging()
    }
    function isMaskPurging() {
        return appContext.maskSampleCollector.isPurging()
    }

    function maybeResetMask() {
        if (protocolExecutionState === "Idle") {
            console.debug("resetting mask collector (reset button pressed)")
            appContext.maskSampleCollector.reset(5 * 1000)
        } else {
            console.debug(`protocol execution state is ${protocolExecutionState}, mask sample collector cannot be reset unless Idle`)
        }
    }

    const stddev = Math.round(100*currentAmbientAverage.stddev/currentAmbientAverage.mean);
    return (
        <div id={"estimated-fit-factor"} ref={divRef} className={"eff-container thin-border"} style={{height: "auto"}}>
            {/*todo: show how old the oldest datapoint is*/}
            <div className={"eff-item"} onClick={maybeResetAmbient}><TbLeaf2/>{isAmbientPurging() ? <MdOutlinePending /> : formatInteger4(currentAmbientAverage.mean)} n={currentAmbientAverage.num} &sigma;={isNaN(stddev)  ? "?": `${stddev}%`}
            </div>
            <div className={"eff-item"} onClick={maybeResetMask}><PiFaceMask/>{isMaskPurging() ? <MdOutlinePending /> : formatInteger4(currentMaskAverage.mean)} n={currentMaskAverage.num}
            </div>
            <div className={"eff-item"}><AiTwotoneExperiment/>{formatFitFactor(score)}</div>
            <div className={"percentage"}>{convertFitFactorToFiltrationEfficiency(score)}%</div>
        </div>
    )
}
