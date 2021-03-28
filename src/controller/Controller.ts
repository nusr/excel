import { isEmpty } from "@/lodash";
import { Model } from "@/model";
import { Scroll } from "./Scroll";
import {
  Coordinate,
  WorkBookJSON,
  EventType,
  CellInfo,
  StyleType,
  ChangeEventType,
} from "@/types";
import {
  parseReference,
  controllerLog,
  EventEmitter,
  Range,
  DEFAULT_ACTIVE_CELL,
} from "@/util";
import { FormulaParser } from "@/parser";
import { History } from "./History";
import { Controller as RenderController } from "@/canvas";

export class Controller extends EventEmitter<EventType> {
  scroll: Scroll = new Scroll(this);
  model: Model = new Model(this);
  ranges: Array<Range> = [];
  isCellEditing = false;
  formulaParser: FormulaParser = new FormulaParser();
  private changeSet = new Set<ChangeEventType>();
  private renderController: RenderController | null = null;
  history = new History();
  constructor() {
    super();
    this.ranges = [
      new Range(
        DEFAULT_ACTIVE_CELL.row,
        DEFAULT_ACTIVE_CELL.col,
        1,
        1,
        this.model.currentSheetId
      ),
    ];
    this.addSheet();
  }
  static createController(): Controller {
    return new this();
  }
  getRenderController(): RenderController | null {
    return this.renderController;
  }
  setRenderController(renderController: RenderController): void {
    this.renderController = renderController;
  }
  emitChange(): void {
    this.emit("change", { changeSet: this.changeSet });
    this.changeSet = new Set<ChangeEventType>();
  }
  queryActiveCell(): Coordinate {
    const { activeCell } = this.model.getSheetInfo();
    if (!activeCell) {
      return { ...DEFAULT_ACTIVE_CELL };
    }
    const { row, col } = parseReference(activeCell, this.model.currentSheetId);
    return { row, col };
  }
  queryActiveCellInfo(): CellInfo {
    const { row, col } = this.queryActiveCell();
    return this.queryCell(row, col);
  }
  setActiveCell(row = -1, col = -1, colCount = 1, rowCount = 1): void {
    this.changeSet.add("selectionChange");
    let position: Coordinate = { ...DEFAULT_ACTIVE_CELL };
    if (row === col && row === -1) {
      position = this.queryActiveCell();
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
        this.model.currentSheetId
      ),
    ];
    this.emitChange();
  }
  setCurrentSheetId(id: string): void {
    if (id === this.model.currentSheetId) {
      return;
    }
    this.model.currentSheetId = id;
    this.setActiveCell();
    this.changeSet.add("contentChange");
    this.emitChange();
  }
  addSheet(): void {
    this.model.addSheet();
    this.setActiveCell(0, 0);
    this.changeSet.add("contentChange");
    this.emitChange();
  }
  selectAll(row: number, col: number): void {
    this.setActiveCell(row, col, 0, 0);
    controllerLog("selectAll");
  }
  selectCol(row: number, col: number): void {
    const sheetInfo = this.model.getSheetInfo();
    this.setActiveCell(row, col, sheetInfo.rowCount, 0);
    controllerLog("selectCol");
  }
  selectRow(row: number, col: number): void {
    const sheetInfo = this.model.getSheetInfo();
    this.setActiveCell(row, col, 0, sheetInfo.colCount);
    controllerLog("selectRow");
  }
  quitEditing(): void {
    this.isCellEditing = false;
  }
  enterEditing(): void {
    this.isCellEditing = true;
  }
  loadJSON(json: WorkBookJSON): void {
    const { model } = this;
    controllerLog("loadJSON", json);
    model.fromJSON(json);
    this.setActiveCell();
    this.changeSet.add("contentChange");
    this.emitChange();
  }
  toJSON(): WorkBookJSON {
    return this.model.toJSON();
  }
  updateSelection(row: number, col: number): void {
    const { model } = this;
    const activeCell = this.queryActiveCell();
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
      model.currentSheetId
    );
    this.ranges = [temp];
    controllerLog("updateSelection", temp);
    this.changeSet.add("selectionChange");
    this.emitChange();
  }
  windowResize(): void {
    this.changeSet.add("contentChange");
    this.emitChange();
  }

  setCellValue(value: string): void {
    this.model.setCellValue(value);
    this.changeSet.add("contentChange");
    this.emitChange();
  }
  setCellStyle(style: Partial<StyleType>, ranges = this.ranges): void {
    if (isEmpty(style)) {
      return;
    }
    this.model.setCellStyle(style, ranges);
    this.changeSet.add("contentChange");
    this.emitChange();
  }
  convertCell = (item: string): string | number => {
    const { row, col } = parseReference(item, this.model.currentSheetId);
    const data = this.model.queryCell(row, col);
    return data.value || "";
  };
  queryCell(row: number, col: number): CellInfo {
    const { model } = this;
    const { value, formula, style } = model.queryCell(row, col);
    let displayValue = value || "";
    if (formula) {
      const temp = this.formulaParser.init(formula, this.convertCell);
      displayValue = temp.result as number | string;
    }

    return {
      value,
      row,
      col,
      formula,
      style,
      displayValue,
    };
  }
  canRedo(): boolean {
    return this.history.canRedo();
  }
  canUndo(): boolean {
    return this.history.canUndo();
  }
  undo = async (): Promise<void> => {
    const result = await this.history.undo(this.model.toJSON());
    if (result) {
      this.model.fromJSON(result);
      this.emitChange();
    }
  };
  redo = async (): Promise<void> => {
    const result = await this.history.redo(this.model.toJSON());
    if (result) {
      this.model.fromJSON(result);
      this.emitChange();
    }
  };
}
