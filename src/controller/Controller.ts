import { isEqual } from "lodash-es";
import { Main } from "@/canvas";
import { Model } from "@/model";
import { Scroll } from "./Scroll";
import {
  Action,
  CellPosition,
  WorkBookJSON,
  EventType,
  CellInfo,
} from "@/types";
import {
  IWindowSize,
  assert,
  EventEmitter,
  singletonPattern,
  getWidthHeight,
} from "@/util";
export class Controller extends EventEmitter<EventType> {
  scroll: Scroll = new Scroll(this);
  model: Model = new Model(this);
  protected draw: Main;
  protected activeCell: CellInfo | null = null;
  protected canvasSize: IWindowSize | null = null;
  constructor(canvas?: HTMLCanvasElement) {
    super();
    this.updateCanvasSize();
    assert(!!canvas);
    this.draw = new Main(this, canvas);
    this.addSheet();
  }
  queryActiveCell(): CellInfo {
    assert(!!this.activeCell);
    return this.activeCell;
  }
  setActiveCell(row = 0, col = 0): void {
    this.activeCell = this.model.queryCell(row, col);
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
    this.render();
  }
  addSheet(): void {
    this.model.addSheet();
    this.setActiveCell();
    this.render();
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
    this.render();
  }
  enterEditing(): void {
    this.dispatchAction({ type: "ENTER_EDITING" });
  }
  clickPositionToCell(offsetX: number, offsetY: number): CellPosition {
    return this.model.clickPositionToCell(offsetX, offsetY);
  }
  updateSelection(row: number, col: number): void {
    const { model } = this;
    const { rowCount, colCount } = model.getSheetInfo();
    if (row >= rowCount || col >= colCount) {
      return;
    }
    const size = this.getCanvasSize();
    const cell = model.queryCell(row, col);
    if (cell.top >= size.height || cell.left >= size.width) {
      return;
    }
    this.activeCell = cell;
    this.updateSelectionRender();
    this.dispatchAction({
      type: "CHANGE_ACTIVE_CELL",
      payload: cell,
    });
  }
  windowResize(): void {
    console.log("windowResize");
    this.render();
  }
  updateCanvasSize(): void {
    const { width, height } = getWidthHeight();
    const toolbarDom = document.querySelector("#tool-bar-container");
    const sheetBarDom = document.querySelector("#sheet-bar-container");
    assert(toolbarDom !== null);
    assert(sheetBarDom !== null);
    const toolbarSize = toolbarDom.getBoundingClientRect();
    const sheetBarSize = sheetBarDom.getBoundingClientRect();
    this.canvasSize = {
      width,
      height: height - toolbarSize.height - sheetBarSize.height,
    };
  }
  getCanvasSize(): IWindowSize {
    assert(!!this.canvasSize);
    return this.canvasSize;
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
    this.render();
  }
  protected updateSelectionRender(): void {
    this.draw.updateSelection();
  }
  protected render(): void {
    this.draw.render();
  }
}

const getSingletonController = singletonPattern<
  Controller,
  [canvas?: HTMLCanvasElement]
>(Controller);

export { getSingletonController };
