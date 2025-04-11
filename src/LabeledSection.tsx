import React from "react";

/**
 * Defines a section with a heading. This is implemented as a fieldset with some borders and padding removed.
 * @param props
 * @constructor
 */
export function LabeledSection({...props}: React.HTMLAttributes<HTMLFieldSetElement>) {
    return (<fieldset style={{borderBottom: "none", borderInline: "none", paddingInline: 0, minWidth:0}}>
        {props.children}
    </fieldset>)
}
