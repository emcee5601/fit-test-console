import React, {useEffect, useState} from "react";
import {CellContext, ColumnDef, flexRender, getCoreRowModel, useReactTable} from "@tanstack/react-table";
import {FitTestProtocol, fitTestProtocolDb, SamplingStage} from "./fit-test-protocol.ts";
import {useEditableColumn} from "./use-editable-column-hook.tsx";
import {useSkipper} from "./use-skipper-hook.ts";

export function FitTestProtocolPanel() {
    function getReadonlyCell(info: CellContext<SamplingStage, string|number|undefined>) {
        return <span>{info.getValue()}</span>
    }

    const columns = React.useMemo<ColumnDef<SamplingStage, string|number|undefined>[]>(
        () => [
            {
                accessorKey: 'index',
                header: '#',
                cell: getReadonlyCell,
                size: 50,
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
                size: 200
            },
            {
                accessorKey: 'sampleDuration',
                header: 'Sample Duration',
            },
            {
                accessorKey: 'sampleInstructions',
                header: 'Sample Instructions',
                size: 300
            },
        ],
        []
    )

    const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper()
    const [protocols, setProtocols] = useState<FitTestProtocol[]>([])
    const [protocol, setProtocol] = useState<FitTestProtocol>(new FitTestProtocol())
    const [protocolName, setProtocolName] = useState<string>("")
    const [protocolStages, setProtocolStages] = useState<SamplingStage[]>([])

    function addStage() {
        // need to change the reference so useState sees the change
        protocol.stages = [...protocol.stages, new SamplingStage(protocol.stages.length+1)];
        setProtocolStages(protocol.stages);
    }
    function saveProtocol() {
        if(protocol) {
            fitTestProtocolDb.saveProtocol(protocol)
        }
    }
    function createNewProtocol() {
        // todo: implement me
    }
    function deleteProtocol() {
        if(protocol.index) {
            fitTestProtocolDb.deleteProtocol(protocol);
            loadProtocols();
        }
    }

    const table = useReactTable({
        data: protocolStages,
        columns,
        defaultColumn: {cell:useEditableColumn},
        getCoreRowModel: getCoreRowModel(),
        autoResetPageIndex,
        // Provide our updateData function to our table meta
        meta: {
            updateData: (rowIndex, columnId, value) => {
                // Skip page index reset until after next rerender
                skipAutoResetPageIndex()
                // replace the updated stage's updated column value
                setProtocolStages((old) => {
                    const stages = old.map((stage, index) =>
                    {
                        if(index == rowIndex) {
                            return {...old[rowIndex]!, [columnId]: value};
                        }
                        return stage;
                    });
                    protocol.stages = stages; // update it
                    return stages;
                })
                saveProtocol()
            },
        },
        debugTable: true,
    })

    function loadProtocols() {
        fitTestProtocolDb.getAllProtocols().then((protocols) => {
            console.log(`got protocols ${JSON.stringify(protocols)}`)
            setProtocols(protocols)
            setProtocol(protocols[0]) // todo: set this to the selected one or the first one if the selected one doesn't exist (because it was deleted)
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
            setProtocolName(protocol.name as string)
            setProtocolStages(protocol.stages)
            console.log(`protocol selection changed to ${protocol.name} (${protocol.index}`)
        } else {
            console.log(`could not find protocol with key ${index}`)
        }
    }

    function protocolNameChanged(event: React.ChangeEvent<HTMLInputElement>) {
        const newProtocolName = event.target.value;
        setProtocolName(newProtocolName);
        if(protocol.index) {
            // only save if we have an index, otherwise we keep creating them.
            protocol.name = newProtocolName;  // update this here since setState is delayed
            saveProtocol()
        }
    }

    return (
        <div className="p-2">
            <div className="h-2"/>
            <select onChange={(event) => protocolSelectionChanged(event.target.value)}
                    value={protocol.index}
            >
                {protocols.map((protocol, index) => (
                    <option key={index} value={protocol.index}>{protocol.name}</option>
                ))}
            </select>
            <input value={protocolName} onChange={(event) => protocolNameChanged(event)}/>
            <input type={"button"} value={"Add stage"} onClick={addStage}/>
            <input type={"button"} value={"Delete protocol"} onClick={deleteProtocol}/>
            <input type={"button"} value={"New protocol"} onClick={createNewProtocol}/>
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
