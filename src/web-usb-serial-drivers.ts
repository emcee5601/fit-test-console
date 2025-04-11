// @ts-expect-error no types defined
import ftdi from 'ftdi-js'
import {logSource, PushSource} from "src/datasource-helper.ts";
import ProlificUsbSerial from "pl2303"

export class UsbSerialPort {
    readonly device: USBDevice;
    private readonly driver: UsbSerialDriver;
    connected: boolean = false;
    readonly readable: ReadableStream<Uint8Array> | null;
    readonly writable: WritableStream<Uint8Array> | null;

    constructor(device: USBDevice, driver: UsbSerialDriver) {
        this.device = device;
        this.driver = driver;
        this.readable = driver.getReadableStreamFromDataSource()
        this.writable = driver.getWritableStreamFromDataSink()
    }

    // make this look like SerialPort
    getInfo(): SerialPortInfo {
        return {
            usbVendorId: this.device.vendorId,
            usbProductId: this.device.productId,
        }
    };

    async open(opts: { baudRate: number }): Promise<void> {
        return new Promise((resolve, reject) => {
            this.driver.open(this.device, opts).then(() => {
                this.connected = true;
                resolve();
                console.log(`${this.driver.name} opened`)
            }).catch(reject)
        })
    }
}

abstract class UsbSerialDriver extends PushSource {
    readonly options: USBDeviceRequestOptions[];
    readonly name: string

    /**
     * When there is no data available, wait this amount of time before checking again.
     * @type {number}
     */
    noDataWaitTimeMs = 300;
    readable: ReadableStream | undefined;
    writable: WritableStream | undefined;
    inboundDataQueue: Uint8Array[] = [];

    abstract open(device: USBDevice, opts: { baudRate: number }): Promise<UsbSerialDriver>;

    protected abstract closeImpl(): Promise<void>;

    abstract write(chunk: Uint8Array): Promise<USBOutTransferResult>;

    protected constructor(options: USBDeviceRequestOptions[]) {
        super();
        this.name = this.constructor.name
        this.options = options;
    }

