import {RefObject, useEffect, useMemo, useState} from "react";
import {getColorForFitFactor, getFgColorForBgColor} from "src/utils.ts";

/**
 * Set the element's foreground and background colors based on the score.
 * The foreground color is based on the background color. Try to use the computed style to get the component colors in
 * case the background color is specified as a named color or color-mix or something that's not in component colors.
 * For now, only rgb colors are supported. todo: parse other color space strings.
 * @param elementRef
 * @param score
 * @param colorize if false, use the fallback colors instead of colorizing based on the score. (legacy behavior)
 */
export function useScoreBasedColors<T extends HTMLElement>(elementRef: RefObject<T>, score: number, colorize: boolean = true) {
    const bgColor = useMemo<string>(() => getColorForFitFactor(score > 1 ? score : NaN, colorize), [score]);
    const [update, setUpdate] = useState({})
    useEffect(() => {
        if (elementRef.current) {
            // console.debug("updating colors, score is", initScore)
            elementRef.current.style.backgroundColor = bgColor

            const computedStyle = window.getComputedStyle(elementRef.current);
            const computedBgColor = computedStyle.backgroundColor
            const matchingFgColor = getFgColorForBgColor(computedBgColor);
            // console.debug("useScoreBasedColor", score, "computed bg:", computedBgColor, "desired bg", bgColor, "fg",
            // matchingFgColor, "score", score);
            elementRef.current.style.color = matchingFgColor;

            if (computedBgColor === "rgba(0, 0, 0, 0)") {
                /**
                 * Sometimes getComputedStyle() returns a 0 alpha color, which is transparent. Force an update, which
                 * should happen in the next render and let getComputedStyle() try again. Hopefully we'll eventually
                 * get a non-transparent color.  Otherwise, we end up with white on white. Also, don't request an
                 * update immediately so React can have some time to update the colors before we try again.
                 */
                // console.debug("force update")
                setTimeout(() => setUpdate({}), 0.1)
            }
        }
    }, [bgColor, elementRef, update]);
}
