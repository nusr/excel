import { ResultType } from './parser';
import { IRange } from './range';
import type { ModelRoot, ModelJSON } from './yjs';
import type { YEvent } from 'yjs';

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
  borderLeft?: BorderItem;
  borderRight?: BorderItem;
  borderTop?: BorderItem;
  borderBottom?: BorderItem;
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

/**
 * Interface representing a base manager for handling models.
 */
export interface IBaseManager {
  /**
   * Populates the manager with data from a JSON object.
   *
   * @param json - The JSON object containing the model data.
   */
  fromJSON(json: ModelJSON): void;

  /**
   * Deletes all entries associated with the specified sheet ID.
   * If no sheet ID is provided, deletes current sheet.
   *
   * @param sheetId - Optional. The ID of the sheet whose entries should be deleted.
   */
  deleteAll(sheetId?: string): void;
}

/**
 * Interface representing a workbook manager.
 * Extends the IBaseManager interface.
 */
export interface IWorkbook extends IBaseManager {
  /**
   * Sets the current sheet ID.
   *
   * @param {string} id - The ID of the sheet to set as current.
   */
  setCurrentSheetId(id: string): void;

  /**
   * Gets the current sheet ID.
   *
   * @returns {string} The ID of the current sheet.
   */
  getCurrentSheetId(): string;

  /**
   * Adds a new sheet to the workbook.
   *
   * @returns {WorksheetType | undefined} The newly added sheet or undefined if the operation fails.
   */
  addSheet(): WorksheetType | undefined;

  /**
   * Deletes a sheet from the workbook.
   *
   * @param {string} [sheetId] - The ID of the sheet to delete. If not provided, the current sheet will be deleted.
   */
  deleteSheet(sheetId?: string): void;

  /**
   * Hides a sheet in the workbook.
   *
   * @param sheetId - The ID of the sheet to hide.
   */
  hideSheet(sheetId?: string): void;

  /**
   * Unhide a sheet in the workbook.
   *
   * @param sheetId - The ID of the sheet to unhide.
   */
  unhideSheet(sheetId: string): void;

  /**
   * Renames a sheet in the workbook.
   *
   * @param {string} sheetName - The new name for the sheet.
   * @param {string} [sheetId] - The ID of the sheet to rename. If not provided, the current sheet will be renamed.
   */
  renameSheet(sheetName: string, sheetId?: string): void;

  /**
   * Gets information about a sheet in the workbook.
   *
   * @param {string} [sheetId] - The ID of the sheet to get information about. If not provided, information about the current sheet will be returned.
   * @returns {WorksheetType | undefined} The sheet information or undefined if the sheet does not exist.
   */
  getSheetInfo(sheetId?: string): WorksheetType | undefined;

  /**
   * Updates information about a sheet in the workbook.
   *
   * @param {Partial<WorksheetType>} data - The data to update the sheet with.
   * @param {string} [sheetId] - The ID of the sheet to update. If not provided, the current sheet will be updated.
   */
  updateSheetInfo(data: Partial<WorksheetType>, sheetId?: string): void;

  /**
   * Gets a list of all sheets in the workbook.
   *
   * @returns {WorksheetType[]} An array of all sheets in the workbook.
   */
  getSheetList(): WorksheetType[];

  /**
   * Validates a sheet in the workbook.
   *
   * @param {WorksheetType} data - The sheet data to validate.
   * @returns {boolean} True if the sheet is valid, false otherwise.
   */
  validateSheet(data: WorksheetType): boolean;
}

export type ActiveRange = {
  isMerged: boolean;
  range: IRange; // merge range
};

/**
 * Interface representing a range map manager.
 * Extends the IBaseManager interface.
 */
export interface IRangeMap extends IBaseManager {
  /**
   * Sets the active range.
   * @param range - The range to be set as active.
   */
  setActiveRange(range: IRange): void;

  /**
   * Gets the active range.
   * @param range - Optional parameter to specify a range.
   * @returns The active range.
   */
  getActiveRange(range?: IRange): ActiveRange;

  /**
   * Validates the specified range.
   * @param range - The range to be validated.
   * @returns True if the range is valid, otherwise false.
   */
  validateRange(range: IRange): boolean;
}

/**
 * Interface representing a scroll manager.
 * Extends the IBaseManager interface.
 */
