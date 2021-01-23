import { isEqual } from "lodash-es";
import { Model } from "@/model";
import { Scroll } from "./Scroll";
import {
  CellPosition,
  WorkBookJSON,
  EventType,
  CellInfo,
  IWindowSize,
  ChangeEventType,
} from "@/types";
import {
  assert,
  EventEmitter,
  singletonPattern,
  getWidthHeight,
  CELL_WIDTH,
  CELL_HEIGHT,
  Range,
} from "@/util";
export class Controller extends EventEmitter<EventType> {
  scroll: Scroll = new Scroll(this);
  model: Model = new Model(this);
  ranges: Array<Range> = [];
  isCellEditing = false;
  private changeSet = new Set<ChangeEventType>();
  constructor() {
    super();
    this.addSheet();
  }
  emitChange(payload?: CellInfo): void {
    const changeSet = Array.from(this.changeSet.values());
    this.emit("change", { changeSet, payload });
    this.changeSet.clear();
  }
  setActiveCell(row = 0, col = 0): void {
    const cell = this.queryCell(row, col);
    this.changeSet.add("selectionChange");
    this.ranges = [new Range(row, col, 0, 0, this.model.currentSheetId)];
    this.emitChange(cell);
  }
  setCurrentSheetId(id: string): void {
    if (isEqual(id, this.model.currentSheetId)) {
      return;
    }
    this.model.currentSheetId = id;
    this.setActiveCell();
    this.changeSet.add("contentChange");
    this.emitChange();
  }
  addSheet(): void {
    this.model.addSheet();
    this.setActiveCell();
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
    console.log("loadJSON", json);
    this.model.fromJSON(json);
    this.setActiveCell();
    this.changeSet.add("contentChange");
    this.emitChange();
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
    const rowCount = row - range.row;
    const colCount = col - range.col;
    if (rowCount === colCount && rowCount === 0) {
      return;
    }
    this.ranges = [
      new Range(range.row, range.col, rowCount, colCount, model.currentSheetId),
    ];
    console.log(this.ranges);
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
  setCellValue(row: number, col: number, value: string): void {
    this.model.setCellValue(row, col, value);
    this.changeSet.add("contentChange");
    this.emitChange();
  }
  queryCell(row: number, col: number): CellInfo {
    const { model } = this;
    const { width, height, value } = model.queryCell(row, col);
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
    };
  }
}

const getSingletonController = singletonPattern<Controller, []>(Controller);

export { getSingletonController };
