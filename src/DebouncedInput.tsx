import React from "react";

// A typical debounced input react component
export function DebouncedInput({
                                   value: initialValue,
                                   onChange,
                                   debounce = 500,
                                   ...props
                               }: {
    value: string | number
    onChange: (value: string | number) => void
    debounce?: number
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
        // adding onChange and debounce here cause constant re-renders. The linter says to useCallback on them, then to memoize the deps of the callback, but suppressing is simpler for now since we don't actually want to do anything when those change
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])

    return (
        <input {...props} value={value} onChange={e => setValue(e.target.value)}/>
    )
}