export interface IScroll extends IBaseManager {
  /**
   * Retrieves the scroll information for a given sheet.
   *
   * @param sheetId - Optional. The ID of the sheet to get the scroll information for. If not provided, the default sheet is used.
   * @returns The scroll information for the specified sheet.
   */
  getScroll(sheetId?: string): ModelScroll;

  /**
   * Sets the scroll information for a given sheet.
   *
   * @param value - The scroll information to set. This is a partial object, meaning only the properties that need to be updated can be provided.
   * @param sheetId - Optional. The ID of the sheet to set the scroll information for. If not provided, the default sheet is used.
   * @returns A boolean indicating whether the operation was successful.
   */
  setScroll(value: Partial<ModelScroll>, sheetId?: string): boolean;
}

/**
 * Interface representing a manager for handling drawing elements.
 * Extends the IBaseManager interface.
 */
export interface IDrawings extends IBaseManager {
  /**
   * Retrieves a list of drawing elements for a specified sheet.
   * @param sheetId - Optional ID of the sheet to get drawings from.
   * @returns An array of DrawingElement objects.
   */
  getDrawingList(sheetId?: string): DrawingElement[];

  /**
   * Adds one or more drawing elements.
   * @param data - The drawing elements to add.
   */
  addDrawing(...data: DrawingElement[]): void;

  /**
   * Updates a drawing element identified by its UUID.
   * @param uuid - The unique identifier of the drawing element to update.
   * @param value - Partial object containing the properties to update.
   */
  updateDrawing(uuid: string, value: Partial<DrawingElement>): void;

  /**
   * Deletes a drawing element identified by its UUID.
   * @param uuid - The unique identifier of the drawing element to delete.
   */
  deleteDrawing(uuid: string): void;

  /**
   * Adds columns to the drawing.
   * @param colIndex - The index at which to start adding columns.
   * @param count - The number of columns to add.
   */
  addCol(colIndex: number, count: number): void;

  /**
   * Adds rows to the drawing.
   * @param rowIndex - The index at which to start adding rows.
   * @param count - The number of rows to add.
   */
  addRow(rowIndex: number, count: number): void;

  /**
   * Deletes columns from the drawing.
   * @param colIndex - The index at which to start deleting columns.
   * @param count - The number of columns to delete.
   */
  deleteCol(colIndex: number, count: number): void;

  /**
   * Deletes rows from the drawing.
   * @param rowIndex - The index at which to start deleting rows.
   * @param count - The number of rows to delete.
   */
  deleteRow(rowIndex: number, count: number): void;

  /**
   * Validates a drawing element.
   * @param item - The drawing element to validate.
   * @returns A boolean indicating whether the drawing element is valid.
   */
  validateDrawing(item: DrawingElement): boolean;
}

/**
 * Interface representing a manager for defined names in a spreadsheet.
 * Extends the IBaseManager interface.
 */
export interface IDefinedName extends IBaseManager {
  /**
   * Retrieves the defined name for a given range.
   * @param range - The range for which to get the defined name.
   * @returns The defined name as a string.
   */
  getDefineName(range: IRange): string;

  /**
   * Sets a defined name for a given range.
   * @param range - The range to which the defined name will be assigned.
   * @param name - The name to assign to the range.
   * @returns A boolean indicating whether the operation was successful.
   */
  setDefineName(range: IRange, name: string): boolean;

  /**
   * Checks if a defined name exists and returns the corresponding range.
   * @param name - The name to check.
   * @returns The range associated with the defined name, or undefined if the name does not exist.
   */
  checkDefineName(name: string): IRange | undefined;

  /**
   * Retrieves a list of all defined names.
   * @returns An array of DefinedNameItem objects representing all defined names.
   */
  getDefineNameList(): DefinedNameItem[];

  /**
   * Validates a defined name to ensure it meets the required criteria.
   * @param name - The name to validate.
   * @returns A boolean indicating whether the name is valid.
   */
  validateDefinedName(name: string): boolean;
}

/**
 * Interface representing a manager for merged cells in a spreadsheet.
 * Extends the IBaseManager interface.
 */
export interface IMergeCell extends IBaseManager {
  /**
   * Retrieves a list of merged cell ranges for a given sheet.
   *
   * @param sheetId - Optional. The ID of the sheet to retrieve merged cells from. If not provided, retrieves merged cells from the current sheet.
   * @returns An array of IRange objects representing the merged cell ranges.
   */
  getMergeCellList(sheetId?: string): IRange[];

