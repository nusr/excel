import { StyleType, WorkBookJSON, WorksheetType, IModel, ResultType, IRange, IHistory, ModelRowType } from '@/types';
import { Range } from '@/util';
export declare class Model implements IModel {
    private currentSheetId;
    private workbook;
    private worksheets;
    private mergeCells;
    private customHeight;
    private customWidth;
    private history;
    private definedNames;
    constructor(history: IHistory);
    getSheetList(): WorkBookJSON['workbook'];
    setActiveCell(range: IRange): void;
    addSheet(): void;
    private getSheetIndex;
    deleteSheet(sheetId?: string): void;
    hideSheet(sheetId?: string | undefined): void;
    unhideSheet(sheetId?: string | undefined): void;
    renameSheet(sheetName: string, sheetId?: string | undefined): void;
    getSheetInfo(id?: string): WorksheetType;
    setCurrentSheetId(id: string): void;
    getCurrentSheetId(): string;
    private getSheetId;
    fromJSON: (json: WorkBookJSON) => void;
    toJSON: () => WorkBookJSON;
    private setCellValue;
    private setCellFormula;
    setCellValues(value: string[][], style: Partial<StyleType>[][], ranges: Range[]): void;
    private setStyle;
    setCellStyle(style: Partial<StyleType>, ranges: Range[]): void;
    getCell: (range: IRange) => {
        row: number;
        col: number;
        value?: ResultType;
        formula?: string | undefined;
        style?: Partial<StyleType> | undefined;
    };
    private computeAllCell;
    private parseFormula;
    addRow(rowIndex: number, count: number): void;
    addCol(colIndex: number, count: number): void;
    deleteCol(colIndex: number, count: number): void;
    deleteRow(rowIndex: number, count: number): void;
    getColWidth(col: number): number;
    setColWidth(col: number, width: number): void;
    getRowHeight(row: number): number;
    setRowHeight(row: number, height: number): void;
    canRedo(): boolean;
    canUndo(): boolean;
    undo(): void;
    redo(): void;
    record(): void;
    private executeOperate;
    pasteRange(fromRange: IRange, isCut: boolean): IRange;
    getSheetData(sheetId?: string): ModelRowType;
}
