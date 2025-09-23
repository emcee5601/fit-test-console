import {CellContext, RowData} from "@tanstack/react-table";
import React, {useCallback, useContext, useEffect} from "react";
import {useInView} from "react-intersection-observer";
import {numberInputClasses, Unstable_NumberInput as NumberInput} from "@mui/base/Unstable_NumberInput";
import {useTheme} from '@mui/system';
import {SimpleResultsDBRecord} from "src/SimpleResultsDB.ts";
import {convertFitFactorToFiltrationEfficiency, getColorForFitFactor, getFitFactorCssClass} from "src/utils.ts";
import {AppContext} from "src/app-context.ts";
import {SmartTextArea} from "src/SmartTextArea.tsx";
import {MaskSelectorWidget} from "src/MaskSelectorWidget.tsx";
import {ControlSource, SampleSource} from "src/portacount/porta-count-state.ts";

declare module '@tanstack/react-table' {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface TableMeta<TData extends RowData> {
        updateData: (rowIndex: number, columnId: string, value: string | number | unknown) => void
    }

    //allows us to define custom properties for our columns
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface ColumnMeta<TData extends RowData, TValue> {
        filterVariant?: 'text' | 'range' | 'select' | 'date' | 'mask'
    }
}

export function useEditableExerciseResultColumn<T extends SimpleResultsDBRecord, V extends string | number | boolean>({
    getValue,
    row,
    column: {id},
    table
}: CellContext<T, V>) {
    const appContext = useContext(AppContext)
    const {index} = row;
    const initialValue = getValue()
    // We need to keep and update the state of the cell normally
    const [value, setValue] = React.useState<V>(initialValue)

    /**
     * Since we're using DebouncedInput, we'll get an update event quickly. This happen before the component
     * scrolls off screen in most cases. So no need to try to detect when it goes off screen. Which may not work
     * properly in a virtualized table anyway.
     */
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
        onBlur()
    }, [value]);

    const {exerciseNum} = id.match(/.*?(?<exerciseNum>[0-9]+)$/)?.groups ?? {exerciseNum: 0} // ex 0 == final
    const protocolHasThisManyExercises = row.original.ProtocolName && appContext.settings.numExercisesForProtocol[row.original.ProtocolName] >= Number(exerciseNum) || false;
    const editable = row.original.TestController === ControlSource.Manual && protocolHasThisManyExercises
    const maskConcentration = (row.original.ParticleCounts ?? []).filter((particleCount) => particleCount.type === SampleSource.MASK).at(Number(exerciseNum) - 1)?.count ?? 0

    const fitFactor = Number(value);
    const efficiencyPercentage = convertFitFactorToFiltrationEfficiency(fitFactor);
    const classes = getFitFactorCssClass(value as string, protocolHasThisManyExercises)
    const color = getColorForFitFactor(value as string, protocolHasThisManyExercises)

    return (
        <div className={[classes, "table-cell"].join(" ")} style={{width: "100%", display: "inline-flex", flexDirection: "column", backgroundColor: color}}>
            <div className={"inline-flex"}>
                {editable
                    ? <SmartTextArea
                        id={`${row.original.ID}-${id}`}
                        resize={false}
                        oneLine={true}
                        // style={{minWidth: 0, minHeight: 0, width: "calc(100% - 0.3em)"}}
                        initialValue={value ? value as string : ""}
                        onChange={value => setValue(value as V)}
                        onBlur={onBlur}
                        placeholder={`${id}`}
                    />
                    : <div>{value}</div>
                }{(value && row.original.ParticleCounts && maskConcentration === 0) && "*"}
            </div>
            {fitFactor > 0 && <span className={"efficiency"}>{efficiencyPercentage}%</span>}
        </div>
    )
}

export function useEditableColumn<T, V>({
    getValue,
    row: {index},
    column: {id},
    table
}: CellContext<T, V | unknown>) {
    const initialValue = getValue()
    // We need to keep and update the state of the cell normally
    const [value, setValue] = React.useState<V>(initialValue as V)

    // When the input is blurred, we'll call our table meta's updateData function
    const onBlur = useCallback(() => {
        if (value != initialValue) {
            // only update if changed
            table.options.meta?.updateData(index, id, value)
        }
    }, [value, id, index, table.options.meta, initialValue])

    // If the initialValue is changed external, sync it up with our state
    React.useEffect(() => {
        setValue(initialValue as V)
    }, [initialValue])
    useEffect(() => {
        onBlur();
    }, [value]);

    return (
        <SmartTextArea className={"table-cell"}
            id={`${String(index)}-${id}`}
            onChangeOnlyOnBlur={true}
            initialValue={value ? value as string : ""}
            onChange={v => setValue(v as V)}
            onBlur={onBlur}
            placeholder={`Click to add ${id}`}
        ></SmartTextArea>
    )
}

export function useEditableMaskColumn<T, V>({
    getValue,
    row: {index},
    column: {id},
    table
}: CellContext<T, V>) {
    const initialValue = getValue()
    // We need to keep and update the state of the cell normally
    const [value, setValue] = React.useState<V>(initialValue)

    const onChange = useCallback((newValue: string) => {
        if (newValue != initialValue) {
            // only update if changed
            table.options.meta?.updateData(index, id, newValue)
            setValue(newValue as V)
        }
    }, [value, id, index, table.options.meta, initialValue])

    // console.debug(`normalizing ${value} => ${normalizeMaskName(value as string)}`)

    return (
        <MaskSelectorWidget id={String(index)} className={"table-cell"} value={(value as string) ?? ""} onChange={(v) => onChange(v)}/>
    )
}

