import {ReactNode, useRef} from "react";
import "./ExerciseScoreBox.css"
import {useScoreBasedColors} from "src/use-score-based-colors.ts";
import {formatFitFactor} from "src/utils.ts";

export function ExerciseScoreBox({label, score}: {
    label: ReactNode,
    score: number
}) {
    const ref = useRef<HTMLFieldSetElement>(null)
    useScoreBasedColors(ref, score)
    return (
        <fieldset className={"exercise-score-box"} ref={ref}>
            <legend>{label}</legend>
            {formatFitFactor(score)}
        </fieldset>

    )
}
