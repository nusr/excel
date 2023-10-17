import { IRange } from '@/types';
export type ResultType = boolean | string | number | null | undefined;
export type ErrorTypes = '#ERROR!' | '#DIV/0!' | '#NAME?' | '#N/A' | '#NULL!' | '#NUM!' | '#REF!' | '#VALUE!';
export declare enum TokenType {
    EQUAL = 0,
    NOT_EQUAL = 1,
    PLUS = 2,
    MINUS = 3,
    STAR = 4,
    SLASH = 5,
    EXPONENT = 6,
    GREATER = 7,
    GREATER_EQUAL = 8,
    CONCATENATE = 9,
    COLON = 10,
    COMMA = 11,
    EMPTY_CHAR = 12,
    PERCENT = 13,
    LESS = 14,
    LESS_EQUAL = 15,
    IDENTIFIER = 16,
    STRING = 17,
    NUMBER = 18,
    TRUE = 19,
    FALSE = 20,
    LEFT_BRACKET = 21,
    RIGHT_BRACKET = 22,
    lEFT_BRACE = 23,
    RIGHT_BRACE = 24,
    SEMICOLON = 25,
    EXCLAMATION = 26,
    EOF = 27
}
export interface CellDataMap {
    set(row: number, col: number, sheetId: string, value: any): void;
    get(row: number, col: number, sheetId: string): any;
    convertSheetNameToSheetId(sheetName: string): string;
}
export interface DefinedNamesMap {
    set(name: string, value: IRange): void;
    get(name: string): IRange;
    has(name: string): boolean;
}
export type InterpreterResult = {
    result: any;
    error: ErrorTypes | null;
    expressionStr: string;
};
export type ReferenceType = 'absolute' | 'mixed' | 'relative';
export type ConvertSheetName = (value: string) => string;
