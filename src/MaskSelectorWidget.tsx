import {SmartTextArea} from "src/SmartTextArea.tsx";
import {useSetting} from "src/use-setting.ts";
import {AppSettings} from "src/app-settings.ts";
import {enCaseInsensitiveCollator} from "src/utils.ts";
import {useCallback} from "react";

type MaskSelectorWidgetProps = {
    value?: string,
    onChange?: (mask: string) => void,
    label?: string,
    id?: string,
    placeholder?: string,
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
            label={props.label}
            initialValue={props.value}
            autocompleteOptions={getAutocompleteOptions}
            placeholder={props.placeholder || "Click to add mask"}
            onChange={(value) => updateCurrentMask(value || "")}
        ></SmartTextArea>

    )
}
