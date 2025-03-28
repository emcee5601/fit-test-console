import {Column} from "@tanstack/react-table";
import {SimpleResultsDBRecord} from "./SimpleResultsDB.ts";
import {DebouncedInput} from "./DebouncedInput.tsx";
import DatePicker from "react-datepicker";

export function ResultsTableColumnFilter<V>({column, dates}: {
    column: Column<SimpleResultsDBRecord, V>,
    dates: Date[]
}) {
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
                               showMonthYearDropdown={true}
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
