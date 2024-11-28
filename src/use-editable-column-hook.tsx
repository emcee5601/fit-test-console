import {CellContext} from "@tanstack/react-table";
import React, {useCallback, useEffect} from "react";
import {useInView} from "react-intersection-observer";

export function useEditableColumn<T, U>({
                                  getValue,
                                  row: {index},
                                  column: {id},
                                  table
                              }: CellContext<T, U>) {
    const initialValue = getValue()
    // We need to keep and update the state of the cell normally
    const [value, setValue] = React.useState<U>(initialValue)
    const {ref, inView} = useInView()

    // When the input is blurred, we'll call our table meta's updateData function
    const onBlur = useCallback(() => {
        if (value != initialValue) {
            // only update if changed
            table.options.meta?.updateData(index, id, value)
        }
    }, [value, id, index, table.options.meta, initialValue])

    // If the initialValue is changed external, sync it up with our state
    React.useEffect(() => {
        setValue(initialValue)
    }, [initialValue])
    useEffect(() => {
        // console.log(`inview is now ${inView}`)
        if (!inView) {
            onBlur();
        }
    }, [inView, onBlur]);

    return (
        <textarea ref={ref} style={{height: "auto", width: "fit-content", border: "none"}}
                  value={value as string}
                  onChange={e => setValue(e.target.value)}
                  onBlur={onBlur}
                  placeholder={`Click to add ${id}`}
        />
    )
}
