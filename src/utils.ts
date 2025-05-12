import {isNull, isUndefined} from "json-2-csv/lib/utils";

import {RefObject} from "react";
import {ConnectionStatus} from "src/connection-status.ts";

/**
 * Format a duration into hh:mm:ss:uuu
 * @param absElapsedMs
 * @param includeMs
 */
export function formatDuration(elapsedMs: number, includeMs: boolean = false): string {
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
    return `${elapsedMs < 0 ? "-" : ""}${totalHours ? `${totalHours}:` : ""}${minutesVal.toString().padStart(totalHours ? 2 : 1, "0")}:${secondsVal.toString().padStart(2, "0")}${includeMs ? (millisVal > 0 ? `.${millisVal.toString().padStart(3, "0")}` : '') : ""}`;
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

export function getFitFactorCssClass(fitFactor: number): string {
    if (fitFactor < 1.1) {
        // probably aborted
        return "result aborted"
    } else if (fitFactor < 20) {
        return "result low-fit-score"
    } else if (fitFactor < 100) {
        return "result moderate-fit-score"
    } else if (fitFactor >= 100) {
        return "result high-fit-score"
    } else {
        // NaN
        return "result aborted"
    }
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
    if(array.length === 0) {
        return 0;
    }
    const sortedArray = array.toSorted()
    if (0 === sortedArray.length % 2) {
        // even
        const right = sortedArray.length / 2
        return (sortedArray[right-1] + sortedArray[right]) / 2;
    } else {
        // odd
        const middle = Math.floor(sortedArray.length / 2);
        return sortedArray[middle]
    }
}
