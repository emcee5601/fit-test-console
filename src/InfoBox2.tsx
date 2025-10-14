import {HTMLAttributes, ReactNode} from "react";
import "./InfoBox2.css"

export function InfoBox2({label, ...props}: { label: ReactNode } & HTMLAttributes<HTMLSpanElement>) {
    return (
        <fieldset className={"infobox2"}>
            <legend>{label}</legend>
            {props.children}
        </fieldset>

    )
}
