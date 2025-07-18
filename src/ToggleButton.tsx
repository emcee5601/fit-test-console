import React, {Dispatch, SetStateAction} from "react";
import {useSetting} from "./use-setting.ts";
import {AppSettings} from "src/app-settings-types.ts";

/**
 * Toggle button tied to a setting.
 * @param trueLabel
 * @param falseLabel
 * @param setting
 * @constructor
 */
export function BooleanSettingToggleButton({trueLabel, falseLabel, setting}: {
    trueLabel?: string,
    falseLabel?: string,
    setting: AppSettings
}) {
    const [settingValue, setSettingValue] = useSetting<boolean>(setting)

    function convertSettingToLabel(setting: AppSettings) {
        return setting.toString().replace(/^(.)/, (_substring, groups) => {
            return `${groups[0].toUpperCase()}`
        }).replace(/(-(.))/g, (_substring, groups) => {
            return ` ${groups[1].toUpperCase()}`
        });
    }

    const resolvedTrueLabel = trueLabel ?? convertSettingToLabel(setting)
    const id = `${resolvedTrueLabel.replace(/[^\p{L}\p{N}]/ui, "")}-settings-checkbox`;  // squash unicode non-alphanum
    return (
        <div className={"labeled-setting"}>
            <label className="setting-name"
                   htmlFor={id}>{settingValue ? resolvedTrueLabel : (falseLabel ? falseLabel : resolvedTrueLabel)}</label>
            <label className="switch">
                {/*react doesn't like checked={value} here for some reason; thinks it's uncontrolled*/}
                <input type="checkbox" id={id} onChange={(event) => setSettingValue(event.target.checked)}
                       checked={settingValue}/>
                <span className="slider round"></span>
            </label>
        </div>
    )
}

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
        <div className={"labeled-setting"}>
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


/**
 * Toggle button with custom text.
 * @param trueLabel the text to show when the button is checked
 * @param falseLabel the text to show when the button is unchecked, defaults to trueLabel if not specified.
 * @param trueValue when the value of this button matches @trueValue, the button is considered checked. defaults to
 *     @trueLabel
 * @param value the underlying value being converted to a toggle value. when this matches @trueValue, the button is
 *     considered checked.
 * @param setValue
 * @param props
 * @constructor
 */
export function ToggleButton<T extends string, V extends string | boolean>({
    trueLabel,
    falseLabel,
    trueValue,
    value,
    setValue,
    ...props
}: {
    trueLabel: T,
    falseLabel?: T,
    trueValue?: V,
    value: T,
    setValue: (v: T) => void,
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
    const id = `${trueLabel.replace(/[^\p{L}\p{N}]/ui, "")}-settings-checkbox`;  // squash unicode non-alphanum
    const resolvedFalseLabel: T = falseLabel ?? trueLabel;
    const resolvedTrueValue = trueValue ?? trueLabel;
    const maybeDisabledClass = props.disabled ? "disabled" : ""
    return (
        <div style={{display: "inline-flex"}}>
            <label className={`setting-name ${maybeDisabledClass}`}
                   htmlFor={id}>{value}</label>
            <label className="switch">
                {/*react doesn't like checked={value} here for some reason; thinks it's uncontrolled*/}
                <input {...props}
                       type="checkbox" id={id}
                       onChange={(event) => setValue(event.target.checked ? trueLabel : resolvedFalseLabel)}
                       checked={value === resolvedTrueValue}/>
                <span className={`slider round ${maybeDisabledClass}`}></span>
            </label>
        </div>
    )
}
