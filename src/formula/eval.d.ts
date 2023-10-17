import { CellDataMap, InterpreterResult, DefinedNamesMap, FormulaData, IRange } from '@/types';
export declare function parseFormula(source: string, cellData?: CellDataMap, definedNamesMap?: DefinedNamesMap, functionMap?: FormulaData): InterpreterResult;
export declare class CellDataMapImpl implements CellDataMap {
    private readonly map;
    private sheetNameMap;
    private getKey;
    setSheetNameMap(sheetNameMap: Record<string, string>): void;
    set(row: number, col: number, sheetId: string, value: any): void;
    get(row: number, col: number, sheetId?: string): any;
    convertSheetNameToSheetId(sheetName: string): string;
}
export declare class DefinedNamesMapImpl implements DefinedNamesMap {
    private readonly map;
    set(name: string, value: IRange): void;
    get(name: string): IRange;
    has(name: string): boolean;
}
