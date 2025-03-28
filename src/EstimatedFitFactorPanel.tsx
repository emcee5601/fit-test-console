import {EstimatedFitFactorWidget} from "./EstimatedFitFactorWidget.tsx";
import {EstimatedFitFactorChart} from "./EstimatedFitFactorChart.tsx";

export function EstimatedFitFactorPanel() {
    return (
        <div id="estimated-ff-and-chart-panel"
             style={{
                 display: "inline-flex",
                 width: "100%",
                 float: "left",
                 height: "fit-content"
             }}>
            <EstimatedFitFactorWidget/>
            <div style={{display: "inline-block", flexGrow: 1}}>
                <EstimatedFitFactorChart/>
            </div>
        </div>
    )
}
