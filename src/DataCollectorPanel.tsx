import React, {useContext, useEffect, useState} from "react";
import {AppContext} from "./app-context.ts";
import {DataCollectorListener} from "./data-collector.ts";

export function DataCollectorPanel() {
    const [rawConsoleData, setRawConsoleData] = useState<string>("")
    const rawConsoleDataTextAreaRef = React.useRef<HTMLTextAreaElement>(null)
    const [logData, setLogData] = useState<string>("")
    const logDataTextAreaRef = React.useRef<HTMLTextAreaElement>(null)
    const [processedData, setProcessedData] = useState<string>("")
    const processedDataTextAreaRef = React.useRef<HTMLTextAreaElement>(null)
    const context = useContext(AppContext)


    useEffect(() => {
        // initial values
        setRawConsoleData(() => context.dataCollector.rawLines)
        // scrollToBottom(rawConsoleDataTextAreaRef)
        setLogData(context.dataCollector.logLines)
        // scrollToBottom(logDataTextAreaRef)
        setProcessedData(context.dataCollector.processedData);
        // scrollToBottom(processedDataTextAreaRef)

        const dataCollectorListener: DataCollectorListener = {
            logRawLine() {
                setRawConsoleData(() => context.dataCollector.rawLines)
                // scrollToBottom(rawConsoleDataTextAreaRef)
            },
            logMessage(message: string) {
                setLogData((prev) => prev + message)
                // scrollToBottom(logDataTextAreaRef)
            },
            logProcessedData(data: string) {
                const timestamp = new Date().toISOString(); // todo: want the timestamp to match up, so need to get it externally
                setProcessedData((prev) => prev + `${timestamp} ${data}`);
                // scrollToBottom(processedDataTextAreaRef)
            },
        }

        context.dataCollector.addListener(dataCollectorListener)
        return () => {
            context.dataCollector.removeListener(dataCollectorListener)
        }
    }, []);

    return (
        <div style={{display:"flex", flexDirection:"column", height: "100%"}}>
            <section style={{width: "100%", display: "flex", flexGrow:1}}>
                <fieldset style={{flexGrow: 1}}>
                    <legend>Raw Data</legend>
                    <textarea id="raw-data" ref={rawConsoleDataTextAreaRef} readOnly
                              style={{width: "100%", height: "100%", border: "none", resize: "vertical"}}
                              tabIndex={1000}
                              value={rawConsoleData}/>
                </fieldset>
                <fieldset style={{flexGrow: 1}}>
                    <legend>Processed Data</legend>
                    <textarea id="interpreted-data" ref={processedDataTextAreaRef} readOnly
                              style={{width: "100%", height: "100%", border: "none", resize: "vertical"}}
                              tabIndex={1001}
                              value={processedData}/>
                </fieldset>
            </section>
            <section style={{width: "100%", flexGrow: 1, display:"flex"}}>
                <fieldset style={{flexGrow: 1}}>
                    <legend>Log</legend>
                    <textarea id="log-text-area" ref={logDataTextAreaRef} readOnly
                              style={{width: "100%", height: "100%", border: "none", resize: "vertical"}}
                              tabIndex={1002}
                              value={logData}
                    />
                </fieldset>
            </section>
        </div>
    )
}
