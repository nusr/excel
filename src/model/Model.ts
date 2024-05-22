import {
  StyleType,
  WorkBookJSON,
  WorksheetType,
  IModel,
  ResultType,
  IRange,
  CustomItem,
  DrawingElement,
  ChangeEventType,
  ICommandItem,
  DefinedNameItem,
  WorksheetData,
  EMergeCellType,
} from '@/types';
import {
  XLSX_MAX_ROW_COUNT,
  XLSX_MAX_COL_COUNT,
  modelToChangeSet,
  eventEmitter,
  sheetViewSizeSet,
  headerSizeSet,
  containRange,
} from '@/util';
import { History, HistoryChangeType } from './History';
import { Workbook } from './workbook';
import { RangeMap } from './rangeMap';
import { Drawing } from './drawing';
import { DefinedName } from './definedName';
import { Worksheet } from './worksheet';
import { MergeCell } from './mergeCell';
import { RowManager } from './row';
import { ColManager } from './col';

export class Model implements IModel {
  private history: History;
  private workbookManager: Workbook;
  private rangeMapManager: RangeMap;
  private drawingsManager: Drawing;
  private definedNameManager: DefinedName;
  private worksheetManager: Worksheet;
  private mergeCellManager: MergeCell;
  private rowManager: RowManager;
  private colManager: ColManager;
  constructor() {
    this.history = new History({
      undo: this.historyUndo,
      redo: this.historyRedo,
      change: this.historyChange,
      maxLength: 1000,
    });
    this.workbookManager = new Workbook(this);
    this.rangeMapManager = new RangeMap(this);
    this.drawingsManager = new Drawing(this);
    this.definedNameManager = new DefinedName(this);
    this.worksheetManager = new Worksheet(this);
    this.mergeCellManager = new MergeCell(this);
    this.rowManager = new RowManager(this);
    this.colManager = new ColManager(this);
  }
  push(command: ICommandItem): void {
    this.history.push(command);
  }
  emitChange(set: Set<ChangeEventType>) {
    const changeSet = modelToChangeSet(this.history.get());
    for (const key of set.keys()) {
      changeSet.add(key);
    }
    if (set.has('scroll')) {
      this.push({
        type: 'scroll',
        key: '',
        newValue: '',
        oldValue: '',
      });
    }
    if (set.has('antLine')) {
      this.push({
        type: 'antLine',
        key: '',
        newValue: '',
        oldValue: '',
      });
    }
    if (
      changeSet.has('cellValue') ||
      changeSet.has('definedNames') ||
      changeSet.has('currentSheetId')
    ) {
      changeSet.add('cellValue');
      const result = this.worksheetManager.computeFormulas();
      if (result && result instanceof Promise) {
        result.then(() => {
          this.commitHistory(changeSet);
        });
        return;
      }
    }
    this.commitHistory(changeSet);
  }

