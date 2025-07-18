import {isNull, isUndefined} from "json-2-csv/lib/utils";

import {RefObject} from "react";
import {ConnectionStatus} from "src/connection-status.ts";

/**
 * Format a duration into hh:mm:ss:uuu
 * @param elapsedMs
 * @param includeSeconds
 * @param includeMs
 */
export function formatDuration(elapsedMs: number, includeMs: boolean = false, includeSeconds: boolean = true): string {
    const absElapsedMs = Math.abs(elapsedMs)
    const millisVal = Math.round(absElapsedMs % 1000);
    const totalSeconds = Math.floor(absElapsedMs / 1000);
    const secondsVal = totalSeconds % 60;
    const totalMinutes = Math.floor(totalSeconds / 60);
    const minutesVal = totalMinutes % 60;
    const totalHours = Math.floor(totalMinutes / 60);
    // const hoursVal = totalHours % 24;
    // const totalDays = Math.round(totalHours / 24);
    // const daysVal = totalDays % 24;
    // hh:mm:ss or m:ss if no h
    const secondsStr = includeSeconds ? `:${secondsVal.toString().padStart(2, "0")}` : "";
    const millisStr = includeMs && includeSeconds ? (millisVal > 0 ? `.${millisVal.toString().padStart(3, "0")}` : '') : "";
    // show hours if there are hours to show, OR if there are no seconds to show. eg. don't just show minutes.
    const includeHours = totalHours || !includeSeconds;
    return `${elapsedMs < 0 ? "-" : ""}${includeHours ? `${totalHours}:` : ""}${minutesVal.toString().padStart(includeHours ? 2 : 1, "0")}${secondsStr}${millisStr}`;
}

export function formatTime(date: Date, includeSeconds: boolean = false): string {
    return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}${includeSeconds ? `:${date.getSeconds().toString().padStart(2, "0")}` : ""}`;
}

export function convertFitFactorToFiltrationEfficiency(fitFactor: number) {
    const efficiency = 100 * (1.0 - 1.0 / fitFactor);
    const efficiencyPercentage: string = Number(efficiency).toFixed(efficiency < 99 ? 0 : 3)
    return efficiencyPercentage;
}


export function getConnectionStatusCssClass(connectionStatus: ConnectionStatus): string {
    switch (connectionStatus) {
        case ConnectionStatus.DISCONNECTED: {
            return "connection-status status-disconnected";
        }
        case ConnectionStatus.WAITING: {
            return "connection-status status-waiting";
        }
        case ConnectionStatus.RECEIVING: {
            return "connection-status status-receiving";
        }
        default: {
            return "connection-status";
        }
    }
}

export function getFitFactorCssClass(fitFactor: number|string, hasThisExercise: boolean): string {
    // console.debug(`ff is ${fitFactor}`)
    if(!hasThisExercise && !fitFactor) {
        // we don't have this many exercises, and there's no value in the cell
        return "result-cell"
    }
    fitFactor = Number(fitFactor)

    if( isNaN(fitFactor) || fitFactor <= 0 ) {
        // if it's zero, it was probably parsed from empty string
        return "result-cell aborted"
    }
    if (fitFactor >= 100) {
        return "result-cell high-fit-score"
    }
    if (fitFactor > 20) {
        return "result-cell moderate-fit-score"
    }
    return "result-cell low-fit-score"
}

export function sum(theNumbers: number[], startIndex: number = 0, endIndex: number = -1) {
    return theNumbers.slice(startIndex, endIndex).reduce((total, theNumber) => total + theNumber, 0)
}

export function avg(...theNumbers: number[]) {
    return avgArray(theNumbers);
}

export function avgArray(theNumbers: number[], startIndex: number = 0, endIndex: number = -1) {
    if (endIndex < 0) {
        endIndex = theNumbers.length;
    }
    return sum(theNumbers, startIndex, endIndex) / (endIndex - startIndex);
}

export function formatFitFactor(value: number): string {
    if (isNaN(value) || isUndefined(value) || isNull(value)) {
        return "?";
    }
    if (value < 1) {
        return value.toFixed(2);
    } else if (value < 10) {
        return value.toFixed(1);
    } else {
        return value.toFixed(0);
    }
}

export function scrollToBottom(textAreaRef: RefObject<HTMLTextAreaElement>) {
    if (textAreaRef.current) {
        textAreaRef.current.scrollTop = textAreaRef.current.scrollHeight;
    }
}

export function median(array: number[]) {
    if (array.length === 0) {
        return 0;
    }
    const sortedArray = array.toSorted()
    if (0 === sortedArray.length % 2) {
        // even
        const right = sortedArray.length / 2
        return (sortedArray[right - 1] + sortedArray[right]) / 2;
    } else {
        // odd
        const middle = Math.floor(sortedArray.length / 2);
        return sortedArray[middle]
    }
}

export const enCaseInsensitiveCollator = Intl.Collator("en", {sensitivity: "base"}) // case-insensitive sort

