import {isNull, isUndefined} from "json-2-csv/lib/utils";

import {RefObject} from "react";
import {ProtocolSegment} from "src/app-settings-types.ts";
import {ParticleConcentrationEvent} from "src/portacount-client-8020.ts";

import {ConnectionStatus} from "src/portacount/porta-count-state.ts";
import {SimpleResultsDBRecord} from "src/SimpleResultsDB.ts";

const aliases = {
    med: "M",
    medium: "M",
    small: "S",
    large: "L", // always abbreviate sizes
    "ear loop": "earloop", // mask name parts should be a single word
    "head strap": "headstrap",
    "head loop": "heeadstrap",
    "headloop": "headstrap",
}
const _MaskAttachmentType = ["headstrap", "earloop", "adhesive"] as const
type MaskAttachmentType = typeof _MaskAttachmentType[number]

const _MaskShape = ["bifold", "trifold", "boat", "duckbill", "cup", "unspecified"] as const
type MaskShape = typeof _MaskShape[number]

const _MaskSize = ["unspecified"
    , "XXS"
    , "XS"
    , "S"
    , "M"
    , "L"
    , "XL"
    , "XXL"
    , "Kids"
    , "Adult Regular"
] as const
type MaskSize = typeof _MaskSize[number]

const _MaskMaker = ["unknown"
    , "3M"
    , "ACI"
    , "BNX"
    , "Benehal"
    , "Blox"
    , "Bluna"
    , "Breatheteq"
    , "Champak"
    , "Drager"
    , "Envo"
    , "Flo"
    , "Gerson"
    , "Jackson"
    , "Laianzhi"
    , "Lighthouse"
    , "Omnimask"
    , "Powecom"
    , "Rackmask"
    , "Readimask"
    , "Trident"
    , "Vitacore"
    , "Vog"
    , "WellBefore"
    , "Zero"
    , "Zimi"]
type MaskMaker = typeof _MaskMaker[number]

const delimiters = '[,;]'

class StructuredMaskName {
    private _maker: MaskMaker;
    private _model: string;
    private _size: MaskSize;
    private _color: string;
    private _attachmentType: MaskAttachmentType;
    private _shape: MaskShape;

    constructor(maker?: MaskMaker, model?: string, size?: MaskSize, color?: string, attachmentType?: MaskAttachmentType, shape: MaskShape = "unspecified") {
        this._maker = maker as MaskMaker;
        this._model = model as string;
        this._size = size as MaskSize;
        this._color = color as string;
        this._attachmentType = attachmentType as MaskAttachmentType;
        this._shape = shape;
    }

    get shortName(): string {
        // console.debug("structured name for ", JSON.stringify(this._model, null, 2));
        return [this.maker, this.model].join(" ");
    }

    /**
     * Generally the taxonomy is mfr + model number + size (if model number doesn't indicate) + color (I've been
     * tracking for Zimis to see if there's a difference in FF) + ear loop vs head strap
     *
     * Assume a few things about the mask name and parts:
     * - maker, size, color, attachmentType are all single words
     * - case and spaces don't matter
     * - commas and semicolons are the same as spaces
     */
    get normalizedName(): string {
        return [this.maker, this.model, this.size, this.color, this.attachmentType].join(" ")
            // remove orphaned delimiters (these will come from leftover original mask name which ends up in model)
            .replaceAll(new RegExp(`(?<=\\s)${delimiters}*(?=\\s)`, "ig"), " ")
            // remove extraneous spaces
            .replaceAll(/\s+/g, " ").trim()
    }

    get maker(): MaskMaker {
        return this._maker;
    }

    set maker(value: MaskMaker) {
        this._maker = value;
    }

    get model(): string {
        return this._model;
    }

    set model(value: string) {
        this._model = value;
    }

    get size(): MaskSize {
        return this._size;
    }

    set size(value: MaskSize) {
        this._size = value;
    }

    get color(): string {
        return this._color;
    }

    set color(value: string) {
        this._color = value;
    }

    get attachmentType(): MaskAttachmentType {
        return this._attachmentType;
    }

    set attachmentType(value: MaskAttachmentType) {
        this._attachmentType = value;
    }

    get shape(): MaskShape {
        return this._shape;
    }

    set shape(value: MaskShape) {
        this._shape = value;
    }
}

export function normalizeMaskName(maskName: string): string {
    return getStructuredMaskName(maskName).normalizedName
}

