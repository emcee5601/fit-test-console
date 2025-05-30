import {useSetting} from "src/use-setting.ts";
import {AppSettings} from "src/app-settings.ts";
import {enCaseInsensitiveCollator} from "src/utils.ts";
import {DebouncedInput} from "src/DebouncedInput.tsx";
import {useEffect, useRef} from "react";
import {GiCancel} from "react-icons/gi";
import {ResizingTextArea} from "src/ResizingTextArea.tsx";

export function SimpleMaskSelector({value, onChange, allowCreate = false, showClearControl = false}: {
    value?: string,
    allowCreate?: boolean,
    showClearControl?: boolean
    onChange?: (value: string) => void
}) {
    const [maskList, setMaskList] = useSetting<string[]>(AppSettings.MASK_LIST)
    const displayRef = useRef<HTMLTextAreaElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!inputRef.current) {
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
        if (!displayRef.current || !inputRef.current) {
            return
        }
        // displayRef.current.style.display = "none";
        displayRef.current.style.visibility = "hidden";
        inputRef.current.style.display = "block";
        inputRef.current?.showPicker();
        inputRef.current?.focus();
    }

    function onBlur(event: React.FocusEvent<HTMLInputElement>) {
        if (!displayRef.current || !inputRef.current) {
            return
        }
        displayRef.current.style.display = "block";
        displayRef.current.style.visibility = "visible";
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

    function handleClearButtonOnClick() {
        handleOnChange("") // clear selection
    }


    // is in effect, it could otherwise remove the row mid-edit
    return (
        <div style={{width: "100%", height: "inherit", display: "flex", flexDirection: "row", position: "relative"}}>
            <DebouncedInput
                style={{
                    fontFamily: "monospace",
                    width: "calc(100% - 4px)",
                    position: "absolute",
                    top: 0,
                    left: 0,
                }} // match the textarea default font family
                inputRef={inputRef}
                className={"simple-mask-selector selector-input"} list={"masklist"} name={"mask-list"}
                placeholder={"Click to add mask"}
                value={value || ""}
                debounce={500}
                onBlur={onBlur}
                onChange={(value) => handleOnChange(value as string)}/>
            <datalist id={"masklist"}>
                {/*using datalist means on mobile these will appear as keyboard autocompletions*/}
                {maskList.map((maskName) => <option key={maskName} value={maskName}/>)}
            </datalist>
            <ResizingTextArea className={"selector-value"}
                      textAreaRef={displayRef}
                      onFocus={onTextAreaFocus}
                      value={value}
                      style={{
                          width: "calc(100% - 4px)",
                          height: "calc(100% - 4px)",
                          borderWidth: 0,
                          resize: "none"
                      }}
                      placeholder={"Click to add mask"}
            ></ResizingTextArea>
            {showClearControl && <div className={"cancel-hover-control"} style={{
                position: "absolute",
                top: 0,
                right: 0,
                height: "100%",
                width: "fit-content",
                alignContent: "center"
            }}>
                <div className={"svg-container"} onClick={handleClearButtonOnClick}>
                    <GiCancel/>
                </div>
            </div>}
        </div>
    )

}
