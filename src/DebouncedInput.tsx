import React, {RefObject} from "react";

/**
 *
 * @param initialValue
 * @param onChange
 * @param debounce milliseconds
 * @param ref
 * @param props
 * @constructor
 */
export function DebouncedInput({
    value: initialValue,
    onChange,
    debounce = 500,
    inputRef,
    ...props
}: {
    value: string | number
    onChange: (value: string | number) => void
    debounce?: number
    inputRef?:RefObject<HTMLInputElement>
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
    const [value, setValue] = React.useState(initialValue)

    React.useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value)
        }, debounce)

        return () => clearTimeout(timeout)
        // adding onChange and debounce here cause constant re-renders. The linter says to useCallback on them, then to
        // memoize the deps of the callback, but suppressing is simpler for now since we don't actually want to do
        // anything when those change eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])

    return (
        <input ref={inputRef} {...props} value={value} onChange={e => setValue(e.target.value)}/>
    )
}
