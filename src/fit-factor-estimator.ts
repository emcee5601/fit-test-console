import MovingAverage from "moving-average";
import {EChartsOption} from "echarts-for-react/src/types.ts";
import {formatFitFactor} from "./utils.ts";
import {deepCopy} from "json-2-csv/lib/utils";
import {DataCollector} from "./data-collector.ts";
import {
    EstimatedAmbientConcentrationChangedEvent,
    EstimatedFitFactorChangedEvent,
    EstimatedMaskConcentrationChangedEvent, TickEvent
} from "./data-collector-events.ts";

const FIVE_SECONDS_IN_MS: number = 5 * 1000;
const TWENTY_SECONDS_IN_MS: number = 20 * 1000;

enum SampleZone {
    MASK = "mask",
    AMBIENT = "ambient",
    UNKNOWN = "unknown",
    DON_DOFF = "purge",
}

/**
 * timestamp, concentration, estimated fit factor, guessed ambient level, EMA concentration, stddev
 */
type TimeseriesEntry = {
    // only timestamp and concentration are measured. everything else is derived from these.
    timestamp: Date, // timestamp from the clock
    concentration: number, // the particle count concentration reading from the device
    emaConcentration: number | undefined, // exponential moving average of the concentration
    emaConcentrationStdDev: number | undefined, // std dev
    guestimatedAmbient: number | undefined, // based on ema concentration and stddev, try to guess the ambient level
    sampleZone: SampleZone, // based on guestimatedAmbient, etc, classify which zone we're in (ambient, mask, unknown)
    emaConcentrationInZone: number | undefined, // based on guestimatedAmbient, only using data points in current zone
    estimatedFitFactor: number | undefined, // based on emaConcentrationInZone and guestimatedAmbient
    estimatedFitFactorBand: number | undefined, // +/- band calculated from applying stddev to emaConcentrationInZone
    estimatedFitFactorBandLower: number | undefined,
    zoneFF: number | undefined,
};

const timeSeriesEntryDerivedFields = {
    emaConcentration: undefined,
    emaConcentrationStdDev: undefined,
    guestimatedAmbient: undefined,
    sampleZone: SampleZone.UNKNOWN,
    emaConcentrationInZone: undefined,
    estimatedFitFactor: undefined,
    estimatedFitFactorBand: undefined,
    estimatedFitFactorBandLower: undefined,
    zoneFF: undefined,
}

export class FitFactorEstimator {
    private guestimatedAmbientConcentration: number = 0;
    // exponential moving average of the concentration
    private maCount5s: MovingAverage = MovingAverage(FIVE_SECONDS_IN_MS);
    private maZoneConcentration20s: MovingAverage = MovingAverage(TWENTY_SECONDS_IN_MS); // TODO: use arithmetic average within the zone so all particles count the same?
    private nextChartUpdateTime: number = 0; // next time (epoch time) that we should update the chart
    private _chartOptions: EChartsOption;
    private _fullConcentrationHistory: TimeseriesEntry[] = [];
    private dataCollector: DataCollector;

    constructor(dataCollector: DataCollector) {
        this.dataCollector = dataCollector
    }

    get chartOptions(): EChartsOption {
        return this._chartOptions;
    }

    set chartOptions(options) {
        this._chartOptions = options;
    }

    get fullConcentrationHistory(): TimeseriesEntry[] {
        return this._fullConcentrationHistory;
    }

    set fullConcentrationHistory(value: TimeseriesEntry[]) {
        this._fullConcentrationHistory = value;
    }