  /**
   * Adds a merged cell range to the spreadsheet.
   *
   * @param range - The range of cells to merge, represented as an IRange object.
   * @param type - Optional. The type of merge to perform, represented as an EMergeCellType. Defaults to a standard merge if not provided.
   */
  addMergeCell(range: IRange, type?: EMergeCellType): void;

  /**
   * Deletes a merged cell range from the spreadsheet.
   *
   * @param range - The range of cells to unmerge, represented as an IRange object.
   */
  deleteMergeCell(range: IRange): void;
}

/**
 * Interface representing a row manager with methods to manipulate rows in a spreadsheet.
 * Extends the IBaseManager interface.
 */
export interface IRow extends IBaseManager {
  /**
   * Hides a specified number of rows starting from the given row index.
   * @param rowIndex - The index of the first row to hide.
   * @param count - The number of rows to hide.
   */
  hideRow(rowIndex: number, count: number): void;

  /**
   * Unhide a specified number of rows starting from the given row index.
   * @param rowIndex - The index of the first row to unhide.
   * @param count - The number of rows to unhide.
   */
  unhideRow(rowIndex: number, count: number): void;

  /**
   * Retrieves a row object from the specified row index and optional sheet ID.
   * @param row - The index of the row to retrieve.
   * @param sheetId - Optional. The ID of the sheet from which to retrieve the row.
   * @returns A CustomItem representing the row.
   */
  getRow(row: number, sheetId?: string): CustomItem;

  /**
   * Sets the height of a specified row in the spreadsheet.
   * @param row - The index of the row to set the height for.
   * @param height - The height to set for the row.
   * @param sheetId - Optional. The ID of the sheet in which to set the row height.
   */
  setRowHeight(row: number, height: number, sheetId?: string): void;
}

/**
 * Interface representing column management operations.
 * Extends the IBaseManager interface.
 */
export interface ICol extends IBaseManager {
  /**
   * Hides a specified number of columns starting from the given column index.
   * @param colIndex - The index of the column to start hiding from.
   * @param count - The number of columns to hide.
   */
  hideCol(colIndex: number, count: number): void;

  /**
   * Unhide a specified number of columns starting from the given column index.
   * @param colIndex - The index of the column to start unhide from.
   * @param count - The number of columns to unhide.
   */
  unhideCol(colIndex: number, count: number): void;

  /**
   * Retrieves the column information for the specified column index.
   * @param col - The index of the column to retrieve.
   * @param sheetId - Optional. The ID of the sheet containing the column.
   * @returns The column information as a CustomItem.
   */
  getCol(col: number, sheetId?: string): CustomItem;

  /**
   * Sets the width of the specified column.
   * @param col - The index of the column to set the width for.
   * @param width - The width to set for the column.
   * @param sheetId - Optional. The ID of the sheet containing the column.
   */
  setColWidth(col: number, width: number, sheetId?: string): void;
}
/**
 * Interface representing a worksheet with various operations.
 * Extends the IBaseManager interface.
 */
export interface IWorksheet extends IBaseManager {
  /**
   * Adds columns to the worksheet.
   *
   * @param {number} colIndex - The index at which to start adding columns.
   * @param {number} count - The number of columns to add.
   * @param {boolean} [isRight] - Whether to add columns to the right of the specified index.
   */
  addCol(colIndex: number, count: number, isRight?: boolean): void;

  /**
   * Adds rows to the worksheet.
   *
   * @param {number} rowIndex - The index at which to start adding rows.
   * @param {number} count - The number of rows to add.
   * @param {boolean} [isAbove] - Whether to add rows above the specified index.
   */
  addRow(rowIndex: number, count: number, isAbove?: boolean): void;

  /**
   * Deletes columns from the worksheet.
   *
   * @param {number} colIndex - The index at which to start deleting columns.
   * @param {number} count - The number of columns to delete.
   */
  deleteCol(colIndex: number, count: number): void;

  /**
   * Deletes rows from the worksheet.
   *
   * @param {number} rowIndex - The index at which to start deleting rows.
   * @param {number} count - The number of rows to delete.
   */
  deleteRow(rowIndex: number, count: number): void;

