import { npx, assert, dpr } from "@/util";
import type { Controller } from "@/controller";
import { Selection } from "./Selection";
import { Content } from "./Content";
import { ChangeEventType } from "@/types";

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
  render(changeSet: Array<ChangeEventType> = []): void {
    const { width, height } = this.controller.getCanvasSize();
    this.resize(width, height);
    if (changeSet.includes("contentChange")) {
      this.content.render(width, height);
    }
    const cell = this.controller.getSelection();
    this.selection.render(width, height, cell);
    this.ctx.drawImage(this.content.canvas, 0, 0);
    this.ctx.drawImage(this.selection.canvas, 0, 0);
  }
  clear(): void {
    const { width, height } = this.canvas;
    this.ctx.clearRect(0, 0, width, height);
  }
}
