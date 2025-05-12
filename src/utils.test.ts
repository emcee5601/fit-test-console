import {assert, describe, test} from 'vitest'
import {median} from "src/utils.ts";

describe('utils', () => {
    describe('median', () => {
            test('empty array', () => {
                assert(0 === median([]),)
            })
            test('odd number of elements', () => {
                assert(-1 === median([-1]))
                assert(2 === median([-1, 2, 99999]))
            })
            test('even number of elements', () => {
                assert(3 === median([2, 4]))
                assert(4 === median([2, 4, 4, 9]))
            })
        }
    )
})
