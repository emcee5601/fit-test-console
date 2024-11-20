/**
 * Table to store the results of fit tests.
 */


import React, {useEffect, useState} from 'react'

import './index.css'

import {
    CellContext,
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    Row, RowData,
    useReactTable,
} from '@tanstack/react-table'

import {useVirtualizer} from '@tanstack/react-virtual'
import {SimpleResultsDBRecord} from "./database.ts";

declare module '@tanstack/react-table' {
    interface TableMeta<TData extends RowData> {
        updateData: (rowIndex: number, columnId: string, value: string | number) => void
    }
}

// Give our default column cell renderer editing superpowers!
function useEditableColumn({
                               getValue,
                               row: {index},
                               column: {id},
                               table
                           }: CellContext<SimpleResultsDBRecord, string | number>) {
    const initialValue = getValue()
    // We need to keep and update the state of the cell normally
    const [value, setValue] = React.useState(initialValue)

    // When the input is blurred, we'll call our table meta's updateData function
    const onBlur = () => {
        if(!table.options.meta) {
            console.log(`meta is falsy! ${index}, ${id}, ${value}`)
        }
        table.options.meta?.updateData(index, id, value)
    }

    // If the initialValue is changed external, sync it up with our state
    React.useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    // there's some sort of bug where inserting new rows at the top causes the editable cell's values to pull from the previous table's first record.
    // only seems to affect rendering
    // textarea has double the default height compared to input. 100% height will bleed out of the containing table cell
    return (
        <textarea style={{height: "auto", width: "fit-content"}}
                  value={value as string}
                  onChange={e => setValue(e.target.value)}
                  onBlur={onBlur}
        />
    )
};

function useSkipper() {
    const shouldSkipRef = React.useRef(true)
    const shouldSkip = shouldSkipRef.current

    // Wrap a function with this to skip a pagination reset temporarily
    const skip = React.useCallback(() => {
        shouldSkipRef.current = false
    }, [])

    React.useEffect(() => {
        shouldSkipRef.current = true
    })

    return [shouldSkip, skip] as const
}

export interface ResultsTableStates {
    results: SimpleResultsDBRecord[],
    readonly setResults: React.Dispatch<React.SetStateAction<SimpleResultsDBRecord[]>>,
}

