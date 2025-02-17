import {Dispatch, SetStateAction} from "react";
import "./Settings.css"

export function ToggleButton({trueLabel, falseLabel, value, setValue}:{ trueLabel:string, falseLabel?: string, value: boolean, setValue: Dispatch<SetStateAction<boolean>>}){
    const id = `${trueLabel.replace(/[^\p{L}\p{N}]/ui, "")}-settings-checkbox`;  // squash unicode non-alphanum
    return(
        <div style={{display: "block"}}>
            <label className="setting-name" htmlFor={id}>{value ? trueLabel : (falseLabel?falseLabel:trueLabel)}</label>
            <label className="switch">
                {/*react doesn't like checked={value} here for some reason; thinks it's uncontrolled*/}
                <input type="checkbox" id={id} onChange={(event) => setValue(event.target.checked)} checked={value}/>
                <span className="slider round"></span>
            </label>
        </div>
    )
}

export function SettingsCheckbox({label, value, setValue}: {
    label: string,
    value: boolean
    setValue: Dispatch<SetStateAction<boolean>>,
}) {
    const id = `${label.replace(/[^\p{L}\p{N}]/ui, "")}-settings-checkbox`;  // squash unicode non-alphanum

    return <>
        <div style={{display: "inline-block"}}>
            <input type="checkbox" id={id}
                   checked={value}
                   onChange={e => setValue(e.target.checked)
                   }/>
            <label htmlFor={id}>{label}</label>
        </div>
    </>
}

type ValueLabelMap = { [value: string]: string }

export function SettingsSelect({label, value, setValue, options}: {
    label: string,
    value: string
    setValue: Dispatch<SetStateAction<string>>,
    options: ValueLabelMap[]
}) {
    const id = `${label.replace(/[^\p{L}\p{N}]/ui, "")}-settings-select`;  // squash unicode non-alphanum

    return <>
        <div style={{display: "block"}}>
            <label htmlFor={id}>{label}: </label>
            <select id={id}
                    value={value}
                    onChange={e => setValue(e.target.value)
                    }>
                {options.map(v => {
                    return Object.entries(v).map(([label, value]) => <option key={value} value={value}>{label}</option>)
                })}
            </select>
            &nbsp;&nbsp;
        </div>
    </>
}

