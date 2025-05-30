import React, {ChangeEvent, HTMLAttributes, Ref, useEffect, useRef} from "react";

/**
 * A wrapped textarea that resizes to fit its content.
 * @param onChange
 * @param textAreaRef
 * @param value
 * @param placeholder
 * @param props
 * @constructor
 */
export function ResizingTextArea({onChange, textAreaRef, value, placeholder, ...props}: {
    value?: string,
    textAreaRef?: Ref<HTMLTextAreaElement>,
    placeholder?: string,
    onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void
} & Omit<HTMLAttributes<HTMLTextAreaElement>, 'onChange' | 'value'>) {
    const labelRef = useRef<HTMLLabelElement>(null);

    function updateTextAreaSize(value: string) {
        if (labelRef.current) {
            labelRef.current.dataset.value = value
        }
    }

    useEffect(() => {
        updateTextAreaSize(value as string);
    }, []);

    function handleOnChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        updateTextAreaSize(e.target.value);
        if (onChange) {
            onChange(e)
        }
    }

    return (
        <label className={"textarea-resizer"} ref={labelRef}>
            <textarea {...props} placeholder={placeholder} value={value as string} ref={textAreaRef}
                      onChange={e => handleOnChange(e)}
            />
        </label>
    )

}
