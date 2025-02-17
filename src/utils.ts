import {isNull, isUndefined} from "json-2-csv/lib/utils";
import {ConnectionStatus} from "./connection-status.ts";

export function convertFitFactorToFiltrationEfficiency(fitFactor:number) {
    const efficiency = 100 * (1.0 - 1.0 / fitFactor);
    const efficiencyPercentage: string = Number(efficiency).toFixed(efficiency < 99 ? 0 : 3)
    return efficiencyPercentage;
}


export function getConnectionStatusCssClass(connectionStatus: ConnectionStatus) : string {
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

export function getFitFactorCssClass(fitFactor:number):string {
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

export function avg(theNumbers: number[], startIndex: number = 0, endIndex: number = -1) {
    if (endIndex < 0) {
        endIndex = theNumbers.length;
    }
    return sum(theNumbers, startIndex, endIndex) / (endIndex - startIndex);
}

export function formatFitFactor(value: number):string {
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
