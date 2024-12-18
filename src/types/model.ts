import { ResultType } from './parser';
import { IRange } from './range';
import type { ModelRoot, ModelJSON } from './yjs';

export type ChartType =
  | 'bar'
  | 'line'
  | 'scatter'
  | 'bubble'
  | 'pie'
  | 'doughnut'
  | 'polarArea'
  | 'radar';

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

export type BorderType =
  | 'thin'
  | 'hair'
  | 'dotted'
  | 'dashed'
  | 'dashDot'
  | 'dashDotDot'
  | 'double'
  | 'medium'
  | 'mediumDashed'
  | 'mediumDashDot'
  | 'mediumDashDotDot'
  | 'thick';
// | 'slantDashDot'

export type BorderItem = {
  color: string;
  type: BorderType;
};
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
  numberFormat: string;
  borderLeft?: BorderItem | undefined;
  borderRight?: BorderItem | undefined;
  borderTop?: BorderItem | undefined;
  borderBottom?: BorderItem | undefined;
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
export interface ModelScroll {
  row: number;
  col: number;
}
export interface ScrollValue extends ModelScroll {
  top: number;
  left: number;
  scrollLeft: number;
  scrollTop: number;
}

export interface ModelCellType extends Partial<StyleType> {
  value: ResultType;
  formula?: string;
}

export interface Coordinate {
  row: number;
  col: number;
}
export type ModelCellValue = ModelCellType &
  Pick<IRange, 'sheetId' | 'row' | 'col'>;

export interface CustomItem {
  len: number; // width or height
  isHide: boolean;
}
export type CustomHeightOrWidthItem = Record<string, CustomItem>; // key: sheetId + '_' + row number or col number value: height or width

