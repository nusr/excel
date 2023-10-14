import { Coordinate } from './components';
import { ResultType } from './parser';
import { IRange } from './range';
export enum EVerticalAlign {
  TOP,
  MIDDLE,
  BOTTOM,
}
export enum EHorizontalAlign {
  LEFT,
  CENTER,
  RIGHT,
}
export enum EUnderLine {
  NONE = 0,
  SINGLE,
  DOUBLE,
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
  format?: string;
};

export type ModelCellValue = ModelCellType & { col: number; row: number };

export type ModelColType = Record<string, ModelCellType>;
export type ModelRowType = Record<string, ModelColType>; // key: col number
export type CustomHeightOrWidthItem = Record<string, number>; // key: row number or col number value: height or width
export type MergeCellItem = {
  start: Coordinate;
  end: Coordinate;
};
export type WorkBookJSON = {
  workbook: WorksheetType[]; // workbook.xml_workbook_sheets
  worksheets: Record<string, ModelRowType>; // key: row number worksheets_*.xml_worksheet_sheetData
  mergeCells: IRange[]; // worksheets_*.xml_worksheet_mergeCells
  customHeight: Record<string, CustomHeightOrWidthItem>; // key: sheetId worksheets_*.xml_worksheet_sheetData_customHeight
  customWidth: Record<string, CustomHeightOrWidthItem>; // key: sheetId worksheets_*.xml_worksheet_sheetData_customHeight
  definedNames: Record<string, IRange>; // key: defineName workbook.xml_workbook_definedNames
};

export interface IModel extends IBaseModel {
  record(): void;
}

export interface IBaseModel {
  getCell(range: IRange): ModelCellType & Coordinate;
  getColWidth(col: number): number;
  setColWidth(col: number, width: number): void;
  getRowHeight(row: number): number;
  setRowHeight(row: number, height: number): void;
  setCellValues(
    value: ResultType[][],
    style: Partial<StyleType>[][],
    ranges: IRange[],
  ): void;
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
