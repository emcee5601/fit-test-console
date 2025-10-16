import {useContext, useEffect, useRef, useState} from "react";
import {AiTwotoneExperiment} from "react-icons/ai";
import {AppContext} from "src/app-context.ts";
import {DataCollectorListener} from "src/data-collector.ts";
import {ExerciseScoreBox} from "src/ExerciseScoreBox.tsx";
import {SimpleResultsDBRecord} from "src/SimpleResultsDB.ts";
import {useScoreBasedColors} from "src/use-score-based-colors.ts";
import {getEstimatedOverallScore} from "src/utils.ts";


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

    function restartFromExercise(exerciseNum: number) {
        appContext.protocolExecutor.restartFromExercise(exerciseNum);
    }

    // for testing:
    // for(let i = 1; i <=8; i++) {
    //     currentTestData[`Ex ${i}`] = i**2+0.01
    // }
    // currentTestData.Final = 123445

    const overallScoreRef = useRef<HTMLDivElement>(null);
    const overallScore = getEstimatedOverallScore(currentTestData);
    useScoreBasedColors(overallScoreRef, overallScore)
    return (
        <div style={{display:"contents"}}>
            {
                Object.entries(currentTestData)
                    .filter(([key,value]) => {
                        const v = Number(value)
                        // keep only exercises with in-bound results
                        return key.startsWith("Ex ") && isFinite(v) && v > 1.0
                    })
                    .map(([key,value]) => {
                        const exerciseNum = Number(key.substring(3))
                        return <ExerciseScoreBox key={key} label={key} score={Number(value)} onClick={() => restartFromExercise(exerciseNum)}/>
                    })
            }
            <ExerciseScoreBox label={<AiTwotoneExperiment/>} score={Number(currentTestData.Final??overallScore)}/>
        </div>
    )
}
