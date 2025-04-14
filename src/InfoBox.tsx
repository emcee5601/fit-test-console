// todo: make value take any JSX
import {HTMLAttributes} from "react";

export function InfoBox({label, ...props}: { label: string } & HTMLAttributes<HTMLSpanElement>) {
    return (
        <div className={"thin-border blue-bg"} style={{display:"flex", justifyContent:"space-between", gap:"1em"}}>
            <span>{label}</span>
            <span className={"number-field"}>{props.children}</span>
        </div>

    )
}
