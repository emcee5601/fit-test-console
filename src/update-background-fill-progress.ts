import {RefObject} from "react";

/**
 * use background gradient fill to mark progress with the given element
 */
const DEFAULT_BACKGROUND_COLOR = "rgba(255, 255, 255, 1)"
const DEFAULT_PROGRESS_COLOR = "rgba(0, 183, 255, 1)"

export function updateBackgroundFillProgress(elementRef: RefObject<HTMLElement>,
    progress: number, // 0<=progress=<1
    progressColor: string = DEFAULT_PROGRESS_COLOR,
    backgroundColor: string = DEFAULT_BACKGROUND_COLOR) {
    if (elementRef.current) {
        elementRef.current.style.background = `linear-gradient(90deg,${progressColor} ${100 * progress}%, ${backgroundColor} 0%, ${backgroundColor} 100%)`
    }
}
