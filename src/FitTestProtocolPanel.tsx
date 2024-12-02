import React, {useEffect, useState} from "react";
import {CellContext, ColumnDef, flexRender, getCoreRowModel, useReactTable} from "@tanstack/react-table";
import {FitTestProtocol, fitTestProtocolDb, SampleSource, SamplingStage} from "./fit-test-protocol.ts";
import {useEditableColumn, useEditableNumberColumn} from "./use-editable-column-hook.tsx";
import {useSkipper} from "./use-skipper-hook.ts";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";

export function FitTestProtocolPanel() {
    const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper()
    const [protocols, setProtocols] = useState<FitTestProtocol[]>([])
    const [protocol, setProtocol] = useState<FitTestProtocol>(new FitTestProtocol())
    const [protocolName, setProtocolName] = useState<string>("")
    const [protocolStages, setProtocolStages] = useState<SamplingStage[]>([])

    function getReadonlyCell(info: CellContext<SamplingStage, string | number | undefined>) {
        return <span>{info.getValue()}</span>
    }

    const columns = React.useMemo<ColumnDef<SamplingStage, string | number | undefined>[]>(
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
                cell: info => {
                    return <Select
                        styles={{
                            container: (baseStyles) => ({
                                ...baseStyles,
                                width: "100%",
                            }),
                        }}
                        options={[
                            {
                                // @ts-expect-error not sure why this is a problem. code seems to work properly
                                value: SampleSource.Mask,
                                label: SampleSource.Mask,
                            },
                            {
                                // @ts-expect-error not sure why this is a problem. code seems to work properly
                                value: SampleSource.Ambient,
                                label: SampleSource.Ambient,
                            }
                        ]}
                        value={info.getValue()}
                        onChange={(value) => {
                            info.table.options.meta?.updateData(info.row.index, info.column.id, value)
                        }}
                    />
                }
            },
            {
                accessorKey: 'purgeDuration',
                header: 'Purge Duration',
                size: 100,
                cell: useEditableNumberColumn
            },
            {
                accessorKey: 'purgeInstructions',
                header: 'Purge Instructions',
                size: 200
            },
            {
                accessorKey: 'sampleDuration',
                header: 'Sample Duration',
                size: 100,
                cell: useEditableNumberColumn
            },
            {
                accessorKey: 'sampleInstructions',
                header: 'Sample Instructions',
                size: 300
            },
            {
                header: "op",
                cell: (info) => {
                    return <input type={"button"} value={"Delete Stage"} onClick={() =>
                        deleteStage(info.row.index)
                    }/>;
                }
            }
        ],
        []
    )


    function addStage() {
        // need to change the reference so useState sees the change
        protocol.stages = [...protocol.stages, new SamplingStage(protocol.stages.length + 1)];
        setProtocolStages(protocol.stages);
        saveProtocol(); // save this, because we expect to be able to delete an added stage
    }

    function deleteStage(index: number) {
        if (protocol) {
            delete protocol.stages[index]
            saveProtocol();
            setProtocolStages(protocol.stages)
        }
    }

    function saveProtocol() {
        if (protocol && protocol.name) {
            // don't save protocols without names
            fitTestProtocolDb.saveProtocol(protocol)
        }
    }

    function createNewProtocol(name: string) {
        const newProtocol = new FitTestProtocol(name)
        console.log(`create new protocol ${name}`)
        fitTestProtocolDb.saveProtocol(newProtocol) // need to do this because useState is async
        loadProtocols()
    }

    function deleteProtocol() {
        if (protocol.index) {
            const response = confirm(`Delete protocol ${protocol.name} (#${protocol.index})?`)
            if (response) {
                fitTestProtocolDb.deleteProtocol(protocol);
                loadProtocols();
            }
        }
    }

    const table = useReactTable({
        data: protocolStages,
        columns,
        defaultColumn: {cell: useEditableColumn},
        getCoreRowModel: getCoreRowModel(),
        autoResetPageIndex,
        // Provide our updateData function to our table meta
        meta: {
            updateData: (rowIndex, columnId, value) => {
                // Skip page index reset until after next rerender
                skipAutoResetPageIndex()
                // replace the updated stage's updated column value
                setProtocolStages((old) => {
                    const stages = old.map((stage, index) => {
                        if (index == rowIndex) {
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
            if(protocols.length > 0) {
                setProtocol(protocols[0]) // todo: set this to the selected one or the first one if the selected one doesn't exist (because it was deleted)
                setProtocolName(protocols[0].name as string)
                setProtocolStages(protocols[0].stages)
            }
        })
    }

    useEffect(() => {
        fitTestProtocolDb.open().then(() => {
            console.log("fit test protocol database opened")
            loadProtocols()
        })
    }, []);

    function protocolSelectionChanged(index: number | undefined) {
        // index should be a number. since it's always from protocol.index. but somehow going through a select to its event it becomes a string?
        const protocol = protocols.find((protocol) => {
            return protocol.index === Number(index)
        });
        if (protocol) {
            setProtocol(protocol)
            setProtocolName(protocol.name as string)
            setProtocolStages(protocol.stages)
            console.log(`protocol selection changed to ${protocol.name} (${protocol.index})`)
        } else {
            console.log(`could not find protocol with key ${index}`)
        }
    }

    function protocolNameChanged(event: React.ChangeEvent<HTMLInputElement>) {
        const newProtocolName = event.target.value;
        setProtocolName(newProtocolName);
        if (protocol.index) {
            // only save if we have an index, otherwise we keep creating them.
            protocol.name = newProtocolName;  // update this here since setState is delayed
            saveProtocol()
        }
    }

    return (
        <div className="p-2">
            <div className="h-2"/>
            <CreatableSelect
                name={"Protocol"}
                options={protocols.map((protocol) => {
                    return {
                        value: protocol.index,
                        label: `${protocol.name} (#${protocol.index})`
                    }
                })}
                value={{value: protocol?.index, label: `${protocol.name} (#${protocol.index})`}}
                styles={{
                    container: (baseStyles) => ({
                        ...baseStyles,
                        display: "inline-flex",
                    }),
                    control: (baseStyles) => ({
                        ...baseStyles,
                        width: "200px"
                    })
                }}
                onChange={(event) => protocolSelectionChanged(event?.value)}
                onCreateOption={createNewProtocol}
                isSearchable={true}/>
            <input value={protocolName} onChange={(event) => protocolNameChanged(event)}/>
            <input type={"button"} value={"Add stage"} onClick={addStage}/>
            <input type={"button"} value={"Delete protocol"} onClick={deleteProtocol}/>
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
