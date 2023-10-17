import type { TokenType } from '@/types';
export declare class Token {
    type: TokenType;
    value: string;
    constructor(type: TokenType, value: string);
    error(): string;
    toString(): string;
}
