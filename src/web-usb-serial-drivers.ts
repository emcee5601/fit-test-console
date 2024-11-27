import ftdi from 'ftdi-js'
import {getReadableStreamFromDataSource, PushSource} from "./datasource-helper.ts";

/**
 * make this sort of look like WebSerial.
 */
export class FTDISerial {
    async requestPort() {
        return new FTDIPortDataSource();
    }
}

export class FTDIPortDataSource implements PushSource {
    /**
     * When there is no data available, wait this amount of time before checking again.
     * @type {number}
     */
    noDataWaitTimeMs = 300;
    readable: ReadableStream | undefined;
    writable: WritableStream | undefined;
    devicePort:ftdi;
    inboundDataQueue:Uint8Array[] = [];
    decoder = new TextDecoder();

    constructor() {
    }

    // must call this from a button
    async open(opts:{baudRate:string}) {
        return new Promise((resolve) => {
            navigator.usb.requestDevice({filters: [{vendorId: 1027, productId: 24577}]}).then(device => {
                const serial = new ftdi(device, opts);
                this.devicePort = serial;
                serial.addEventListener('data', (event:CustomEvent) => {
                    const chunk = event.detail;
                    const decodedData = this.decoder.decode(chunk);
                    console.log(`got data: ${decodedData}`)
                    // logData(`${decodedData}`);
                    // logSource(`data callback got ${chunk.length} bytes: ${decodedData}\n`)

                    // chunk is a Uint8Array so we can't just use + or +=
                    this.inboundDataQueue.push(chunk);
                })

                this.readable = getReadableStreamFromDataSource(this); // this starts reading immediately  :(
                this.writable = this.getWritableStreamFromDataSink(this);
                resolve(this);
            })
        })
    }

    getWritableStreamFromDataSink(dataSink:FTDIPortDataSource) {
        const queuingStrategy = new CountQueuingStrategy({highWaterMark: 1});
        const decoder = new TextDecoder();
        return new WritableStream(
            {
                // Implement the sink
                write(chunk) {
                    const data = decoder.decode(chunk);
                    console.log(`sending to ftdi: ${data}`);
                    return new Promise<void>((resolve, reject) => {
                        dataSink.devicePort.writeAsync(chunk).then((res:USBOutTransferResult) => {
                            console.log(`successfully sent to ftdi: ${res.status}, bytesWritten: ${res.bytesWritten}`);
                            resolve()
                        }).catch((err:string) => {
                            console.log(`error sending to ftdi: ${err.toString()}`);
                            reject(err)
                        });
                    });
                },
                close() {
                    console.log("ftdi sink closed")
                },
                abort(err) {
                    console.log("ftdi Sink error:", err);
                },
            },
            queuingStrategy
        );
    }


    // Method returning promise when this push source is readable.
    async dataRequest() : Promise<Uint8Array> {
        if (this.inboundDataQueue.length === 0) {
            // Data not available. We need a way to know if there is no more data or if we're just waiting.
            return new Promise((resolve) => {
                setTimeout(() => {
                    console.log(`no data, waiting a bit...`);
                    this.dataRequest().then((res) => {
                        console.log(`trying to get more data...`);
                        resolve(res)
                    });  // is this the correct way to chain Promises?
                }, this.noDataWaitTimeMs); // wait a little bit
            });
        }

        const chunks = this.inboundDataQueue.splice(0, this.inboundDataQueue.length); // is this thread safe?

        return new Promise((resolve) => {
            const bigChunkSize = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
            const bigChunk = new Uint8Array(bigChunkSize);

            // this has side effects...
            chunks.reduce((chunkIndex, chunk) => {
                bigChunk.set(chunk, chunkIndex);
                return (chunkIndex + chunk.length);
            }, 0);

            console.log(`big chunk size is ${bigChunkSize}`)
            resolve(bigChunk);
        });
    }

    // Dummy close function
    close() {
        return;
    }
}

