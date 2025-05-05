import React from "react";
import {Table} from "@tanstack/react-table";
import {exportToCsv, CsvAbleType} from "./download-helper.ts";


/**
 * A button that exports the given React Table as a CSV.
 * @constructor
 */
export function ReactTableCsvExportWidget<T extends CsvAbleType>({table, ...props}: {
    table: Table<T>
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'>) {

    // todo: use <button/>. for now use <input/>
    return (<button {...props} onClick={() => exportToCsv(table)}>Export to CSV</button>)
}
