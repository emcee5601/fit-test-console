/*
Download data from an HTML elements in various formats.
Not all combination of elements and formats are supported.
*/


function getFilenamePrefix(htmlElement:HTMLElement, filenamePrefixHint = "data") {
    return (htmlElement.id || htmlElement.nodeName || filenamePrefixHint) + "_";
}

/**
 * Download the terminal's contents to a file. from https://github.com/GoogleChromeLabs/serial-terminal/blob/main/src/index.ts
 */
function createFauxLink(fileName:string, contents:string) {
    const linkContent = URL.createObjectURL(
        new Blob([new TextEncoder().encode(contents).buffer],
            {type: 'text/plain'}));
    const fauxLink = document.createElement('a');
    fauxLink.download = fileName;
    fauxLink.href = linkContent;
    return fauxLink;
}

/**
 * @param data must have a value property (for now)
 * @param filenameHint
 */
export function downloadRawData(data:string, filenameHint = "data") {
    const fauxLink = createFauxLink(`${filenameHint}_${new Date().getTime()}.txt`, data);
    fauxLink.click();
}

export function downloadTableAsCSV(tableElement:HTMLTableElement, filenameHint = "table") {
    const tableData = [];
    const rowElements = tableElement.getElementsByTagName("tr");
    for (let row = 0; row < rowElements.length; row++) {
        const rowData:string[] = [];
        let cells = rowElements[row].getElementsByTagName("td");
        if (cells.length === 0) {
            cells = rowElements[row].getElementsByTagName("th");
        }
        for (let i = 0; i < cells.length; i++) {
            rowData.push(cells[i].innerText);
        }
        // use a replacer function to replace more than the first match
        tableData.push(rowData.map((value) => `"${value.replace("\"", () => "\"\"")}"`).join(","));
    }

    const fauxLink = createFauxLink(`${getFilenamePrefix(tableElement, filenameHint)}${new Date().getTime()}.csv`, tableData.join("\n"));
    fauxLink.click();
}

export interface Dict<T> {
    [key: string]: T;
}

export function jsonifyTableRow(orderedColumnNames:string[], tableRowElement:HTMLTableRowElement):Dict<string> {
    const orderedColumnCells = tableRowElement.getElementsByTagName("td");
    const rowData: Dict<string> = {}
    for (let i = 0; i < orderedColumnNames.length; i++) {
        if (orderedColumnCells.length <= i) {
            break; // no more cells (aborted)
        }
        rowData[orderedColumnNames[i]] = orderedColumnCells[i].innerText; // todo: convert line breaks
    }
    return rowData;
}

export function getTableColumnNames(tableElement:HTMLTableElement) {
    const columnHeadingElements = tableElement.getElementsByTagName("th");
    const columnNames = [];
    for (let i = 0; i < columnHeadingElements.length; i++) {
        columnNames.push(columnHeadingElements[i].innerText);
    }
    return columnNames;
}

export function downloadTableAsJSON(tableElement:HTMLTableElement, filenameHint = "table") {
    const columnNames = getTableColumnNames(tableElement);

    const tableData = [];
    const rowElements = tableElement.getElementsByTagName("tr");
    for (let rowIndex = 0; rowIndex < rowElements.length; rowIndex++) {
        const tableRowElement = rowElements[rowIndex];
        const rowData = jsonifyTableRow(columnNames, tableRowElement);
        tableData.push(rowData);
    }

    const fauxLink = createFauxLink(`${getFilenamePrefix(tableElement, filenameHint)}${new Date().getTime()}.json`, JSON.stringify(tableData));
    fauxLink.click();
}


