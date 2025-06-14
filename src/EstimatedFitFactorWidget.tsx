import ReactEChartsCore from "echarts-for-react/lib/core";
import * as echarts from "echarts/core";
import {EChartsOption} from "echarts-for-react/src/types.ts";
import {convertFitFactorToFiltrationEfficiency, formatFitFactor, getFitFactorCssClass} from "./utils.ts";
import {useContext, useEffect, useState} from "react";
import {AppContext} from "./app-context.ts";
import {DataCollectorListener} from "./data-collector.ts";
import {deepCopy} from "json-2-csv/lib/utils";


export function EstimatedFitFactorWidget() {
    const context = useContext(AppContext)
    const [estimatedFitFactor, setEstimatedFitFactor] = useState<number>(NaN)
    const [ambientConcentration, setAmbientConcentration] = useState<number>(0)
    const [maskConcentration, setMaskConcentration] = useState<number>(-1) // -1 means unknown
    const initialEstimatedFitFactorGaugeOptions: EChartsOption = {
        series: [
            {
                type: 'gauge',
                radius: '100%',
                min: 0,
                max: 200,
                detail: {
                    valueAnimation: true,
                    formatter: formatFitFactor,
                    color: 'inherit'
                },
                axisLabel: {
                    color: 'inherit',
                    distance: 10,
                },
                axisLine: {
                    lineStyle: {
                        width: 6,
                        color: [
                            [0.0999, 'darkred'],
                            [0.4999, 'darkorange'],
                            [1, 'green'],
                        ]
                    }
                },
                axisTick: {
                    show: false,
                    length: 2,
                    lineStyle: {
                        color: 'inherit',
                        width: 2
                    }
                },
                splitLine: {
                    distance: 0,
                    length: 5,
                    lineStyle: {
                        color: 'inherit',
                        width: 1
                    },
                },
                pointer: {
                    itemStyle: {
                        color: 'inherit',
                    }
                },
                data: [
                    {value: 88},
                ],
            }
        ]
    };
    const [gaugeOptions, setGaugeOptions] = useState(initialEstimatedFitFactorGaugeOptions)
    useEffect(() => {
        const dataCollectorListener: DataCollectorListener = {
            estimatedFitFactorChanged(estimate: number) {
                gaugeOptions.series[0].data[0].value = formatFitFactor(estimate)
                const newGaugeOptions = deepCopy(gaugeOptions)
                setGaugeOptions(newGaugeOptions)
                setEstimatedFitFactor(estimate)
            },
            estimatedAmbientConcentrationChanged(estimate: number) {
                setAmbientConcentration(estimate)
            },
            estimatedMaskConcentrationChanged(estimate: number) {
                setMaskConcentration(estimate)
            }
        }
        context.dataCollector.addListener(dataCollectorListener)
        return () => {
            context.dataCollector.removeListener(dataCollectorListener)
        }
    }, []);


    return (
        <div style={{aspectRatio: 1, height: "auto", marginTop: "1rem"}}>
            <fieldset id="estimated-ff-panel"
                      style={{display: "inline-block", float: "left", height: "max-content"}}>
                <legend>Estimated Fit Factor</legend>
                <div style={{width: "100%", display: "inline-flex"}}>
                    <fieldset style={{display: "inline-block", float: "inline-start"}}>
                        <legend>Ambient</legend>
                        <span>{Number(ambientConcentration).toFixed(0)}</span>
                    </fieldset>
                    <fieldset style={{display: "inline-block", float: "inline-start"}}>
                        <legend>Mask</legend>
                        <span>{maskConcentration < 0 ? "?" : Number(maskConcentration).toFixed(maskConcentration < 10 ? 1 : 0)}</span>
                    </fieldset>
                </div>
                <div className={getFitFactorCssClass(estimatedFitFactor, true)}
                     style={{
                         boxSizing: "border-box",
                         width: '100%',
                         height: 'max-content',
                         alignContent: 'center',
                         fontSize: "1.7rem",
                     }}>
                    <span>{Number(estimatedFitFactor).toFixed(estimatedFitFactor < 10 ? 1 : 0)}</span>
                    <br/>
                    <span
                        style={{fontSize: "smaller"}}>({convertFitFactorToFiltrationEfficiency(estimatedFitFactor)}%)</span>
                </div>
                <ReactEChartsCore echarts={echarts} option={gaugeOptions}/>
            </fieldset>
        </div>
    )
}
