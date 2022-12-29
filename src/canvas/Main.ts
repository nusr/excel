import { dpr, resizeCanvas, npx } from "@/util";
import {
  EventType,
  IWindowSize,
  ContentView,
} from "@/types";

export class MainCanvas implements ContentView {
  private ctx: CanvasRenderingContext2D;
  private content: ContentView;
  private selection: ContentView;
  private canvas: HTMLCanvasElement;
  private canvasSize: IWindowSize = {
    width: 0,
    height: 0,
  };
  constructor(
    canvas: HTMLCanvasElement,
    content: ContentView,
    selection: ContentView
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.content = content;
    this.selection = selection;
    const size = dpr();
    this.ctx.scale(size, size);
  }
  getCanvas() {
    return this.canvas;
  }
  resize(width: number, height: number) {
    this.canvasSize = {
      width,
      height,
    };
    resizeCanvas(this.canvas, width, height);
    this.content.resize(width, height);
    this.selection.resize(width, height);
  }
  private clear() {
    this.ctx.clearRect(
      0,
      0,
      npx(this.canvasSize.width),
      npx(this.canvasSize.height)
    );
  }
  render = (params: EventType): void => {
    if (params.changeSet.size === 0) {
      return;
    }
    this.content.render(params);
    this.selection.render(params);
    this.clear();
    this.ctx.drawImage(this.content.getCanvas(), 0, 0);
    this.ctx.drawImage(this.selection.getCanvas(), 0, 0);
  };
}
