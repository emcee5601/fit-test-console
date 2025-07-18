import {SmartTextArea} from "src/SmartTextArea.tsx";
import {useSetting} from "src/use-setting.ts";
import {enCaseInsensitiveCollator} from "src/utils.ts";
import {ReactElement, useCallback} from "react";
import {AppSettings} from "src/app-settings-types.ts";

type MaskSelectorWidgetProps = {
    value?: string,
    onChange?: (mask: string) => void,
    label?: string | ReactElement,
    id?: string,
    placeholder?: string,
    className?: string,
};

export function MaskSelectorWidget(props: MaskSelectorWidgetProps) {
    const [maskList] = useSetting<string[]>(AppSettings.COMBINED_MASK_LIST)

    function updateCurrentMask(mask: string) {
        if (props.onChange) {
            props.onChange(mask);
        }
    }

    const getAutocompleteOptions = useCallback(() => {
        return maskList
            .toSorted(enCaseInsensitiveCollator.compare)
            .map((maskName) => {
                return {label: maskName, value: maskName}
            })
    }, [maskList])

    return (
        <SmartTextArea
            id={`mask-${props.id}`}
            className={props.className}
            onChangeOnlyOnBlur={true}
            label={props.label}
            initialValue={props.value}
            autocompleteOptions={getAutocompleteOptions}
            placeholder={props.placeholder || "Click to add mask"}
            onChange={(value) => updateCurrentMask(value || "")}
        ></SmartTextArea>

    )
}
