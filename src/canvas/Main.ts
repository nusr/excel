import { npx, assert, dpr } from "@/util";
import type { Controller } from "@/controller";
import { Selection } from "./Selection";
import { Content } from "./Content";
import { EventType, CanvasOverlayPosition } from "@/types";
import theme from "@/theme";
import { Base } from "./Base";

export class Main extends Base {
  protected mainCanvas: HTMLCanvasElement;
  protected mainCtx: CanvasRenderingContext2D;
  protected controller: Controller;
  protected selection: Selection;
  protected content: Content;
  constructor(controller: Controller, canvas: HTMLCanvasElement) {
    super(controller.getCanvasSize());
    const { width, height } = controller.getCanvasSize();
    this.controller = controller;
    this.mainCanvas = canvas;
    const mainCtx = canvas.getContext("2d");
    assert(!!mainCtx);
    this.mainCtx = mainCtx;
    this.resizeMain(width, height);
    const size = dpr();
    this.mainCtx.scale(size, size);
    this.selection = new Selection({ width, height });
    this.content = new Content(controller, width, height);
    this.controller.on("change", this.render);
    // this.render(["contentChange"]);
  }
  resizeMain(width: number, height: number): void {
    const { mainCanvas } = this;
    mainCanvas.style.width = width + "px";
    mainCanvas.style.height = height + "px";
    mainCanvas.width = npx(width);
    mainCanvas.height = npx(height);
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
  render = ({ changeSet = [] }: EventType["change"]): void => {
    const { width, height } = this.controller.getCanvasSize();
    this.resize(width, height);
    if (changeSet.includes("contentChange")) {
      this.content.render(width, height);
    }
    const list = this.getSelection();
    this.selection.render(width, height, list);
    this.ctx.drawImage(this.selection.canvas, 0, 0);
    this.ctx.drawImage(this.content.canvas, 0, 0);

    const [activeCell, all] = list;
    const line = all ? all : activeCell;
    this.ctx.strokeStyle = theme.primaryColor;
    this.ctx.lineWidth = dpr();
    this.strokeRect(line.left, line.top, line.width, line.height);

    this.renderMain(width, height);
  };
  renderMain(width: number, height: number): void {
    this.resizeMain(width, height);
    this.mainCtx.drawImage(this.canvas, 0, 0);
  }
}
