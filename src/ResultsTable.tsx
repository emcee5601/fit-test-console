/**
 * Table to store the results of fit tests.
 */
import React, {Dispatch, SetStateAction, useContext, useEffect, useState} from 'react'

import './ResultsTable.css'

import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    Row,
    SortingState,
    useReactTable,
} from '@tanstack/react-table'

import {useVirtualizer} from '@tanstack/react-virtual'
import "react-datepicker/dist/react-datepicker.css";
import {
    useEditableColumn,
    useEditableExerciseResultColumn,
    useEditableMaskColumn
} from "./use-editable-column-hook.tsx";
import {useSkipper} from "./use-skipper-hook.ts";
import {SimpleResultsDBRecord} from "./SimpleResultsDB.ts";
import {AppSettings} from "./app-settings.ts";
import {AppContext} from "./app-context.ts";
import {DataCollector, DataCollectorListener} from "./data-collector.ts";
import {ResultsTableColumnFilter} from "./ResultsTableColumnFilter.tsx";
import {ReactTableCsvExportWidget} from "./ReactTableCsvExportWidget.tsx";
import {ReactTableQrCodeExportWidget} from "./ReactTableQrCodeExportWidget.tsx";
import {useSetting} from "./use-setting.ts";
import {BooleanToggleButton} from "src/ToggleButton.tsx";
import {deepCopy} from "json-2-csv/lib/utils";

