/**
 * Table to store the results of fit tests.
 */
import React, {Dispatch, SetStateAction, useEffect, useState} from 'react'

import './index.css'

import {
    CellContext,
    Column,
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
import LZString from 'lz-string'
import './ResultsTable.css'

import {useVirtualizer} from '@tanstack/react-virtual'
import {AppSettings, SETTINGS_DB, useDBSetting} from "./settings-db.ts";
import {download, generateCsv, mkConfig} from "export-to-csv";
import {DataCollector} from "./data-collector.tsx";
import {createMailtoLink} from "./html-data-downloader.ts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {useEditableColumn} from "./use-editable-column-hook.tsx";
import {useSkipper} from "./use-skipper-hook.ts";
import {convertFitFactorToFiltrationEfficiency, getFitFactorCssClass} from "./utils.ts";
import {QRCodeSVG} from "qrcode.react";
import {SimpleResultsDBRecord} from "./SimpleResultsDB.ts";
import {sanitizeRecord} from "./results-transfer-util.ts";
import {JSONContent} from "vanilla-jsoneditor";

//This is a dynamic row height example, which is more complicated, but allows for a more realistic table.
//See https://tanstack.com/virtual/v3/docs/examples/react/table for a simpler fixed row height example.
export function ResultsTable({tableData, setTableData, dataCollector}: {
    tableData: SimpleResultsDBRecord[],
    setTableData: Dispatch<SetStateAction<SimpleResultsDBRecord[]>>,
    dataCollector?: DataCollector,
}) {
    if (dataCollector) {
        dataCollector.setResultsCallback(setTableData)
    }

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
        return Array.from(Array(numExercises).keys()).map((num) => createExerciseResultColumn(num + 1))
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

    const [numExerciseColumns, setNumExerciseColumns] = useState(4)

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
                enableColumnFilter: true,
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
                enableColumnFilter: true,
                filterFn: (row, columnId, filterValue) => {
                    return RegExp(filterValue, "i").test(row.getValue(columnId));
                },
                size: 150,
            },
            {
                accessorKey: 'Mask',
                cell: useEditableColumn,
                filterFn: (row, columnId, filterValue) => {
                    return RegExp(filterValue, "i").test(row.getValue(columnId));
                },
                size: 250,
            },
            {
                accessorKey: 'Notes',
                cell: useEditableColumn,
                filterFn: (row, columnId, filterValue) => {
                    return RegExp(filterValue, "i").test(row.getValue(columnId));
                },
                size: 150,
            },
            createExerciseResultColumnBase("Final"),
            ...createExerciseResultColumns(numExerciseColumns),
            {
                accessorKey: 'ProtocolName',
                header: 'Protocol',
                enableColumnFilter: false,
                size: 75,
            },
        ],
        [numExerciseColumns]
    )

    const [qrcodeUrl, setQrcodeUrl] = useState<string>("")
    const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper()
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [sorting, setSorting] = useDBSetting<SortingState>(AppSettings.RESULTS_TABLE_SORT, [{
            id: 'ID',
            desc: true,
        }]
    )

    const table = useReactTable({
        data: tableData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
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
        const filteredRowModel = table.getFilteredRowModel();
        const numExercises: { [key: string]: number } = {}
        // load protocols dynamically
        // todo: do this more efficiently (use helpers to get protocol definitions, cache them)
        SETTINGS_DB.open().then(() => {
            SETTINGS_DB.getSetting<JSONContent>(AppSettings.PROTOCOL_INSTRUCTION_SETS).then((protocolInstructionSets: JSONContent) => {
                const protocolInstructionSetsJson = protocolInstructionSets.json as { [key: string]: [] };
                for (const protocolName of Object.keys(protocolInstructionSetsJson)) {
                    const protocolInstructionSet = protocolInstructionSetsJson[protocolName];
                    numExercises[protocolName] = protocolInstructionSet.length;
                }
                const protocolsShownInTable: string[] = []
                filteredRowModel.rows.forEach((row) => {
                    const protocolName = row.getValue("ProtocolName") as string;
                    if (!(protocolsShownInTable.includes(protocolName))) {
                        protocolsShownInTable.push(protocolName);
                    }
                });

                // todo: if no records are on display, default to the currently selected protocol in the protocol dropdown

                // default to 4. before the protocol column was added, num exercises was hardcoded to 4
                let maxExercises = protocolsShownInTable.length == 0 ? 0 : 4;
                protocolsShownInTable.forEach((protocol) => {
                    if (protocol in numExercises && numExercises[protocol] > maxExercises) {
                        maxExercises = numExercises[protocol];
                    }
                })
                setNumExerciseColumns(maxExercises);
            })
        });

    }, [columnFilters]);

    useEffect(() => {
        if (dataCollector) {
            console.log(`initializing results db`)
            dataCollector.resultsDatabase.open().then(() => dataCollector.resultsDatabase.getAllData().then(data => {
                setTableData(data);
            }));
        } else {
            console.log("no data collector, we must be in test result view mode")
        }
    }, [dataCollector?.resultsDatabase]);

    useEffect(() => {
        if (qrcodeUrl) {
            console.log("adding key listener")
            const keyListener = (keyEvent: KeyboardEvent) => {
                console.log(`key listener got event: ${JSON.stringify(keyEvent)}`)
                if (keyEvent.code === "Escape") {
                    setQrcodeUrl("");
                }
            };
            window.addEventListener("keydown", keyListener)
            return () => {
                window.removeEventListener("keypress", keyListener)
                console.log("removed key listener")
            }
        }
    }, [qrcodeUrl]);

    function generateCsvPayload() {
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
        return {csvConfig, csv};
    }

    function handleExportAsCsv() {
        const {csvConfig, csv} = generateCsvPayload();
        download(csvConfig)(csv)
    }

    function handleMailto() {
        // can't have html body, so we'll construct something that's easily readable (not csv)

        const rows = table.getSortedRowModel().rows
        const rowData: SimpleResultsDBRecord[] = rows.map((row) => row.original)
        let body = "Your fit test results:\n\n"
        // TODO: dynamically figure out field names
        const fields = ['Time', 'Participant', 'Mask', 'Notes', 'Ex 1', 'Ex 2', 'Ex 3', 'Ex 4', 'Final'];
        rowData.forEach((row) => {
            const rowInfo: string[] = []
            fields.forEach((key) => {
                if (key in row) {
                    rowInfo.push(`${key}: ${row[key]}`)
                }
            })

            body = body + rowInfo.join("\n") + "\n\n"
        })

        const link = createMailtoLink("", "Fit test results", body);
        link.click()
    }

    function generateQRCode() {
        // first, extract data and compress it with lz-string

        // The table is filtered, so look at the filtered table data for which record IDs to include. Then grab these from localTableData
        const rows = table.getSortedRowModel().rows
        const rowData = rows.map((row) => row.original)
        const recordIdsToInclude: number[] = rowData.map(rd => rd.ID)

        const recordsToExport: SimpleResultsDBRecord[] = tableData
            .filter((row) => recordIdsToInclude.includes(row.ID))
            .map((record) => sanitizeRecord(record));

        const str = LZString.compressToEncodedURIComponent(JSON.stringify(recordsToExport));
        // sometimes location has a trailing '/', remove it so we don't get a '//'. This behavior is different between local and prod for some reason
        const baseLocation = location.toString().replace(/\/$/, '')
        // const baseLocation = "https://emcee5601.github.io/fit-test-console"
        const url = `${baseLocation}/view-results?data=${str}`;
        console.log(`url is: ${url}`)
        console.log(`url length is ${url.length}`);
        if (url.length > 4296) {
            console.log("url is too long")
        } else {
            setQrcodeUrl(url);
        }
    }

    /**
     * Returns a string summarising the filters in effect.
     */
    function getFilterSummary(): string {
        let dateFilter = "";
        let participantFilter = "";
        columnFilters.forEach((columnFilter) => {
            if ("Time" === columnFilter.id) {
                dateFilter = columnFilter.value as string;
            }
            if ("Participant" === columnFilter.id) {
                participantFilter = columnFilter.value as string;
            }
        })
        return [participantFilter && `for ${participantFilter}`, dateFilter && `on ${dateFilter}`].join(" ")
    }

    //All important CSS styles are included as inline styles for this example. This is not recommended for your code.
    return (
        <div>
            {qrcodeUrl &&
                <div className={"full-screen-overlay"}>
                    <div onClick={() => setQrcodeUrl("")} id="results-qrcode">
                        <span style={{display: "block"}}>Fit test results {getFilterSummary()}</span>
                        <QRCodeSVG value={qrcodeUrl}
                                   size={512}
                                   marginSize={2}
                                   title={"Fit Test Results"}/>
                    </div>
                </div>}
            <input type={"button"} value={"Export as CSV"} onClick={() => handleExportAsCsv()}/>
            <input type={"button"} value={"Email"} onClick={() => handleMailto()}/>
            <input type={"button"} value={"QR Code"} onClick={() => generateQRCode()}/>
            <div
                className="container"
                ref={tableContainerRef}
                style={{
                    overflow: 'auto', //our scrollable table container
                    position: 'relative', //needed for sticky header
                    height: '80vh', //should be a fixed height
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
                                                <Filter column={header.column} dates={dates}/>
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


function Filter<V>({column, dates}: { column: Column<SimpleResultsDBRecord, V>, dates: Date[] }) {
    const columnFilterValue = column.getFilterValue()
    const {filterVariant} = column.columnDef.meta ?? {}

    switch (filterVariant) {
        case 'range':
            return <div>
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
                <div className="h-1"/>
            </div>
        case 'select':
            return <select
                onChange={e => column.setFilterValue(e.target.value)}
                value={columnFilterValue?.toString()}
            >
                {/* See faceted column filters example for dynamic select options */}
                <option value="">All</option>
                <option value="complicated">complicated</option>
                <option value="relationship">relationship</option>
                <option value="single">single</option>
            </select>
        case 'date': {
            const curFilter = column.getFilterValue() as string;
            const selectedDate = curFilter ? new Date(curFilter) : null;
            return <DatePicker minDate={new Date("2024-01-01")} maxDate={new Date()}
                               isClearable={true}
                               placeholderText={"Search..."}
                               selected={selectedDate}
                               includeDates={dates}
                               showIcon={true}
                               showDisabledMonthNavigation={true}
                               className={'datePickerInput'}
                               todayButton={<input type={"button"} value={"Today"}/>}
                               onChange={(value) => column.setFilterValue(value?.toLocaleDateString())}
            ></DatePicker>
        }
        default:
            return <DebouncedInput
                className="filterInput"
                onChange={value => column.setFilterValue(value)}
                placeholder={`Search...`}
                type="text"
                value={(columnFilterValue ?? '') as string}
            />
    }
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
        // adding onChange and debounce here cause constant re-renders. The linter says to useCallback on them, then to memoize the deps of the callback, but suppressing is simpler for now since we don't actually want to do anything when those change
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])

    return (
        <input {...props} value={value} onChange={e => setValue(e.target.value)}/>
    )
}
