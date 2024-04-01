import { ResultType } from './parser';
import { IRange } from './range';
import type { ChartType } from 'chart.js';
import type { ICommandItem } from './history';

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
  isStrike: boolean;
  numberFormat: number; // NUMBER_FORMAT_LIST id
}
export interface WorksheetType {
  sheetId: string;
  name: string;
  isHide: boolean;
  rowCount: number;
  colCount: number;
  sort: number; // sort
  tabColor?: string;
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
  len: number; // width or height
  isHide: boolean;
}
export type CustomHeightOrWidthItem = Record<string, CustomItem>; // key: sheetId + '_' + row number or col number value: height or width

export interface MergeCellItem {
  start: Coordinate;
  end: Coordinate;
}

export type FloatElement = {
  title: string;
  type: 'floating-picture' | 'chart';
  uuid: string;
  width: number;
  height: number;
  originWidth: number;
  originHeight: number;
  fromCol: number; // insert col
  fromRow: number; // insert row
  sheetId: string; // insert sheetId
  marginX: number; // the x distance of (fromCol, fromRow)
  marginY: number; // the Y distance of (fromCol, fromRow)
  imageAngle?: number;
  imageSrc?: string; // floating-picture src
  chartType?: ChartType;
  chartRange?: IRange; // chart reference range
};
export type WorksheetData = Record<string, ModelCellType>; // key: row + col worksheets_*.xml_worksheet_sheetData

export type ChangeEventType =
  | keyof WorkBookJSON
  | 'antLine'
  | 'scroll'
  | 'row'
  | 'col'
  | 'cellValue'
  | 'cellStyle'
  | 'undoRedo';
export interface EventType {
  changeSet: Set<ChangeEventType>;
}

export type WorkBookJSON = {
  worksheets: Record<string, WorksheetData>; // key: sheetId
  workbook: Record<string, WorksheetType>; // key: sheetId, workbook.xml_workbook_sheets
  mergeCells: Record<string, IRange>; // key: ref, worksheets_*.xml_worksheet_mergeCells
  customHeight: CustomHeightOrWidthItem; // key: sheetId_row worksheets_*.xml_worksheet_sheetData_customHeight
  customWidth: CustomHeightOrWidthItem; // key: sheetId_col worksheets_*.xml_worksheet_sheetData_customHeight
  definedNames: Record<string, IRange>; // key: defineName workbook.xml_workbook_definedNames
  currentSheetId: string;
  drawings: Record<string, FloatElement>; // key: uuid,  chart floatImage
  rangeMap: Record<string, IRange>; // key: sheetId
};

export type DefinedNameItem = { range: IRange; name: string };

export interface IBaseManager {
  fromJSON(json: WorkBookJSON): void;
  undo(item: ICommandItem): void;
  redo(item: ICommandItem): void;
  deleteAll(sheetId?: string): void;
}

export interface IWorkbook extends IBaseManager {
  toJSON(): Pick<WorkBookJSON, 'currentSheetId' | 'workbook'>;
  setCurrentSheetId(id: string): void;
  getCurrentSheetId(): string;
  addSheet(): WorksheetType;
  deleteSheet(sheetId?: string): void;
  hideSheet(sheetId?: string): void;
  unhideSheet(sheetId?: string): void;
  renameSheet(sheetName: string, sheetId?: string): void;
  getSheetInfo(sheetId?: string): WorksheetType | undefined;
  updateSheetInfo(data: Partial<WorksheetType>, sheetId?: string): void;
  getSheetList(): WorksheetType[];
}

export interface IRangeMap extends IBaseManager {
  toJSON(): Pick<WorkBookJSON, 'rangeMap'>;
  setActiveCell(range: IRange): void;
  getActiveCell(): IRange;
}

export interface IDrawings extends IBaseManager {
  toJSON(): Pick<WorkBookJSON, 'drawings'>;
  getFloatElementList(sheetId?: string): FloatElement[];
  addFloatElement(data: FloatElement): void;
  updateFloatElement(uuid: string, value: Partial<FloatElement>): void;
  deleteFloatElement(uuid: string): void;
  deleteCol(colIndex: number, count: number): void;
  deleteRow(rowIndex: number, count: number): void;
}