// from https://mui.com/base-ui/react-number-input/
const cyan = {
    50: '#E9F8FC',
    100: '#BDEBF4',
    200: '#99D8E5',
    300: '#66BACC',
    400: '#1F94AD',
    500: '#0D5463',
    600: '#094855',
    700: '#063C47',
    800: '#043039',
    900: '#022127',
};

const grey = {
    50: '#F3F6F9',
    100: '#E5EAF2',
    200: '#DAE2ED',
    300: '#C7D0DD',
    400: '#B0B8C4',
    500: '#9DA8B7',
    600: '#6B7A90',
    700: '#434D5B',
    800: '#303740',
    900: '#1C2025',
};

function useIsDarkMode() {
    const theme = useTheme();
    return theme.palette.mode === 'dark';
}

function Styles() {
    // Replace this with your app logic for determining dark mode
    const isDarkMode = useIsDarkMode();

    return (
        <style>
            {`
      .CustomNumberInput {
        font-family: 'IBM Plex Sans', sans-serif;
        font-weight: 400;
        border-radius: 8px;
        color: ${isDarkMode ? grey[300] : grey[900]};
        background: ${isDarkMode ? grey[900] : '#fff'};
        border: 1px solid ${isDarkMode ? grey[700] : grey[200]};
        box-shadow: 0px 2px 2px ${isDarkMode ? grey[900] : grey[50]};
        display: grid;
        grid-template-columns: 1fr 19px;
        grid-template-rows: 1fr 1fr;
        overflow: hidden;
        column-gap: 8px;
        padding: 4px;
        width: 100%;
      }

      .CustomNumberInput:hover {
        border-color: ${cyan[400]};
      }

      .CustomNumberInput.${numberInputClasses.focused} {
        border-color: ${cyan[400]};
        box-shadow: 0 0 0 3px ${isDarkMode ? cyan[600] : cyan[200]};
      }

      .CustomNumberInput .input {
        font-size: 0.875rem;
        font-family: inherit;
        font-weight: 400;
        line-height: 1.5;
        grid-column: 1/2;
        grid-row: 1/3;
        color: ${isDarkMode ? grey[300] : grey[900]};
        background: inherit;
        border: none;
        border-radius: inherit;
        padding: 8px 12px;
        outline: 0;
        width: calc(100% - 20px);
      }

      .CustomNumberInput .input:focus-visible {
        outline: 0;
      }

      .CustomNumberInput .btn {
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;
        appearance: none;
        padding: 0;
        width: 19px;
        height: 19px;
        font-family: system-ui, sans-serif;
        font-size: 0.875rem;
        line-height: 1;
        box-sizing: border-box;
        background: ${isDarkMode ? grey[900] : '#fff'};
        border: 0;
        color: ${isDarkMode ? grey[300] : grey[900]};
        transition-property: all;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 120ms;
      }

      .CustomNumberInput .btn:hover {
        background: ${isDarkMode ? grey[800] : grey[50]};
        border-color: ${isDarkMode ? grey[600] : grey[300]};
        cursor: pointer;
      }

      .CustomNumberInput .btn.increment {
        grid-column: 2/3;
        grid-row: 1/2;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        border: 1px solid;
        border-bottom: 0;
        &:hover {
          cursor: pointer;
          background: ${cyan[400]};
          color: ${grey[50]};
        }
        border-color: ${isDarkMode ? grey[800] : grey[200]};
        background: ${isDarkMode ? grey[900] : grey[50]};
        color: ${isDarkMode ? grey[200] : grey[900]};
      }

      .CustomNumberInput .btn.decrement {
        grid-column: 2/3;
        grid-row: 2/3;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
        border: 1px solid;
        &:hover {
          cursor: pointer;
          background: ${cyan[400]};
          color: ${grey[50]};
        }
        border-color: ${isDarkMode ? grey[800] : grey[200]};
        background: ${isDarkMode ? grey[900] : grey[50]};
        color: ${isDarkMode ? grey[200] : grey[900]};
        }

      & .arrow {
        transform: translateY(-1px);
      }
      `}
        </style>
    );
}

export function useEditableNumberColumn<T>({
    getValue,
    row: {index},
    column: {id},
    table
}: CellContext<T, string | number | undefined>) {
    const initialValue = getValue() as number
    // We need to keep and update the state of the cell normally
    const [value, setValue] = React.useState<number | null | undefined>(initialValue as number)
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

    return (<>
            <NumberInput ref={ref}
                         placeholder={`Click to add ${id}`}
                         value={value as number}
                         onChange={(_event, value) => setValue(value)}
                         onBlur={onBlur}

                         slotProps={{
                             root: {className: 'CustomNumberInput'},
                             input: {className: 'input'},
                             decrementButton: {className: 'btn decrement', children: '▾'},
                             incrementButton: {className: 'btn increment', children: '▴'},
                         }}
            />
            <Styles/>
        </>
    )
}

