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

// TODO: move this to a utility class
export function createMailtoLink(to:string = "", subject:string = "", body:string = "") {
    const fauxLink = document.createElement('a');
    body = body.substring(0, 1900);  // limit is around 2000?
    fauxLink.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    fauxLink.target = '_blank';
    return fauxLink
}

/**
 * Constructs a file named filenameHint_date.ext with the given data and downloads it.
 * @param data
 * @param filenameHint
 * @param extension
 */
export function downloadData(data:string, filenameHint = "data", extension="txt") {
    const fauxLink = createFauxLink(`${filenameHint}_${new Date().getTime()}.${extension}`, data);
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


