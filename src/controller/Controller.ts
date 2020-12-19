import { Draw } from "./Draw";
import { Model } from "./Model";
import { Scroll } from "./Scroll";
import { Action, CellPosition, WorkBookJSON } from "@/types";
import { IWindowSize, EventEmitter } from "@/util";

export interface IController {
  reset(): void;
  selectAll(): void;
  loadJSON(json: WorkBookJSON): void;
  selectRow(offsetX: number, offsetY: number): void;
  selectCol(offsetX: number, offsetY: number): void;
  changeActiveCell(offsetX: number, offsetY: number): void;
  quitEditing(): void;
  enterEditing(): void;
  windowResize(): void;
  setCellValue(row: number, col: number, value: string): this;
  clickPositionToCell(offsetX: number, offsetY: number): CellPosition;
}

export class Controller extends EventEmitter implements IController {
  private draw: Draw;
  private scroll: Scroll = new Scroll();
  private model: Model = new Model();
  private dispatch: (value: Action) => void;
  constructor(canvas: HTMLCanvasElement, dispatch: (value: Action) => void) {
    super();
    this.draw = new Draw(canvas);
    this.dispatch = dispatch;
    this.render();
  }
  selectAll(): void {
    console.log("selectAll");
  }
  selectCol(offsetX: number, offsetY: number): void {
    console.log("selectCol");
  }
  selectRow(offsetX: number, offsetY: number): void {
    console.log("selectRow");
  }
  quitEditing(): void {
    this.dispatch({ type: "QUIT_EDITING" });
  }
  loadJSON(json: WorkBookJSON): void {
    console.log("loadJSON", json);
    this.model.fromJSON(json);
    this.render();
  }
  enterEditing(): void {
    this.dispatch({ type: "ENTER_EDITING" });
  }
  clickPositionToCell(offsetX: number, offsetY: number): CellPosition {
    return this.model.clickPositionToCell(offsetX, offsetY);
  }
  changeActiveCell(row: number, col: number): void {
    const { model } = this;
    const { rowCount, colCount } = model;
    if (row >= rowCount || col >= colCount) {
      return;
    }
    const size = this.getCanvasSize();
    const cell = model.queryCell(row, col);
    if (cell.top >= size.height || cell.left >= size.width) {
      return;
    }
    this.dispatch({
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
    this.changeActiveCell(10, 10);
  }
  protected clear(): void {
    this.draw.clear();
  }
  reset(): void {
    this.clear();
  }
}
