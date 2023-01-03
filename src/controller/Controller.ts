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
  IRange,
} from '@/types';
import { parseReference, controllerLog, Range, assert } from '@/util';

const DEFAULT_ACTIVE_CELL = { row: 0, col: 0 };
const CELL_HEIGHT = 20;
const CELL_WIDTH = 68;
const ROW_TITLE_HEIGHT = 20;
const COL_TITLE_WIDTH = 34;
const PLAIN_TEXT = 'text/plain';

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
  getCellsContent(sheetId: string): Coordinate[] {
    return this.model.getCellsContent(sheetId);
  }
  getSheetInfo(sheetId: string): WorksheetType {
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
    const { activeCell } = this.getSheetInfo(this.model.getCurrentSheetId());
    if (!activeCell) {
      return { ...DEFAULT_ACTIVE_CELL };
    }
    const result = parseReference(activeCell);
    assert(!!result);
    const { row, col } = result;
    return { row, col };
  }
  setActiveCell(
    row: number,
    col: number,
    rowCount: number,
    colCount: number,
  ): void {
    this.changeSet.add('selectionChange');
    this.model.setActiveCell(row, col, rowCount, colCount);
    this.ranges = [
      new Range(row, col, rowCount, colCount, this.getCurrentSheetId()),
    ];
    this.emitChange();
  }
  setCurrentSheetId(id: string): void {
    if (id === this.getCurrentSheetId()) {
      return;
    }
    this.model.setCurrentSheetId(id);
    const pos = this.getActiveCell();
    this.setActiveCell(pos.row, pos.col, 1, 1);
    this.changeSet.add('contentChange');
    this.computeViewSize();
    this.emitChange();
  }
  addSheet(): void {
    this.model.addSheet();
    this.computeViewSize();
    this.model.setActiveCell(0, 0, 1, 1);
    this.setScroll({
      top: 0,
      left: 0,
      row: 0,
      col: 0,
      scrollLeft: 0,
      scrollTop: 0,
    });
  }
  fromJSON(json: WorkBookJSON): void {
    controllerLog('loadJSON', json);
    this.model.fromJSON(json);
    this.model.setActiveCell(0, 0, 1, 1);
    this.computeViewSize();
    this.changeSet.add('contentChange');
    this.emitChange(false);
  }
  toJSON(): WorkBookJSON {
    return this.model.toJSON();
  }

  setCellValues(value: string[][], ranges: IRange[]): void {
    controllerLog('setCellValue', value);
    this.model.setCellValues(value, ranges);
    this.changeSet.add('contentChange');
    this.emitChange();
  }
  setCellStyle(style: Partial<StyleType>, ranges: IRange[]): void {
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
    const sheetInfo = this.model.getSheetInfo(this.model.getCurrentSheetId());
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
  deleteCol(colIndex: number, count: number): void {
    this.model.deleteCol(colIndex, count);
    this.changeSet.add('contentChange');
    this.emitChange();
  }
  deleteRow(rowIndex: number, count: number): void {
    this.model.deleteRow(rowIndex, count);
    this.changeSet.add('contentChange');
    this.emitChange();
  }
  getChangeSet(): Set<ChangeEventType> {
    const result = this.changeSet;
    this.changeSet = new Set<ChangeEventType>();
    return result;
  }

  getScroll(): ScrollValue {
    const sheetId = this.model.getCurrentSheetId();
    const result = this.scrollValue[sheetId] || defaultScrollValue;
    return result;
  }
  setScroll(data: ScrollValue): void {
    const sheetId = this.model.getCurrentSheetId();
    this.scrollValue[sheetId] = {
      ...data,
    };
    this.changeSet.add('contentChange');
    this.emitChange();
  }
  private parseText(text: string) {
    const list = text
      .split('\n')
      .map((item) => item)
      .map((item) => item.split('\t'));
    const rowCount = list.length;
    let colCount = 0;
    for (let item of list) {
      if (item.length > colCount) {
        colCount = item.length;
      }
    }
    console.log(list);
    const activeCell = this.getActiveCell();
    this.model.setCellValues(list, this.ranges);
    this.changeSet.add('contentChange');
    this.setActiveCell(activeCell.row, activeCell.col, rowCount, colCount);
  }
  // private parseHTML(html: string) {}
  paste(event?: ClipboardEvent): void {
    if (!event) {
      return;
    }
    const text = event.clipboardData?.getData(PLAIN_TEXT) || '';
    // const html = event.clipboardData?.getData('text/html') || '';
    // if (html) {
    //   this.parseHTML(html);
    // }
    this.parseText(text);
  }
  copy(): void {

  }
}
