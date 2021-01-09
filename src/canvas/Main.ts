import { CanvasOption } from "@/controller/interface";
import {
  thinLineWidth,
  EDefaultStrokeColor,
  EDefaultFillColor,
  npx,
  assert,
  dpr,
} from "@/util";
import type { Controller } from "@/controller";
import { Selection } from "./Selection";
import { Content } from "./Content";

export const HEADER_STYLE: Omit<CanvasOption, "direction"> = {
  textAlign: "center",
  textBaseline: "middle",
  font: `500 ${npx(12)}px 'Source Sans Pro',sans-serif`,
  fillStyle: EDefaultFillColor.ROW_COL_HEADER,
  lineWidth: thinLineWidth(),
  strokeStyle: EDefaultStrokeColor.GRID,
};

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
    this.scale(size, size);
    this.selection = new Selection(width, height);
    this.content = new Content(controller, width, height);
  }
  resize(width: number, height: number): void {
    const { canvas } = this;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    canvas.width = npx(width);
    canvas.height = npx(height);
  }

  scale(x: number, y: number): void {
    this.ctx.scale(x, y);
  }
  render(): void {
    const { width, height } = this.controller.getCanvasSize();
    this.resize(width, height);

    this.content.render(width, height);
    const cell = this.controller.queryActiveCell();

    this.selection.render(width, height, cell);

    this.compose();
  }
  updateSelection(): void {
    const { width, height } = this.controller.getCanvasSize();
    this.resize(width, height);

    const cell = this.controller.queryActiveCell();

    this.selection.render(width, height, cell);

    this.compose();
  }
  compose(): void {
    this.clear();
    this.ctx.drawImage(this.content.canvas, 0, 0);
    this.ctx.drawImage(this.selection.canvas, 0, 0);
  }
  clear(): void {
    const { width, height } = this.canvas;
    this.ctx.clearRect(0, 0, width, height);
  }
}
