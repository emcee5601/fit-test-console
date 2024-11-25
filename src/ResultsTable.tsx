/**
 * Table to store the results of fit tests.
 */


import React, {useEffect, useState} from 'react'

import './index.css'

import {
    CellContext, Column,
    ColumnDef, ColumnFiltersState,
    flexRender,
    getCoreRowModel, getFilteredRowModel,
    getSortedRowModel,
    Row, RowData,
    useReactTable,
} from '@tanstack/react-table'

import {useVirtualizer} from '@tanstack/react-virtual'
import {SimpleResultsDBRecord} from "./database.ts";
import {useInView} from "react-intersection-observer";
import {mkConfig} from "export-to-csv";
import {download, generateCsv} from "export-to-csv";
import {DataCollector} from "./data-collector.tsx";
import {createMailtoLink} from "./html-data-downloader.ts";

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
    const {ref, inView} = useInView()

    // When the input is blurred, we'll call our table meta's updateData function
    const onBlur = () => {
        if(value != initialValue) {
            // only update if changed
            table.options.meta?.updateData(index, id, value)
        }
    }

    // If the initialValue is changed external, sync it up with our state
    React.useEffect(() => {
        setValue(initialValue)
    }, [initialValue])
    useEffect(() => {
        // console.log(`inview is now ${inView}`)
        if(!inView) {
            onBlur();
        }
    }, [inView]);

    // there's some sort of bug where inserting new rows at the top causes the editable cell's values to pull from the previous table's first record.
    // only seems to affect rendering
    // textarea has double the default height compared to input. 100% height will bleed out of the containing table cell
    return (
        <textarea ref={ref} style={{height: "auto", width: "fit-content", border:"none"}}
                  value={value as string}
                  onChange={e => setValue(e.target.value)}
                  onBlur={onBlur}
                  placeholder={`Click to add ${id}`}
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
export function ResultsTable({dataCollector}: {
    dataCollector: DataCollector,
}) {
    const [localTableData, setLocalTableData] = useState<SimpleResultsDBRecord[]>([])
    dataCollector.setResultsCallback(setLocalTableData)

    function getExerciseResultCell(info: CellContext<SimpleResultsDBRecord, unknown>) {
        const val = info.getValue<number>();
        if( val < 1.1) {
            // probably aborted
            return <span className={"aborted result"}>{val}</span>
        } else if( val < 20) {
            return <span className={"result"} style={{backgroundColor:"darkred", color:"whitesmoke"}}>{val}</span>
        } else if (val < 100) {
            return <span className={"result"} style={{backgroundColor:"darkorange", color:"whitesmoke"}}>{val}</span>
        } else if (val >= 100) {
            return <span className={"result"} style={{backgroundColor:"green", color:"whitesmoke"}}>{val}</span>
        } else {
            // NaN
            return <span className={"aborted result"}>{val}</span>
        }
    }

    const columns = React.useMemo<ColumnDef<SimpleResultsDBRecord, string | number>[]>(
        () => [
            {
                accessorKey: 'ID',
                header: 'ID',
                enableColumnFilter: false,
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
                enableColumnFilter: false,
                size: 200,
            },
            {
                accessorKey: 'Participant',
                cell: useEditableColumn,
                enableColumnFilter: true,
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
                enableColumnFilter: false,
                size: 50,
            },
            {
                accessorKey: 'Ex 2',
                cell: getExerciseResultCell,
                enableColumnFilter: false,
                size: 50,
            },
            {
                accessorKey: 'Ex 3',
                cell: getExerciseResultCell,
                enableColumnFilter: false,
                size: 50,
            },
            {
                accessorKey: 'Ex 4',
                cell: getExerciseResultCell,
                enableColumnFilter: false,
                size: 50,
            },
            {
                accessorKey: 'Final',
                cell: getExerciseResultCell,
                enableColumnFilter: false,
                size: 50,
            },
        ],
        []
    )

    const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper()
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

    const table = useReactTable({
        data: localTableData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            columnFilters,
        },
        onColumnFiltersChange: setColumnFilters,
        autoResetPageIndex,
        // Provide our updateData function to our table meta
        meta: {
            updateData: (rowIndex, columnId, value) => {
                // Skip page index reset until after next rerender
                skipAutoResetPageIndex()
                setLocalTableData(old => { // this updates the local data used by the table?
                    const res = old.map((row, index) => {
                            if (index === rowIndex) {
                                const updatedRow = {
                                    ...old[rowIndex]!,
                                    [columnId]: value,  // this updates the cell that was changed
                                };
                                // TODO: roll this in a function in dataCollector
                                dataCollector.resultsDatabase.updateTest(updatedRow); // this saves the changes to the db
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


    useEffect(() => {
        console.log(`initializing results db`)
        dataCollector.resultsDatabase.open().then(() => dataCollector.resultsDatabase.getAllData().then(data => {
            setLocalTableData(data);
        }));
    }, []);


    function handleExportAsCsv() {
        const csvConfig = mkConfig({
            fieldSeparator: ',',
            filename: `fit-test-results-${new Date().getTime()}`,
            decimalSeparator: '.',
            // useKeysAsHeaders: true,
            columnHeaders: table.getAllColumns().map(col => col.id)
        });
        const rows = table.getSortedRowModel().rows
        const rowData = rows.map((row) => row.original)
        const csv = generateCsv(csvConfig)(rowData)
        download(csvConfig)(csv)
    }

    function handleMailto() {
        // can't have html body, so we'll construct something that's easily readable (not csv)

        const rows = table.getSortedRowModel().rows
        const rowData:SimpleResultsDBRecord[] = rows.map((row) => row.original)
        let body = "Your fit test results:\n\n"
        const fields = ['Time', 'Participant', 'Mask', 'Notes', 'Ex 1', 'Ex 2', 'Ex 3', 'Ex 4', 'Final'];
        rowData.forEach((row) => {
            const rowInfo:string[] = []
            fields.forEach((key) => {
                if(key in row) {
                    rowInfo.push(`${key}: ${row[key]}`)
                }
            })

            body = body + rowInfo.join("\n") + "\n\n"
        })

        const link = createMailtoLink( "", "Fit test results", body);
        link.click()
    }

    //All important CSS styles are included as inline styles for this example. This is not recommended for your code.
    return (
        <div>
            <input type={"button"} value={"Export as CSV"} onClick={() => handleExportAsCsv()}/>
            <input type={"button"} value={"Email"} onClick={() => handleMailto()}/>
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
                                        {header.column.getCanFilter() ? (
                                            <div>
                                                <Filter column={header.column}/>
                                            </div>
                                        ) : null}

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


function Filter({column}: { column: Column<any, unknown> }) {
    const columnFilterValue = column.getFilterValue()
    const { filterVariant } = column.columnDef.meta ?? {}

    return filterVariant === 'range' ? (
        <div>
            <div className="flex space-x-2">
                {/* See faceted column filters example for min max values functionality */}
                <DebouncedInput
                    type="number"
                    value={(columnFilterValue as [number, number])?.[0] ?? ''}
                    onChange={value =>
                        column.setFilterValue((old: [number, number]) => [value, old?.[1]])
                    }
                    placeholder={`Min`}
                    className="w-24 border shadow rounded"
                />
                <DebouncedInput
                    type="number"
                    value={(columnFilterValue as [number, number])?.[1] ?? ''}
                    onChange={value =>
                        column.setFilterValue((old: [number, number]) => [old?.[0], value])
                    }
                    placeholder={`Max`}
                    className="w-24 border shadow rounded"
                />
            </div>
            <div className="h-1" />
        </div>
    ) : filterVariant === 'select' ? (
        <select
            onChange={e => column.setFilterValue(e.target.value)}
            value={columnFilterValue?.toString()}
        >
            {/* See faceted column filters example for dynamic select options */}
            <option value="">All</option>
            <option value="complicated">complicated</option>
            <option value="relationship">relationship</option>
            <option value="single">single</option>
        </select>
    ) : (
        <DebouncedInput
            className="w-36 border shadow rounded"
            onChange={value => column.setFilterValue(value)}
            placeholder={`Search...`}
            type="text"
            value={(columnFilterValue ?? '') as string}
        />
        // See faceted column filters example for datalist search suggestions
    )
}

// A typical debounced input react component
function DebouncedInput({
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
    }, [value])

    return (
        <input {...props} value={value} onChange={e => setValue(e.target.value)} />
    )
}