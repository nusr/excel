import {
  StyleType,
  WorkBookJSON,
  WorksheetType,
  IModel,
  ResultType,
  IRange,
  ModelCellValue,
  CustomItem,
  FloatElement,
  ChangeEventType,
  ICommandItem,
  DefinedNameItem,
  WorksheetData,
} from '@/types';
import {
  assert,
  XLSX_MAX_ROW_COUNT,
  XLSX_MAX_COL_COUNT,
  modelLog,
  modelToChangeSet,
  eventEmitter,
  sheetViewSizeSet,
  headerSizeSet,
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
    if (
      changeSet.has('cellValue') ||
      changeSet.has('definedNames') ||
      changeSet.has('currentSheetId')
    ) {
      this.worksheetManager.computeFormulas();
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
    if (!set.has('undoRedo')) {
      this.history.commit();
    } else {
      this.history.clear(false);
    }
  }

  getSheetList(): WorksheetType[] {
    return this.workbookManager.getSheetList();
  }
  getActiveCell(): IRange {
    return this.rangeMapManager.getActiveCell();
  }
  setActiveCell(range: IRange): void {
    this.rangeMapManager.setActiveCell(range);
  }
  addSheet() {
    const result = this.workbookManager.addSheet();
    this.worksheetManager.setWorksheet({}, result.sheetId);
    this.workbookManager.setCurrentSheetId(result.sheetId);
    return result;
  }
  deleteSheet(sheetId?: string): void {
    const newSheetId = this.getNextSheetId(sheetId);
    this.workbookManager.deleteSheet(sheetId);
    this.worksheetManager.setWorksheet({}, sheetId);
    this.workbookManager.setCurrentSheetId(newSheetId);
  }
  updateSheetInfo(data: Partial<WorksheetType>, sheetId?: string): void {
    this.workbookManager.updateSheetInfo(data, sheetId);
  }
  hideSheet(sheetId?: string): void {
    const newSheetId = this.getNextSheetId(sheetId);
    this.workbookManager.hideSheet(sheetId);
    this.workbookManager.setCurrentSheetId(newSheetId);
  }
  unhideSheet(sheetId?: string): void {
    this.workbookManager.unhideSheet(sheetId);
    this.workbookManager.setCurrentSheetId(
      sheetId || this.workbookManager.getCurrentSheetId(),
    );
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
    this.history.clear(true);
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

  setCellValues(
    value: ResultType[][],
    style: Array<Array<Partial<StyleType>>>,
    ranges: IRange[],
  ): void {
    this.worksheetManager.setCellValues(value, style, ranges);
  }

  updateCellStyle(style: Partial<StyleType>, ranges: IRange[]): void {
    return this.worksheetManager.updateCellStyle(style, ranges);
  }
  getCell = (range: IRange): ModelCellValue | null => {
    return this.worksheetManager.getCell(range);
  };
  getWorksheet(sheetId?: string | undefined): WorksheetData | undefined {
    return this.worksheetManager.getWorksheet(sheetId);
  }
  setWorksheet(data: WorksheetData, sheetId?: string): void {
    this.worksheetManager.setWorksheet(data, sheetId);
  }
  addCol(colIndex: number, count: number): void {
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
    this.colManager.addCol(colIndex, count);
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

    this.colManager.deleteCol(colIndex, count);
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

  addRow(rowIndex: number, count: number): void {
    if (count <= 0) {
      return;
    }
    const sheetInfo = this.getSheetInfo()!;
    if (sheetInfo.rowCount >= XLSX_MAX_ROW_COUNT) {
      return;
    }

    const newCount = sheetInfo.rowCount + count;
    this.workbookManager.updateSheetInfo({ rowCount: newCount });
    this.rowManager.addRow(rowIndex, count);
  }
  deleteRow(rowIndex: number, count: number): void {
    if (count <= 0) {
      return;
    }
    const sheetInfo = this.getSheetInfo()!;
    const newCount = sheetInfo.rowCount - count;
    this.drawingsManager.deleteRow(rowIndex, count);
    this.workbookManager.updateSheetInfo({ rowCount: newCount });
    this.rowManager.deleteRow(rowIndex, count);
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
  setDefineName(range: IRange, name: string): void {
    this.definedNameManager.setDefineName(range, name);
  }
  checkDefineName(name: string): IRange | undefined {
    return this.definedNameManager.checkDefineName(name);
  }

  iterateRange(range: IRange, fn: (row: number, col: number) => boolean) {
    const { row, col, rowCount, colCount, sheetId } = range;
    const sheetInfo = this.getSheetInfo(sheetId);
    if (!sheetInfo) {
      return;
    }
    if (colCount === 0 && rowCount > 0) {
      for (let r = row, endRow = row + sheetInfo.rowCount; r < endRow; r++) {
        if (fn(r, col)) {
          break;
        }
      }
    } else if (rowCount === 0 && colCount > 0) {
      for (let c = col, endCol = col + sheetInfo.colCount; c < endCol; c++) {
        if (fn(row, c)) {
          break;
        }
      }
    } else {
      for (
        let r = row, endRow = row + (rowCount || sheetInfo.rowCount);
        r < endRow;
        r++
      ) {
        for (
          let c = col, endCol = col + (colCount || sheetInfo.colCount);
          c < endCol;
          c++
        ) {
          if (fn(r, c)) {
            return;
          }
        }
      }
    }
  }

  getFloatElementList(sheetId?: string): FloatElement[] {
    return this.drawingsManager.getFloatElementList(sheetId);
  }
  addFloatElement(data: FloatElement) {
    this.drawingsManager.addFloatElement(data);
  }
  updateFloatElement(uuid: string, value: Partial<FloatElement>) {
    this.drawingsManager.updateFloatElement(uuid, value);
  }
  deleteFloatElement(uuid: string) {
    this.drawingsManager.deleteFloatElement(uuid);
  }
  getMergeCells(sheetId?: string): IRange[] {
    return this.mergeCellManager.getMergeCells(sheetId);
  }
  addMergeCell(range: IRange): void {
    this.mergeCellManager.addMergeCell(range);
  }
  deleteMergeCell(range: IRange): void {
    this.mergeCellManager.deleteMergeCell(range);
  }
  private historyChange = (list: ICommandItem[], type: HistoryChangeType) => {
    const changeSet = modelToChangeSet(list);
    if (type === 'undoRedo') {
      changeSet.add(type);
    }
    if (changeSet.has('row') || changeSet.has('col')) {
      this.computeViewSize();
    }
    modelLog(changeSet);
    eventEmitter.emit('modelChange', { changeSet });
  };
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
    let { width } = headerSize;
    let { height } = headerSize;
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
    assert(index >= 0);
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
