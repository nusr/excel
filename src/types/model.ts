import { IWindowSize } from "./event";
import { CellPosition, CellInfo } from "./store";
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
  value: string | number;
  formula?: string;
  width?: number;
  height?: number;
  style?: string;
};

export type QueryCellResult = Omit<ModelCellType, "style"> & {
  style?: Partial<StyleType>;
};

export type ModelCellValue = ModelCellType & { col: number; row: number };

export type ModelColType = Record<string, ModelCellType>;
export type ModelRowType = Record<string, ModelColType>;
export type WorkBookJSON = {
  workbook: WorksheetType[];
  worksheets: Record<string, ModelRowType>;
  styles: Record<string, Partial<StyleType>>;
};

export interface IModelValue {
  sheetList: WorksheetType[];
  currentSheetId: string;
  addSheet(): void;
  getCellsContent(): CellInfo[];
  toJSON(): WorkBookJSON;
  fromJSON(data: WorkBookJSON): void;
  getSheetInfo(id?: string): WorksheetType;
  getRowTitleHeightAndColTitleWidth(): IWindowSize;
  setCellValue(row: number, col: number, value: string): void;
  queryCell(row: number, col: number): CellInfo;
  clickPositionToCell(x: number, y: number, size: IWindowSize): CellPosition;
}
