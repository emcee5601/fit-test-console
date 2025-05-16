import CreatableSelect from "react-select/creatable";
import {useSetting} from "src/use-setting.ts";
import {AppSettings} from "src/app-settings.ts";
import {enCaseInsensitiveCollator} from "src/utils.ts";

export function MaskCreatableSelect({value, onChange}: { value?: string, onChange?: (value: string) => void }) {
    const [maskList,setMaskList] = useSetting<string[]>(AppSettings.MASK_LIST)

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
            defaultInputValue={value} // this seems to only apply the first time this is displayed. need to re-mount for this to behave correctly afterwards
            menuPortalTarget={document.body} // this fixes the menu rendering under other instances of the Select when the Select is used in table cells
            menuShouldScrollIntoView={true}
            menuPlacement={"auto"}
            tabSelectsValue={false} // prevent tabbing from accidentally selecting the first item on the list
            styles={{
                menu: (baseStyles) => ({
                    ...baseStyles,
                }),
                singleValue: (baseStyles) => ({
                    ...baseStyles,
                    whiteSpace: "normal", // disable truncating with ellipses
                }),
            }}
            onBlur={(event) => {
                // needed to capture these so any entered value is preserved/created even if create isn't selected
                if(onChange && event.target.value !== "") {
                    onChange(event.target.value)
                }
            }}
            onChange={(event) => {
                if(onChange) {
                    // todo: use SingleValue here instead of a string type for onChange parameters
                    onChange(event?.value as string)
                }
            }}
            onCreateOption={(inputValue:string) => {
                if(onChange) {
                    onChange(inputValue)
                    // add the newly created mask to the list
                    setMaskList((prev) => [...prev, inputValue].toSorted(enCaseInsensitiveCollator.compare))
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
