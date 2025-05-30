/**
 * An icon that shows a list of actions when tapped and executes the action when selected.
 * Implemented as a customized react-select component.
 */

import {PropsWithChildren} from "react";
import Select, {components, DropdownIndicatorProps} from "react-select";

export type SelectOption = { label: string, value: string }
type ActionMenuWidgetProps = {
    options: SelectOption[];
    onChange: (value: string) => void;
    value?: string;
}

export function ActionMenuWidget({options, children, onChange, value}: PropsWithChildren<ActionMenuWidgetProps>) {
    const CompactDropdownIndicator = (
        dropdownIndicatorProps: DropdownIndicatorProps<SelectOption, true>
    ) => {
        return (
            <components.DropdownIndicator {...dropdownIndicatorProps} >
                {children}
            </components.DropdownIndicator>
        );
    };

    return (<div className={"svg-container"}>
        <Select
            components={{DropdownIndicator: CompactDropdownIndicator}}
            options={options}
            value={value ? {value:value, label:value}: null}
            styles={{
                control: () => ({
                    height: "inherit",
                }),
                container: () => ({
                    aspectRatio: "1/1",
                    height: "inherit"
                }),
                valueContainer: () => ({
                    height: 0,
                    width: 0,
                    overflow: "hidden", // we want the mouse click handling to dismiss menu (can't use display:none)
                }),
                indicatorsContainer: () => ({
                    height: "inherit"
                }),
                indicatorSeparator: () => ({
                    display: "none"
                }),
                dropdownIndicator: () => ({
                    padding: 0,
                    height: "inherit",
                }),

                menu: (baseStyles) => ({
                    ...baseStyles,
                    zIndex: 10,
                    width: "max-content",
                    textAlign: "left",
                }),
            }}
            tabSelectsValue={false}
            isSearchable={false}
            onChange={(event) => {
                // @ts-expect-error somehow this is not recognized as a SingleValue when it is in fact a SingleValue
                onChange(event?.value as string)
            }}
        /></div>)
}
