import { dpr, resizeCanvas, npx } from "@/util";
import {
  EventType,
  ContentView,
  CanvasOverlayPosition,
  IController,
} from "@/types";
import { drawAntLine } from "./util";

export class MainCanvas implements ContentView {
  private ctx: CanvasRenderingContext2D;
  private content: ContentView;
  private selection: ContentView;
  private canvas: HTMLCanvasElement;
  private controller: IController;
  private antLine: CanvasOverlayPosition | null = null;
  constructor(
    canvas: HTMLCanvasElement,
    controller: IController,
    content: ContentView,
    selection: ContentView
  ) {
    this.canvas = canvas;
    this.controller = controller;
    this.ctx = canvas.getContext("2d")!;
    this.content = content;
    this.selection = selection;
    const size = dpr();
    this.ctx.scale(size, size);
  }
  getCanvas() {
    return this.canvas;
  }
  resize() {
    const { width, height } = this.controller.getDomRect();
    resizeCanvas(this.canvas, width, height);
    this.content.resize();
    this.selection.resize();
  }
  private clear() {
    const { width, height } = this.controller.getDomRect();
    this.ctx.clearRect(
      0,
      0,
      npx(width),
      npx(height)
    );
  }
  render = (params: EventType) => {
    if (params.changeSet.size === 0) {
      return {
        top: 0,
        left: 0,
        width: 0,
        height: 0,
      };
    }
    this.content.render(params);
    const result = this.selection.render(params);
    if (this.controller.getIsDrawAntLine()) {
      if (this.antLine === null) {
        this.antLine = result;
      }
    } else {
      this.antLine = null;
    }
    this.clear();
    this.ctx.drawImage(this.content.getCanvas(), 0, 0);
    this.ctx.drawImage(this.selection.getCanvas(), 0, 0);
    if (this.antLine) {
      drawAntLine(
        this.ctx,
        this.antLine.left,
        this.antLine.top,
        this.antLine.width,
        this.antLine.height
      );
    }
    return result;
  };
}
