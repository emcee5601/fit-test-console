/*
  mock data source idea from https://developer.mozilla.org/en-US/docs/Web/API/Streams_API/Using_readable_streams
 */

import {formatDuration} from "src/utils.ts";

const utf8Decoder = new TextDecoder("utf-8");

/**
 * from
 * https://developer.mozilla.org/en-US/docs/Web/API/ReadableStreamDefaultReader/read#example_2_-_handling_text_line_by_line
 * @param reader
 * @returns an iterator that returns data from the reader broken up into lines
 */
export async function* getLines(reader: ReadableStreamDefaultReader<Uint8Array>) {
    async function readFromReader() {
        const result = await reader.read();
        if (!result.done && result.value) {
            // console.debug(`getLines() got result '${result.value}'`)
        }
        return result;
    }

    let {value: value, done: readerDone} = await readFromReader();
    let chunk: string = value ? utf8Decoder.decode(value, {stream: true}) : "";


    // TODO: seems sometimes we exhaust the data and a new line is interpreted when that happens. this seems to be a
    // bug with vite dynamic reloads running multiple copies of threads
    const re = /\r\n|\n|\r/gm;
    let startIndex = 0;

    for (; ;) {
        const result = re.exec(chunk);
        if (!result) {
            if (readerDone) {
                break;
            }
            const remainder = chunk.substring(startIndex);
            ({value: value, done: readerDone} = await readFromReader());
            chunk =
                remainder + (value ? utf8Decoder.decode(value, {stream: true}) : "");
            startIndex = re.lastIndex = 0;
            continue;
        } else {
            // console.debug(`result type is '${typeof result}', isnull? ${result === null}, undefined? ${result ===
            // undefined}, `)
        }
        const line = chunk.substring(startIndex, result.index);
        // console.debug(`yielding line '${line}', result was ${JSON.stringify(result)}, ${typeof result}, chunk was
        // ${chunk}, value: ${value}`);
        yield line;
        startIndex = re.lastIndex;
    }
    if (startIndex < chunk.length) {
        // last line didn't end in a newline char
        yield chunk.substring(startIndex);
    }
}


export function getReadableStreamFromDataSource(pushSource: PushSource): ReadableStream<Uint8Array> {
    return new ReadableStream<Uint8Array>({
        start(controller) {
            readRepeatedly().catch((e) => controller.error(e));

            async function readRepeatedly(): Promise<Uint8Array> {
                return pushSource.dataRequest().then((result: Uint8Array) => {
                    if (result.length === 0) {
                        logSource(`No data from source: closing`);
                        controller.close();
                        return new Uint8Array();
                    }

                    // logSource(`Enqueue data: ${result.data}`);
                    controller.enqueue(result);
                    return readRepeatedly();
                });
            }
        },

        cancel() {
            logSource(`cancel() called on underlying source`);
            pushSource.close();
        },
    });
}

export abstract class PushSource {
    abstract dataRequest(): Promise<Uint8Array>

    protected abstract closeImpl(): void

    private _closed: boolean = false;

    close(): void {
        this.closeImpl();
        this._closed = true;
    }

    set closed(value: boolean) {
        this._closed = value;
    }

    get closed() {
        return this._closed
    }
}

export class DataFilePushSource extends PushSource {
    private static readonly NO_MORE_DATA = new Promise<Uint8Array>((resolve) => resolve(new Uint8Array()));
    static DEFAULT_BYTES_PER_SECOND = 1200;
    static encoder = new TextEncoder();
    private reader: ReadableStreamDefaultReader<Uint8Array> | undefined;
    private linesSource: AsyncGenerator<string, void, unknown> | undefined;
    private nextLine: string | undefined
    private lastLineTimestamp: number = 0;
    buffer: Uint8Array = new Uint8Array();
    bufferIndex = 0;
    fileOrUrl: string | File;
    rateBytesPerSecond: number;
    lastRequestTime: number = 0;

    constructor(fileOrUrl: string | File, bytesPerSecond = DataFilePushSource.DEFAULT_BYTES_PER_SECOND) {
        super();
        this.fileOrUrl = fileOrUrl;
        this.rateBytesPerSecond = Math.max(bytesPerSecond, 1); // make sure we always make progress
    }

    // Method returning promise when this push source is readable.
    async dataRequest(): Promise<Uint8Array> {
        if (this.reader === undefined) {
            if (typeof this.fileOrUrl === "string") {
                this.reader = await fetch(this.fileOrUrl).then((result: Response) => {
                    if (result.ok) {
                        return result.body?.getReader();
                    } else {
                        throw new Error(`Failed to file: ${result.status}`);
                    }
                })
            } else {
                // it's a File
                this.reader = this.fileOrUrl.stream().getReader();
            }
            if (!this.reader) {
                return DataFilePushSource.NO_MORE_DATA;
            }
            console.debug("simulator(file) started")
        }

        if(!this.linesSource) {
            this.linesSource = getLines(this.reader);
        }

        let rtDelay:number = 0
        if (this.bufferIndex >= this.buffer.length) {
            // need (more) data
            if(!this.nextLine) {
                const result = await this.linesSource.next();
                if(result.done) {
                    return DataFilePushSource.NO_MORE_DATA;
                }
                this.nextLine = result.value
            }

            const timestampPattern = /^(?<timestamp>\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d.\d{3}Z)\s*(?<rest>.+)$/i;
            const match = timestampPattern.exec(this.nextLine);
            if(match && match.groups) {
                const {timestamp, rest} = match.groups
                const nextLineTimestamp = Date.parse(timestamp)
                // calculate necessary delay. this is close enough. todo: look at wall clock
                rtDelay = this.lastLineTimestamp ? nextLineTimestamp - this.lastLineTimestamp : 0
                this.lastLineTimestamp = nextLineTimestamp
                this.buffer = DataFilePushSource.encoder.encode(rest + "\r\n") // put back crlf
            } else {
                // no timestamp
                this.buffer = DataFilePushSource.encoder.encode(this.nextLine + "\r\n") // put back crlf
            }
            this.bufferIndex = 0; // reset
            this.nextLine = undefined; // consume
        }

        // some data not sent
        let now = Date.now();
        let delay = rtDelay; // inherit any delay from rt data simulation
        if( now === this.lastRequestTime) {
            // we've fully caught up. need to inject some delay. if we return no data, the stream is interpreted to have ended.
            delay += 50
            now += delay
            if(delay > 50) {
                console.debug(`simulator: next data chunk available ${formatDuration(delay)}`)
            }
        }

        const elapsedMs = now - (this.lastRequestTime || (now - 1000)); // if this is the first request, return 1
                                                                        // second of data
        this.lastRequestTime = now;
        const numBytesToReturn = Math.ceil(elapsedMs * this.rateBytesPerSecond / 1000)
        const end = this.bufferIndex + (this.bufferIndex + numBytesToReturn < this.buffer.length ? numBytesToReturn : this.buffer.length);
        const chunk = this.buffer?.slice(this.bufferIndex, end);
        this.bufferIndex += chunk.length;
        // console.log(`chunk size is ${chunk.length} bytes, elapsed ms is ${elapsedMs}`);
        return new Promise((resolve) => {
            // Emulate slow read of data
            if (delay) {
                setTimeout(() => {
                    resolve(chunk);
                }, delay);
            } else {
                resolve(chunk);
            }
        });
    }

    // Dummy close function
    protected closeImpl() {
        return;
    }
}


export function logSource(result: string) {
    console.log(`source: ${result}`);
}

export function logData(result: string) {
    console.log(`data: ${result}`);
}
