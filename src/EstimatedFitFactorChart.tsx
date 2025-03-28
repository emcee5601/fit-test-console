import ReactEChartsCore from "echarts-for-react/lib/core";
import * as echarts from "echarts";
import {useContext, useEffect, useState} from "react";
import {AppContext} from "./app-context.ts";
import {DataCollectorListener} from "./data-collector.ts";
import {deepCopy} from "json-2-csv/lib/utils";
import {EChartsOption} from "echarts-for-react/src/types.ts";

export function EstimatedFitFactorChart() {
    const appContext = useContext(AppContext);
    const [chartOptions, setChartOptions] = useState<EChartsOption>(appContext.dataCollector.fitFactorEstimator.chartOptions);
    const dataCollectorListener:DataCollectorListener = {
        tick() {
            // deep copy so the chart sees an update
            setChartOptions(deepCopy(appContext.dataCollector.fitFactorEstimator.chartOptions))
        }
    }

    useEffect(() => {
        appContext.dataCollector.addListener(dataCollectorListener)
        return () => {
            appContext.dataCollector.removeListener(dataCollectorListener)}
    }, []);

    return (
            <ReactEChartsCore echarts={echarts} style={{height: "100%"}}
                              option={chartOptions}
                // notMerge={false}
                // lazyUpdate={true}
            />
    )
}
