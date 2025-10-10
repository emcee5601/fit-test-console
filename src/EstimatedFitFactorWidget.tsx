import {useSetting} from "src/use-setting.ts";
import {AppSettings} from "src/app-settings-types.ts";
import {convertFitFactorToFiltrationEfficiency, formatFitFactor, formatInteger4} from "src/utils.ts";
import {useEffect, useRef, useState} from "react";
import {PiFaceMask} from "react-icons/pi";
import {AiTwotoneExperiment} from "react-icons/ai";
import {TbLeaf2} from "react-icons/tb";
import "src/estimated-fit-factor-widget.css"
import {useScoreBasedColors} from "src/use-score-based-colors.ts";


export function EstimatedFitFactorWidget() {
    const divRef = useRef<HTMLDivElement>(null);
    const [currentAmbientAverage] = useSetting<number>(AppSettings.CURRENT_AMBIENT_AVERAGE)
    const [currentMaskAverage] = useSetting<number>(AppSettings.CURRENT_MASK_AVERAGE)
    const [score, setScore] = useState<number>(calculateScore(currentAmbientAverage, currentMaskAverage))

    useEffect(() => {
        const newScore = calculateScore(currentAmbientAverage, currentMaskAverage);
        // console.debug("effect score inputs changed, new score is ", newScore, "new bg color is ", newBgColor)
        setScore(newScore)
    }, [currentAmbientAverage, currentMaskAverage]);

    useScoreBasedColors(divRef, score);

    function calculateScore(ambient: number, mask: number) {
        return ambient / Math.max(0.01, mask);
    }

    return (
        <div id={"estimated-fit-factor"} ref={divRef} className={"eff-container thin-border"}>
            <div className={"eff-item"}><TbLeaf2/>{formatInteger4(currentAmbientAverage)}</div>
            <div className={"eff-item"}><PiFaceMask/>{formatInteger4(currentMaskAverage)}</div>
            <div className={"eff-item"}><AiTwotoneExperiment/>{formatFitFactor(score)}</div>
            <div className={"percentage"}>{convertFitFactorToFiltrationEfficiency(score)}%</div>
        </div>
    )
}
