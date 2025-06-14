import {SmartTextArea} from "src/SmartTextArea.tsx";
import {useSetting} from "src/use-setting.ts";
import {AppSettings} from "src/app-settings.ts";
import {enCaseInsensitiveCollator} from "src/utils.ts";

type MaskSelectorWidgetProps = {
    value?: string,
    onChange?: (mask: string) => void,
    label?: string,
    id?:string,
    placeholder?: string,
};

export function MaskSelectorWidget(props: MaskSelectorWidgetProps) {
    const [maskList, setMaskList] = useSetting<string[]>(AppSettings.MASK_LIST)

    function updateCurrentMask(mask: string) {
        if (props.onChange) {
            props.onChange(mask);
        }

        // update the mask list
        setMaskList((prev) => {
            return [...new Set([...prev, mask])].filter((item) => item && item.trim().length > 0).toSorted(enCaseInsensitiveCollator.compare)
        })
    }

    return (
        <SmartTextArea
            id={`mask-${props.id}`}
            label={props.label}
            initialValue={props.value}
            autocompleteOptions={maskList.map((maskName) => {
                return {label: maskName, value: maskName}
            })}
            placeholder={props.placeholder || "Click to add mask"}
            onChange={(value) => updateCurrentMask(value || "")}
        ></SmartTextArea>

    )
}
