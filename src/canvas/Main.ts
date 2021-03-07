import { npx, assert, dpr } from "@/util";
import type { Controller } from "@/controller";
import { Selection } from "./Selection";
import { Content } from "./Content";
import { CanvasOverlayPosition } from "@/types";
import theme from "@/theme";

export class Main {
  protected canvas: HTMLCanvasElement;
  protected ctx: CanvasRenderingContext2D;
  protected controller: Controller;
  protected selection: Selection;
  protected content: Content;
  constructor(controller: Controller, canvas: HTMLCanvasElement) {
    const { width, height } = controller.getCanvasSize();
    this.controller = controller;
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    assert(!!ctx);
    this.ctx = ctx;
    this.resize(width, height);
    const size = dpr();
    this.ctx.scale(size, size);
    this.selection = new Selection({ width, height, controller });
    this.content = new Content({ width, height, controller });
    this.controller.on("change", this.render);
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
    const activeCell = controller.queryActiveCellInfo();
    const firstCell = {
      left: activeCell.left,
      top: activeCell.top,
      width: activeCell.width,
      height: activeCell.height,
    };
    if (range.rowCount === range.colCount && range.rowCount <= 1) {
      return [firstCell];
    }
    const endCellRow = range.row + range.rowCount - 1;
    const endCellCol = range.col + range.colCount - 1;
    assert(endCellRow >= 0 && endCellCol >= 0);
    const endCell = controller.queryCell(endCellRow, endCellCol);
    const width = endCell.left + endCell.width - startCell.left;
    const height = endCell.top + endCell.height - startCell.top;
    assert(width >= 0 && height >= 0);
    return [
      firstCell,
      {
        left: startCell.left,
        top: startCell.top,
        width: width,
        height: height,
      },
    ];
  }
  render = (): void => {
    const { width, height } = this.controller.getCanvasSize();
    this.resize(width, height);
    this.content.render(width, height);
    const list = this.getSelection();
    this.selection.render(width, height, list);
    this.ctx.drawImage(this.content.canvas, 0, 0);
    this.ctx.drawImage(this.selection.canvas, 0, 0);
    const [activeCell, all] = list;
    const line = all ? all : activeCell;
    this.ctx.strokeStyle = theme.primaryColor;
    this.ctx.lineWidth = dpr();
    this.strokeRect(line.left, line.top, line.width, line.height);
  };
  strokeRect(x: number, y: number, width: number, height: number): void {
    this.ctx.strokeRect(npx(x) - 0.5, npx(y) - 0.5, npx(width), npx(height));
  }
  renderMain(width: number, height: number): void {
    this.resize(width, height);
    this.ctx.drawImage(this.canvas, 0, 0);
  }
  clearMain(): void {
    const { width, height } = this.canvas;
    this.ctx.clearRect(0, 0, width, height);
  }
}
