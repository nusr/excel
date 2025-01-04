import {
  StyleType,
  ModelJSON,
  WorksheetType,
  IModel,
  ResultType,
  IRange,
  CustomItem,
  DrawingElement,
  DefinedNameItem,
  WorksheetData,
  EMergeCellType,
  IHooks,
  AutoFilterItem,
  ModelRoot,
  ModelScroll,
  SYNC_FLAG,
  ModelEventEmitterType,
} from '../types';
import {
  XLSX_MAX_ROW_COUNT,
  XLSX_MAX_COL_COUNT,
  EventEmitter,
  containRange,
  KEY_LIST,
} from '../util';
import { Workbook } from './workbook';
import { RangeMap } from './rangeMap';
import { Drawing } from './drawing';
import { DefinedName } from './definedName';
import { Worksheet } from './worksheet';
import { MergeCell } from './mergeCell';
import { RowManager } from './row';
import { ColManager } from './col';
import { FilterManger } from './filter';
import { ScrollManager } from './scroll';
import * as Y from 'yjs';

export class Model
  extends EventEmitter<ModelEventEmitterType>
  implements IModel
{
  private readonly workbookManager: Workbook;
  private readonly rangeMapManager: RangeMap;
  private readonly drawingsManager: Drawing;
  private readonly definedNameManager: DefinedName;
  private readonly worksheetManager: Worksheet;
  private readonly mergeCellManager: MergeCell;
  private readonly rowManager: RowManager;
  private readonly colManager: ColManager;
  private readonly filterManager: FilterManger;
  private readonly scrollManager: ScrollManager;
  private readonly doc: Y.Doc;
  private readonly undoManager: Y.UndoManager;
  constructor(hooks: Pick<IHooks, 'doc' | 'worker'>) {
    super();
    const { doc, worker } = hooks;
    this.doc = doc;
    const root = this.getRoot();
    root.observeDeep((event) => {
      this.emit('modelChange', { event });
    });
    this.undoManager = new Y.UndoManager(root, {
      trackedOrigins: new Set([SYNC_FLAG.MODEL, SYNC_FLAG.SKIP_UPDATE]),
      captureTimeout: 100,
    });

    this.workbookManager = new Workbook(this);
    this.rangeMapManager = new RangeMap(this);
    this.drawingsManager = new Drawing(this);
    this.definedNameManager = new DefinedName(this);
    this.worksheetManager = new Worksheet(this, worker);
    this.mergeCellManager = new MergeCell(this);
    this.rowManager = new RowManager(this);
    this.colManager = new ColManager(this);
    this.filterManager = new FilterManger(this);
    this.scrollManager = new ScrollManager(this);
  }
  transaction = <T>(fn: () => T, origin?: any): T => {
    return this.doc.transact(fn, origin || SYNC_FLAG.MODEL);
  };
  clearHistory() {
    this.undoManager.clear(true, true);
  }
  getRoot() {
    return this.doc.getMap('excel') as ModelRoot;
  }
  computeFormulas() {
    return this.worksheetManager.computeFormulas();
  }

  getSheetList(): WorksheetType[] {
    return this.workbookManager.getSheetList();
  }
  getActiveRange(r?: IRange) {
    const range = r || this.rangeMapManager.getActiveRange().range;
    const mergeCells = this.getMergeCellList(range.sheetId);
    for (const item of mergeCells) {
      if (containRange(range, item)) {
        const newRange = {
          ...item,
          sheetId: item.sheetId || this.getCurrentSheetId(),
        };
        return {
          range: newRange,
          isMerged: true,
        };
      }
    }
    return {
      range,
      isMerged: false,
    };
  }
  setActiveRange(range: IRange): void {
    range.sheetId = range.sheetId || this.getCurrentSheetId();
    const { range: newRange } = this.getActiveRange(range);
    this.rangeMapManager.setActiveRange(newRange);
  }
  addSheet() {
    const result = this.workbookManager.addSheet();
    this.worksheetManager.setWorksheet([]);
    this.workbookManager.setCurrentSheetId(result.sheetId);
    return result;
  }
  deleteSheet(sheetId?: string): void {
    const newSheetId = this.getNextSheetId(sheetId);
    if (!newSheetId) {
      return;
    }
    this.deleteAll(sheetId);
    this.workbookManager.deleteSheet(sheetId);
    this.workbookManager.setCurrentSheetId(newSheetId);
  }
  updateSheetInfo(data: Partial<WorksheetType>, sheetId?: string): void {
    this.workbookManager.updateSheetInfo(data, sheetId);
  }
  hideSheet(sheetId?: string): void {
    const newSheetId = this.getNextSheetId(sheetId);
    if (!newSheetId) {
      return;
    }
    this.workbookManager.hideSheet(sheetId);
    this.workbookManager.setCurrentSheetId(newSheetId);
  }
  unhideSheet(sheetId: string): void {
    if (!sheetId) {
      return;
    }
    this.workbookManager.unhideSheet(sheetId);
    this.workbookManager.setCurrentSheetId(sheetId);
  }
  renameSheet(sheetName: string, sheetId?: string): void {
    this.workbookManager.renameSheet(sheetName, sheetId);
  }
  getSheetInfo(sheetId?: string): WorksheetType | undefined {
    return this.workbookManager.getSheetInfo(sheetId);
  }
  setCurrentSheetId(sheetId: string): void {
    this.workbookManager.setCurrentSheetId(sheetId);
  }
  getCurrentSheetId(): string {
    return this.workbookManager.getCurrentSheetId();
  }
  fromJSON = (json: ModelJSON): void => {
    this.workbookManager.fromJSON(json);
    this.rangeMapManager.fromJSON(json);
    this.drawingsManager.fromJSON(json);
    this.definedNameManager.fromJSON(json);
    this.worksheetManager.fromJSON(json);
    this.mergeCellManager.fromJSON(json);
    this.rowManager.fromJSON(json);
    this.colManager.fromJSON(json);
    this.filterManager.fromJSON(json);
    this.scrollManager.fromJSON(json);
    this.worksheetManager.computeFormulas();
  };
  toJSON = (): ModelJSON => {
    const temp = this.getRoot().toJSON();
    const result: any = {};
    for (const key of KEY_LIST) {
      const v = temp[key];
      if (key === 'currentSheetId') {
        result.currentSheetId = v || '';
        continue;
      }

      result[key] = typeof v === 'undefined' ? {} : v;
    }
    return {
      ...result,
      rangeMap: this.rangeMapManager.toJSON(),
      scroll: this.scrollManager.toJSON(),
    };
  };

  setCell(
    value: ResultType[][],
    style: Array<Array<Partial<StyleType>>>,
    range: IRange,
  ) {
    return this.worksheetManager.setCell(value, style, range);
  }
  setCellValue(value: ResultType, range: IRange) {
    return this.worksheetManager.setCellValue(value, range);
  }

  updateCellStyle(style: Partial<StyleType>, range: IRange): void {
    return this.worksheetManager.updateCellStyle(style, range);
  }
  getCell = (range: IRange) => {
    return this.worksheetManager.getCell(range);
  };
  getWorksheet(sheetId?: string) {
    return this.worksheetManager.getWorksheet(sheetId);
  }
  setWorksheet(data: WorksheetData): void {
    this.worksheetManager.setWorksheet(data);
  }
  addCol(colIndex: number, count: number, isRight = false): void {
    if (count <= 0) {
      return;
    }
    const sheetInfo = this.getSheetInfo();
    if (!sheetInfo) {
      return;
    }
    if (sheetInfo.colCount >= XLSX_MAX_COL_COUNT) {
      return;
    }

    const id = this.getCurrentSheetId();
    const newCount = sheetInfo.colCount + count;
    this.workbookManager.updateSheetInfo({ colCount: newCount }, id);
    this.drawingsManager.addCol(colIndex, count, isRight);
    this.worksheetManager.addCol(colIndex, count, isRight);
  }
  deleteCol(colIndex: number, count: number): void {
    if (count <= 0) {
      return;
    }
    const sheetInfo = this.getSheetInfo();
    if (!sheetInfo) {
      return;
    }
    const id = this.getCurrentSheetId();
    const newCount = sheetInfo.colCount - count;
    this.workbookManager.updateSheetInfo({ colCount: newCount }, id);
    this.drawingsManager.deleteCol(colIndex, count);
    this.worksheetManager.deleteCol(colIndex, count);
  }

  hideCol(colIndex: number, count: number): void {
    this.colManager.hideCol(colIndex, count);
  }
  getCol(col: number, sheetId?: string): CustomItem {
    return this.colManager.getCol(col, sheetId);
  }
  setColWidth(col: number, width: number, sheetId?: string): void {
    this.colManager.setColWidth(col, width, sheetId);
  }

  addRow(rowIndex: number, count: number, isAbove = false): void {
    if (count <= 0) {
      return;
    }
    const sheetInfo = this.getSheetInfo();
    if (!sheetInfo) {
      return;
    }
    if (sheetInfo.rowCount >= XLSX_MAX_ROW_COUNT) {
      return;
    }

    const newCount = sheetInfo.rowCount + count;
    this.workbookManager.updateSheetInfo({ rowCount: newCount });
    this.drawingsManager.addRow(rowIndex, count, isAbove);
    this.worksheetManager.addRow(rowIndex, count, isAbove);
  }
  deleteRow(rowIndex: number, count: number): void {
    if (count <= 0) {
      return;
    }
    const sheetInfo = this.getSheetInfo();
    if (!sheetInfo) {
      return;
    }
    const newCount = sheetInfo.rowCount - count;
    this.workbookManager.updateSheetInfo({ rowCount: newCount });
    this.drawingsManager.deleteRow(rowIndex, count);
    this.worksheetManager.deleteRow(rowIndex, count);
  }

  hideRow(rowIndex: number, count: number): void {
    this.rowManager.hideRow(rowIndex, count);
  }
  unhideRow(rowIndex: number, count: number): void {
    this.rowManager.unhideRow(rowIndex, count);
  }
  unhideCol(colIndex: number, count: number): void {
    this.colManager.unhideCol(colIndex, count);
  }
  getRow(row: number, sheetId?: string): CustomItem {
    return this.rowManager.getRow(row, sheetId);
  }
  setRowHeight(row: number, height: number, sheetId?: string): void {
    this.rowManager.setRowHeight(row, height, sheetId);
  }
  canRedo(): boolean {
    return this.undoManager.canRedo();
  }
  canUndo(): boolean {
    return this.undoManager.canUndo();
  }
  undo(): void {
    this.undoManager.undo();
  }
  redo(): void {
    this.undoManager.redo();
  }

  pasteRange(fromRange: IRange, isCut: boolean): IRange {
    return this.worksheetManager.pasteRange(fromRange, isCut);
  }
  deleteAll(sheetId?: string): void {
    this.rowManager.deleteAll(sheetId);
    this.colManager.deleteAll(sheetId);
    this.worksheetManager.deleteAll(sheetId);
    this.mergeCellManager.deleteAll(sheetId);
    this.drawingsManager.deleteAll(sheetId);
    this.definedNameManager.deleteAll(sheetId);
    this.filterManager.deleteAll(sheetId);
  }
  getDefineNameList(): DefinedNameItem[] {
    return this.definedNameManager.getDefineNameList();
  }
  getDefineName(range: IRange): string {
    return this.definedNameManager.getDefineName(range);
  }
  setDefineName(range: IRange, name: string) {
    return this.definedNameManager.setDefineName(range, name);
  }
  checkDefineName(name: string): IRange | undefined {
    return this.definedNameManager.checkDefineName(name);
  }

  getDrawingList(sheetId?: string): DrawingElement[] {
    return this.drawingsManager.getDrawingList(sheetId);
  }
  addDrawing(...list: DrawingElement[]) {
    for (const item of list) {
      this.drawingsManager.addDrawing(item);
    }
  }
  updateDrawing(uuid: string, value: Partial<DrawingElement>) {
    this.drawingsManager.updateDrawing(uuid, value);
  }
  deleteDrawing(uuid: string) {
    this.drawingsManager.deleteDrawing(uuid);
  }
  getMergeCellList(sheetId?: string) {
    return this.mergeCellManager.getMergeCellList(sheetId);
  }
  addMergeCell(range: IRange, type = EMergeCellType.MERGE_CENTER) {
    if (range.colCount === 1 && range.rowCount === 1) {
      return;
    }
    range.sheetId = range.sheetId || this.getCurrentSheetId();
    this.mergeCellManager.addMergeCell(range);
    this.worksheetManager.addMergeCell(range, type);
  }
  deleteMergeCell(range: IRange): void {
    this.mergeCellManager.deleteMergeCell(range);
  }
  validateRange(range: IRange) {
    return this.rangeMapManager.validateRange(range);
  }
  validateDrawing(data: DrawingElement) {
    return this.drawingsManager.validateDrawing(data);
  }
  validateDefinedName(name: string) {
    return this.definedNameManager.validateDefinedName(name);
  }

  getFilter(sheetId?: string) {
    return this.filterManager.getFilter(sheetId);
  }
  addFilter(range: IRange): void {
    this.filterManager.addFilter(range);
  }
  deleteFilter(sheetId?: string): void {
    this.filterManager.deleteFilter(sheetId);
  }
  updateFilter(sheetId: string, value: Partial<AutoFilterItem>) {
    this.filterManager.updateFilter(sheetId, value);
  }

  getScroll(sheetId?: string) {
    return this.scrollManager.getScroll(sheetId);
  }
  setScroll(value: ModelScroll, sheetId?: string) {
    return this.scrollManager.setScroll(value, sheetId);
  }

  private getNextSheetId(sheetId?: string) {
    const id = sheetId || this.getCurrentSheetId();
    const list = this.getSheetList();
    const index = list.findIndex((item) => item.sheetId === id);
    if (index < 0) {
      return '';
    }
    const isLast = index === list.length - 1;
    let lastIndex = isLast
      ? (index - 1 + list.length) % list.length
      : (index + 1) % list.length;
    while (lastIndex !== index) {
      if (list[lastIndex].isHide) {
        lastIndex = isLast
          ? (lastIndex - 1 + list.length) % list.length
          : (lastIndex + 1) % list.length;
      } else {
        break;
      }
    }
    return list[lastIndex].sheetId;
  }
}
