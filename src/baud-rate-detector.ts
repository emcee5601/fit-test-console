import {SerialPortLike} from "src/portacount-client-8020.ts";

export class BaudRateDetector {
    private readonly supportedBaudRates = [300, 600, 1200, 2400, 9600]

    private async readFromReader(reader: ReadableStreamDefaultReader<Uint8Array>) {
        const result = await reader.read();
        if (!result.done && result.value) {
            // console.debug(`getLines() got result '${result.value}'`)
        }
        return result;
    }


    async openPortWithAutoDetectedBaudRate(port: SerialPortLike, startingBaudRateIndex: number = this.supportedBaudRates.length - 1): Promise<number> {
        if (startingBaudRateIndex < 0) {
            console.debug("baud rate auto-detect unsuccessful. giving up.")
            return 0
        }
        const baudRateToTry = this.supportedBaudRates[startingBaudRateIndex];
        console.log(`auto-detecting baud rate... trying ${baudRateToTry}...`)

        return port.open({baudRate: Number(baudRateToTry)})
            .then(() => port.readable ? port.readable : Promise.reject("reader not ready"))
            .then((readable) => readable.getReader())
            .then(async (reader) => {
                let maybeFoundBaudRate = 0;
                let charactersLeftToRead = 30;
                try {
                    while (charactersLeftToRead > 0) {
                        const {value: value, done: readerDone} = await this.readFromReader(reader);
                        if(readerDone) {
                            console.debug("autobaud / reader done")
                            break;
                        }
                        const utf8Decoder = new TextDecoder("utf-8");
                        const chunk: string = value ? utf8Decoder.decode(value, {stream: true}) : "";

                        if (chunk.match(/^\s*$/)) {
                            // ignore whitespace
                            console.debug("ignoring whitespace")
                            continue
                        }
                        charactersLeftToRead -= chunk.length;

                        maybeFoundBaudRate += this.looksLikeAscii(chunk);

                        if (maybeFoundBaudRate < -5) {
                            // too many non-ascii results, probably wrong baud rate
                            return this.openPortWithAutoDetectedBaudRate(port, startingBaudRateIndex-1)
                        } else if (maybeFoundBaudRate > 5) {
                            return baudRateToTry
                        } else {
                            // read more
                        }
                    }
                    // inconclusive
                    if( charactersLeftToRead > 0) {
                        console.warn("reader closed before enough data was read, retrying...")
                        return this.openPortWithAutoDetectedBaudRate(port, startingBaudRateIndex)
                    } else {
                        console.warn(`autobaud inconclusive for ${baudRateToTry}`)
                        return this.openPortWithAutoDetectedBaudRate(port, startingBaudRateIndex-1)
                    }
                } finally {
                    reader.releaseLock() // so the caller can get another reader.
                }
            })
    }

    /**
     * larger numbers mean more ascii-like
     */
    private looksLikeAscii(chunk: string) {
        // eslint-disable-next-line no-control-regex
        // const match = chunk.match(/[\x00-\x7F]/g);
        const match = chunk.match(/[a-zA-Z0-9#:./\s]/g)
        const numMatch = match ? match.length : 0
        const score = numMatch * 2 - chunk.length;
        console.debug(`looksLikeAscii(${chunk}) = ${score}`)
        return score
    }

}
