import React, {HTMLAttributes, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {createPortal} from "react-dom";
import "./SmartTextArea.css";
import {BsXCircleFill} from "react-icons/bs";

type Option = { label: string, value: string }
type SmartTextAreaProps = {
    initialValue?: string,
    label?: string,
    placeholder?: string,
    onChange?: (value: string | undefined) => void,
    debounce?: boolean,
    debounceDelay?: number,
    resize?: boolean,
    autocompleteOptions?: Option[] | (() => Option[]),
    id?: string,
    oneLine?: boolean,
    scrollable?: boolean,
}

/**
 * A wrapped textarea that can resize itself to fit its content, debounce input, offer auto-completions.
 * @param onChange
 * @param textAreaRef
 * @param initialValue
 * @param placeholder
 * @param props
 * @constructor
 *
 * todo:
 * - option to confirm changes before calling onChange - useful for filtered data so partial updates don't get saved
 *     and fall off the filter
 * - control to show all options regardless of autocompletion (toggle?)
 * - control to clear the current value
 */
export function SmartTextArea({
    debounce = true,
    debounceDelay = 500, // milliseconds
    resize = true,
    onChange,
    initialValue,
    label,
    placeholder,
    autocompleteOptions = [],
    id,
    oneLine = false,
    scrollable = false,
}: SmartTextAreaProps & Omit<HTMLAttributes<HTMLTextAreaElement>, 'onChange' | 'value' | 'style'>) {
    const [value, setValue] = React.useState(initialValue)
    const labelRef = useRef<HTMLLabelElement>(null);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const [hoverOptionIndex, setHoverOptionIndex] = useState<number | null>(null)
    // const [availableCompletions, setAvailableCompletions] = useState<Option[]>([])
    const [autocompleteVisible, setAutocompleteVisible] = useState<boolean>(false)
    const [allowMouseFocus, setAllowMouseFocus] = useState<boolean>(true)
    const [enableFiltering, setEnableFiltering] = useState<boolean>(true)
    const [numAutocompletionOptions, setNumAutocompletionOptions] = useState<number>(0)
    const autocompleteOptionsDivRef = useRef<HTMLDivElement>(null)
    const availableCompletions = useMemo(() => {
        const opts = Array.isArray(autocompleteOptions) ? autocompleteOptions : autocompleteOptions()
        const cleanedValue = (value ?? "").trim();
        if (cleanedValue.length === 0 || !enableFiltering) {
            return opts; // no filter in effect
        }

        function filterFun(option: Option) {
            const lcOption = option.value.toLowerCase();
            // option must contain every word in value, not the phrase
            return (value ?? "").toLowerCase().split(/\s+/).every((word) => lcOption.includes(word))
        }

        return opts.filter((option) => filterFun(option))

    }, [autocompleteOptions, value, enableFiltering])
    const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // console.debug("keyDown", event)
        // console.debug("availableCompletions:", availableCompletions, ", hover index:", hoverOptionIndex);
        const numCompletions = availableCompletions.length;
        if (!numCompletions) {
            // no completions. nothing to do.
            return;
        }
        // if ctrl-key is down, construct our own key code with modifiers. otherwise use the key code.
        // event.key is the logical key, event.code is the physical key. so use logical key so keyboard remapping is
        // honored.
        const key = event.ctrlKey ? `Ctrl-${event.key.toUpperCase()}` : event.code;

        switch (key) {
            case "Escape":
                if (enableFiltering && numCompletions < numAutocompletionOptions) {
                    // we're filtering, and we've filtered some items
                    setEnableFiltering(false)
                    break;
                }
                resetAutocompleteSelection();
                break;
            case "Ctrl-N": // next
            case "Ctrl-F": // forward
            case "ArrowDown":
                setHoverOptionIndex((prev) => (prev === null ? 0 : (prev + 1)) % numCompletions)
                setAutocompleteVisible(true);
                break;
            case "Ctrl-P": // prev
            case "Ctrl-B": // back
            case "ArrowUp":
                setHoverOptionIndex((prev) => (numCompletions + (prev === null ? (numCompletions - 1) : (prev - 1))) % numCompletions)
                setAutocompleteVisible(true);
                break;

            // case "Space": // can't use space since options can contain space
            case "Enter": // same as tab
            case "Tab":
                if (!autocompleteVisible) {
                    break; // do nothing
                }
                if (hoverOptionIndex === null) {
                    // no selection => no completion
                } else if (numCompletions === 1 && availableCompletions[0].value.toLowerCase() === (value ?? "").toLowerCase()) {
                    // we have exactly 1 completion, and the completion is an exact match, treat it as not a completion.
                } else if (numCompletions > 0) {
                    // console.debug("tab pressed with available completions:", availableCompletions)
                    event.preventDefault(); // consume
                    setValue(availableCompletions[hoverOptionIndex].value)
                }
                resetAutocompleteSelection();
                break;
            default:
                // a regular key
                setEnableFiltering(true)
                break
        }
    }, [availableCompletions, hoverOptionIndex, value, autocompleteVisible])

    useEffect(() => {
        updateTextAreaSize(value as string);
    }, []);

    useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    useEffect(() => {
        if (!value) {
            setHoverOptionIndex(null)
        }

        if (onChange) {
            // todo: figure out how to create a ChangeEvent and send that along instead of just the value
            if (debounce) {
                const timeout = setTimeout(() => {
                    if (initialValue !== value) {
                        // console.debug(`debouncedTextArea applying change: ${initialValue} -> ${value}`)
                        onChange(value)
                    }
                }, debounceDelay)

                return () => clearTimeout(timeout)
            } else {
                onChange(value)
            }
        }
        // adding onChange or options here cause constant re-renders. The linter says to useCallback on them, then to
        // memoize the deps of the callback, but suppressing is simpler for now since we don't actually want to do
        // anything when those change eslint-disable-next-line react-hooks/exhaustive-deps

    }, [value])

    useEffect(() => {
        if (autocompleteOptionsDivRef.current) {
            if (hoverOptionIndex !== null) {
                const selectedItem = autocompleteOptionsDivRef.current.children.item(hoverOptionIndex);
                if (selectedItem) {
                    selectedItem.scrollIntoView({block: "center"})
                }
                setAllowMouseFocus(false) // keyboard is in control
            }
        }
    }, [hoverOptionIndex]);

    useEffect(() => {
        // if there are no available completions, this will be set to -1
        // if the previous value is -1, use 0 instead so we don't get stuck at -1
        setHoverOptionIndex((prev) => prev === null || availableCompletions.length === 0
            ? null
            : Math.min(prev, availableCompletions.length - 1))
    }, [availableCompletions]);

    useEffect(() => {
        if (autocompleteVisible) {
            /*
             whenever we show the autocomplete dropdown, set up global event listeners to detect if we've navigated
             away:
             - tabbed away
             - mouse clicked away
             - scrolled away (todo)
            */
            const mouseClickListener = (event: MouseEvent) => {
                // console.debug("global click listener:", event)
                if (event.target !== autocompleteOptionsDivRef.current && event.target !== textAreaRef.current) {
                    resetAutocompleteSelection()
                    cleanUpListeners();
                }
            };
            const focusInListener = (event: FocusEvent) => {
                // console.debug("focus in", event)
                if (!allowMouseFocus) {
                    // console.debug("mouse focus not allowed")
                    return
                }
                if (event.target !== textAreaRef.current) {
                    // we focused into some other element
                    resetAutocompleteSelection()
                    cleanUpListeners();
                }
            }
            const mouseMoveListener = (event: MouseEvent) => {
                // console.debug("mousemove", event)
                if (event.type !== "mousemove") {
                    return
                }
                setAllowMouseFocus(true)
            }

            function cleanUpListeners() {
                document.removeEventListener("click", mouseClickListener)
                document.removeEventListener("focusin", focusInListener)
                document.removeEventListener("mousemove", mouseMoveListener)
            }

            document.addEventListener("click", mouseClickListener)
            document.addEventListener("focusin", focusInListener)
            document.addEventListener("mousemove", mouseMoveListener)

            return () => {
                cleanUpListeners()
            }
        }
    }, [autocompleteVisible, allowMouseFocus]);

    useEffect(() => {
        const opts = Array.isArray(autocompleteOptions) ? autocompleteOptions : autocompleteOptions()
        setNumAutocompletionOptions(opts.length)
    }, [autocompleteOptions]);


    function updateTextAreaSize(value: string) {
        if (!resize) {
            return
        }
        if (labelRef.current) {
            labelRef.current.dataset.value = value
        }
    }

    function handleOnChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        updateTextAreaSize(e.target.value);
        setValue(e.target.value)
    }

    function handleOnMouseEnter() {
        if (allowMouseFocus) {
            setHoverOptionIndex(null)
        }
    }

    function resetAutocompleteSelection() {
        setHoverOptionIndex(null); // reset
        setAutocompleteVisible(false);
        setEnableFiltering(true);
        if (textAreaRef.current) {
            textAreaRef.current.blur()
        }
    }

    function handleAutoCompleteOptionClick(option: Option) {
        // console.debug("autoCompleteOptionClick", option)
        setValue(option.value)
        resetAutocompleteSelection();
    }


    function handleTextAreaMouseEvent(event: React.MouseEvent<HTMLTextAreaElement, MouseEvent>) {
        // console.debug("mouse event", event)
        if (availableCompletions.length > 1) {
            if (event.type === "mousedown") {
                if (document.activeElement === textAreaRef.current) {
                    // toggle
                    setAutocompleteVisible((prev) => !prev);
                }
            }
        }
    }

    function handleOnFocus() {
        if (availableCompletions.length > 1) {
            setAutocompleteVisible(true);
        }
    }

    function getOptions() {
        return availableCompletions.map((option) => {
            const selected = hoverOptionIndex !== null && (availableCompletions[hoverOptionIndex] === option)
            return <li key={option.value}
                       className={`autocomplete-option ${selected && "selected"}`}
                       onMouseEnter={() => handleOnMouseEnter()}
                       onClick={() => handleAutoCompleteOptionClick(option)}>{option.label}</li>
        })
    }

    function clearContent() {
        setValue("")
    }

    const rect = textAreaRef.current?.getBoundingClientRect();

    const textAreaId = `smart-text-area-${id}-textarea`;
    return (
        <label id={`smart-text-area-${id}-container`} className="smart-text-area-container">
            {label && <label id={`smart-text-area-${id}-label`}
                             htmlFor={textAreaId}
                             className={"smart-text-area-label"}>{label}</label>}
            <label id={`smart-text-area-${id}-textarea-resizer`} className={"textarea-resizer"} ref={labelRef}>
                <textarea id={`smart-text-area-${id}-textarea`}
                          className={`smart-text-area-textarea ${oneLine && "one-line"} ${scrollable&& "scrollable"}`}
                          placeholder={placeholder}
                          value={value as string}
                          ref={textAreaRef}
                          onChange={handleOnChange}
                          onFocus={handleOnFocus}
                          onMouseDown={handleTextAreaMouseEvent}
                          onKeyDown={(event) => handleKeyDown(event)}
                />
            </label>
            <div className={"clear-content-icon"}>
                <BsXCircleFill onClick={() => clearContent()}/>
            </div>
            {autocompleteVisible && // only render this if we need to show it
                // use createPortal() to place the auto-completion div on the document body. Otherwise, if we're
                // trapped inside a table, say TanStack table cell, the div can't render on top of other cells
                createPortal(
                    <div id={`smart-text-area-${id}-autocomplete-options`}
                         className={`smart-text-area-autocomplete-container ${availableCompletions.length < numAutocompletionOptions && "some-options-filtered"}`}
                         ref={autocompleteOptionsDivRef}
                         style={{
                             top: rect?.bottom,
                             left: rect?.left,
                             width: rect?.width,
                         }}
                    >
                        {getOptions()}
                    </div>,
                    document.body)
            }
        </label>
    )

}