export function getStructuredMaskName(maskName: string): StructuredMaskName {
    const structuredName: StructuredMaskName = new StructuredMaskName();
    // collapse whitespace
    const spaceFixedName = (maskName ?? "").replaceAll(/\s+/g, " ")
    // resolve aliases
    const unaliasedName = Object.entries(aliases).toSorted(([k1], [k2]) => k2.length - k1.length).reduce((result, [alias, value]) => {
        return result.replaceAll(new RegExp(`${alias}`, "ig"), value)
    }, spaceFixedName)
    let originalName = unaliasedName
    let loweredName = originalName.toLowerCase();

    // TODO: don't perform the replace if more than one match is found, eg, zimi kn95 med frame small filter (size
    // appears 2x)

    // look for parts in order, splice out found pieces from both lower case and original version
    _MaskMaker.find((maker) => {
        const match = loweredName.match(new RegExp(`\\b${maker.toLowerCase()}${delimiters}*\\b`, "i"))
        if (match && match.index !== undefined) {
            // found
            const index = match.index
            structuredName.maker = maker
            loweredName = loweredName.slice(0, index) + loweredName.slice(index + match[0].length)
            originalName = originalName.slice(0, index) + originalName.slice(index + match[0].length)
            return true;

        } else {
            return false
        }
    })

    _MaskSize.find((size) => {
        const match = loweredName.match(new RegExp(`\\b${size}${delimiters}*\\b`, "i"))
        if (match && match.index !== undefined) {
            // found
            const index = match.index
            structuredName.size = size
            loweredName = loweredName.slice(0, index) + loweredName.slice(index + match[0].length)
            originalName = originalName.slice(0, index) + originalName.slice(index + match[0].length)
            return true;
        } else {
            return false;
        }
    })

    _MaskAttachmentType.find((attachmentType) => {
        const match = loweredName.match(new RegExp(`\\b${attachmentType}${delimiters}*\\b`, "i"))
        if (match && match.index !== undefined) {
            // found
            const index = match.index
            structuredName.attachmentType = attachmentType
            loweredName = loweredName.slice(0, index) + loweredName.slice(index + match[0].length)
            originalName = originalName.slice(0, index) + originalName.slice(index + match[0].length)
            return true;
        } else {
            return false;
        }
    })

    // do any of these remaining parts look like a color?
    loweredName.split(/\s+/).find((part) => {
        if (CSS.supports('color', part)) {
            // looks like a color
            structuredName.color = part
            // remove from the remainder of the name strings
            loweredName = loweredName.replace(part, '')
            originalName = originalName.replace(new RegExp(part, "i"), '') // case-insensitively replace 1 instance

            return true
        } else {
            return false
        }
    })

    if (originalName.length > 0) {
        structuredName.model = originalName.replaceAll(/\s+/g, ' ').trim()
        originalName = ""
    }

    return structuredName
}

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

/**
 * Convert FitFactor to filtration efficiency equivalent.
 * @param fitFactor
 */
export function ffToFe(fitFactor: number) {
    return 100 * (1.0 - 1.0 / fitFactor);
}

export function feToFf(filtrationEfficiency: number) {
    return 1.0 / (1.0 - filtrationEfficiency / 100.0)
}

export function formatFe(efficiency: number): string {
    return (efficiency > 0 && efficiency <= 99.999)
        ? efficiency.toFixed(efficiency < 90 ? 0 : efficiency < 99.9 ? 1 : efficiency < 99.99 ? 2 : 3)
        : "?"
}

export function formatFF(fitFactor: number): string {
    return fitFactor.toFixed(fitFactor < 10 ? 1 : 0)
}

