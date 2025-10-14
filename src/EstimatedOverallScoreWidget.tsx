import {useContext, useEffect, useRef, useState} from "react";
import {AiTwotoneExperiment} from "react-icons/ai";
import {AppContext} from "src/app-context.ts";
import {DataCollectorListener} from "src/data-collector.ts";
import {InfoBox2} from "src/InfoBox2.tsx";
import {SimpleResultsDBRecord} from "src/SimpleResultsDB.ts";
import {useScoreBasedColors} from "src/use-score-based-colors.ts";
import {formatFitFactor, getEstimatedOverallScore} from "src/utils.ts";


export function EstimatedOverallScoreWidget() {
    const appContext = useContext(AppContext)
    const dataCollector = appContext.dataCollector;
    const [currentTestData, setCurrentTestData] = useState<SimpleResultsDBRecord>({} as SimpleResultsDBRecord)
    useEffect(() => {
        const dataCollectorListener: DataCollectorListener = {
            newTestStarted(data: SimpleResultsDBRecord) {
                setCurrentTestData(data)
            },
            currentTestUpdated(data: SimpleResultsDBRecord) {
                setCurrentTestData(data)
            }
        };

        dataCollector.addListener(dataCollectorListener)
        return () => {
            dataCollector.removeListener(dataCollectorListener)
        }
    }, []);

    // for(let i = 1; i <=8; i++) {
    //     currentTestData[`Ex ${i}`] = 100 + i*10
    // }
    // currentTestData.Final = 123445

    const overallScoreRef = useRef<HTMLDivElement>(null);
    const overallScore = getEstimatedOverallScore(currentTestData);
    useScoreBasedColors(overallScoreRef, overallScore)
    return (
        <div className={"inline-flex"}>
            {
                Object.entries(currentTestData)
                    .filter(([key,value]) => {
                        const v = Number(value)
                        // keep only exercises with in-bound results
                        return key.startsWith("Ex ") && isFinite(v) && v > 1.0
                    })
                    .map(([key,value]) => <InfoBox2 key={key} label={key}>{formatFitFactor(Number(value))}</InfoBox2>)
            }
            <InfoBox2 label={<AiTwotoneExperiment/>}>{formatFitFactor(currentTestData.Final??overallScore)}</InfoBox2>
        </div>
    )
}
