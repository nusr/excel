import { isEmpty } from "lodash-es";
import { Model } from "@/model";
import { Scroll } from "./Scroll";
import {
  CellPosition,
  WorkBookJSON,
  EventType,
  CellInfo,
  IWindowSize,
  StyleType,
  ChangeEventType,
} from "@/types";
import {
  parseReference,
  assert,
  EventEmitter,
  singletonPattern,
  CELL_WIDTH,
  CELL_HEIGHT,
  Range,
} from "@/util";
import { FormulaParser } from "@/parser";

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
  constructor() {
    super();
    console.log("init addSheet");
    this.addSheet();
  }
  emitChange(payload?: CellInfo): void {
    const changeSet = Array.from(this.changeSet.values());
    this.emit("change", { changeSet, payload });
    this.changeSet.clear();
  }
  queryActiveCell(): CellInfo {
    const [range] = this.ranges;
    const { row, col } = range;
    return this.queryCell(row, col);
  }
  setActiveCell(row = -1, col = -1): void {
    const { model } = this;
    const cell = this.queryCell(row, col);
    this.changeSet.add("selectionChange");
    let range = new Range(row, col, 1, 1, model.currentSheetId);
    const sheetItem = model.workbook.find(
      (v) => v.sheetId === model.currentSheetId
    );
    if (row === col && row === -1) {
      if (sheetItem && sheetItem.activeCell) {
        range = parseReference(sheetItem.activeCell, model.currentSheetId);
      } else {
        range = new Range(0, 0, 1, 1, model.currentSheetId);
      }
    }
    this.ranges = [range];
    console.log("setActiveCell", this.ranges);
    this.model.setActiveCell(range.row, range.col);
    this.emitChange(cell);
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
  selectAll(): void {
    console.log("selectAll");
  }
  selectCol(): void {
    console.log("selectCol");
  }
  selectRow(): void {
    console.log("selectRow");
  }
  quitEditing(): void {
    this.isCellEditing = false;
  }
  enterEditing(): void {
    this.isCellEditing = true;
  }
  loadJSON(json: WorkBookJSON): void {
    const { model } = this;
    console.log("loadJSON", json);
    model.fromJSON(json);
    this.setActiveCell();
    this.changeSet.add("contentChange");
    this.emitChange();
  }
  toJSON(): WorkBookJSON {
    return this.model.toJSON();
  }
  clickPositionToCell(x: number, y: number): CellPosition {
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
    const { ranges, model } = this;
    const [range] = ranges;
    if (range.row === row && range.col === col) {
      return;
    }
    const rowCount =
      range.row <= row ? row - range.row + 1 : range.row - row + range.rowCount;
    const colCount =
      range.col <= col ? col - range.col + 1 : range.col - col + range.colCount;
    const temp = new Range(
      Math.min(range.row, row),
      Math.min(range.col, col),
      Math.max(rowCount, 1),
      Math.max(colCount, 1),
      model.currentSheetId
    );
    this.ranges = [temp];
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
  setCellValue(value: string, ranges = this.ranges): void {
    this.model.setCellValue(ranges, value);
    this.changeSet.add("contentChange");
    this.emitChange();
  }
  setCellStyle(style: Partial<StyleType>, ranges = this.ranges): void {
    if (isEmpty(style)) {
      return;
    }
    this.model.setCellStyle(ranges, style);
    this.changeSet.add("contentChange");
    this.emitChange();
  }
  convertCell = (item: string): string | number => {
    const { row, col } = parseReference(item, this.model.currentSheetId);
    const data = this.queryCell(row, col);
    return data.value;
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
    };
  }
}

const getSingletonController = singletonPattern<Controller, []>(Controller);

export { getSingletonController };
