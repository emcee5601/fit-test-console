import {SmartTextArea} from "src/SmartTextArea.tsx";
import {useSetting} from "src/use-setting.ts";
import {AppSettings} from "src/app-settings.ts";
import {enCaseInsensitiveCollator} from "src/utils.ts";

type MaskSelectorWidgetProps = {
    value?: string,
    onChange?: (mask: string) => void,
    label?: string,
    id?: string,
    placeholder?: string,
};

export function MaskSelectorWidget(props: MaskSelectorWidgetProps) {
    const [dbMaskist, setDbMaskList] = useSetting<string[]>(AppSettings.MASKS_IN_DATABASE)
    const [maskList] = useSetting<string[]>(AppSettings.MASK_LIST)

    function updateCurrentMask(mask: string) {
        if (props.onChange) {
            props.onChange(mask);
        }

        // update the mask list
        setDbMaskList((prev) => {
            return [...new Set([...prev, mask])].filter((item) => item && item.trim().length > 0).toSorted(enCaseInsensitiveCollator.compare)
        })
    }

    return (
        <SmartTextArea
            id={`mask-${props.id}`}
            label={props.label}
            initialValue={props.value}
            autocompleteOptions={() => {
                return [...dbMaskist, ...maskList]
                    .toSorted(enCaseInsensitiveCollator.compare)
                    .map((maskName) => {
                        return {label: maskName, value: maskName}
                    })
            }}
            placeholder={props.placeholder || "Click to add mask"}
            onChange={(value) => updateCurrentMask(value || "")}
        ></SmartTextArea>

    )
}
