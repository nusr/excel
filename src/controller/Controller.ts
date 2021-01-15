import { isEqual } from "lodash-es";
import { Model } from "@/model";
import { Scroll } from "./Scroll";
import {
  Action,
  CellPosition,
  WorkBookJSON,
  EventType,
  CellInfo,
  ChangeEventType,
} from "@/types";
import {
  IWindowSize,
  assert,
  EventEmitter,
  singletonPattern,
  getWidthHeight,
  CELL_WIDTH,
  CELL_HEIGHT,
} from "@/util";
export class Controller extends EventEmitter<EventType> {
  scroll: Scroll = new Scroll(this);
  model: Model = new Model(this);
  protected activeCell: CellInfo | null = null;
  private changeSet = new Set<ChangeEventType>();
  constructor() {
    super();
    this.addSheet();
  }
  emitChange(): void {
    const data = Array.from(this.changeSet.values());
    this.emit("change", { changeSet: data });
    this.changeSet.clear();
  }
  queryActiveCell(): CellInfo {
    assert(!!this.activeCell);
    return this.activeCell;
  }
  setActiveCell(row = 0, col = 0): void {
    this.activeCell = this.queryCell(row, col);
    this.changeSet.add("selectionChange");
  }
  dispatchAction(data: Action): void {
    this.emit("dispatch", data);
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
    this.dispatchAction({ type: "QUIT_EDITING" });
  }
  loadJSON(json: WorkBookJSON): void {
    console.log("loadJSON", json);
    this.model.fromJSON(json);
    this.setActiveCell();
    this.changeSet.add("contentChange");
    this.emitChange();
  }
  enterEditing(): void {
    this.dispatchAction({ type: "ENTER_EDITING" });
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
    const { model } = this;
    const { rowCount, colCount } = model.getSheetInfo();
    if (row >= rowCount || col >= colCount) {
      return;
    }
    const size = this.getCanvasSize();
    const cell = this.queryCell(row, col);
    if (cell.top >= size.height || cell.left >= size.width) {
      return;
    }
    this.activeCell = cell;
    this.changeSet.add("contentChange");
    this.dispatchAction({
      type: "CHANGE_ACTIVE_CELL",
      payload: cell,
    });
    this.emitChange();
  }
  windowResize(): void {
    this.changeSet.add("contentChange");
    this.emitChange();
  }
  getCanvasSize(): IWindowSize {
    const { width, height } = getWidthHeight();
    const toolbarDom = document.querySelector("#tool-bar-container");
    const sheetBarDom = document.querySelector("#sheet-bar-container");
    assert(toolbarDom !== null);
    assert(sheetBarDom !== null);
    const toolbarSize = toolbarDom.getBoundingClientRect();
    const sheetBarSize = sheetBarDom.getBoundingClientRect();
    return {
      width,
      height: height - toolbarSize.height - sheetBarSize.height,
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
