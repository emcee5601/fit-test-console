import React, {useEffect, useState} from "react";
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

    const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper()
    const [stages, setStages] = React.useState<SamplingStage[]>([])
    const [protocol, setProtocol] = useState<FitTestProtocol>()
    const [protocols, setProtocols] = useState<FitTestProtocol[]>([])

    function addStage() {
        setStages((prev) => ([ ...prev, new SamplingStage(prev.length+1) ]))
    }
    function saveProtocol() {
        if(protocol) {
            protocol.stages = stages;
            fitTestProtocolDb.saveProtocol(protocol)
        }
    }

    const table = useReactTable({
        data: stages,
        columns,
        defaultColumn: {cell:useEditableColumn},
        getCoreRowModel: getCoreRowModel(),
        autoResetPageIndex,
        // Provide our updateData function to our table meta
        meta: {
            updateData: (rowIndex, columnId, value) => {
                // Skip page index reset until after next rerender
                skipAutoResetPageIndex()
                setStages(old =>
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

    function loadProtocols() {
        fitTestProtocolDb.getAllProtocols().then((protocols) => {
            console.log(`got protocols ${JSON.stringify(protocols)}`)
            setProtocols(protocols)
        })
    }

    useEffect(() => {
        fitTestProtocolDb.open().then(() => {
            console.log("fit test protocol database opened")
            loadProtocols()
        })
    }, []);

    function protocolSelectionChanged(index: number|string) {
        // index should be a number. since it's always from protocol.index. but somehow going through a select to its event it becomes a string?
        const protocol = protocols.find((protocol) => {
            return protocol.index === Number(index)
        });
        if(protocol) {
            setProtocol(protocol)
            setStages(protocol.stages)
        } else {
            console.log(`could not find protocol with key ${index}`)
        }
    }

    return (
        <div className="p-2">
            <div className="h-2"/>
            <select onChange={(event) => protocolSelectionChanged(event.target.value)}>
                {protocols.map((protocol, index) => (
                    <option key={index} value={protocol.index}>{protocol.name}</option>
                ))}
            </select>
            <input type={"button"} value={"Add stage"} onClick={addStage}/>
            <input type={"button"} value={"Save protocol"} onClick={saveProtocol}/>
            <table>
                <thead>
                {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id} style={{display: 'flex', width: '100%'}}>
                        {headerGroup.headers.map(header => {
                            return (
                                <th key={header.id} colSpan={header.colSpan}
                                    style={{
                                        display: 'flex',
                                        width: header.column.getSize(),
                                    }}
                                >
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
                        <tr key={row.id} style={{display: 'flex', width: '100%'}}>
                            {row.getVisibleCells().map(cell => {
                                return (
                                    <td key={cell.id}
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
    )
}
