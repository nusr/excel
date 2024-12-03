import {
  StyleType,
  ModelJSON,
  WorksheetType,
  IModel,
  ResultType,
  IRange,
  CustomItem,
  DrawingElement,
  ChangeEventType,
  DefinedNameItem,
  WorksheetData,
  EMergeCellType,
  IHooks,
  AutoFilterItem,
  ModelRoot,
  ModelScroll,
  SYNC_FLAG,
} from '@excel/shared';
import {
  XLSX_MAX_ROW_COUNT,
  XLSX_MAX_COL_COUNT,
  eventEmitter,
  sheetViewSizeSet,
  headerSizeSet,
  containRange,
  modelLog,
  KEY_LIST,
} from '@excel/shared';
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

export function modelToChangeSet(list: Y.YEvent<any>[]) {
  const result = new Set<ChangeEventType>();
  const set = new Set<keyof ModelJSON>(KEY_LIST);
  for (const item of list) {
    if (!item) {
      continue;
    }
    const keySet = new Set(item?.changes?.keys?.keys?.() || []);
    const pathSet = new Set(item.path || []);
    for (const key of keySet.keys()) {
      if (set.has(key as any)) {
        result.add(key as any);
      }
    }
    for (const key of pathSet.keys()) {
      if (set.has(key as any)) {
        result.add(key as any);
      }
    }
    if (pathSet.has('worksheets') || keySet.has('worksheets')) {
      if (keySet.has('formula') || keySet.has('value')) {
        result.add('cellValue');
      } else {
        result.add('cellStyle');
      }
    } else {
      result.add('cellStyle');
    }
  }
  return result;
}

export class Model implements IModel {
  private workbookManager: Workbook;
  private rangeMapManager: RangeMap;
  private drawingsManager: Drawing;
  private definedNameManager: DefinedName;
  private worksheetManager: Worksheet;
  private mergeCellManager: MergeCell;
  private rowManager: RowManager;
  private colManager: ColManager;
  private filterManager: FilterManger;
  private scrollManager: ScrollManager;
  private doc: Y.Doc;
  private undoManager: Y.UndoManager;
  private changeSet = new Set<ChangeEventType>();
  constructor(hooks: Pick<IHooks, 'doc' | 'worker'>) {
    const { doc, worker } = hooks;
    this.doc = doc;
    const root = this.getRoot();
    root.observeDeep((event) => {
      const changeSet = modelToChangeSet(event);
      for (const item of this.changeSet.keys()) {
        changeSet.add(item);
      }
      modelLog('observeDeep', event, changeSet);
      this.render(changeSet);
      this.changeSet = new Set<ChangeEventType>();
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
  render(changeSet: Set<ChangeEventType>) {
    if (changeSet.size === 0) {
      return;
    }
    modelLog(changeSet);
    eventEmitter.emit('modelChange', { changeSet });
  }
  async emitChange(changeSet: Set<ChangeEventType>) {
    const localChangeList: ChangeEventType[] = ['antLine', 'undo', 'redo'];
    if (changeSet.has('customHeight') || changeSet.has('customWidth')) {
      this.computeViewSize();
    }

    for (const item of localChangeList) {
      if (changeSet.has(item)) {
        this.changeSet.add(item);
        changeSet.delete(item);
      }
    }

    if (
      changeSet.has('cellValue') ||
      changeSet.has('definedNames') ||
      changeSet.has('currentSheetId')
    ) {
      const result = await this.worksheetManager.computeFormulas();
      if (result) {
        this.changeSet.add('cellValue');
      }
    }
    if (changeSet.size === 0 && this.changeSet.size > 0) {
      this.render(this.changeSet);
      this.changeSet = new Set<ChangeEventType>();
    }
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
    // this.undoManager.clear(true, true);
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
    return result;
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
    const sheetInfo = this.getSheetInfo()!;
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
    const sheetInfo = this.getSheetInfo()!;
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
    const sheetInfo = this.getSheetInfo()!;
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
    const sheetInfo = this.getSheetInfo()!;
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

  private computeViewSize() {
    const headerSize = headerSizeSet.get();
    const sheetInfo = this.getSheetInfo();
    if (!sheetInfo) {
      return;
    }
    let { width, height } = headerSize;
    for (let i = 0; i < sheetInfo.colCount; i++) {
      const t = this.getCol(i);
      width += t.isHide ? 0 : t.len;
    }
    for (let i = 0; i < sheetInfo.rowCount; i++) {
      const t = this.getRow(i);
      height += t.isHide ? 0 : t.len;
    }
    sheetViewSizeSet.set({ width, height });
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
