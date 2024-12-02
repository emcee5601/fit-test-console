import {CellContext, RowData} from "@tanstack/react-table";
import React, {useCallback, useEffect} from "react";
import {useInView} from "react-intersection-observer";

declare module '@tanstack/react-table' {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface TableMeta<TData extends RowData> {
        updateData: (rowIndex: number, columnId: string, value: string | number|unknown) => void
    }

    //allows us to define custom properties for our columns
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface ColumnMeta<TData extends RowData, TValue> {
        filterVariant?: 'text' | 'range' | 'select' | 'date'
    }
}


export function useEditableColumn<T,V>({
                                  getValue,
                                  row: {index},
                                  column: {id},
                                  table
                              }: CellContext<T, V|unknown>) {
    const initialValue = getValue()
    // We need to keep and update the state of the cell normally
    const [value, setValue] = React.useState<V|unknown>(initialValue)
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
    <textarea ref={ref} style={{height: "auto", width: "100%", border: "none"}}
              value={value? value as string : ""}
              onChange={e => setValue(e.target.value)}
              onBlur={onBlur}
              placeholder={`Click to add ${id}`}
    />
    )
}
