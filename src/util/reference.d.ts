import { Range } from './range';
declare function convertSheetNameToSheetId(value: string): string;
export declare function parseCell(ref: string, convertSheetName?: typeof convertSheetNameToSheetId): Range | null;
export declare function parseReference(text: string, convertSheetName?: typeof convertSheetNameToSheetId): Range | null;
export declare function mergeRange(start: Range, end: Range): Range | null;
export {};
