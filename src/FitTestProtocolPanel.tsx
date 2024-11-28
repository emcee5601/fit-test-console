import React, {useEffect} from "react";
import {ColumnDef, flexRender, getCoreRowModel, useReactTable} from "@tanstack/react-table";
import {FitFactorCalculationMethod, FitTestProtocol, fitTestProtocolDb, SamplingStage} from "./fit-test-protocol.ts";
import {useEditableColumn} from "./use-editable-column-hook.tsx";
import {useSkipper} from "./use-skipper-hook.ts";

export function FitTestProtocolPanel() {
    const columns = React.useMemo<ColumnDef<SamplingStage>[]>(
        () => [
            {
                accessorKey: 'index',
                header: '#',
            },
            {
                accessorKey: 'name',
                header: 'Stage Name',
            },
            {
                accessorKey: 'source',
                header: 'Sample Source',
            },
            {
                accessorKey: 'purgeDuration',
                header: 'Purge Duration',
            },
            {
                accessorKey: 'purgeInstructions',
                header: 'Purge Instructions',
            },
            {
                accessorKey: 'sampleDuration',
                header: 'Sample Duration',
            },
            {
                accessorKey: 'sampleInstructions',
                header: 'Sample Instructions',
            },
        ],
        []
    )

    const [data, setData] = React.useState<SamplingStage[]>([])
    const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper()

    function addStage() {
        setData((prev) => ([ ...prev, new SamplingStage(prev.length+1) ]))
    }
    function saveProtocol() {
        const protocol = new FitTestProtocol();
        protocol.fitFactorCalculationMethod = FitFactorCalculationMethod.Before
        protocol.name = "my protocol"
        protocol.setStages(data)
        fitTestProtocolDb.saveProtocol( protocol)
    }

    const table = useReactTable({
        data,
        columns,
        defaultColumn: {cell:useEditableColumn},
        getCoreRowModel: getCoreRowModel(),
        autoResetPageIndex,
        // Provide our updateData function to our table meta
        meta: {
            updateData: (rowIndex, columnId, value) => {
                // Skip page index reset until after next rerender
                skipAutoResetPageIndex()
                setData(old =>
                    old.map((row, index) => {
                        if (index === rowIndex) {
                            return {
                                ...old[rowIndex]!,
                                [columnId]: value,
                            }
                        }
                        return row
                    })
                )
            },
        },
        debugTable: true,
    })

    useEffect(() => {
        fitTestProtocolDb.open().then(() => "fit test protocol database opened")
    }, []);

    return (
        <div className="p-2">
            <div className="h-2"/>
            <input type={"button"} value={"Add stage"} onClick={addStage}/>
            <input type={"button"} value={"Save protocol"} onClick={saveProtocol}/>
            <table>
                <thead>
                {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => {
                            return (
                                <th key={header.id} colSpan={header.colSpan}>
                                    {header.isPlaceholder ? null : (
                                        <div>
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                        </div>
                                    )}
                                </th>
                            )
                        })}
                    </tr>
                ))}
                </thead>
                <tbody>
                {table.getRowModel().rows.map(row => {
                    return (
                        <tr key={row.id}>
                            {row.getVisibleCells().map(cell => {
                                return (
                                    <td key={cell.id}>
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
    )
}
