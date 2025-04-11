import React from "react";
import {Table} from "@tanstack/react-table";
import {exportToCsv, CsvAbleType} from "./download-helper.ts";


/**
 * A button that exports the given React Table as a CSV.
 * @constructor
 */
export function ReactTableCsvExportWidget<T extends CsvAbleType>({table, ...props}: {
    table: Table<T>
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onClick'>) {

    // todo: use <button/>. for now use <input/>
    return (<input type={"button"} value={"Export to CSV"} {...props}
                   onClick={() => exportToCsv(table)}/>)
}
