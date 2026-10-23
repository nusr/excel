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
  ModelScroll,
  SYNC_FLAG,
  ModelEventEmitterType,
} from '../types';
import { XLSX_MAX_ROW_COUNT, XLSX_MAX_COL_COUNT, EventEmitter, containRange } from '../util';
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
import { Doc, UndoManager, type Map as YMap } from 'yjs';
import { SharedRoot, type SharedType } from '../protocol';

export class Model extends EventEmitter<ModelEventEmitterType> implements IModel {
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
  private readonly doc: Doc;
  private readonly undoManager: UndoManager;
  private readonly root: SharedRoot;
  private readonly observedTypes = new Set<SharedType>();
  private readonly observeTypes = () => {
    for (const type of this.root.types) this.observeType(type);
  };
  private readonly observeType = (type: SharedType) => {
    if (this.observedTypes.has(type)) return;
    this.observedTypes.add(type);
    type.observeDeep(this.handleModelChange);
    if (type !== this.root.get('worksheets')) this.undoManager.addToScope(type);
  };
  private readonly handleModelChange: Parameters<YMap<unknown>['observeDeep']>[0] = (event) => {
    this.emit('modelChange', { event });
  };
  constructor(hooks: Pick<IHooks, 'doc' | 'worker'>) {
    super();
    const { doc, worker } = hooks;
    this.doc = doc;
    this.root = new SharedRoot(doc);
    const root = this.getRoot();
    this.undoManager = new UndoManager(
      root.types.filter((type) => type !== root.get('worksheets')),
      {
        trackedOrigins: new Set([SYNC_FLAG.MODEL, SYNC_FLAG.SKIP_UPDATE]),
        captureTimeout: 100,
      },
    );
    this.observeTypes();
    root.onType(this.observeType);
    doc.on('afterTransaction', this.observeTypes);

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
    return this.root;
  }
  destroy() {
    this.doc.off('afterTransaction', this.observeTypes);
    this.root.onType();
    this.observedTypes.forEach((type) => type.unobserveDeep(this.handleModelChange));
    this.undoManager.destroy();
    this.worksheetManager.destroy();
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
    const id = sheetId || this.getCurrentSheetId();
    const info = this.getSheetInfo(id);
    if (!info) return;
    if (!info.isHide && this.getSheetList().filter((sheet) => !sheet.isHide).length < 2) {
      this.workbookManager.deleteSheet(id);
      return;
    }
    const currentSheetId = this.getCurrentSheetId();
    const newSheetId = this.getNextSheetId(sheetId);
    if (!newSheetId) {
      return;
    }
    this.deleteAll(sheetId, true);
    this.workbookManager.deleteSheet(sheetId);
    this.workbookManager.setCurrentSheetId(id === currentSheetId ? newSheetId : currentSheetId);
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
  fromJSON = (json: ModelJSON): void =>
    this.doc.transact(() => {
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
    }, SYNC_FLAG.SKIP_UNDO_REDO);
  toJSON = (): ModelJSON => {
    return {
      ...this.getRoot().toJSON(),
      rangeMap: this.rangeMapManager.toJSON(),
      scroll: this.scrollManager.toJSON(),
    };
  };

  deleteCell(range: IRange) {
    this.worksheetManager.deleteCell(range);
  }

  setCell(value: ResultType[][], style: Array<Array<Partial<StyleType>>>, range: IRange) {
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
    if (
      !Number.isInteger(count) ||
      !Number.isInteger(colIndex) ||
      colIndex < 0 ||
      colIndex >= sheetInfo.colCount
    ) {
      throw new RangeError('Invalid column insertion');
    }
    count = Math.min(count, XLSX_MAX_COL_COUNT - sheetInfo.colCount);
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
    if (
      !Number.isInteger(count) ||
      !Number.isInteger(colIndex) ||
      colIndex < 0 ||
      colIndex >= sheetInfo.colCount
    ) {
      throw new RangeError('Invalid column deletion');
    }
    count = Math.min(count, sheetInfo.colCount - colIndex, sheetInfo.colCount - 1);
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
    if (
      !Number.isInteger(count) ||
      !Number.isInteger(rowIndex) ||
      rowIndex < 0 ||
      rowIndex >= sheetInfo.rowCount
    ) {
      throw new RangeError('Invalid row insertion');
    }
    count = Math.min(count, XLSX_MAX_ROW_COUNT - sheetInfo.rowCount);
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
    if (
      !Number.isInteger(count) ||
      !Number.isInteger(rowIndex) ||
      rowIndex < 0 ||
      rowIndex >= sheetInfo.rowCount
    ) {
      throw new RangeError('Invalid row deletion');
    }
    count = Math.min(count, sheetInfo.rowCount - rowIndex, sheetInfo.rowCount - 1);
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
    const result = this.rowManager.getRow(row, sheetId);
    return {
      ...result,
      isHide:
        result.isHide || this.filterManager.isRowFiltered(row, sheetId || this.getCurrentSheetId()),
    };
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
  deleteAll(sheetId?: string, preserveDefinedNames = false): void {
    this.rowManager.deleteAll(sheetId);
    this.colManager.deleteAll(sheetId);
    this.worksheetManager.deleteAll(sheetId);
    this.mergeCellManager.deleteAll(sheetId);
    this.drawingsManager.deleteAll(sheetId);
    if (!preserveDefinedNames) this.definedNameManager.deleteAll(sheetId);
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
    if (!this.validateRange(range) || range.rowCount === 0 || range.colCount === 0) return;
    if (range.colCount === 1 && range.rowCount === 1) {
      return;
    }
    range.sheetId = range.sheetId || this.getCurrentSheetId();
    if (this.mergeCellManager.addMergeCell(range)) {
      this.worksheetManager.addMergeCell(range, type);
    }
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
    let lastIndex = isLast ? (index - 1 + list.length) % list.length : (index + 1) % list.length;
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
