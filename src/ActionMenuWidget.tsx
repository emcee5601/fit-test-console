/**
 * An icon that shows a list of actions when tapped and executes the action when selected.
 * Implemented as a customized react-select component.
 */

import {PropsWithChildren, ReactNode} from "react";
import Select, {
    CommonPropsAndClassName,
    components,
    DropdownIndicatorProps,
    GroupBase,
    MenuPlacement,
    MenuPosition
} from "react-select";
import {ErrorBoundary} from "react-error-boundary"
import IntrinsicElements = React.JSX.IntrinsicElements;

interface MenuPortalProps<Option, IsMulti extends boolean, Group extends GroupBase<Option>> extends CommonPropsAndClassName<Option, IsMulti, Group> {
    appendTo: HTMLElement | undefined;
    children: ReactNode;
    controlElement: HTMLDivElement | null;
    innerProps: IntrinsicElements['div'];
    menuPlacement: MenuPlacement;
    menuPosition: MenuPosition;
}

export type SelectOption = { label: string, value: string }
type ActionMenuWidgetProps = {
    options: SelectOption[];
    onChange: (value: string) => void;
    value?: string;
    id?: string;
}

export function ActionMenuWidget({options, children, onChange, value, id}: PropsWithChildren<ActionMenuWidgetProps>) {
    const CompactDropdownIndicator = (
        dropdownIndicatorProps: DropdownIndicatorProps<SelectOption, true>
    ) => {
        return (<div id={id} style={{width: '100%', height: '100%'}}>
                <components.DropdownIndicator {...dropdownIndicatorProps} >
                    {children}
                </components.DropdownIndicator>
            </div>
        );
    };
    const MenuPortalWithErrorBoundary = (props: MenuPortalProps<SelectOption, true, GroupBase<SelectOption>>) => {
        return (
            <ErrorBoundary fallback={<div style={{background:"red", color:"white"}}>menu is too wide to fit on screen</div>}>
                <components.MenuPortal {...props}></components.MenuPortal>
            </ErrorBoundary>
        )
    }

    // if the screen is too narrow, rendering options labels in react-select that are too long seems to crash react
    // with too many re-renders.
    return (<div className={"svg-container icon-button"}>
            <Select
                components={{DropdownIndicator: CompactDropdownIndicator, MenuPortal: MenuPortalWithErrorBoundary}}
                options={options}
                value={value ? {value: value, label: value} : null}
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
                menuPortalTarget={document.body}
                tabSelectsValue={false}
                isSearchable={false}
                onChange={(event) => {
                    // @ts-expect-error somehow this is not recognized as a SingleValue when it is in fact a SingleValue
                    onChange(event?.value as string)
                }}
            /></div>)
}
