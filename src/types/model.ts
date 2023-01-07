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
export type StyleType = {
  fontColor: string;
  fillColor: string;
  fontSize: number;
  fontFamily: string;
  verticalAlign: EVerticalAlign;
  horizontalAlign: EHorizontalAlign;
  isWrapText: boolean;
  format: string;
  isUnderline: boolean;
  isItalic: boolean;
  isBold: boolean;
  isCrossOut: boolean;
};
export type WorksheetType = {
  sheetId: string;
  name: string;
  activeCell?: string;
  rowCount: number;
  colCount: number;
};

export type ModelCellType = {
  value?: ResultType;
  formula?: string;
  width?: number;
  height?: number;
  style?: string;
};

export type QueryCellResult = Omit<ModelCellType, 'style'> & {
  style?: Partial<StyleType>;
};

export type ModelCellValue = ModelCellType & { col: number; row: number };

export type ModelColType = Record<string, ModelCellType>;
export type ModelRowType = Record<string, ModelColType>;
export type WorkBookJSON = {
  workbook: WorksheetType[];
  worksheets: Record<string, ModelRowType>;
  styles: Record<string, Partial<StyleType>>;
  mergeCells?: string[];
};

export interface IModel extends IBaseModel {
  queryCell(row: number, col: number, sheetId?: string): QueryCellResult;
}

export interface IBaseModel {
  setCellValues(
    value: string[][],
    style: Partial<StyleType>[][],
    ranges: IRange[],
  ): void;
  setActiveCell(
    row: number,
    col: number,
    rowCount: number,
    colCount: number,
  ): void;
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
