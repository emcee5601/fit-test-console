import {MouseEventHandler, ReactNode, useRef} from "react";
import "./ExerciseScoreBox.css"
import {AppSettings} from "src/app-settings-types.ts";
import {useScoreBasedColors} from "src/use-score-based-colors.ts";
import {useSetting} from "src/use-setting.ts";
import {convertFitFactorToFiltrationEfficiency, formatFitFactor} from "src/utils.ts";

export function ExerciseScoreBox({label, score, displayScoreAsFE = false, stddev, onClick}: {
    label: ReactNode,
    score: number,
    displayScoreAsFE?: boolean,
    stddev?: number, // this is really the stddev as a percentage of the average mask concentration
    onClick?: MouseEventHandler | undefined,
}) {
    const ref = useRef<HTMLFieldSetElement>(null)
    const [showStddev] = useSetting<boolean>(AppSettings.SHOW_STDDEV)
    useScoreBasedColors(ref, score)
    const displayValue = displayScoreAsFE ? `${convertFitFactorToFiltrationEfficiency(score)}%` : formatFitFactor(score)
    return (
        <fieldset className={"exercise-score-box"} ref={ref} onClick={onClick}>
            <legend>{label}</legend>
            {displayValue}{showStddev && stddev ? `±${Math.round(stddev * score)}`:''}
        </fieldset>

    )
}
