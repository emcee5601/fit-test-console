import React, {Dispatch, SetStateAction} from "react";

/**
 * This is the old implementation where we only expected boolean values
 */
export function BooleanToggleButton({trueLabel, falseLabel, value, setValue}: {
    trueLabel: string,
    falseLabel?: string,
    value: boolean,
    setValue: Dispatch<SetStateAction<boolean>>
}) {
    const id = `${trueLabel.replace(/[^\p{L}\p{N}]/ui, "")}-settings-checkbox`;  // squash unicode non-alphanum
    return (
        <div style={{display: "block"}}>
            <label className="setting-name"
                   htmlFor={id}>{value ? trueLabel : (falseLabel ? falseLabel : trueLabel)}</label>
            <label className="switch">
                {/*react doesn't like checked={value} here for some reason; thinks it's uncontrolled*/}
                <input type="checkbox" id={id} onChange={(event) => setValue(event.target.checked)} checked={value}/>
                <span className="slider round"></span>
            </label>
        </div>
    )
}


export function ToggleButton<T extends string>({trueLabel, falseLabel, value, setValue, ...props}: {
    trueLabel: T,
    falseLabel?: T,
    value: T,
    setValue: (v: T) => void,
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
    const id = `${trueLabel.replace(/[^\p{L}\p{N}]/ui, "")}-settings-checkbox`;  // squash unicode non-alphanum
    const resolvedFalseLabel: T = falseLabel ? falseLabel : trueLabel;
    const maybeDisabledClass = props.disabled?"disabled":""
    return (
        <div style={{display: "inline-flex"}}>
            <label className={`setting-name ${maybeDisabledClass}`}
                   htmlFor={id}>{value}</label>
            <label className="switch">
                {/*react doesn't like checked={value} here for some reason; thinks it's uncontrolled*/}
                <input {...props}
                       type="checkbox" id={id}
                       onChange={(event) => setValue(event.target.checked ? trueLabel : resolvedFalseLabel)}
                       checked={value === trueLabel}/>
                <span className={`slider round ${maybeDisabledClass}`} ></span>
            </label>
        </div>
    )
}