    getReadableStreamFromDataSource() {
        const driver = this as UsbSerialDriver;
        return new ReadableStream({
            start(controller) {
                readRepeatedly().catch((e) => controller.error(e));

                async function readRepeatedly(): Promise<Uint8Array> {
                    return driver.dataRequest().then((result: Uint8Array) => {
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
                driver.closeImpl();
            },
        });
    }

    getWritableStreamFromDataSink(): WritableStream<Uint8Array> {
        const queuingStrategy = new CountQueuingStrategy({highWaterMark: 1});
        const decoder = new TextDecoder();
        const driver = this as UsbSerialDriver;
        return new WritableStream(
            {
                // Implement the sink
                write(chunk) {
                    const data = decoder.decode(chunk);
                    console.log(`sending to ${driver.name}: ${data}`);
                    return new Promise<void>((resolve, reject) => {
                        driver.write(chunk).then((res: USBOutTransferResult) => {
                            console.log(`successfully sent to ${driver.name}: ${res.status}, bytesWritten: ${res.bytesWritten}`);
                            resolve()
                        }).catch((err: string) => {
                            console.log(`error sending to ${driver.name}: ${err.toString()}`);
                            reject(err)
                        });
                    });
                },
                close() {
                    console.log(`${driver.name} sink closed`)
                },
                abort(err) {
                    console.log(`${driver.name} Sink error:`, err);
                },
            },
            queuingStrategy
        );
    }

    // Method returning promise when this push source is readable.
    async dataRequest(): Promise<Uint8Array> {
        if (this.inboundDataQueue.length === 0) {
            // Data not available. We need a way to know if there is no more data or if we're just waiting.
            console.debug(`dataRequest() called, closed? ${this.closed}`)
            if(this.closed) {
                return Promise.resolve(new Uint8Array()) // empty
            }
            return new Promise((resolve) => {
                setTimeout(() => {
                    // console.debug(`no data, waiting a bit...`);
                    this.dataRequest().then((res) => {
                        // console.debug(`trying to get more data...`);
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

            // console.debug(`big chunk size is ${bigChunkSize}`)
            resolve(bigChunk);
        });
    }

}

class ProlificSerialDriver extends UsbSerialDriver {
    private delegate: ProlificUsbSerial | undefined;

    constructor() {
        super([{
            filters: [
                {vendorId: 1659, productId: 9123},
                {vendorId: 1659, productId: 8963}
            ]
        }]);
    }

    async open(device: USBDevice, opts: { baudRate: number }) {
        return new Promise<UsbSerialDriver>((resolve, reject) => {
            this.delegate = new ProlificUsbSerial(device, opts)
            this.delegate.addEventListener('data', (event) => {
                const chunk: Uint8Array = (event as CustomEvent).detail;
                // chunk is a Uint8Array so we can't just use + or +=
                this.inboundDataQueue.push(chunk);
            })
            this.delegate.addEventListener('ready', () => {resolve(this)})
            this.delegate.addEventListener('error', (event:Event) => {reject(event)})
            this.delegate.addEventListener('disconnected', () => {
                console.debug(`disconnected from ${JSON.stringify(device)}`)
                this.closed = true
            })
            this.delegate.open(); // this isn't wired up properly, the ready event is what denotes a successful open()
        })
    }

    override async closeImpl() {
        return this.delegate?.close();
    }

    override async write(chunk: Uint8Array) {
        if (this.delegate) {
            return this.delegate.write(chunk);
        }
        return new Promise<USBOutTransferResult>((_resolve, reject) => {
            reject("not yet initialized")
        })
    }
}


class FtdiSerialDriver extends UsbSerialDriver {
    private delegate: ftdi;

    constructor() {
        super([{filters: [{vendorId: 1027, productId: 24577}]}])
    }

    override async open(device: USBDevice, opts: { baudRate: number }) {
        return new Promise<UsbSerialDriver>((resolve, reject) => {
            this.delegate = new ftdi(device, opts)
            this.delegate.addEventListener('data', (event: CustomEvent) => {
                const chunk = event.detail;
                this.inboundDataQueue.push(chunk);
            })
            this.delegate.addEventListener('ready', () => {resolve(this)})
            this.delegate.addEventListener('error', (event:{detail:string}) => {reject(event.detail)})
            this.delegate.addEventListener('disconnected', () => {
                console.debug(`disconnected from ${JSON.stringify(device)}`)
                this.closed = true
            })
        })
    }

    override async closeImpl() {
        return this.delegate.closeAsync();
    }

    override async write(chunk: Uint8Array) {
        return this.delegate.writeAsync(chunk);
    }
}

export class UsbSerialDrivers {
    static readonly supportedDrivers: UsbSerialDriver[] = [new FtdiSerialDriver(), new ProlificSerialDriver()];

    static async getPorts(): Promise<UsbSerialPort[]> {
        const devices = await navigator.usb.getDevices();
        const ports: UsbSerialPort[] = []
        devices.forEach(device => {
            const driver = UsbSerialDrivers.findDriverForDevice(device)
            if (driver) {
                // just return the first matching driver
                ports.push(new UsbSerialPort(device, driver));
            }
        })
        return ports;
    }

    async requestPort(): Promise<UsbSerialPort> {
        return new Promise((resolve, reject) => {
            const supportedDevices = UsbSerialDrivers.supportedDrivers.flatMap(driver => driver.options.flatMap(t => t.filters))

            navigator.usb.requestDevice({filters: supportedDevices}).then(device => {
                const driver = UsbSerialDrivers.findDriverForDevice(device)

                if (driver) {
                    resolve(new UsbSerialPort(device, driver));
                } else {
                    reject(`could not find driver for device ${JSON.stringify(device)}`)
                }
            })
        })
    }

    private static findDriverForDevice(device: USBDevice) {
        return this.supportedDrivers.find((driver) => {
            const driverDevices = driver.options.flatMap(t => t.filters)
            return driverDevices.find(driverDevice => {
                return driverDevice.vendorId == device.vendorId
                    && driverDevice.productId === device.productId
            })
        });
    }
}


