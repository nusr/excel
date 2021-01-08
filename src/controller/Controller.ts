import { isEqual } from "lodash-es";
import { Draw } from "./Draw";
import { Model } from "./Model";
import { Scroll } from "./Scroll";
import { Action, CellPosition, WorkBookJSON, IController } from "@/types";
import { IWindowSize, eventEmitter, DISPATCH_ACTION, assert } from "@/util";

export class Controller implements IController {
  private draw: Draw;
  private scroll: Scroll = new Scroll(this);
  private model: Model = new Model(this);
  constructor(canvas?: HTMLCanvasElement) {
    assert(!!canvas);
    this.draw = new Draw(this, canvas);
    this.addSheet();
  }
  dispatchAction(data: Action): void {
    eventEmitter.emit(DISPATCH_ACTION, data);
  }
  setCurrentSheetId(id: string): void {
    if (isEqual(id, this.model.currentSheetId)) {
      return;
    }
    this.model.currentSheetId = id;
    this.render();
    this.changeActiveCell(0, 0);
  }
  addSheet(): void {
    this.model.addSheet();
    this.render();
    this.changeActiveCell(0, 0);
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
  }
  enterEditing(): void {
    this.dispatchAction({ type: "ENTER_EDITING" });
  }
  clickPositionToCell(offsetX: number, offsetY: number): CellPosition {
    return this.model.clickPositionToCell(offsetX, offsetY);
  }
  changeActiveCell(row: number, col: number): void {
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
  setCellValue(row: number, col: number, value: string): this {
    this.model.setCellValue(row, col, value);
    this.render();
    return this;
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

const getSingletonController = (() => {
  let instance: Controller;
  return (canvas?: HTMLCanvasElement): Controller => {
    if (!instance) {
      instance = new Controller(canvas);
    }
    assert(!!instance);
    return instance;
  };
})();

export { getSingletonController };
