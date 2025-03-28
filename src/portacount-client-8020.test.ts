import {beforeEach, describe, expect, test} from 'vitest'

import {ParticleConcentrationEvent, PortaCountClient8020} from "./portacount-client-8020.ts";


describe('PortaCountClient8020', () => {
    const client = new PortaCountClient8020();
    describe('processLine', () => {
        describe('ParticleConcentrationEvent', () => {
            let event: ParticleConcentrationEvent|undefined;
            client.addListener({
                particleConcentrationReceived(concentrationEvent: ParticleConcentrationEvent) {
                    event = concentrationEvent
                }
            })
            beforeEach(() => {
                event = undefined
            })
            describe('internal control', () => {
                test('emits event with concentration', () => {
                    client.processLine("Conc.            345 #/cc")
                    expect(event?.concentration).toEqual(345);
                })
                test('emits event with default timestamp when input line contains no timestamp', async () => {
                    client.processLine("Conc.            353 #/cc")
                    expect(event?.timestamp).toBeTruthy();
                })
                test('emits event with explicit timestamp from input line', async () => {
                    client.processLine("2022-02-22T22:22:22.222Z Conc.            353 #/cc\n")
                    expect(event?.timestamp).toBeTruthy();
                    // @ts-expect-error shouldn't get here if event is falsy
                    expect(new Date(event.timestamp).toISOString()).toEqual("2022-02-22T22:22:22.222Z");
                })
            })
            describe('external control', () => {
                test('emits event with concentration', () => {
                    client.processLine("123456.78")
                    expect(event?.concentration).toEqual(123456.78);
                })
                test('emits event with default timestamp when input line contains no timestamp', async () => {
                    client.processLine("006408.45")
                    expect(event?.timestamp).toBeTruthy();
                })
                test('emits event with explicit timestamp from input line', async () => {
                    client.processLine("2022-02-22T22:22:22.222Z 006408.45\n")
                    expect(event?.timestamp).toBeTruthy();
                    // @ts-expect-error shouldn't get here if event is falsy
                    expect(new Date(event.timestamp).toISOString()).toEqual("2022-02-22T22:22:22.222Z");
                })
            })
        })
    })
})
