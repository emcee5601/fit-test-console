import CreatableSelect from "react-select/creatable";
import {useSetting} from "src/use-setting.ts";
import {AppSettings} from "src/app-settings.ts";

export function MaskCreatableSelect({value, onChange}: { value?: string, onChange?: (value: string) => void }) {
    const [maskList] = useSetting<string[]>(AppSettings.MASK_LIST) // todo: store this is context

    return (
        <CreatableSelect
            name={"Mask"}
            options={maskList.map((maskName) => {
                return {
                    value: maskName,
                    label: maskName
                }
            })}
            value={value ? {value: value, label: value} : null}
            menuPortalTarget={document.body} // this fixes the menu rendering under other instances of the Select when the Select is used in table cells
            styles={{
                menu: (baseStyles) => ({
                    ...baseStyles,
                }),
                singleValue: (baseStyles) => ({
                    ...baseStyles,
                    whiteSpace: "normal", // disable truncating with ellipses
                }),
            }}
            onChange={(event) => {
                if(onChange) {
                    // todo: use SingleValue here instead of a string type for onChange parameters
                    onChange(event?.value as string)
                }
            }}
            allowCreateWhileLoading={true}
            createOptionPosition={"first"}
            isValidNewOption={(mask) => !maskList.some(value => value === mask.trim())}
            isSearchable={true}
            placeholder={"Click to add Mask"}
        />
    )
}
