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
export enum EWrap {
  OVERFLOW,
  AUTO_WRAP,
}
export type StyleType = {
  fontColor: string;
  fillColor: string;
  fontSize: number;
  fontFamily: string;
  verticalAlign: EVerticalAlign;
  horizontalAlign: EHorizontalAlign;
  wrapText: EWrap;
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

export interface IModel {
  getCurrentSheetId(): string;
  addSheet(): void;
  setCurrentSheetId(id: string): void;
  getCellsContent(sheetId?: string): Array<Coordinate>;
  setActiveCell(row: number, col: number): void;
  toJSON(): WorkBookJSON;
  fromJSON(json: WorkBookJSON): void;
  queryCell(row: number, col: number, sheetId?: string): QueryCellResult;
  setCellFormula(formula: string, range: IRange): void;
  setCellStyle(style: Partial<StyleType>, ranges: IRange[]): void;
  getSheetInfo(sheetId?: string): WorksheetType;
  setCellValues(value: string, ranges: IRange[]): void;
  setCellValue(value: ResultType, range: IRange): void;
  getSheetList(): WorkBookJSON['workbook'];
}

export interface IHistory {
  canRedo(): boolean;
  canUndo(): boolean;
  undo(sheetData: WorkBookJSON): void;
  redo(sheetData: WorkBookJSON): void;
  onChange(sheetData: WorkBookJSON): void;
  getUndoData(): WorkBookJSON | undefined
  getRedoData(): WorkBookJSON | undefined
}
