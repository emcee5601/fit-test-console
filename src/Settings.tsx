import {Dispatch, SetStateAction} from "react";
import "./Settings.css"

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
        <div className={"labeled-setting"}>
            <label htmlFor={id}>{label}: </label>
            <select id={id}
                    value={value}
                    onChange={e => setValue(e.target.value)
                    }>
                {options.map(v => {
                    return Object.entries(v).map(([label, value]) => <option key={value} value={value}>{label}</option>)
                })}
            </select>
        </div>
    </>
}