export type DrawingElement = {
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
export type WorksheetData = ModelCellValue[];

export type ChangeEventType =
  | keyof ModelJSON
  | 'cellValue'
  | 'cellStyle'
  | 'antLine'
  | 'redo'
  | 'undo';
export interface EventType {
  changeSet: Set<ChangeEventType>;
}

export enum EMergeCellType {
  MERGE_CENTER = 0,
  MERGE_CELL,
  MERGE_CONTENT,
}

export interface MergeCellItem {
  range: IRange; // merge range
  type: EMergeCellType; // merge type
  firstCell: Coordinate; // first cell not empty
}

export type NumberFilter = {
  type: 'number';
  value: Array<{ type: string; value: number }>;
};

export type TextFilter = {
  type: 'text';
  value: Array<{ type: string; value: string }>;
};

export type ColorFilter = {
  type: 'color';
  value: string;
  colorType: 'fillColor' | 'fontColor';
};

export type NormalFilter = {
  type: 'normal';
  value: ResultType[];
};

export type AutoFilterItem = {
  range: IRange;
  col?: number;
  value?: NormalFilter | NumberFilter | TextFilter | ColorFilter;
};

export type DefinedNameItem = { range: IRange; name: string };

export interface IBaseManager {
  fromJSON(json: ModelJSON): void;
  deleteAll(sheetId?: string): void;
}

export interface IWorkbook extends IBaseManager {
  setCurrentSheetId(id: string): void;
  getCurrentSheetId(): string;
  addSheet(): WorksheetType | undefined;
  deleteSheet(sheetId?: string): void;
  hideSheet(sheetId?: string): void;
  unhideSheet(sheetId: string): void;
  renameSheet(sheetName: string, sheetId?: string): void;
  getSheetInfo(sheetId?: string): WorksheetType | undefined;
  updateSheetInfo(data: Partial<WorksheetType>, sheetId?: string): void;
  getSheetList(): WorksheetType[];
  validateSheet(data: WorksheetType): boolean;
}
export type ActiveRange = {
  isMerged: boolean;
  range: IRange; // merge range
};
export interface IRangeMap extends IBaseManager {
  setActiveRange(range: IRange): void;
  getActiveRange(range?: IRange): ActiveRange;
  validateRange(range: IRange): boolean;
}

export interface IScroll extends IBaseManager {
  getScroll(sheetId?: string): ModelScroll;
  setScroll(value: Partial<ModelScroll>, sheetId?: string): boolean;
}

export interface IDrawings extends IBaseManager {
  getDrawingList(sheetId?: string): DrawingElement[];
  addDrawing(...data: DrawingElement[]): void;
  updateDrawing(uuid: string, value: Partial<DrawingElement>): void;
  deleteDrawing(uuid: string): void;
  addCol(colIndex: number, count: number): void;
  addRow(rowIndex: number, count: number): void;
  deleteCol(colIndex: number, count: number): void;
  deleteRow(rowIndex: number, count: number): void;
  validateDrawing(item: DrawingElement): boolean;
}

export interface IDefinedName extends IBaseManager {
  getDefineName(range: IRange): string;
  setDefineName(range: IRange, name: string): boolean;
  checkDefineName(name: string): IRange | undefined;
  getDefineNameList(): DefinedNameItem[];
  validateDefinedName(name: string): boolean;
}

export interface IMergeCell extends IBaseManager {
  getMergeCellList(sheetId?: string): IRange[];
  addMergeCell(range: IRange, type?: EMergeCellType): void;
  deleteMergeCell(range: IRange): void;
}

export interface IRow extends IBaseManager {
  hideRow(rowIndex: number, count: number): void;
  unhideRow(rowIndex: number, count: number): void;
  getRow(row: number, sheetId?: string): CustomItem;
  setRowHeight(row: number, height: number, sheetId?: string): void;
}

export interface ICol extends IBaseManager {
  hideCol(colIndex: number, count: number): void;
  unhideCol(colIndex: number, count: number): void;
  getCol(col: number, sheetId?: string): CustomItem;
  setColWidth(col: number, width: number, sheetId?: string): void;
}
export interface IWorksheet extends IBaseManager {
  addCol(colIndex: number, count: number, isRight?: boolean): void;
  addRow(rowIndex: number, count: number, isAbove?: boolean): void;
  deleteCol(colIndex: number, count: number): void;
  deleteRow(rowIndex: number, count: number): void;
  pasteRange(fromRange: IRange, isCut: boolean): IRange;
  getWorksheet(sheetId?: string): WorksheetData;
  setWorksheet(data: WorksheetData): void;
  getCell(range: IRange): ModelCellType | undefined;
  setCell(
    value: ResultType[][],
    style: Array<Array<Partial<StyleType>>>,
    range: IRange,
  ): void;
  updateCellStyle(style: Partial<StyleType>, range: IRange): void;
  setCellValue(value: ResultType, range: IRange): void;
  computeFormulas(): void;
  addMergeCell(range: IRange, type?: EMergeCellType): void;
}

export interface IFilter extends IBaseManager {
  addFilter(range: IRange): void;
  deleteFilter(sheetId?: string): void;
  getFilter(sheetId?: string): AutoFilterItem | undefined;
  updateFilter(sheetId: string, value: Partial<AutoFilterItem>): void;
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
    Pick<IRangeMap, 'setActiveRange' | 'getActiveRange' | 'validateRange'>,
    Pick<
      IDrawings,
      | 'getDrawingList'
      | 'addDrawing'
      | 'updateDrawing'
      | 'deleteDrawing'
      | 'validateDrawing'
    >,
    Pick<
      IDefinedName,
      | 'getDefineName'
      | 'setDefineName'
      | 'checkDefineName'
      | 'getDefineNameList'
      | 'validateDefinedName'
    >,
    Pick<IMergeCell, 'getMergeCellList' | 'addMergeCell' | 'deleteMergeCell'>,
    Pick<IRow, 'hideRow' | 'getRow' | 'setRowHeight' | 'unhideRow'>,
    Pick<ICol, 'hideCol' | 'getCol' | 'setColWidth' | 'unhideCol'>,
    Pick<
      IWorksheet,
      | 'addRow'
      | 'deleteRow'
      | 'addCol'
      | 'deleteCol'
      | 'getCell'
      | 'setCell'
      | 'updateCellStyle'
      | 'getWorksheet'
      | 'setWorksheet'
      | 'setCellValue'
    >,
    Pick<IFilter, 'addFilter' | 'getFilter' | 'deleteFilter' | 'updateFilter'> {
  toJSON(): ModelJSON;
  canRedo(): boolean;
  canUndo(): boolean;
  undo(): void;
  redo(): void;
  transaction<T>(fn: () => T, origin?: any): T;
  clearHistory(): void;
}

export interface IModel
  extends IBaseModel,
    Pick<IScroll, 'getScroll' | 'setScroll'> {
  pasteRange(range: IRange, isCut: boolean): IRange;
  emitChange(dataset: Set<ChangeEventType>): void;
  render(dataset: Set<ChangeEventType>): void;
  getRoot(): ModelRoot;
}

export type NumberFormatValue =
  | number
  | string
  | boolean
  | Date
  | null
  | undefined;

export type UserItem = {
  range: IRange;
  clientId: number;
};
export type EventEmitterType = {
  modelChange: {
    changeSet: Set<ChangeEventType>;
  };
  awarenessChange: {
    users: UserItem[];
  };
  rangeChange: {
    range: IRange;
  };
};

export enum SYNC_FLAG {
  MODEL = 'model',
  SKIP_UPDATE = 'skip-update',
  SKIP_UNDO_REDO = 'skip-undo-redo',
  SKIP_UNDO_REDO_UPDATE = 'skip-undo-redo-update',
}