  private commitHistory(changeSet: Set<ChangeEventType>) {
    if (changeSet.has('noHistory')) {
      if (changeSet.has('row') || changeSet.has('col')) {
        this.computeViewSize();
      }
      eventEmitter.emit('modelChange', { changeSet });
    } else {
      if (!changeSet.has('undoRedo')) {
        this.history.commit();
      }
    }
    this.history.clear(false);
  }
  private historyChange = (list: ICommandItem[], type: HistoryChangeType) => {
    const changeSet = modelToChangeSet(list);
    if (type === 'undoRedo') {
      changeSet.add(type);
    }
    if (changeSet.has('row') || changeSet.has('col')) {
      this.computeViewSize();
    }
    eventEmitter.emit('modelChange', { changeSet });
  };

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
    this.worksheetManager.setWorksheet({}, result.sheetId);
    this.workbookManager.setCurrentSheetId(result.sheetId);
    this.computeViewSize();
    return result;
  }
  deleteSheet(sheetId?: string): void {
    const newSheetId = this.getNextSheetId(sheetId);
    if (!newSheetId) {
      return;
    }
    this.workbookManager.deleteSheet(sheetId);
    this.worksheetManager.setWorksheet({}, sheetId);
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
  fromJSON = (json: WorkBookJSON): void => {
    this.workbookManager.fromJSON(json);
    this.rangeMapManager.fromJSON(json);
    this.drawingsManager.fromJSON(json);
    this.definedNameManager.fromJSON(json);
    this.worksheetManager.fromJSON(json);
    this.mergeCellManager.fromJSON(json);
    this.rowManager.fromJSON(json);
    this.colManager.fromJSON(json);
    this.worksheetManager.computeFormulas();
  };
  toJSON = (): WorkBookJSON => {
    return {
      ...this.workbookManager.toJSON(),
      ...this.rangeMapManager.toJSON(),
      ...this.drawingsManager.toJSON(),
      ...this.definedNameManager.toJSON(),
      ...this.worksheetManager.toJSON(),
      ...this.mergeCellManager.toJSON(),
      ...this.rowManager.toJSON(),
      ...this.colManager.toJSON(),
    };
  };

  setCell(
    value: ResultType[][],
    style: Array<Array<Partial<StyleType>>>,
    range: IRange,
  ): void {
    this.worksheetManager.setCell(value, style, range);
  }
  setCellValue(value: ResultType, range: IRange) {
    this.worksheetManager.setCellValue(value, range);
  }

  updateCellStyle(style: Partial<StyleType>, range: IRange): void {
    return this.worksheetManager.updateCellStyle(style, range);
  }
  getCell = (range: IRange) => {
    return this.worksheetManager.getCell(range);
  };
  getWorksheet(sheetId?: string): WorksheetData | undefined {
    return this.worksheetManager.getWorksheet(sheetId);
  }
  setWorksheet(data: WorksheetData, sheetId?: string): void {
    this.worksheetManager.setWorksheet(data, sheetId);
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
  getColWidth(col: number, sheetId?: string): CustomItem {
    return this.colManager.getColWidth(col, sheetId);
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
  getRowHeight(row: number, sheetId?: string): CustomItem {
    return this.rowManager.getRowHeight(row, sheetId);
  }
  setRowHeight(row: number, height: number, sheetId?: string): void {
    this.rowManager.setRowHeight(row, height, sheetId);
  }
  canRedo(): boolean {
    return this.history.canRedo();
  }
  canUndo(): boolean {
    return this.history.canUndo();
  }
  undo(): void {
    this.history.undo();
  }
  redo(): void {
    this.history.redo();
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
  addDrawing(data: DrawingElement) {
    this.drawingsManager.addDrawing(data);
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
  addMergeCell(range: IRange, type = EMergeCellType.MERGE_CENTER): void {
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

  private historyRedo = (item: ICommandItem) => {
    this.workbookManager.redo(item);
    this.rangeMapManager.redo(item);
    this.drawingsManager.redo(item);
    this.definedNameManager.redo(item);
    this.worksheetManager.redo(item);
    this.mergeCellManager.redo(item);
    this.rowManager.redo(item);
    this.colManager.redo(item);
  };
  private historyUndo = (item: ICommandItem) => {
    this.workbookManager.undo(item);
    this.rangeMapManager.undo(item);
    this.drawingsManager.undo(item);
    this.definedNameManager.undo(item);
    this.worksheetManager.undo(item);
    this.mergeCellManager.undo(item);
    this.rowManager.undo(item);
    this.colManager.undo(item);
  };
  private computeViewSize() {
    const headerSize = headerSizeSet.get();
    const sheetInfo = this.getSheetInfo();
    if (!sheetInfo) {
      return;
    }
    let { width, height } = headerSize;
    for (let i = 0; i < sheetInfo.colCount; i++) {
      width += this.getColWidth(i).len;
    }
    for (let i = 0; i < sheetInfo.rowCount; i++) {
      height += this.getRowHeight(i).len;
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
