import {useSetting} from "src/use-setting.ts";
import {AppSettings} from "src/app-settings.ts";
import {enCaseInsensitiveCollator} from "src/utils.ts";
import {DebouncedInput} from "src/DebouncedInput.tsx";
import {useEffect, useRef} from "react";

export function SimpleMaskSelector({value, onChange, allowCreate = false}: {
    value?: string,
    allowCreate?: boolean,
    onChange?: (value: string) => void
}) {
    const [maskList, setMaskList] = useSetting<string[]>(AppSettings.MASK_LIST)
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if(!inputRef.current) {
            return
        }
        inputRef.current.style.display = "none"
    }, []);

    function updateMaskList(newValue: string) {
        if (!allowCreate) {
            return;
        }
        setMaskList((prev) => {
            return [...new Set([...prev, newValue as string])].filter((item) => item && item.trim().length > 0).toSorted(enCaseInsensitiveCollator.compare)
        })
    }

    function onTextAreaFocus() {
        if(!textAreaRef.current || !inputRef.current) {
            return
        }
        textAreaRef.current.style.display = "none";
        inputRef.current.style.display = "block";
        inputRef.current?.showPicker();
        inputRef.current?.focus();
    }

    function onBlur(event: React.FocusEvent<HTMLInputElement>) {
        if(!textAreaRef.current || !inputRef.current) {
            return
        }
        textAreaRef.current.style.display = "block";
        inputRef.current.style.display = "none";
        updateMaskList(event.target.value)
    }

    // todo: don't call onChange if editing is incomplete. so if editing, only call if onBlur. because if table filter
    function handleOnChange(value: string) {
        if (onChange) {
            onChange(value as string)
        }
        // textAreaRef.current.style.display = "block";
    }

    // is in effect, it could otherwise remove the row mid-edit
    return (
        <div style={{width: "100%", height:"inherit"}}>
            <textarea readOnly={true} value={value} onFocus={onTextAreaFocus} ref={textAreaRef}
                      style={{width: "calc(100% - 4px)", height: "calc(100% - 4px)", borderWidth: 0, resize:"none"}}
                      placeholder={"Click to add mask"}/>
            <DebouncedInput
                style={{fontFamily:"monospace", width:"calc(100% - 4px)"}} // match the textarea default font family
                inputRef={inputRef}
                className={"simple-mask-selector"} list={"masklist"} name={"mask-list"}
                placeholder={"Click to add mask"}
                value={value || ""}
                debounce={500}
                onBlur={onBlur}
                onChange={(value) => handleOnChange(value as string)}/>
            <datalist id={"masklist"}>
                {maskList.map((maskName) => <option key={maskName} value={maskName}/>)}
            </datalist>
        </div>
    )

}
