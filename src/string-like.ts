/**
 * Looks like a string.
 */
export class StringLike {
    private readonly str: string;

    constructor(str: string) {
        this.str = str
    }

    match(pattern: RegExp): RegExpMatchArray | null {
        return this.str.match(pattern);
    }

    toString(): string {
        return this.str
    }
}

/**
 * Looks like a string. But the match() call will ignore the start of line token (^) in the pattern.
 */
export class StringLikeWithMatchesIgnoringLineStart extends StringLike {
    constructor(str: string) {
        super(str);
    }

    match(pattern: RegExp): RegExpMatchArray | null {
        const alteredPattern = new RegExp(pattern.source.replace(/^\^/, ''), pattern.flags)
        return super.match(alteredPattern);
    }
}
