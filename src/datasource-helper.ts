/*
  mock data source idea from https://developer.mozilla.org/en-US/docs/Web/API/Streams_API/Using_readable_streams
 */

const utf8Decoder = new TextDecoder("utf-8");

/**
 * from https://developer.mozilla.org/en-US/docs/Web/API/ReadableStreamDefaultReader/read#example_2_-_handling_text_line_by_line
 * @param reader
 * @returns an iterator that returns data from the reader broken up into lines
 */

export async function* getLines(reader: ReadableStreamDefaultReader<Uint8Array>) {
    async function readFromReader() {
        const result = await reader.read();
        if (!result.done && result.value) {
            // appendRaw(utf8Decoder.decode(result.value));
        }
        return result;
    }

    let {value: value, done: readerDone} = await readFromReader();
    let chunk : string = value ? utf8Decoder.decode(value, {stream: true}) : "";


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
        }
        yield chunk.substring(startIndex, result.index);
        startIndex = re.lastIndex;
    }
    if (startIndex < chunk.length) {
        // last line didn't end in a newline char
        yield chunk.substring(startIndex);
    }
}



export function getReadableStreamFromDataSource(pushSource: PushSource):ReadableStream<Uint8Array> {
    return new ReadableStream<Uint8Array>({
        start(controller) {
            readRepeatedly().catch((e) => controller.error(e));

            async function readRepeatedly() :Promise<Uint8Array> {
                return pushSource.dataRequest().then((result:Uint8Array) => {
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

export interface PushSource {
    dataRequest() : Promise<Uint8Array>
    close() : void
}

export class DataFilePushSource implements PushSource {
    static DEFAULT_BYTES_PER_SECOND = 1200;
    static encoder = new TextEncoder();
    reader : ReadableStreamDefaultReader<Uint8Array> | undefined;
    buffer : Uint8Array = new Uint8Array();
    bufferIndex = 0;
    fileOrUrl : string|File;
    rateBytesPerSecond : number;
    lastRequestTime: number = 0;

    constructor(fileOrUrl : string|File, bytesPerSecond= DataFilePushSource.DEFAULT_BYTES_PER_SECOND) {
        this.fileOrUrl = fileOrUrl;
        this.rateBytesPerSecond = Math.max(bytesPerSecond, 1); // make sure we always make progress
    }

    // Method returning promise when this push source is readable.
    async dataRequest() : Promise<Uint8Array> {
        if (this.bufferIndex >= this.buffer.length) {
            // need (more) data
            if (this.reader === undefined) {
                if(typeof this.fileOrUrl === "string") {
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
            }

            const result :ReadableStreamReadResult<Uint8Array> | undefined = await this.reader?.read();
            this.bufferIndex = 0;
            if (result?.done) {
                // no more data
                this.buffer = new Uint8Array();
            } else {
                this.buffer = result ? result.value : new Uint8Array();
            }
        }

        if (this.buffer.length === 0) {
            // no more data
            return new Promise((resolve) => resolve(new Uint8Array()));
        }

        // some data not sent
        let now = Date.now();
        let delay = 0;
        if( now === this.lastRequestTime) {
            // we've fully caught up. need to inject some delay. if we return no data, the stream is interpreted to have ended.
            delay += 50
            now += delay
        }

        const elapsedMs = now - (this.lastRequestTime || (now - 1000)); // if this is the first request, return 1 second of data
        this.lastRequestTime = now;
        const numBytesToReturn = Math.ceil(elapsedMs * this.rateBytesPerSecond / 1000)
        const end = this.bufferIndex + (this.bufferIndex + numBytesToReturn < this.buffer.length ? numBytesToReturn : this.buffer.length);
        const chunk = this.buffer?.slice(this.bufferIndex, end);
        this.bufferIndex += chunk.length;
        // console.log(`chunk size is ${chunk.length} bytes, elapsed ms is ${elapsedMs}`);
        return new Promise((resolve) => {
            // Emulate slow read of data
            if( delay) {
                setTimeout(() => {
                    resolve(chunk);
                }, delay);
            } else {
                resolve(chunk);
            }
        });
    }

    // Dummy close function
    close() {
        return;
    }
}



export function logSource(result:string) {
    console.log(`source: ${result}`);
}

export function logData(result:string) {
    console.log(`data: ${result}`);
}
