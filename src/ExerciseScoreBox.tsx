import {MouseEventHandler, ReactNode, useRef} from "react";
import "./ExerciseScoreBox.css"
import {useScoreBasedColors} from "src/use-score-based-colors.ts";
import {formatFitFactor} from "src/utils.ts";

export function ExerciseScoreBox({label, score, stddev, onClick}: {
    label: ReactNode,
    score: number,
    stddev?: number, // this is really the stddev as a percentage of the average mask concentration
    onClick?: MouseEventHandler | undefined,
}) {
    const ref = useRef<HTMLFieldSetElement>(null)
    useScoreBasedColors(ref, score)
    return (
        <fieldset className={"exercise-score-box"} ref={ref} onClick={onClick}>
            <legend>{label}</legend>
            {formatFitFactor(score)}{stddev&& `±${Math.round(stddev*score)}`}
        </fieldset>

    )
}