//This is a dynamic row height example, which is more complicated, but allows for a more realistic table.
//See https://tanstack.com/virtual/v3/docs/examples/react/table for a simpler fixed row height example.
export default function ResultsTable({
    tableData, setTableData,
    searchableColumns = ["Time", "Participant", "Mask", "Notes", "ProtocolName"],
    hideColumns = [],
    minExercisesToShow = 0,
    columnSortingSettingKey = AppSettings.RESULTS_TABLE_SORT,
    columnFilterSettingKey = AppSettings.RESULTS_TABLE_FILTER,
    deleteRowsCallback,
}: {
    tableData: SimpleResultsDBRecord[],
    setTableData: Dispatch<SetStateAction<SimpleResultsDBRecord[]>>,
    searchableColumns?: string[],
    hideColumns?: string[],
    minExercisesToShow?: number,
    columnSortingSettingKey?: AppSettings.RESULTS_TABLE_SORT | AppSettings.PARTICIPANT_RESULTS_TABLE_SORT,
    columnFilterSettingKey?: AppSettings.RESULTS_TABLE_FILTER | AppSettings.PARTICIPANT_RESULTS_TABLE_FILTER,
    deleteRowsCallback?: (recordIds: number[]) => void,
}) {
    const appContext = useContext(AppContext)
    const dataCollector: DataCollector = appContext.dataCollector

    const dateTimeFormat = new Intl.DateTimeFormat(undefined, {
        hour12: false,
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        month: '2-digit',
        day: '2-digit',
        year: "numeric"
    })

    // todo: make this a useCallback?
    function createExerciseResultColumn(exerciseNum: number) {
        return createExerciseResultColumnBase(`Ex ${exerciseNum}`)
    }

    function createExerciseResultColumnBase(exercise: string) {
        return {
            accessorKey: exercise,
            cell: useEditableExerciseResultColumn,
            enableColumnFilter: false,
            sortUndefined: undefined,
            sortingFn: compareNumericString,
            sortDescFirst: true,
            size: 65,
        };
    }

    function createExerciseResultColumns(numExercises: number) {
        try {
            return Array.from(Array(numExercises).keys()).map((num) => createExerciseResultColumn(num + 1))
        } catch (error) {
            console.error(error)
            return []
        }
    }

    function compareNumericString(rowA: Row<SimpleResultsDBRecord>, rowB: Row<SimpleResultsDBRecord>, id: string) {
        let a = Number.parseFloat(rowA.getValue(id));
        let b = Number.parseFloat(rowB.getValue(id));
        if (Number.isNaN(a)) {  // Blanks and non-numeric strings to bottom
            a = Number.NEGATIVE_INFINITY;
        }
        if (Number.isNaN(b)) {
            b = Number.NEGATIVE_INFINITY;
        }
        if (a > b) return 1;
        if (a < b) return -1;
        return 0;
    }

    function compareDateString(rowA: Row<SimpleResultsDBRecord>, rowB: Row<SimpleResultsDBRecord>, id: string) {
        const a = new Date(rowA.getValue(id)).getTime();
        const b = new Date(rowB.getValue(id)).getTime();
        if (a > b) return 1;
        if (a < b) return -1;
        return 0;
    }

    const [numExerciseColumns, setNumExerciseColumns] = useState(1) // make sure this is not zero

    function safeRegExpFilter(row: Row<SimpleResultsDBRecord>, columnId: string, filterValue: string): boolean {
        const cellValue: string = row.getValue(columnId);
        if ((filterValue ?? "").trim() === (cellValue ?? "").trim()) {
            // matches empty strings, and empty values
            return true;
        }
        try {
            return RegExp(filterValue, "i").test(cellValue);
        } catch {
            // bad regexp, try simple substring match
            return cellValue.includes(filterValue);
        }
    }

    const [selectedRows, setSelectedRows] = useState<number[]>([])

    useEffect(() => {
    }, [selectedRows]);
    const columns = React.useMemo<ColumnDef<SimpleResultsDBRecord, string | number | boolean>[]>(
        () => [
            {
                accessorFn: record => {
                    return selectedRows.includes(record.ID)
                },
                header: 'Select',
                cell: info => {
                    const recordId: number = info.row.getValue("ID") as number;
                    return <input type={"checkbox"} checked={selectedRows.includes(recordId)}
                                  onChange={(event) => {
                                      if (event.target.checked) {
                                          setSelectedRows((prev) => [...prev, recordId])
                                      } else {
                                          setSelectedRows((prev) => prev.filter((item) => item !== recordId));
                                      }
                                  }}></input>
                },
                enableColumnFilter: false,
                size: 50,
            },
            {
                accessorKey: 'ID',
                header: 'ID',
                enableColumnFilter: false,
                size: 50,
            },
            {
                accessorKey: 'Time',
                header: 'Date',
                cell: info => {
                    const date = info.getValue<Date>();
                    if (date) {
                        return dateTimeFormat.format(new Date(date))// date.toLocaleString()
                    } else {
                        return null;
                    }
                },
                enableColumnFilter: searchableColumns.includes('Time'),
                filterFn: (row, columnId, filterValue) => {
                    return (row.getValue(columnId) as string).startsWith(filterValue);
                },
                sortingFn: compareDateString,
                meta: {
                    filterVariant: 'date',
                },
            },
            {
                accessorKey: 'Participant',
                cell: useEditableColumn,
                enableColumnFilter: searchableColumns.includes('Participant'),
                filterFn: safeRegExpFilter,
            },
            {
                accessorKey: 'Mask',
                cell: useEditableMaskColumn,
                enableColumnFilter: searchableColumns.includes('Mask'),
                filterFn: safeRegExpFilter,
                meta: {
                    filterVariant: 'mask',
                },
            },
            {
                accessorKey: 'Notes',
                cell: useEditableColumn,
                enableColumnFilter: searchableColumns.includes('Notes'),
                filterFn: safeRegExpFilter,
            },
            createExerciseResultColumnBase("Final"),
            ...createExerciseResultColumns(numExerciseColumns),
            {
                accessorKey: 'ProtocolName',
                enableColumnFilter: searchableColumns.includes('ProtocolName'),
                filterFn: safeRegExpFilter,
                accessorFn: (record) => {
                    return `${record.ProtocolName} - ${record.TestController}`
                },
                header: 'Protocol',
            },
        ],
        [numExerciseColumns, selectedRows]
    )

    const [enableSelection, setEnableSelection] = useState<boolean>(false)
    const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper()
    const [columnFilters, setColumnFilters] = useSetting<ColumnFiltersState>(columnFilterSettingKey)
    const [sorting, setSorting] = useSetting<SortingState>(columnSortingSettingKey)
    const [columnVisibility, setColumnVisibility] = useState(hideColumns.reduce((result: {
        [key: string]: boolean
    }, column: string) => {
        result[column] = false;
        return result
    }, {}))
    useEffect(() => {
        columnVisibility["Select"] = enableSelection;
        setColumnVisibility(deepCopy(columnVisibility))
        if (!enableSelection) {
            setSelectedRows([]) // clear
        }
    }, [enableSelection]);


    // console.debug(`columnVisibility: ${JSON.stringify(columnVisibility)}`)
    const table = useReactTable({
        data: tableData,
        columns,
        enableColumnResizing: true,
        columnResizeMode: 'onChange',
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
            columnVisibility
        },
        onColumnFiltersChange: setColumnFilters,
        onSortingChange: setSorting,
        autoResetPageIndex,
        // Provide our updateData function to our table meta
        meta: {
            updateData: (rowIndex, columnId, value) => {
                if (!dataCollector) {
                    // short circuit if no data collector
                    return;
                }
                // Skip page index reset until after next rerender
                skipAutoResetPageIndex()
                setTableData(old => { // this updates the local data used by the table
                    const res = old.map((row, index) => {
                            if (index === rowIndex) {
                                const updatedRow = {
                                    ...old[rowIndex]!,
                                    [columnId]: value,  // this updates the cell that was changed
                                } as SimpleResultsDBRecord;
                                dataCollector.updateTest(updatedRow);
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

    /**
     * Look at the data currently displayed and adjust the number of exercise columns to fit. eg. if we only have 4
     * exercises (w1 protocol), there's no need to show ex 5-8 that are only in the osha protocol when we are not
     * showing any osha protocol results.
     */
    function dynamicallyAdjustNumExerciseColumns() {
        const filteredRowModel = table.getFilteredRowModel();
        const numExercises = appContext.settings.numExercisesForProtocol
        const protocolsShownInTable: string[] = []
        filteredRowModel.rows.forEach((row) => {
            const protocolName = row.original.ProtocolName as string;
            if (!(protocolsShownInTable.includes(protocolName))) {
                protocolsShownInTable.push(protocolName);
            }
        });

        let maxExercises = Math.max(minExercisesToShow, protocolsShownInTable.length)
        protocolsShownInTable.forEach((protocol) => {
            if (protocol in numExercises && numExercises[protocol] > maxExercises) {
                maxExercises = numExercises[protocol];
            }
        })
        if (maxExercises === 0) {
            // default to 4. before the protocol column was added, num exercises was hardcoded to 4
            maxExercises = 4
        }
        setNumExerciseColumns(maxExercises);
    }

    const {rows} = table.getRowModel()
    const dates: Date[] = [new Date(), ...new Set<Date>(tableData.map((row) => new Date(row.Time)))]
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
        dynamicallyAdjustNumExerciseColumns();
    }, [columnFilters, tableData, minExercisesToShow]);

    useEffect(() => {
        const listener: DataCollectorListener = {
            currentTestUpdated(updatedRecord: SimpleResultsDBRecord) {
                // happens when new test is started too
                // console.debug("currentTestUpdated:", updatedRecord)
                setTableData((prev) => {
                    // upsert the updated record. force a copy so tanstack table sees the update
                    return ([...prev.filter((record) => record.ID !== updatedRecord.ID), updatedRecord])
                })
            },

        }
        dataCollector.addListener(listener);
        return () => {
            dataCollector.removeListener(listener)
        }
    }, [dataCollector]);


    function deleteSelectedRecords() {
        setSelectedRows([]) // reset
        if (deleteRowsCallback) {
            deleteRowsCallback(selectedRows)
        }
    }

    function getColumnStyleName(columnId: string) {
        return `${columnId.replace(/\s+/g, "_")}-column`
    }

    return (
        <div className={"results-table-container"}>
            <style id={"per-column-styles"}>{
                table.getHeaderGroups().flatMap(headerGroup => {
                    return headerGroup.headers.map(header => {
                        const className = `.${getColumnStyleName(header.id)}`
                        const width = header.getSize()
                        return `${className} { width: ${width}px; }`
                    })
                })
            }</style>

            <div>
                <div style={{display: "inline-block"}}>
                    <BooleanToggleButton trueLabel={"Enable selection"}
                                         value={enableSelection}
                                         setValue={setEnableSelection}/>
                </div>
                {enableSelection && deleteRowsCallback &&
                    <button onClick={() => deleteSelectedRecords()}>Delete selected</button>}
                <ReactTableCsvExportWidget table={table}/>
                <ReactTableQrCodeExportWidget table={table} tableData={tableData} columnFilters={columnFilters}/>
            </div>
            <div
                className="container"
                ref={tableContainerRef}
                style={{
                    overflow: 'auto', //our scrollable table container
                    flexGrow: 1
                }}
            >
                {/* Even though we're still using sematic table tags, we must use CSS grid and flexbox for dynamic row heights */}
                <table style={{display: 'grid'}}>
                    <thead className={"results-table-header"}>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr className={"results-table-header-row"}
                            key={headerGroup.id}>
                            {headerGroup.headers.map(header => {
                                return (
                                    <th key={header.id}
                                        className={`results-table-header-cell ${getColumnStyleName(header.id)}`}
                                        colSpan={header.colSpan}
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : <div>
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
                                                {header.column.getCanFilter() && (
                                                    <div>
                                                        <ResultsTableColumnFilter column={header.column} dates={dates}/>
                                                    </div>
                                                )}
                                            </div>}
                                        {header.column.getCanResize() && (
                                            <div
                                                onMouseDown={header.getResizeHandler()}
                                                onTouchStart={header.getResizeHandler()}
                                                className={`resizer ${
                                                    header.column.getIsResizing() ? 'isResizing' : ''
                                                }`}
                                            ></div>
                                        )}

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
                                className={"results-table-virtualized-row"}
                                style={{
                                    transform: `translateY(${virtualRow.start}px)`, //this should always be a `style`
                                                                                    // as it changes on scroll
                                }}
                            >
                                {row.getVisibleCells().map(cell => {
                                    return (
                                        <td
                                            key={cell.id}
                                            className={`results-table-cell ${getColumnStyleName(cell.column.id)}`}
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


