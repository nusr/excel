import { isEmpty } from '@/lodash';
import {
  Coordinate,
  WorkBookJSON,
  CellInfo,
  StyleType,
  ChangeEventType,
  IController,
  IHooks,
  IModel,
  WorksheetType,
  IHistory,
  IWindowSize,
  CanvasOverlayPosition,
  ScrollValue,
} from '@/types';
import { parseReference, controllerLog, Range, assert } from '@/util';

const DEFAULT_ACTIVE_CELL = { row: 0, col: 0 };
const CELL_HEIGHT = 20;
const CELL_WIDTH = 68;
const ROW_TITLE_HEIGHT = 20;
const COL_TITLE_WIDTH = 34;

const defaultScrollValue: ScrollValue = {
  top: 0,
  left: 0,
  row: 0,
  col: 0,
  scrollLeft: 0,
  scrollTop: 0,
};

export class Controller implements IController {
  private scrollValue: Record<string, ScrollValue> = {};
  private model: IModel;
  private ranges: Array<Range> = [];
  private changeSet = new Set<ChangeEventType>();
  private hooks: IHooks = {
    modelChange() {},
  };
  private history: IHistory;
  private readonly rowMap: Map<number, number> = new Map([]);
  private readonly colMap: Map<number, number> = new Map([]);
  private viewSize = {
    width: 0,
    height: 0,
  };
  constructor(model: IModel, history: IHistory) {
    this.model = model;
    this.ranges = [
      new Range(
        DEFAULT_ACTIVE_CELL.row,
        DEFAULT_ACTIVE_CELL.col,
        1,
        1,
        this.getCurrentSheetId(),
      ),
    ];
    this.history = history;
  }
  getCurrentSheetId(): string {
    return this.model.getCurrentSheetId();
  }
  getSheetList(): WorkBookJSON['workbook'] {
    return this.model.getSheetList();
  }
  getCellsContent(sheetId?: string | undefined): Coordinate[] {
    return this.model.getCellsContent(sheetId);
  }
  getSheetInfo(sheetId?: string | undefined): WorksheetType {
    return this.model.getSheetInfo(sheetId);
  }
  getRanges(): Range[] {
    return this.ranges;
  }
  setHooks(hooks: IHooks): void {
    this.hooks = hooks;
  }
  private emitChange(recordHistory = true): void {
    controllerLog('emitChange', this.changeSet);
    if (recordHistory) {
      this.history.onChange(this.toJSON());
    }
    this.hooks.modelChange(this.changeSet);
    this.changeSet = new Set<ChangeEventType>();
  }
  getActiveCell(): Coordinate {
    const { activeCell } = this.getSheetInfo();
    if (!activeCell) {
      return { ...DEFAULT_ACTIVE_CELL };
    }
    const result = parseReference(activeCell);
    assert(!!result);
    const { row, col } = result;
    return { row, col };
  }
  setActiveCell(row = -1, col = -1, colCount = 1, rowCount = 1): void {
    this.changeSet.add('selectionChange');
    let position: Coordinate = { ...DEFAULT_ACTIVE_CELL };
    if (row === col && row === -1) {
      position = this.getActiveCell();
    } else {
      position = { row, col };
    }
    this.model.setActiveCell(position.row, position.col);
    this.ranges = [
      new Range(
        position.row,
        position.col,
        colCount,
        rowCount,
        this.getCurrentSheetId(),
      ),
    ];
    this.emitChange();
  }
  setCurrentSheetId(id: string): void {
    if (id === this.getCurrentSheetId()) {
      return;
    }
    this.model.setCurrentSheetId(id);
    this.setActiveCell();
    this.changeSet.add('contentChange');
    this.computeViewSize();
    this.emitChange();
  }
  addSheet(): void {
    this.model.addSheet();
    this.computeViewSize();
    this.model.setActiveCell(0, 0);
    this.setScroll({
      top: 0,
      left: 0,
      row: 0,
      col: 0,
      scrollLeft: 0,
      scrollTop: 0,
    });
  }
  selectAll(row: number, col: number): void {
    this.setActiveCell(row, col, 0, 0);
    controllerLog('selectAll');
  }
  selectCol(row: number, col: number): void {
    const sheetInfo = this.model.getSheetInfo();
    this.setActiveCell(row, col, sheetInfo.rowCount, 0);
    controllerLog('selectCol');
  }
  selectRow(row: number, col: number): void {
    const sheetInfo = this.model.getSheetInfo();
    this.setActiveCell(row, col, 0, sheetInfo.colCount);
    controllerLog('selectRow');
  }
  fromJSON(json: WorkBookJSON): void {
    controllerLog('loadJSON', json);
    this.model.fromJSON(json);
    this.model.setActiveCell(0, 0);
    this.changeSet.add('contentChange');
    this.emitChange(false);
  }
  toJSON(): WorkBookJSON {
    return this.model.toJSON();
  }
  updateSelection(row: number, col: number): void {
    const activeCell = this.getActiveCell();
    if (activeCell.row === row && activeCell.col === col) {
      return;
    }
    const colCount = Math.abs(col - activeCell.col) + 1;
    const rowCount = Math.abs(row - activeCell.row) + 1;
    const temp = new Range(
      Math.min(activeCell.row, row),
      Math.min(activeCell.col, col),
      rowCount,
      colCount,
      this.getCurrentSheetId(),
    );
    this.ranges = [temp];
    controllerLog('updateSelection', temp);
    this.changeSet.add('selectionChange');
    this.emitChange();
  }

