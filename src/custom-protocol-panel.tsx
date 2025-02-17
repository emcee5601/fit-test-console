import {Segment, SegmentSource, SegmentState} from "./simple-protocol.ts";
import {ProtocolExecutor} from "./protocol-executor.ts";
import {useEffect, useState} from "react";

export function CustomProtocolPanel({protocolExecutor}: { protocolExecutor: ProtocolExecutor }) {
    const [sampleSource, setSampleSource] = useState(SegmentSource.MASK)
    const [samplingState, setSamplingState] = useState(SegmentState.IDLE)
    const [sampleDuration, setSampleDuration] = useState(0)
    const [sampleTimeLeft, setSampleTimeLeft] = useState(0)
    useEffect(() => {
        const listener = {
            segmentChanged(segment: Segment) {
                setSampleSource(segment.source);
                setSamplingState(segment.state);
                setSampleDuration(segment.duration);
            },
            tick(timeLeft: number) {
                setSampleTimeLeft(timeLeft);
            },
            cancelled() {
                setSampleTimeLeft(0)
                setSamplingState(SegmentState.IDLE)
            },
            completed() {
            }
        };
        protocolExecutor.addListener(listener)
        return () => {protocolExecutor.removeListener(listener)}
    }, [protocolExecutor]);
    return (
        <section id="custom-control-panel">
            <div style={{display: "block", paddingInline:"2rem"}}>
                <input type="button" value="Start" id="start-protocol-button" onClick={() => protocolExecutor.executeProtocol()}/>
                <input type="button" value="Stop" id="stop-protocol-button" onClick={() => protocolExecutor.cancel()}/>
            </div>
            <div style={{display: "inline-block", width: "fit-content"}}>
                <span style={{display: "block"}}>Source: {sampleSource}</span>
                <span style={{display: "block"}}>State: {samplingState}</span>
                <span style={{
                    display: "inline-block",
                    width: "100%"
                }}>Duration: {sampleTimeLeft} / {sampleDuration}</span>
            </div>
        </section>
    )
}
