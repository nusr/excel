import { npx, assert, dpr } from "@/util";
import type { Controller } from "@/controller";
import { Selection } from "./Selection";
import { Content } from "./Content";
import { ChangeEventType, CanvasOverlayPosition } from "@/types";

export class Main {
  protected canvas: HTMLCanvasElement;
  protected ctx: CanvasRenderingContext2D;
  protected controller: Controller;
  protected selection: Selection;
  protected content: Content;
  constructor(controller: Controller, canvas: HTMLCanvasElement) {
    this.controller = controller;
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    assert(!!ctx);
    this.ctx = ctx;
    const { width, height } = this.controller.getCanvasSize();
    this.resize(width, height);
    const size = dpr();
    this.ctx.scale(size, size);
    this.selection = new Selection(width, height);
    this.content = new Content(controller, width, height);
    this.controller.on("change", (data) => {
      const { changeSet } = data;
      this.render(changeSet);
    });
    this.render(["contentChange"]);
  }
  resize(width: number, height: number): void {
    const { canvas } = this;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    canvas.width = npx(width);
    canvas.height = npx(height);
  }
  getSelection(): CanvasOverlayPosition[] {
    const { controller } = this;
    const { ranges } = controller;
    const [range] = ranges;
    const startCell = controller.queryCell(range.row, range.col);
    const firstCell = {
      left: startCell.left,
      top: startCell.top,
      width: startCell.width,
      height: startCell.height,
    };
    if (range.rowCount === range.colCount && range.rowCount === 0) {
      return [firstCell];
    }
    const endCell = controller.queryCell(
      range.row + range.rowCount,
      range.col + range.colCount
    );
    const width =
      endCell.left +
      (range.colCount > 0 ? endCell.width : -endCell.width) -
      startCell.left;
    const height =
      endCell.top +
      (range.rowCount > 0 ? endCell.height : -endCell.height) -
      startCell.top;
    return [
      firstCell,
      {
        left: startCell.left,
        top: startCell.top,
        width,
        height,
      },
    ];
  }
  render(changeSet: Array<ChangeEventType> = []): void {
    const { width, height } = this.controller.getCanvasSize();
    this.resize(width, height);
    if (changeSet.includes("contentChange")) {
      this.content.render(width, height);
    }
    const cell = this.getSelection();
    this.selection.render(width, height, cell);
    this.ctx.drawImage(this.selection.canvas, 0, 0);
    this.ctx.drawImage(this.content.canvas, 0, 0);
  }
  clear(): void {
    const { width, height } = this.canvas;
    this.ctx.clearRect(0, 0, width, height);
  }
}
