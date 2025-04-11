import {describe, expect, test} from "vitest";
import {StringLike, StringLikeWithMatchesIgnoringLineStart} from "./string-like.ts";


describe('StringLike', () => {
    test('does NOT ignore extraneous leading characters', () =>{
        const target: StringLike = new StringLike("extraneousVF")
        expect(target.match(/^VF$/)).toBeNull()
    })
    test('can find exact matches', () =>{
        const target: StringLike = new StringLike("VF")
        expect(target.match(/^VF$/)).toBeTypeOf("object") // match found
    })
});


describe('StringLikeWithMatchesIgnoringLineStart', () => {
    test('ignores extraneous leading characters', () =>{
        const target: StringLike = new StringLikeWithMatchesIgnoringLineStart("extraneousVF")
        expect(target.match(/^VF$/)).toBeTypeOf("object")
    })
    test('can find exact matches', () =>{
        const target: StringLike = new StringLikeWithMatchesIgnoringLineStart("VF")
        expect(target.match(/^VF$/)).toBeTypeOf("object") // match found
    })
});
