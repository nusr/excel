import isEmpty from "lodash/isEmpty";
import { Model } from "@/model";
import { Scroll } from "./Scroll";
import {
  Coordinate,
  WorkBookJSON,
  EventType,
  CellInfo,
  IWindowSize,
  StyleType,
  ChangeEventType,
} from "@/types";
import {
  parseReference,
  controllerLog,
  assert,
  EventEmitter,
  singletonPattern,
  CELL_WIDTH,
  CELL_HEIGHT,
  Range,
  DEFAULT_ACTIVE_CELL,
} from "@/util";
import { FormulaParser } from "@/parser";
import { History } from "./History";

function getWidthHeight(): IWindowSize {
  return {
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
  };
}
export class Controller extends EventEmitter<EventType> {
  scroll: Scroll = new Scroll(this);
  model: Model = new Model(this);
  ranges: Array<Range> = [];
  isCellEditing = false;
  formulaParser: FormulaParser = new FormulaParser();
  private changeSet = new Set<ChangeEventType>();
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
  emitChange(): void {
    const changeSet = Array.from(this.changeSet.values());
    this.emit("change", { changeSet });
    this.changeSet.clear();
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
    // controllerLog("setActiveCell", this.ranges[0]);
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
    const sheetInfo = this.model.getSheetInfo();
    this.setActiveCell(row, col, sheetInfo.rowCount, sheetInfo.colCount);
    controllerLog("selectAll");
  }
  selectCol(row: number, col: number): void {
    const sheetInfo = this.model.getSheetInfo();
    this.setActiveCell(row, col, sheetInfo.rowCount);
    controllerLog("selectCol");
  }
  selectRow(row: number, col: number): void {
    const sheetInfo = this.model.getSheetInfo();
    this.setActiveCell(row, col, 1, sheetInfo.colCount);
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
  clickPositionToCell(x: number, y: number): Coordinate {
    const config = this.model.getRowTitleHeightAndColTitleWidth();
    let resultX = config.width;
    let resultY = config.height;
    let row = 0;
    let col = 0;
    while (resultX + CELL_WIDTH <= x) {
      resultX += CELL_WIDTH;
      col++;
    }
    while (resultY + CELL_HEIGHT <= y) {
      resultY += CELL_HEIGHT;
      row++;
    }
    return { row, col };
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
  getCanvasSize(): IWindowSize {
    const { width, height } = getWidthHeight();
    const toolbarDom = document.getElementById("tool-bar-container");
    const sheetBarDom = document.getElementById("sheet-bar-container");
    const formulaBarDom = document.getElementById("formula-bar-container");
    assert(toolbarDom !== null);
    assert(sheetBarDom !== null);
    assert(formulaBarDom !== null);
    const toolbarSize = toolbarDom.getBoundingClientRect();
    const sheetBarSize = sheetBarDom.getBoundingClientRect();
    const formulaBarSize = formulaBarDom.getBoundingClientRect();
    return {
      width,
      height:
        height -
        toolbarSize.height -
        sheetBarSize.height -
        formulaBarSize.height,
    };
  }
  getDrawSize(config: IWindowSize): IWindowSize {
    const size = this.getCanvasSize();
    const width = size.width - config.width;
    const height = size.height - config.height;
    return {
      width,
      height,
    };
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
    const { width, height, value, formula, style } = model.queryCell(row, col);
    const config = model.getRowTitleHeightAndColTitleWidth();
    let resultX = config.width;
    let resultY = config.height;
    let r = 0;
    let c = 0;
    while (c < col) {
      resultX += CELL_WIDTH;
      c++;
    }
    while (r < row) {
      resultY += CELL_HEIGHT;
      r++;
    }
    let displayValue = value || "";
    if (formula) {
      const temp = this.formulaParser.init(formula, this.convertCell);
      displayValue = temp.result;
    }

    return {
      width: width || CELL_WIDTH,
      height: height || CELL_HEIGHT,
      value,
      top: resultY,
      left: resultX,
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

export const getSingletonController = singletonPattern<Controller, []>(
  Controller
);

export const controller = getSingletonController();