export function convertFitFactorToFiltrationEfficiency(fitFactor: number) {
    return formatFe(ffToFe(fitFactor));
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

/**
 * from
 * https://gamedev.stackexchange.com/questions/38536/given-a-rgb-color-x-how-to-find-the-most-contrasting-color-y?noredirect=1
 * @param bgColor
 *
 * color(srgb 0.635608 0.783529 0.180392)
 * color(srgb-linear 0.151859 0.354418 0.0149882)
 * rgb(245, 245, 245)
 * oklab(0.647273 -0.103665 0.123616)
 */
export function getFgColorForBgColor(bgColor: string) {
    const match = bgColor.match(/rgb(?<hasAlpha>a)?\((?<r>\d+),\s*(?<g>\d+),\s*(?<b>\d+)(,\s*(?<a>\d+))?\)/)
        || bgColor.match(/color\((?<srgb>s)rgb(-linear)?\s+(?<r>[\d.]+)\s+(?<g>[\d.]+)\s+(?<b>[\d.]+)\)/)
        || bgColor.match(/(?<oklab>oklab)\((?<L>[\d.]+)\s+(?<a>[\d.-]+)\s+(?<B>[\d.-]+)(\s+(?<A>[\d.]+))?\)/)
    if (!match || !match.groups) {
        console.debug(`no match for ${bgColor}`)
        return "black"
    }
    const {r: r, g: g, b: b, srgb: srgb, oklab: oklab, L: L} = match.groups;
    if (oklab) {
        const lum = Number(L)
        return lum > 0.5 ? "black" : "white";
    } else {
        const divisor = srgb ? 1 : 255
        const gamma = 2.2;
        const lum =
            0.2126 * Math.pow(Number(r) / divisor, gamma) +
            0.7152 * Math.pow(Number(g) / divisor, gamma) +
            0.0722 * Math.pow(Number(b) / divisor, gamma)
        return lum > Math.pow(0.5, gamma) ? "black" : "white";
    }
    // console.debug(bgColor, "lum is ", lum)
}

export function getColorForFitFactor(fitFactor: number | string, hasThisExercise: boolean = true) {
    if (!hasThisExercise && !fitFactor) {
        // we don't have this many exercises, and there's no value in the cell
        return "whitesmoke"
    }
    fitFactor = Number(fitFactor)
    if (isNaN(fitFactor) || fitFactor <= 0) {
        // if it's zero, it was probably parsed from empty string
        return "whitesmoke"
    }
    const efficiency = 100 * (1.0 - 1.0 / fitFactor);
    if (efficiency > 99) {
        return "darkgreen"
    }
    if (efficiency >= 95) {
        // 20 == 95%
        const pctLowColor = Math.round(100 * (99 - efficiency) / (99 - 95))
        const pctHighColor = 100 - pctLowColor
        return `color-mix(in srgb, yellowgreen ${pctLowColor}%, darkgreen ${pctHighColor}%)`
    }
    if (efficiency >= 80) {
        // 5 == 95%
        const pctLowColor = Math.round(100 * (95 - efficiency) / (95 - 80))
        const pctHighColor = 100 - pctLowColor
        return `color-mix(in srgb, darkorange ${pctLowColor}%, yellowgreen ${pctHighColor}%)`
    }
    if (efficiency > 0) {
        // 1 == 0%
        const pctLowColor = Math.round(100 * (80 - efficiency) / (80 - 0))
        const pctHighColor = 100 - pctLowColor
        return `color-mix(in srgb, darkred ${pctLowColor}%, darkorange ${pctHighColor}%)`
    }
    // console.debug("efficiency", efficiency, "fit factor", fitFactor)
    return "darkred"
}

export function getFitFactorCssClass(fitFactor: number | string, hasThisExercise: boolean): string {
    // console.debug(`ff is ${fitFactor}`)
    if (!hasThisExercise && !fitFactor) {
        // we don't have this many exercises, and there's no value in the cell
        return "result-cell"
    }
    fitFactor = Number(fitFactor)

    if (isNaN(fitFactor) || fitFactor <= 0) {
        // if it's zero, it was probably parsed from empty string
        return "result-cell aborted"
    }
    if (fitFactor >= 100) {
        // 99+%
        return "result-cell very-high-fit-score"
    }
    if (fitFactor >= 33) {
        // 33 == 97%
        return "result-cell high-fit-score"
    }
    if (fitFactor >= 20) {
        // 20 == 95%
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

/**
 * use exponents to express integers with more than width number of digits.
 */
export function formatInteger(value: number, width: number = 4): string {
    const digits = value ? 1 + Math.floor(Math.log10(value)) : 1;
    if (digits > width) {
        const digitsToTrim = digits - 2;
        return Math.round(value / (10 ** digitsToTrim)).toFixed(0) + 'e' + digitsToTrim
    } else {
        return value.toFixed(0)
    }
}

/**
 * Format integers to display in 4 or fewer characters if possible.
 */
export function formatInteger4(value: number): string {
    if (isNaN(value) || isUndefined(value) || isNull(value)) {
        return "?";
    }
    if (value >= 10000) {
        return Math.round(value / 1000).toFixed(0) + 'k';
    } else {
        return value.toFixed(0)
    }
}

export function formatFitFactor(value: number): string {
    if (isNaN(value) || isUndefined(value) || isNull(value) || value < 1) {
        return "?";
    }
    if (value < 10) {
        return value.toFixed(2);
    }
    return formatInteger4(value);
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

export function isMobile() {
    return window.navigator.userAgent.includes("Mobi")
}

export function calculateSegmentConcentration(segment: ProtocolSegment): number {
    // don't round this here
    // portacount seems to return a minimum value of 0.01 here, so we'll do the same
    return Math.max(0.01, segment.data.reduce((sum, currentValue: ParticleConcentrationEvent) => sum + currentValue.concentration, 0) / segment.data.length);
}

export function getEstimatedOverallScore(currentTestData: SimpleResultsDBRecord) {
    // calculate harmonic mean of exercise fields
    const scores = Object.entries(currentTestData)
        .filter(([key]) => key.startsWith("Ex ")) // only look at exercise fields
        .map(([, value]) => Number(value))
        .filter((value) => isFinite(value) && value > 1.0); // ignore invalid values
    return scores.length / scores.reduce((result, value) => result + 1 / value, 0)
}