//This is a dynamic row height example, which is more complicated, but allows for a more realistic table.
//See https://tanstack.com/virtual/v3/docs/examples/react/table for a simpler fixed row height example.
export function ResultsTable({state, rowUpdatedCallback}: {
    state: ResultsTableStates,
    rowUpdatedCallback: (record: SimpleResultsDBRecord) => void
}) {
    const [localTableData, setLocalTableData] = useState(state.results)
    useEffect(() => {
        console.log("result table saw change in state.results")
        setLocalTableData(state.results)
    }, [state.results]);

    function getExerciseResultCell(info: CellContext<SimpleResultsDBRecord, unknown>) {
        const val = info.getValue<number>();
        if (val < 100) {
            return <span className={"fail result"}>{val}</span>
        } else if (val > 100) {
            return <span className={"pass result"}>{val}</span>
        } else {
            return <span className={"aborted result"}>{val}</span>
        }
    }

    const columns = React.useMemo<ColumnDef<SimpleResultsDBRecord, string | number>[]>(
        () => [
            {
                accessorKey: 'ID',
                header: 'ID',
                size: 50,
            },
            {
                accessorKey: 'Time',
                cell: info => {
                    const date = info.getValue<Date>();
                    if (date) {
                        return date.toLocaleString()
                    } else {
                        return null;
                    }
                },
                size: 180,
            },
            {
                accessorKey: 'Participant',
                cell: useEditableColumn,
                size: 150,
            },
            {
                accessorKey: 'Mask',
                cell: useEditableColumn,
                size: 150,
            },
            {
                accessorKey: 'Notes',
                cell: useEditableColumn,
                size: 150,
            },
            {
                accessorKey: 'Ex 1',
                cell: getExerciseResultCell,
                size: 50,
            },
            {
                accessorKey: 'Ex 2',
                cell: getExerciseResultCell,
                size: 50,
            },
            {
                accessorKey: 'Ex 3',
                cell: getExerciseResultCell,
                size: 50,
            },
            {
                accessorKey: 'Ex 4',
                cell: getExerciseResultCell,
                size: 50,
            },
            {
                accessorKey: 'Final',
                cell: getExerciseResultCell,
                size: 50,
            },
        ],
        []
    )

    const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper()

    const table = useReactTable({
        data: localTableData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        autoResetPageIndex,
        // Provide our updateData function to our table meta
        meta: {
            updateData: (rowIndex, columnId, value) => {
                // Skip page index reset until after next rerender
                skipAutoResetPageIndex()
                setLocalTableData(old => {
                    const res = old.map((row, index) => {
                            if (index === rowIndex) {
                                const updatedRow = {
                                    ...old[rowIndex]!,
                                    [columnId]: value,
                                };
                                rowUpdatedCallback(updatedRow);
                                return updatedRow;
                            }
                            return row
                        }
                    );
                    return res;
                });
            },
        },
        debugTable: true,
    })

    const {rows} = table.getRowModel()

    //The virtualizer needs to know the scrollable container element
    const tableContainerRef = React.useRef<HTMLDivElement>(null)

    const rowVirtualizer = useVirtualizer({
        count: rows.length,
        estimateSize: () => 33, //estimate row height for accurate scrollbar dragging
        getScrollElement: () => tableContainerRef.current,
        //measure dynamic row height, except in firefox because it measures table border height incorrectly
        measureElement:
            typeof window !== 'undefined' &&
            navigator.userAgent.indexOf('Firefox') === -1
                ? element => element?.getBoundingClientRect().height
                : undefined,
        overscan: 5,
    })

    //All important CSS styles are included as inline styles for this example. This is not recommended for your code.
    return (
        <div className="app">
            <div
                className="container"
                ref={tableContainerRef}
                style={{
                    overflow: 'auto', //our scrollable table container
                    position: 'relative', //needed for sticky header
                    height: '60vh', //should be a fixed height
                }}
            >
                {/* Even though we're still using sematic table tags, we must use CSS grid and flexbox for dynamic row heights */}
                <table style={{display: 'grid'}}>
                    <thead
                        style={{
                            display: 'grid',
                            position: 'sticky',
                            top: 0,
                            zIndex: 1,
                        }}
                    >
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr
                            key={headerGroup.id}
                            style={{display: 'flex', width: '100%'}}
                        >
                            {headerGroup.headers.map(header => {
                                return (
                                    <th
                                        key={header.id}
                                        style={{
                                            display: 'flex',
                                            width: header.getSize(),
                                        }}
                                    >
                                        <div
                                            {...{
                                                className: header.column.getCanSort()
                                                    ? 'cursor-pointer select-none'
                                                    : '',
                                                onClick: header.column.getToggleSortingHandler(),
                                            }}
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                            {{
                                                asc: ' 🔼',
                                                desc: ' 🔽',
                                            }[header.column.getIsSorted() as string] ?? null}
                                        </div>
                                    </th>
                                )
                            })}
                        </tr>
                    ))}
                    </thead>
                    <tbody
                        style={{
                            display: 'grid',
                            height: `${rowVirtualizer.getTotalSize()}px`, //tells scrollbar how big the table is
                            position: 'relative', //needed for absolute positioning of rows
                        }}
                    >
                    {rowVirtualizer.getVirtualItems().map(virtualRow => {
                        const row = rows[virtualRow.index] as Row<SimpleResultsDBRecord>
                        return (
                            <tr
                                data-index={virtualRow.index} //needed for dynamic row height measurement
                                ref={node => rowVirtualizer.measureElement(node)} //measure dynamic row height
                                key={row.id}
                                style={{
                                    display: 'flex',
                                    position: 'absolute',
                                    transform: `translateY(${virtualRow.start}px)`, //this should always be a `style` as it changes on scroll
                                    width: '100%',
                                }}
                            >
                                {row.getVisibleCells().map(cell => {
                                    return (
                                        <td
                                            key={cell.id}
                                            style={{
                                                display: 'flex',
                                                width: cell.column.getSize(),
                                            }}
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    )
                                })}
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

