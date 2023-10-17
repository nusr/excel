import { ResultType } from './parser';
import { IRange } from './range';
export declare enum EVerticalAlign {
    TOP = 0,
    CENTER = 1,
    BOTTOM = 2
}
export declare enum EHorizontalAlign {
    LEFT = 0,
    CENTER = 1,
    RIGHT = 2
}
export declare enum EUnderLine {
    NONE = 0,
    SINGLE = 1,
    DOUBLE = 2
}
export type StyleType = {
    fontColor: string;
    fillColor: string;
    fontSize: number;
    fontFamily: string;
    verticalAlign: EVerticalAlign;
    horizontalAlign: EHorizontalAlign;
    isWrapText: boolean;
    underline: EUnderLine;
    isItalic: boolean;
    isBold: boolean;
    numberFormat: number;
};
export type WorksheetType = {
    sheetId: string;
    name: string;
    isHide: boolean;
    activeCell: IRange;
    rowCount: number;
    colCount: number;
};
export type ModelCellType = {
    value?: ResultType;
    formula?: string;
    style?: Partial<StyleType>;
};
export interface Coordinate {
    row: number;
    col: number;
}
export type ModelCellValue = ModelCellType & Coordinate;
export type ModelColType = Record<string, ModelCellType>;
export type ModelRowType = Record<string, ModelColType>;
export type CustomHeightOrWidthItem = Record<string, number>;
export type MergeCellItem = {
    start: Coordinate;
    end: Coordinate;
};
export type WorkBookJSON = {
    workbook: WorksheetType[];
    worksheets: Record<string, ModelRowType>;
    mergeCells: IRange[];
    customHeight: Record<string, CustomHeightOrWidthItem>;
    customWidth: Record<string, CustomHeightOrWidthItem>;
    definedNames: Record<string, IRange>;
};
export interface IModel extends IBaseModel {
    record(): void;
    pasteRange(range: IRange, isCut: boolean): IRange;
}
export interface IBaseModel {
    getCell(range: IRange): ModelCellValue;
    getColWidth(col: number): number;
    setColWidth(col: number, width: number): void;
    getRowHeight(row: number): number;
    setRowHeight(row: number, height: number): void;
    setCellValues(value: ResultType[][], style: Partial<StyleType>[][], ranges: IRange[]): void;
    setActiveCell(range: IRange): void;
    setCurrentSheetId(id: string): void;
    getCurrentSheetId(): string;
    addSheet(): void;
    deleteSheet(sheetId?: string): void;
    hideSheet(sheetId?: string): void;
    unhideSheet(sheetId?: string): void;
    renameSheet(sheetName: string, sheetId?: string): void;
    toJSON(): WorkBookJSON;
    fromJSON(json: WorkBookJSON): void;
    setCellStyle(style: Partial<StyleType>, ranges: IRange[]): void;
    getSheetInfo(sheetId: string): WorksheetType;
    getSheetList(): WorkBookJSON['workbook'];
    addRow(rowIndex: number, count: number): void;
    addCol(colIndex: number, count: number): void;
    deleteCol(colIndex: number, count: number): void;
    deleteRow(rowIndex: number, count: number): void;
    canRedo(): boolean;
    canUndo(): boolean;
    undo(): void;
    redo(): void;
}
export type UndoRedoItem = {
    op: UndoRedoType;
    path: string;
    value: any;
};
export type UndoRedoType = 'set' | 'add-array' | 'delete-array';
export interface IHistory {
    clear(): void;
    canRedo(): boolean;
    canUndo(): boolean;
    undo(): UndoRedoItem[];
    redo(): UndoRedoItem[];
    pushRedo(op: UndoRedoType, path: string, value: any): void;
    pushUndo(op: UndoRedoType, path: string, value: any): void;
    onChange(): void;
}