export interface IDefinedName extends IBaseManager {
  toJSON(): Pick<WorkBookJSON, 'definedNames'>;
  getDefineName(range: IRange): string;
  setDefineName(range: IRange, name: string): void;
  checkDefineName(name: string): IRange | undefined;
  getDefineNameList(): DefinedNameItem[];
}

export interface IMergeCell extends IBaseManager {
  toJSON(): Pick<WorkBookJSON, 'mergeCells'>;
  getMergeCells(sheetId?: string): IRange[];
  addMergeCell(range: IRange): void;
  deleteMergeCell(range: IRange): void;
}

export interface IRow extends IBaseManager {
  toJSON(): Pick<WorkBookJSON, 'customHeight'>;
  addRow(rowIndex: number, count: number): void;
  deleteRow(rowIndex: number, count: number): void;
  hideRow(rowIndex: number, count: number): void;
  getRowHeight(row: number, sheetId?: string): CustomItem;
  setRowHeight(row: number, height: number, sheetId?: string): void;
}

export interface ICol extends IBaseManager {
  toJSON(): Pick<WorkBookJSON, 'customWidth'>;
  addCol(colIndex: number, count: number): void;
  deleteCol(colIndex: number, count: number): void;
  hideCol(colIndex: number, count: number): void;
  getColWidth(col: number, sheetId?: string): CustomItem;
  setColWidth(col: number, width: number, sheetId?: string): void;
}
export interface IWorksheet extends IBaseManager {
  toJSON(): Pick<WorkBookJSON, 'worksheets'>;
  pasteRange(fromRange: IRange, isCut: boolean): IRange;
  getWorksheet(sheetId?: string): WorksheetData | undefined;
  setWorksheet(data: WorksheetData, sheetId?: string): void;
  getCell(range: IRange): ModelCellValue | null;
  setCellValues(
    value: ResultType[][],
    style: Array<Array<Partial<StyleType>>>,
    ranges: IRange[],
  ): void;
  updateCellStyle(style: Partial<StyleType>, ranges: IRange[]): void;
  computeFormulas(): void;
}

export interface IModel extends IBaseModel {
  pasteRange: (range: IRange, isCut: boolean) => IRange;
  emitChange: (dataset: Set<ChangeEventType>) => void;
  push(command: ICommandItem): void;
  iterateRange(range: IRange, fn: (row: number, col: number) => boolean): void;
}
export interface IBaseModel
  extends Pick<
      IWorkbook,
      | 'setCurrentSheetId'
      | 'getCurrentSheetId'
      | 'addSheet'
      | 'deleteSheet'
      | 'hideSheet'
      | 'unhideSheet'
      | 'renameSheet'
      | 'getSheetInfo'
      | 'updateSheetInfo'
      | 'getSheetList'
      | 'deleteAll'
      | 'fromJSON'
    >,
    Pick<IRangeMap, 'setActiveCell' | 'getActiveCell'>,
    Pick<
      IDrawings,
      | 'getFloatElementList'
      | 'addFloatElement'
      | 'updateFloatElement'
      | 'deleteFloatElement'
    >,
    Pick<
      IDefinedName,
      | 'getDefineName'
      | 'setDefineName'
      | 'checkDefineName'
      | 'getDefineNameList'
    >,
    Pick<IMergeCell, 'getMergeCells' | 'addMergeCell' | 'deleteMergeCell'>,
    Pick<
      IRow,
      'addRow' | 'deleteRow' | 'hideRow' | 'getRowHeight' | 'setRowHeight'
    >,
    Pick<
      ICol,
      'addCol' | 'deleteCol' | 'hideCol' | 'getColWidth' | 'setColWidth'
    >,
    Pick<
      IWorksheet,
      | 'getCell'
      | 'setCellValues'
      | 'updateCellStyle'
      | 'getWorksheet'
      | 'setWorksheet'
    > {
  toJSON(): WorkBookJSON;
  canRedo(): boolean;
  canUndo(): boolean;
  undo(): void;
  redo(): void;
}
