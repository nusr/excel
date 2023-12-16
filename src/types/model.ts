import { ResultType } from './parser';
import { IRange } from './range';

export enum EVerticalAlign {
  TOP,
  CENTER,
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
/**
 * XML to model
 * 1. styleId = worksheets_*.xml worksheet.sheetData.row.c.s
 * 2. styles = styles.xml styleSheet
 * 3. xf = styles.cellXfs.xf[styleId]
 * 4. fillColor = xf.applyFill != undefined && xf.fillId != undefined && styles.fills.fill[xf.fillId]
 * 5. font = xf.applyFont != undefined && xf.fontId != undefined && styles.fonts.font[xf.fontId]
 * 6. fontColor = font.color,fontSize = font.sz,isBold= font.b,isItalic=font.i,underline=font.u,fontFamily=font.name
 * 7. alignment = xf.ApplyAlignment != undefined && xf.alignment != undefined
 * 8. verticalAlign = alignment.vertical,horizontalAlign = alignment.horizontal,isWrapText = alignment.wrapText
 * 9. numberFormat = xl.applyNumberFormat != undefined && styles.numFmts.numFmt.find(v => v.numFmtId === xf.numFmtId).formatCode
 *
 * model to XML
 */
export interface StyleType {
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
  numberFormat: number; // NUMBER_FORMAT_LIST id
}
export interface WorksheetType {
  sheetId: string;
  name: string;
  isHide: boolean;
  activeCell: IRange;
  rowCount: number;
  colCount: number;
}

export interface ModelCellType {
  value?: ResultType;
  formula?: string;
  style?: Partial<StyleType>;
}
export interface Coordinate {
  row: number;
  col: number;
}
export type ModelCellValue = ModelCellType & Coordinate;

export type ModelColType = Record<string, ModelCellType>; // key: col number
export type ModelRowType = Record<string, ModelColType>; // key: row number

export interface CustomItem {
  widthOrHeight: number; // width or height
  isHide: boolean;
}
export type CustomHeightOrWidthItem = Record<string, CustomItem>; // key: row number or col number value: height or width
export interface MergeCellItem {
  start: Coordinate;
  end: Coordinate;
}
export interface WorkBookJSON {
  workbook: WorksheetType[]; // workbook.xml_workbook_sheets
  worksheets: Record<string, ModelRowType>; // key: sheetId worksheets_*.xml_worksheet_sheetData
  mergeCells: IRange[]; // worksheets_*.xml_worksheet_mergeCells
  customHeight: Record<string, CustomHeightOrWidthItem>; // key: sheetId worksheets_*.xml_worksheet_sheetData_customHeight
  customWidth: Record<string, CustomHeightOrWidthItem>; // key: sheetId worksheets_*.xml_worksheet_sheetData_customHeight
  definedNames: Record<string, IRange>; // key: defineName workbook.xml_workbook_definedNames
}

export interface IModel extends IBaseModel {
  record: () => void;
  pasteRange: (range: IRange, isCut: boolean) => IRange;
}

export interface IBaseModel {
  getCell: (range: IRange) => ModelCellValue;
  getColWidth: (col: number) => number;
  setColWidth: (col: number, width: number) => void;
  getRowHeight: (row: number) => number;
  setRowHeight: (row: number, height: number) => void;
  setCellValues: (value: ResultType[][], style: Array<Array<Partial<StyleType>>>, ranges: IRange[]) => void;
  setActiveCell: (range: IRange) => void;
  setCurrentSheetId: (id: string) => void;
  getCurrentSheetId: () => string;
  addSheet: () => void;
  deleteSheet: (sheetId?: string) => void;
  hideSheet: (sheetId?: string) => void;
  unhideSheet: (sheetId?: string) => void;
  renameSheet: (sheetName: string, sheetId?: string) => void;
  toJSON: () => WorkBookJSON;
  fromJSON: (json: WorkBookJSON) => void;
  setCellStyle: (style: Partial<StyleType>, ranges: IRange[]) => void;
  getSheetInfo: (sheetId: string) => WorksheetType;
  getSheetList: () => WorkBookJSON['workbook'];
  addRow: (rowIndex: number, count: number) => void;
  addCol: (colIndex: number, count: number) => void;
  deleteCol: (colIndex: number, count: number) => void;
  deleteRow: (rowIndex: number, count: number) => void;
  hideRow: (rowIndex: number, count: number) => void;
  hideCol: (colIndex: number, count: number) => void;
  canRedo: () => boolean;
  canUndo: () => boolean;
  undo: () => void;
  redo: () => void;
  deleteAll: (sheetId?: string) => void;
  getDefineName: (range: IRange) => string;
  setDefineName: (range: IRange, name: string) => void;
}

export interface UndoRedoItem {
  op: UndoRedoType;
  path: string;
  value: any;
}

export type UndoRedoType = 'set' | 'add-array' | 'delete-array';

export interface IHistory {
  clear: () => void;
  canRedo: () => boolean;
  canUndo: () => boolean;
  undo: () => UndoRedoItem[];
  redo: () => UndoRedoItem[];
  pushRedo: (op: UndoRedoType, path: string, value: any) => void;
  pushUndo: (op: UndoRedoType, path: string, value: any) => void;
  onChange: () => void;
}
