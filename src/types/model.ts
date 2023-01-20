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
  activeCell: Coordinate;
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
};

export interface IModel extends IBaseModel {
  queryCell(row: number, col: number, sheetId?: string): ModelCellType;
}

export interface IBaseModel {
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
  getCellsContent(sheetId: string): Array<Coordinate>;
  toJSON(): WorkBookJSON;
  fromJSON(json: WorkBookJSON): void;
  setCellStyle(style: Partial<StyleType>, ranges: IRange[]): void;
  getSheetInfo(sheetId: string): WorksheetType;
  getSheetList(): WorkBookJSON['workbook'];
  addRow(rowIndex: number, count: number): void;
  addCol(colIndex: number, count: number): void;
  deleteCol(colIndex: number, count: number): void;
  deleteRow(rowIndex: number, count: number): void;
}

export interface IHistory {
  canRedo(): boolean;
  canUndo(): boolean;
  undo(sheetData: WorkBookJSON): WorkBookJSON | undefined;
  redo(sheetData: WorkBookJSON): WorkBookJSON | undefined;
  onChange(sheetData: WorkBookJSON): void;
}
