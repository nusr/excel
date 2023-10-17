import { IRange } from '@/types';
export declare function isSheet(range: IRange): boolean;
export declare function isRow(range: IRange): boolean;
export declare function isCol(range: IRange): boolean;
export declare function isSameRange(oldRange?: IRange, newRange?: IRange): boolean;
export declare class Range implements IRange {
    row: number;
    col: number;
    colCount: number;
    rowCount: number;
    sheetId: string;
    constructor(row: number, col: number, rowCount: number, colCount: number, sheetId: string);
    isValid(): boolean;
    static makeRange(range: IRange): Range;
}
