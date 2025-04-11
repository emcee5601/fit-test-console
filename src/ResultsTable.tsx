/**
 * Table to store the results of fit tests.
 */
import React, {Dispatch, SetStateAction, useContext, useEffect, useState} from 'react'

import './index.css'

import {
    CellContext,
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
import './ResultsTable.css'

import {useVirtualizer} from '@tanstack/react-virtual'
import "react-datepicker/dist/react-datepicker.css";
import {useEditableColumn} from "./use-editable-column-hook.tsx";
import {useSkipper} from "./use-skipper-hook.ts";
import {convertFitFactorToFiltrationEfficiency, getFitFactorCssClass} from "./utils.ts";
import {SimpleResultsDBRecord} from "./SimpleResultsDB.ts";
import {AppSettings, calculateNumberOfExercises} from "./app-settings.ts";
import {AppContext} from "./app-context.ts";
import {DataCollector, DataCollectorListener} from "./data-collector.ts";
import {ResultsTableColumnFilter} from "./ResultsTableColumnFilter.tsx";
import {ReactTableCsvExportWidget} from "./ReactTableCsvExportWidget.tsx";
import {ReactTableQrCodeExportWidget} from "./ReactTableQrCodeExportWidget.tsx";
import {useSetting} from "./use-setting.ts";

//This is a dynamic row height example, which is more complicated, but allows for a more realistic table.
//See https://tanstack.com/virtual/v3/docs/examples/react/table for a simpler fixed row height example.
export function ResultsTable({
    tableData, setTableData,
    searchableColumns = ["Time", "Participant", "Mask", "Notes", "ProtocolName"],
    hideColumns = [],
    minExercisesToShow = 0,
    columnSortingSettingKey = AppSettings.RESULTS_TABLE_SORT
}: {
    tableData: SimpleResultsDBRecord[],
    setTableData: Dispatch<SetStateAction<SimpleResultsDBRecord[]>>,
    searchableColumns?: string[],
    hideColumns?: string[],
    minExercisesToShow?: number,
    columnSortingSettingKey?: AppSettings.RESULTS_TABLE_SORT | AppSettings.PARTICIPANT_RESULTS_TABLE_SORT
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

    function getExerciseResultCell(info: CellContext<SimpleResultsDBRecord, string | number>) {
        const fitFactor = info.getValue<number>();

        const efficiencyPercentage = convertFitFactorToFiltrationEfficiency(fitFactor);
        const classes = getFitFactorCssClass(fitFactor)
        return <span className={classes}>{fitFactor}<br/>{fitFactor > 0 && <span
            className={"efficiency"}>{efficiencyPercentage}%</span>}
        </span>
    }

    // todo: make this a useCallback?
    function createExerciseResultColumn(exerciseNum: number) {
        return createExerciseResultColumnBase(`Ex ${exerciseNum}`)
    }

    function createExerciseResultColumnBase(exercise: string) {
        return {
            accessorKey: exercise,
            cell: getExerciseResultCell,
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
        const cellValue:string = row.getValue(columnId);
        if((filterValue??"").trim() === (cellValue??"").trim()) {
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
                size: 125,
            },
            {
                accessorKey: 'Participant',
                cell: useEditableColumn,
                enableColumnFilter: searchableColumns.includes('Participant'),
                filterFn: safeRegExpFilter,
                size: 150,
            },
            {
                accessorKey: 'Mask',
                cell: useEditableColumn,
                enableColumnFilter: searchableColumns.includes('Mask'),
                filterFn: safeRegExpFilter,
                size: 250,
            },
            {
                accessorKey: 'Notes',
                cell: useEditableColumn,
                enableColumnFilter: searchableColumns.includes('Notes'),
                filterFn: safeRegExpFilter,
                size: 150,
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
                size: 75,
            },
        ],
        [numExerciseColumns]
    )

    const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper()
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility] = useState(hideColumns.reduce((result: { [key: string]: boolean }, column: string) => {
        result[column] = false;
        return result
    }, {}))
    const [sorting, setSorting] = useSetting<SortingState>(columnSortingSettingKey)

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
        const numExercises: { [key: string]: number } = {}
        // load protocols dynamically
        const protocolInstructionSets = appContext.settings.protocolDefinitions;
        for (const protocolName of Object.keys(protocolInstructionSets)) {
            const protocolInstructionSet = protocolInstructionSets[protocolName];
            numExercises[protocolName] = calculateNumberOfExercises(protocolInstructionSet);
        }
        const protocolsShownInTable: string[] = []
        filteredRowModel.rows.forEach((row) => {
            const protocolName = row.original.ProtocolName as string;
            if (!(protocolsShownInTable.includes(protocolName))) {
                protocolsShownInTable.push(protocolName);
            }
        });

        // default to 4. before the protocol column was added, num exercises was hardcoded to 4
        let maxExercises = Math.max(minExercisesToShow, protocolsShownInTable.length, 4)
        protocolsShownInTable.forEach((protocol) => {
            if (protocol in numExercises && numExercises[protocol] > maxExercises) {
                maxExercises = numExercises[protocol];
            }
        })
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


    //All important CSS styles are included as inline styles for this example. This is not recommended for your code.
    return (
        <div style={{height: "100%", display: "flex", flexDirection: "column"}}>
            <div>
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
                    <thead
                        style={{
                            display: 'grid',
                            position: 'sticky',
                            top: 0,
                            zIndex: 1, // table rows are zIndex 0 by default?
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
                                        colSpan={header.colSpan}
                                        style={{position: 'relative', width: header.getSize()}}
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
                                style={{
                                    display: 'flex',
                                    position: 'absolute',
                                    transform: `translateY(${virtualRow.start}px)`, //this should always be a `style`
                                                                                    // as it changes on scroll
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