  /**
   * Pastes a range of cells.
   *
   * @param {IRange} fromRange - The range of cells to paste.
   * @param {boolean} isCut - Whether the operation is a cut-paste.
   * @returns {IRange} - The range of cells that were pasted.
   */
  pasteRange(fromRange: IRange, isCut: boolean): IRange;

  /**
   * Retrieves worksheet data.
   *
   * @param {string} [sheetId] - The ID of the sheet to retrieve.
   * @returns {WorksheetData} - The data of the worksheet.
   */
  getWorksheet(sheetId?: string): WorksheetData;

  /**
   * Sets the worksheet data.
   *
   * @param {WorksheetData} data - The data to set in the worksheet.
   */
  setWorksheet(data: WorksheetData): void;

  /**
   * Retrieves a cell from the worksheet.
   *
   * @param {IRange} range - The range of the cell to retrieve.
   * @returns {ModelCellType | undefined} - The cell data or undefined if not found.
   */
  getCell(range: IRange): ModelCellType | undefined;

  /**
   * Sets the value and style of a range of cells.
   *
   * @param {ResultType[][]} value - The values to set in the cells.
   * @param {Array<Array<Partial<StyleType>>>} style - The styles to apply to the cells.
   * @param {IRange} range - The range of cells to set.
   */
  setCell(
    value: ResultType[][],
    style: Array<Array<Partial<StyleType>>>,
    range: IRange,
  ): void;

  /**
   * Updates the style of a range of cells.
   *
   * @param {Partial<StyleType>} style - The style to apply to the cells.
   * @param {IRange} range - The range of cells to update.
   */
  updateCellStyle(style: Partial<StyleType>, range: IRange): void;

  /**
   * Sets the value of a cell.
   *
   * @param {ResultType} value - The value to set in the cell.
   * @param {IRange} range - The range of the cell to set.
   */
  setCellValue(value: ResultType, range: IRange): void;

  /**
   * Computes all formulas in the worksheet.
   */
  computeFormulas(): void;

  /**
   * Adds a merged cell range.
   *
   * @param {IRange} range - The range of cells to merge.
   * @param {EMergeCellType} [type] - The type of merge to apply.
   */
  addMergeCell(range: IRange, type?: EMergeCellType): void;
}

/**
 * Interface representing a filter manager that extends the base manager.
 * Provides methods to add, delete, get, and update filters.
 */
export interface IFilter extends IBaseManager {
  /**
   * Adds a filter to the specified range.
   * @param range - The range to which the filter will be applied.
   */
  addFilter(range: IRange): void;

  /**
   * Deletes a filter from the specified sheet.
   * @param sheetId - The optional ID of the sheet from which the filter will be deleted. If not provided, the filter will be deleted from the current sheet.
   */
  deleteFilter(sheetId?: string): void;

  /**
   * Retrieves the filter from the specified sheet.
   * @param sheetId - The optional ID of the sheet from which the filter will be retrieved. If not provided, the filter from the current sheet will be retrieved.
   * @returns The filter item if found, otherwise undefined.
   */
  getFilter(sheetId?: string): AutoFilterItem | undefined;

  /**
   * Updates the filter on the specified sheet with the given value.
   * @param sheetId - The ID of the sheet on which the filter will be updated.
   * @param value - The partial filter item containing the updated values.
   */
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

/**
 * Interface representing a model with various functionalities.
 *
 */
export interface IModel
  extends IBaseModel,
    Pick<IScroll, 'getScroll' | 'setScroll'> {
  /**
   * Pastes a range of cells.
   *
   * @param range - The range of cells to paste.
   * @param isCut - A boolean indicating if the operation is a cut-paste.
   * @returns The range of cells that were pasted.
   */
  pasteRange(range: IRange, isCut: boolean): IRange;

  computeFormulas(): Promise<boolean>;

  /**
   * Gets the root of the model.
   *
   * @returns The root of the model.
   */
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
  renderChange: {
    changeSet: Set<ChangeEventType>;
  };
  awarenessChange: {
    users: UserItem[];
  };
  rangeChange: {
    range: IRange;
  };
  modelChange: {
    event: YEvent<any>[];
  };
};

export enum SYNC_FLAG {
  MODEL = 'model',
  SKIP_UPDATE = 'skip-update',
  SKIP_UNDO_REDO = 'skip-undo-redo',
  SKIP_UNDO_REDO_UPDATE = 'skip-undo-redo-update',
}
