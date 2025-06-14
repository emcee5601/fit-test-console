import React, {Ref} from "react";
import {ResizingTextArea} from "src/ResizingTextArea.tsx";

// based on DebouncedInput
export function DebouncedTextArea({
    value: initialValue,
    textAreaRef,
    onChange,
    debounce = 500,
    ...props
}: {
    value: string
    textAreaRef?: Ref<HTMLTextAreaElement>,
    onChange: (value: string) => void
    debounce?: number
} & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'>) {
    const [value, setValue] = React.useState(initialValue)

    React.useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            if(initialValue !== value) {
                console.debug(`debouncedTextArea applying change: ${initialValue} -> ${value}`)
                onChange(value)
            }
        }, debounce)

        return () => clearTimeout(timeout)
        // adding onChange and debounce here cause constant re-renders. The linter says to useCallback on them, then to
        // memoize the deps of the callback, but suppressing is simpler for now since we don't actually want to do
        // anything when those change eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])

    if (!props) {
        props = {}
    }
    if (!props.style) {
        props.style = {}
    }

    return (
        <ResizingTextArea {...props} value={value} onChange={e => setValue(e.target.value)} textAreaRef={textAreaRef} />
    )
}