    resetChart() {
        this.fullConcentrationHistory = [];
        this.guestimatedAmbientConcentration = 0;
        this.maCount5s = MovingAverage(FIVE_SECONDS_IN_MS);
        this.maZoneConcentration20s = MovingAverage(TWENTY_SECONDS_IN_MS);
        this.nextChartUpdateTime = 0;
        const initialChartOptions: EChartsOption = {
            axisPointer: {
                link: [
                    {
                        xAxisIndex: 'all'
                    }
                ],
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                },
                valueFormatter: formatFitFactor,
                position: function (pos: Array<number>, _params: object | Array<object>, _el: HTMLElement, _elRect: object, size: {
                    contentSize: number[],
                    viewSize: number[]
                }) {
                    // place tooltip on edges, moving it out of the way when cursor is near
                    if (pos[0] < size.viewSize[0] / 2) {
                        return {bottom: 10, right: 30}
                    } else {
                        return {bottom: 10, left: 30}
                    }
                }
            },
            grid: [
                {
                    top: '10%',
                    left: '4%',
                    right: '3%',
                    bottom: '55%',
                    containLabel: true
                },
                {
                    top: '60%',
                    left: '4%',
                    right: '3%',
                    containLabel: true
                },
            ],
            xAxis: [
                {
                    type: 'time',
                    gridIndex: 0,
                },
                {
                    type: 'time',
                    gridIndex: 1,
                },
            ],
            yAxis: [
                {
                    name: 'concentration',
                    position: 'left',
                    type: 'value',
                    gridIndex: 0,
                    splitLine: {
                        show: true,
                    },
                    minorSplitLine: {
                        show: true,
                    }
                },
                {
                    name: 'estimated fit factor',
                    position: 'left',
                    type: 'value',
                    gridIndex: 1,
                },
            ],
            dataZoom: [
                {
                    id: 'dataZoomX',
                    type: 'slider',
                    xAxisIndex: [0, 1],
                    filterMode: 'filter',   // Set as 'filter' so that the modification
                                            // of window of xAxis will effect the
                                            // window of yAxis.
                },
                {
                    id: 'dataZoomY0',
                    type: 'slider',
                    yAxisIndex: [0],
                    filterMode: 'empty',
                },
                {
                    id: 'dataZoomY1',
                    type: 'slider',
                    yAxisIndex: [1],
                    filterMode: 'empty',
                }
            ],
            series: [
                {
                    name: 'concentration',
                    type: 'line',
                    encode: {
                        x: ['timestamp'],
                        y: ['concentration'],
                    },
                    yAxisIndex: 0,
                    xAxisIndex: 0,
                    lineStyle: {
                        type: "dotted",
                        width: 3,
                        opacity: 0, // hide
                    },
                    markArea: {
                        data: []
                    }
                },
                {
                    name: 'guestimated ambient level',
                    type: 'line',
                    encode: {
                        x: ['timestamp'],
                        y: ['guestimatedAmbient'],
                    },
                    yAxisIndex: 0,
                    xAxisIndex: 0,
                    lineStyle: {
                        color: "gray",
                        width: 3,
                    },
                    itemStyle: {
                        color: "gray",
                    },
                    showSymbol: false, // hides the point until mouseover
                },
                {
                    name: 'EMA concentration',
                    type: 'line',
                    encode: {
                        x: ['timestamp'],
                        y: ['emaConcentration'],
                    },
                    yAxisIndex: 0,
                    xAxisIndex: 0,
                    lineStyle: {
                        color: "blue",
                        width: 3,
                    },
                    itemStyle: {
                        color: "blue",
                    },
                    showSymbol: false, // hides the point until mouseover
                },
                {
                    name: 'EMA concentration in zone',
                    type: 'line',
                    encode: {
                        x: ['timestamp'],
                        y: ['emaConcentrationInZone'],
                    },
                    yAxisIndex: 0,
                    xAxisIndex: 0,
                    lineStyle: {
                        color: "blue",
                        width: 1,
                    },
                    itemStyle: {
                        color: "blue",
                    },
                    showSymbol: false, // hides the point until mouseover
                },
                {
                    name: 'Zone FF',
                    type: 'line',
                    encode: {
                        x: ['timestamp'],
                        y: ['zoneFF'],
                    },
                    yAxisIndex: 1,
                    xAxisIndex: 1,
                    lineStyle: {
                        width: 1,
                    },
                    itemStyle: {
                        opacity: 0, // hidden
                    },
                    showSymbol: false, // hides the point until mouseover
                },
            ],
        };
        this.chartOptions = initialChartOptions
    }

    /**
     * Assume mask and ambient concentration values will be at least 1 order of magnitude apart (ie. ambient will be at least 10x mask).
     * Assume ambient will be more stable than mask when well above zero.
     * Assume purge times 4-5 seconds. During this time concentration will sharply rise or fall.
     * Given this new concentration number, maybe update the auto-detected ambient value.
     * Ambient values are assumed to be higher than mask values. We'll assume that ambient numbers are also reasonably
     * stable.  So after 4 seconds or so of stable high values, we'll update the auto-detected ambient value.
     *
     * Margin of error at 95% confidence level is approximately 1/sqrt(sample_size).
     * Sample size here is particle count.
     * Need to understand this calculation more: https://www.qualtrics.com/experience-management/research/margin-of-error/
     *
     * @param concentration
     */
    processConcentration(concentration: number, timestamp: Date = new Date()) {
        if (isNaN(concentration)) {
            // try to avoid problems
            return;
        }
        // todo: consider moving median, see https://en.wikipedia.org/wiki/Moving_average#Moving_median
        const msSinceEpoch = timestamp.getTime();
        const prevRecord = this.fullConcentrationHistory.length > 0 ? this.fullConcentrationHistory[this.fullConcentrationHistory.length - 1] : undefined;
        let sampleZone: SampleZone;

        /**
         * todo: revisit this
         * Assumptions:
         * - Ambient levels are relatively stable. Assume stddev is within 10% of moving average
         * - Mask levels are at most half of ambient. ie. FF of at least 2.
         * - Whenever stddev is within 10% of moving average, and we're above 50% of previous ambient guess, update the ambient guess.
         * - Assume we're fully in the mask when concentration is within 50% of moving average concentration AND we're below 50% of ambient.
         * - Assume we're in the mask when stddev is > 10% of moving average concentration?
         */
        if (!this.guestimatedAmbientConcentration) {
            // we don't have an estimate yet.
            sampleZone = SampleZone.AMBIENT
        } else if (concentration > this.guestimatedAmbientConcentration) {
            // found a higher moving average, must be a new ambient
            sampleZone = SampleZone.AMBIENT
        } else if (this.maCount5s.movingAverage() < 0.5 * this.guestimatedAmbientConcentration) {
            // average count is less than half of ambient guess. probably mask
            if (prevRecord?.sampleZone !== SampleZone.MASK
                && this.maCount5s.deviation() > 1.5 * this.maCount5s.movingAverage()) {
                // TODO: re-evaluate this
                // if we're not in stable mask zone yet, and concentration is fluctuating too much, probably donning / doffing
                sampleZone = SampleZone.DON_DOFF;
            } else {
                sampleZone = SampleZone.MASK;
            }
        } else if (this.maCount5s.deviation() < 0.3 * this.guestimatedAmbientConcentration) {
            // stddev is "near" guestimate, assume we're still in ambient
            sampleZone = SampleZone.AMBIENT
        } else {
            sampleZone = SampleZone.UNKNOWN;
        }

        if (sampleZone === SampleZone.AMBIENT) {
            // if we're in the ambient zone, update the ambient guess
            this.guestimatedAmbientConcentration = this.maCount5s.movingAverage();
        }


        let zoneFF: number = NaN;
        // backfill to the beginning of the zone if we're in the mask zone
        if (prevRecord && prevRecord.sampleZone === SampleZone.MASK) {
            // todo: figure out how to determine purge zones. maybe look for first and last data points within stddev of the data in the zone?
            // or first leftmost/rightmost datapoint outside of stddev moving from midpoint? must be within 10% of the end?

            // if the previous zone was a mask zone, go back and fill in the FF data based on the full zone
            let concentrationSum = 0;
            // TODO: calculate purge segments. remove some leading and trailing data points within the zone
            let ii = this.fullConcentrationHistory.length - 1;
            let numRecords = 0;
            for (; ii >= 0 && this.fullConcentrationHistory[ii].sampleZone === SampleZone.MASK; ii--) {
                if (this.fullConcentrationHistory.length - ii > 5) {
                    // skip the last 5 data points (seconds)
                    concentrationSum += this.fullConcentrationHistory[ii].concentration;
                    numRecords++;
                }
            }
            // trim 5 data points from the front
            // for(let kk = 0; kk < 5; kk++ ) {
            //     concentrationSum -= this.fullConcentrationHistory[ii].concentration;
            //     ii++;
            // }
            if (concentrationSum) {
                zoneFF = numRecords * this.guestimatedAmbientConcentration / concentrationSum;
                // for( ; ii < this.fullConcentrationHistory.length; ii++) {
                //     this.fullConcentrationHistory[ii].zoneFF = zoneFF;
                // }
                if (prevRecord) {
                    prevRecord.zoneFF = zoneFF;
                }
            }
        }
        this.dataCollector.dispatch(new EstimatedFitFactorChangedEvent(zoneFF))

        // update values
        this.dataCollector.dispatch(new EstimatedAmbientConcentrationChangedEvent(this.guestimatedAmbientConcentration))
        if (sampleZone === SampleZone.MASK) {
            this.dataCollector.dispatch(new EstimatedMaskConcentrationChangedEvent(concentration))
            // we're not in the mask, so there's no data to record for the mask.
            // this.maEstimatedFF.push(msSinceEpoch, 1)

        } else {
            // we're not in the mask, so there's no data to record for the mask.
            this.dataCollector.dispatch(new EstimatedMaskConcentrationChangedEvent(-1))
        }

        // update the chart
        const record: TimeseriesEntry = {
            ...timeSeriesEntryDerivedFields,
            timestamp: timestamp,
            concentration: concentration,
            guestimatedAmbient: this.guestimatedAmbientConcentration,
            emaConcentration: this.maCount5s.movingAverage(),
            emaConcentrationStdDev: this.maCount5s.deviation(),
            sampleZone: sampleZone,
            zoneFF: zoneFF,
        };


        if (sampleZone === SampleZone.MASK) {
            if (prevRecord && prevRecord.sampleZone === sampleZone) {
                // have previous records (and we're in the same zone type)
                record.emaConcentrationInZone = this.maZoneConcentration20s.movingAverage();
                // cap stddev at some value
                const emaZoneConcentrationStdDev = Math.min(0.3 * record.emaConcentrationInZone, this.maZoneConcentration20s.deviation());
                const guestimatedAmbient = record.guestimatedAmbient || 0;
                record.estimatedFitFactor = guestimatedAmbient / record.emaConcentrationInZone;
                record.estimatedFitFactorBand = (guestimatedAmbient / (record.emaConcentrationInZone - emaZoneConcentrationStdDev)) - (guestimatedAmbient / (record.emaConcentrationInZone + emaZoneConcentrationStdDev))
                record.estimatedFitFactorBandLower = guestimatedAmbient / (record.emaConcentrationInZone + emaZoneConcentrationStdDev);

            } else {
                // first record in the zone. no data is fine.
                this.maZoneConcentration20s = MovingAverage(TWENTY_SECONDS_IN_MS); // reset
            }
        }
        // append after we look backwards through history
        this.fullConcentrationHistory.push(record);

        // update moving averages after we've taken their snapshot
        this.maCount5s.push(msSinceEpoch, concentration);
        this.maZoneConcentration20s.push(msSinceEpoch, concentration);

        // TODO: try to merge in new data instead of rebuilding it every time data point? esp for simulator data
        this.chartOptions.dataset = {
            dimensions: [
                'timestamp',
                'concentration',
                'guestimatedAmbient',
                'emaConcentration',
                'emaConcentrationStdDev',
                'sampleZone',
                'emaConcentrationInZone',
                'estimatedFitFactor',
                'estimatedFitFactorBand',
                'estimatedFitFactorBandLower',
                'zoneFF'
            ],

            source: this.fullConcentrationHistory
        }

        // need to manually calculate min and max for log scale when using line charts https://github.com/apache/echarts/issues/19818
        this.chartOptions.yAxis[0].type = 'log'
        this.chartOptions.yAxis[0].min = Math.min(...this.chartOptions.dataset.source.map((v: TimeseriesEntry) => v.concentration));
        this.chartOptions.yAxis[0].max = Math.max(...this.chartOptions.dataset.source.map((v: TimeseriesEntry) => v.concentration));

        this.chartOptions.yAxis[1].type = 'value'
        // this.chartOptions.yAxis[1].min = Math.min(...this.chartOptions.series[1].data.map(v => v[1]));
        // this.chartOptions.yAxis[1].max = Math.max(...this.chartOptions.series[1].data.map(v => v[1]));

        // update the zoom window
        this.chartOptions.dataZoom[0].endValue = record.timestamp
        this.chartOptions.dataZoom[0].startValue = record.timestamp.getTime() - 15 * 60 * 1000; // 15 minutes back


        if (this.guestimatedAmbientConcentration > 0) {
            // only map visually if we have an ambient candidate

            const concentrationVisualMapConfig = {
                type: "piecewise",
                show: false,
                seriesIndex: [0], // placeholder
                dimension: '', // placeholder
                pieces: [
                    {
                        // note: these ranges must be closed, eg. both upper and lower bounds must be specified
                        gte: 100,
                        lt: 100000,
                        color: 'green',
                    },
                    {
                        gte: 20,
                        lt: 100,
                        color: 'darkorange',
                    },
                    {
                        gte: 0,
                        lt: 20,
                        color: 'darkred',
                    },
                ],
                outOfRange: {
                    color: '#999'
                }
            };
            const estimatedFF = deepCopy(concentrationVisualMapConfig);
            estimatedFF.dimension = 'estimatedFitFactor';
            estimatedFF.seriesIndex = this.chartOptions.series.findIndex((series: {
                name: string
            }) => series.name === "estimated fit factor");
            const zoneFF = deepCopy(concentrationVisualMapConfig);
            zoneFF.dimension = 'zoneFF';
            zoneFF.seriesIndex = this.chartOptions.series.findIndex((series: {
                name: string
            }) => series.name === "Zone FF");

            this.chartOptions.visualMap = [
                estimatedFF,
                zoneFF,
            ]
        }

        this.updateMarkArea(this.chartOptions, record);

        // todo use a ref to get access to the underlying echart and call setOptions on it directly with only data
        if (Date.now() > this.nextChartUpdateTime) {
            // simple debounce
            this.nextChartUpdateTime = Date.now() + 1000; // 1 second later
            this.dataCollector.dispatch(new TickEvent())
        }
    }

    updateMarkArea(chartOptions: EChartsOption, datum: TimeseriesEntry) {
        const datumAreaName = datum.sampleZone
        const markAreaData = chartOptions.series[0].markArea.data
        const [start, end] = markAreaData.length > 0 ? markAreaData[markAreaData.length - 1] : [{}, {}]
        if (start.name === datumAreaName) {
            // still in the same block, extend it
            end.xAxis = datum.timestamp
        } else {
            // changed, or new. create new area
            const newArea = [
                {
                    xAxis: datum.timestamp,
                    name: datumAreaName,
                    itemStyle: {
                        color: (datum.sampleZone === SampleZone.MASK)
                            ? "wheat"
                            : (datum.sampleZone === SampleZone.AMBIENT)
                                ? "powderblue"
                                : "black",
                        opacity: 0.2,
                    }
                },
                {
                    xAxis: datum.timestamp
                },
            ];
            markAreaData.push(newArea)
        }
    }

}
