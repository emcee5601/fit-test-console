// todo: make value take any JSX
import {HTMLAttributes, ReactNode} from "react";

export function InfoBox({label, ...props}: { label: ReactNode } & HTMLAttributes<HTMLSpanElement>) {
    return (
        <div className={"thin-border blue-bg"} style={{display:"flex", justifyContent:"space-between", gap:"1em"}}>
            {label}
            <div className={"number-field"}>{props.children}</div>
        </div>

    )
}
