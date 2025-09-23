/**
 * FunctionPlot wrapper plotting relative mask performance.
 */
import {FunctionPlot} from "src/FunctionPlot.tsx";
import {FunctionPlotDatum, FunctionPlotDatumScope, FunctionPlotOptionsAxis} from "function-plot";
import {feToFf, ffToFe, formatFe, formatFF, getStructuredMaskName} from "src/utils.ts";
import {useState} from "react";
import {SimpleResultsDBRecord} from "src/SimpleResultsDB.ts";

export type FFRange = { lo: number, hi: number, label: string };
type MaskPerfFunctionPlotProps = {
    ranges?: FFRange[],
    records?: SimpleResultsDBRecord[],
}

const colors = [
    "#FE2712", "#FC600A", "#FB9902",
    "#FCCC1A", "#FEFE33", "#B2D732", "#66B032", "#347C98", "#0247FE",
    "#4424D6", "#8601AF", "#C21460"]

function getColorForIndex(index: number) {
    return colors[index] || "black"
}

export function MaskPerfFunctionPlot(props: MaskPerfFunctionPlotProps) {
    const [invert, setInvert] = useState<boolean>(true)
    const [zoomFitFactor, setZoomFitFactor] = useState<boolean>(false)
    const [zoomEfficiency, setZoomEfficiency] = useState<boolean>(false)

    // clean up ranges
    let ranges: FFRange[] = [];
    if (props.records) {
        ranges = props.records.filter((record) => !isNaN(Number(record["Ex 1"]))).toSpliced(10).map((record) => {
            const values = Object.keys(record).filter((key) => key.startsWith("Ex") && !isNaN(Number(record[key]))).map((key) => record[key] as number);
            return {
                lo: Math.min(...values),
                hi: Math.max(...values),
                label: `${getStructuredMaskName(record.Mask ?? "").shortName} (${record.ID})`
            } as FFRange
        })
    } else if (props.ranges) {
        ranges = props.ranges.filter(range => !(isNaN(range.hi) || isNaN(range.lo)))
    }

    /**
     * use interval arithmetic plotter to plot a band for a FF range
     */
    function getFeRangePlotData(range: FFRange, index: number): FunctionPlotDatum {
        return {
            fn: (scope: FunctionPlotDatumScope) => {
                return {
                    hi: ffToFe(scope.x.hi),
                    lo: ffToFe(range.lo),
                }
            },
            range: [range.lo, range.hi],
            color: getColorForIndex(index),
        }
    }

    function getFfRangePlotData(range: FFRange, index: number): FunctionPlotDatum {
        return {
            fn: (scope: FunctionPlotDatumScope) => {
                return {
                    hi: feToFf(scope.x.hi),
                    lo: range.lo,
                }
            },
            range: [ffToFe(range.lo), ffToFe(range.hi)],
            color: getColorForIndex(index),
        }
    }

    function getLabelPlot(range: FFRange): FunctionPlotDatum {
        return {
            graphType: "text",
            location: invert
                ? [ffToFe(range.lo), range.lo]
                : [range.lo, ffToFe(range.lo)],
            text: range.label,
            color: "black",
        }
    }

    const minFf = 1.001;
    const maxFf = 200;
    const minFe = 1;
    const maxFe = 99.99;

    const efficiencyAxis: FunctionPlotOptionsAxis = {
        domain: [zoomEfficiency ? Math.min(...ranges.map((r) => ffToFe(r.lo))) : minFe,
            zoomEfficiency ? Math.max(...ranges.map((r) => ffToFe(r.hi))) : maxFe],
        type: "linear",
        label: "Filtration %",
    };
    const fitFactorAxis: FunctionPlotOptionsAxis = {
        domain: [zoomFitFactor ? Math.min(...ranges.map((r) => r.lo)) : minFf,
            zoomFitFactor ? Math.max(...ranges.map((r) => r.hi)) : maxFf],
        type: "log",
        label: "Fit Factor",
    };
    const fitFactorFn: FunctionPlotDatum = {
        fn: "1/(1-x/100)",
        range: [minFe, maxFe],
    };
    const efficiencyFn: FunctionPlotDatum = {
        fn: "100*(1-1/x)",
        range: [minFf, maxFf]
    }
    return (
        <div>
            <div>
                <button onClick={() => setInvert(!invert)}>Invert</button>
                <button onClick={() => setZoomEfficiency(!zoomEfficiency)}>Zoom Efficiency</button>
                <button onClick={() => setZoomFitFactor(!zoomFitFactor)}>Zoom Fit Factor</button>
            </div>
            <FunctionPlot
                height={300}
                width={1000}
                grid={true}
                // disableZoom={true}
                tip={{
                    xLine: true,
                    yLine: true,
                    renderer: (x, y) => {
                        if (invert) {
                            return `${formatFe(x)}% = FF:${formatFF(y)}`
                        } else {
                            return `${formatFe(y)}% = FF:${formatFF(x)}`
                        }
                    },
                }}
                xAxis={invert ? efficiencyAxis : fitFactorAxis}
                yAxis={invert ? fitFactorAxis : efficiencyAxis}
                data={[
                    invert ? fitFactorFn : efficiencyFn,
                    ...ranges.map((range, index) => invert ? getFfRangePlotData(range, index) : getFeRangePlotData(range, index)),
                    ...ranges.map((range) => getLabelPlot(range)),
                ]}
            />
        </div>)
}
