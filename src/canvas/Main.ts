import { npx, assert, dpr, isCol, isRow, isSheet } from "@/util";
import type { Controller } from "@/controller";
import { Content } from "./Content";
import { CanvasOverlayPosition } from "@/types";
import theme from "@/theme";
import { Controller as RenderController } from "./controller";
import { Selection } from "./Selection";

export class Main {
  protected canvas: HTMLCanvasElement;
  protected ctx: CanvasRenderingContext2D;
  protected controller: Controller;
  protected content: Content;
  protected renderController: RenderController;
  protected selection: Selection;
  constructor(
    controller: Controller,
    canvas: HTMLCanvasElement,
    renderController: RenderController
  ) {
    const { width, height } = renderController.getCanvasSize();
    this.renderController = renderController;
    this.controller = controller;
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    assert(!!ctx);
    this.ctx = ctx;
    this.resize(width, height);
    const size = dpr();
    this.ctx.scale(size, size);
    this.content = new Content({
      width,
      height,
      controller,
      renderController: this.renderController,
    });
    this.selection = new Selection({
      width,
      height,
      controller,
      renderController: this.renderController,
    });
    this.controller.on("change", this.render);
    this.render();
  }
  resize(width: number, height: number): void {
    const { canvas } = this;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    canvas.width = npx(width);
    canvas.height = npx(height);
  }
  getSelection(
    activeCell: CanvasOverlayPosition
  ): CanvasOverlayPosition | null {
    const { controller, renderController } = this;
    const { ranges } = controller;
    const [range] = ranges;
    if (range.rowCount === range.colCount && range.rowCount === 1) {
      return null;
    }
    const drawSize = renderController.getDrawSize();
    if (isSheet(range)) {
      return {
        ...drawSize,
        left: activeCell.left,
        top: activeCell.top,
      };
    }
    if (isCol(range)) {
      const width = renderController.getColWidth(range.col);
      return {
        left: activeCell.left,
        top: activeCell.top,
        width: width,
        height: drawSize.height,
      };
    }
    if (isRow(range)) {
      const height = renderController.getRowHeight(range.row);
      return {
        left: activeCell.left,
        top: activeCell.top,
        width: drawSize.width,
        height,
      };
    }

    const endCellRow = range.row + range.rowCount - 1;
    const endCellCol = range.col + range.colCount - 1;
    assert(endCellRow >= 0 && endCellCol >= 0);
    const endCell = renderController.queryCell(endCellRow, endCellCol);
    const width = endCell.left + endCell.width - activeCell.left;
    const height = endCell.top + endCell.height - activeCell.top;
    assert(width >= 0 && height >= 0);
    return {
      left: activeCell.left,
      top: activeCell.top,
      width: width,
      height: height,
    };
  }
  render = (): void => {
    const { width, height } = this.renderController.getCanvasSize();
    this.resize(width, height);
    this.content.render(width, height);
    const [range] = this.controller.ranges;
    const activeCell = this.renderController.queryCell(range.row, range.col);
    const selectAll = this.getSelection(activeCell);
    this.selection.render(width, height, selectAll);
    this.ctx.drawImage(this.content.canvas, 0, 0);
    this.ctx.drawImage(this.selection.canvas, 0, 0);
    this.ctx.strokeStyle = theme.primaryColor;
    this.ctx.lineWidth = dpr();
    const line = selectAll ? selectAll : activeCell;
    this.strokeRect(line.left, line.top, line.width, line.height);
  };

  strokeRect(x: number, y: number, width: number, height: number): void {
    this.ctx.strokeRect(npx(x) - 0.5, npx(y) - 0.5, npx(width), npx(height));
  }
}
