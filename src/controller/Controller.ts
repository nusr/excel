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
import {
  parseReference,
  controllerLog,
  Range,
  DEFAULT_ACTIVE_CELL,
  assert,
  CELL_WIDTH,
  CELL_HEIGHT,
  COL_TITLE_WIDTH,
  ROW_TITLE_HEIGHT,
} from '@/util';

export class Controller implements IController {
  private scrollLeft = 0;
  private scrollTop = 0;
  private model: IModel;
  private ranges: Array<Range> = [];
  private changeSet = new Set<ChangeEventType>();
  private hooks: IHooks = {
    modelChange() {},
    getCanvasSize() {
      return {
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        contentWidth: 0,
        contentHeight: 0,
      };
    },
  };
  private history: IHistory;
  private readonly rowMap: Map<number, number> = new Map([]);
  private readonly colMap: Map<number, number> = new Map([]);
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
    this.emitChange();
  }
  addSheet(): void {
    this.model.addSheet();
    this.model.setActiveCell(0, 0);
    this.changeSet.add('contentChange');
    this.emitChange();
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
  windowResize(): void {
    this.changeSet.add('contentChange');
    this.emitChange(false);
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
    this.changeSet.add('contentChange');
  }
  getRowHeight(row: number): number {
    return this.rowMap.get(row) || CELL_HEIGHT;
  }
  setRowHeight(row: number, height: number) {
    this.rowMap.set(row, height);
    this.changeSet.add('contentChange');
  }
  getCellSize(row: number, col: number): IWindowSize {
    return { width: this.getColWidth(col), height: this.getRowHeight(row) };
  }
  computeCellPosition(row: number, col: number): CanvasOverlayPosition {
    let resultX = COL_TITLE_WIDTH;
    let resultY = ROW_TITLE_HEIGHT;
    let r = 0;
    let c = 0;
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

  getScrollRowAndCol(): Coordinate {
    const size = this.hooks.getCanvasSize();
    const sheetInfo = this.getSheetInfo();
    const rowRadio = this.scrollTop / size.contentHeight;
    const colRadio = this.scrollLeft / size.contentWidth;
    const row = Math.floor(rowRadio * sheetInfo.rowCount);
    const col = Math.floor(colRadio * sheetInfo.colCount);
    return {
      row: Math.min(row, sheetInfo.rowCount - 1),
      col: Math.min(col, sheetInfo.colCount - 1),
    };
  }
  getScroll(): ScrollValue {
    return {
      top: this.scrollTop,
      left: this.scrollLeft,
    };
  }
  setScroll(scrollLeft: number, scrollTop: number): void {
    if (scrollLeft === this.scrollLeft && scrollTop === this.scrollTop) {
      return;
    }
    this.scrollLeft = scrollLeft;
    this.scrollTop = scrollTop;
    this.changeSet.add('contentChange');
    this.emitChange();
  }
}
