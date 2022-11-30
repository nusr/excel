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
  IScrollValue,
  WorksheetType,
  IHistory,
} from '@/types';
import {
  parseReference,
  controllerLog,
  Range,
  DEFAULT_ACTIVE_CELL,
  assert,
} from '@/util';

export class Controller implements IController {
  private model: IModel;
  private ranges: Array<Range> = [];
  private changeSet = new Set<ChangeEventType>();
  private hooks: IHooks = {
    modelChange() {},
  };
  private scroll: IScrollValue;
  private history: IHistory;
  constructor(model: IModel, scroll: IScrollValue, history: IHistory) {
    this.model = model;
    this.scroll = scroll;
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
  getX(): number {
    return this.scroll.getX();
  }
  getY(): number {
    return this.scroll.getY();
  }
  getColIndex(): number {
    return this.scroll.getColIndex();
  }
  getRowIndex(): number {
    return this.scroll.getRowIndex();
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
}
