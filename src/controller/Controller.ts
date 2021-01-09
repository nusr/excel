import { isEqual } from "lodash-es";
import { Draw } from "@/view";
import { Model } from "@/model";
import { Scroll } from "./Scroll";
import {
  Action,
  CellPosition,
  WorkBookJSON,
  IController,
  EventType,
} from "@/types";
import { IWindowSize, assert, EventEmitter, singletonPattern } from "@/util";
export class Controller extends EventEmitter<EventType> implements IController {
  protected draw: Draw;
  protected scroll: Scroll = new Scroll(this);
  protected model: Model = new Model(this);
  constructor(canvas?: HTMLCanvasElement) {
    super();
    assert(!!canvas);
    this.draw = new Draw(this, canvas);
    this.addSheet();
  }
  dispatchAction(data: Action): void {
    this.emit("dispatch", data);
  }
  setCurrentSheetId(id: string): void {
    if (isEqual(id, this.model.currentSheetId)) {
      return;
    }
    this.model.currentSheetId = id;
    this.render();
    this.setActiveCell(0, 0);
  }
  addSheet(): void {
    this.model.addSheet();
    this.render();
    this.setActiveCell(0, 0);
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
    this.render();
    this.setActiveCell(0, 0);
  }
  enterEditing(): void {
    this.dispatchAction({ type: "ENTER_EDITING" });
  }
  clickPositionToCell(offsetX: number, offsetY: number): CellPosition {
    return this.model.clickPositionToCell(offsetX, offsetY);
  }
  setActiveCell(row: number, col: number): void {
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
    this.draw.setActiveCell(cell);
    this.dispatchAction({
      type: "CHANGE_ACTIVE_CELL",
      payload: cell,
    });
  }
  windowResize(): void {
    console.log("windowResize");
    this.render();
  }
  getCanvasSize(): IWindowSize {
    return this.draw.getCanvasSize();
  }
  setCellValue(row: number, col: number, value: string): void {
    this.model.setCellValue(row, col, value);
    this.render();
  }
  protected render(): void {
    const { draw, scroll, model } = this;
    draw.render(scroll, model);
  }
  protected clear(): void {
    this.draw.clear();
  }
  reset(): void {
    this.clear();
  }
}

const getSingletonController = singletonPattern<
  Controller,
  [canvas?: HTMLCanvasElement]
>(Controller);

export { getSingletonController };
