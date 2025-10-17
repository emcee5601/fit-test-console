import "./OverlayPanelWidget.css"
import {MutableRefObject, PropsWithChildren, ReactNode, useId, useRef} from "react";

type Position = "top" | "bottom" | "left" | "right";
type OverlayPanelWidgetProps = {
    dismissOverlay?: MutableRefObject<CallableFunction | undefined>,
    buttonIcon?: ReactNode,
    position?: Position | Position[],
}

export function OverlayPanelWidget(props: PropsWithChildren<OverlayPanelWidgetProps>) {
    const ref = useRef<HTMLInputElement>(null);
    const checkboxId = "overlay-panel-widget-checkbox-" + useId()
    const positions: Position[] = []
    if(props.position) {
        if(Array.isArray(props.position)) {
            positions.push(...props.position)
        } else {
            positions.push(props.position)
        }
    } else {
        positions.push("left")
    }

    if (props.dismissOverlay) {
        props.dismissOverlay.current = () => {
            if (ref.current) {
                ref.current.checked = false
            }
        }
    }

    return (
        <div style={{display: "block"}}>
            <input className="overlay-panel-widget-checkbox" id={checkboxId} type="checkbox"
                   ref={ref}/>
            <label className="overlay-panel-widget-button" htmlFor={checkboxId}>{props.buttonIcon ?? "button"}</label>
            <label className="overlay-panel-widget-overlay" htmlFor={checkboxId}></label>
            <div className={`overlay-panel-widget-content ${positions.join(" ")}`}>{props.children}</div>
        </div>
    )
}