  setCellValue(data: Coordinate, value: string): void {
    controllerLog('setCellValue', value);
    const temp = [
      new Range(data.row, data.col, 1, 1, this.getCurrentSheetId()),
    ];
    this.model.setCellValues(value, temp);
    this.changeSet.add('contentChange');
    this.emitChange();
  }
  setCellStyle(style: Partial<StyleType>, ranges = this.ranges): void {
    if (isEmpty(style)) {
      return;
    }
    this.model.setCellStyle(style, ranges);
    this.changeSet.add('contentChange');
    this.emitChange();
  }
  getCell = (data: Coordinate): CellInfo => {
    const { row, col } = data;
    const { model } = this;
    const { value, formula, style } = model.queryCell(row, col);
    return {
      value,
      row,
      col,
      formula,
      style,
    };
  };
  canRedo(): boolean {
    return this.history.canRedo();
  }
  canUndo(): boolean {
    return this.history.canUndo();
  }
  undo(): void {
    const result = this.history.undo(this.toJSON());
    if (result) {
      this.fromJSON(result);
    }
  }
  redo(): void {
    const result = this.history.redo(this.toJSON());
    if (result) {
      this.fromJSON(result);
    }
  }
  getColWidth(col: number): number {
    return this.colMap.get(col) || CELL_WIDTH;
  }
  setColWidth(col: number, width: number): void {
    this.colMap.set(col, width);
    this.computeViewSize();
    this.changeSet.add('contentChange');
  }
  getRowHeight(row: number): number {
    return this.rowMap.get(row) || CELL_HEIGHT;
  }
  setRowHeight(row: number, height: number) {
    this.rowMap.set(row, height);
    this.computeViewSize();
    this.changeSet.add('contentChange');
  }
  private computeViewSize() {
    const headerSize = this.getHeaderSize();
    const sheetInfo = this.model.getSheetInfo();
    let width = headerSize.width;
    let height = headerSize.height;
    for (let i = 0; i < sheetInfo.colCount; i++) {
      width += this.getColWidth(i);
    }
    for (let i = 0; i < sheetInfo.rowCount; i++) {
      height += this.getRowHeight(i);
    }
    this.viewSize = {
      width,
      height,
    };
  }
  getViewSize() {
    return {
      ...this.viewSize,
    };
  }
  getCellSize(row: number, col: number): IWindowSize {
    return { width: this.getColWidth(col), height: this.getRowHeight(row) };
  }
  getHeaderSize() {
    return {
      width: COL_TITLE_WIDTH,
      height: ROW_TITLE_HEIGHT,
    };
  }
  computeCellPosition(row: number, col: number): CanvasOverlayPosition {
    const size = this.getHeaderSize();
    const scroll = this.getScroll();
    let resultX = size.width;
    let resultY = size.height;
    let r = scroll.row;
    let c = scroll.col;
    while (c < col) {
      resultX += this.getColWidth(c);
      c++;
    }
    while (r < row) {
      resultY += this.getRowHeight(r);
      r++;
    }
    const cellSize = this.getCellSize(row, col);
    return { ...cellSize, top: resultY, left: resultX };
  }

  addRow(rowIndex: number, count: number): void {
    this.model.addRow(rowIndex, count);
    this.changeSet.add('contentChange');
    this.emitChange();
  }
  addCol(colIndex: number, count: number): void {
    this.model.addCol(colIndex, count);
    this.changeSet.add('contentChange');
    this.emitChange();
  }
  getChangeSet(): Set<ChangeEventType> {
    const result = this.changeSet;
    this.changeSet = new Set<ChangeEventType>();
    return result;
  }

  getScroll(): ScrollValue {
    const sheetId = this.model.getCurrentSheetId()
    const result = this.scrollValue[sheetId] || defaultScrollValue;
    return result;
  }
  setScroll(data: ScrollValue): void {
    const sheetId = this.model.getCurrentSheetId()
    this.scrollValue[sheetId] = {
      ...data
    }
    this.changeSet.add('contentChange');
    this.emitChange();
  }
}
