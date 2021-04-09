import { assert, dpr } from "@/util";
import type { Controller } from "@/controller";

export type BaseProps = {
  controller: Controller;
  name?: string;
};

export class Base {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  controller: Controller;
  constructor({ controller, name = "Base" }: BaseProps) {
    this.controller = controller;
    this.canvas = document.createElement("canvas");
    this.canvas.id = name;
    this.canvas.style.display = "none";
    document.body.appendChild(this.canvas);
    const ctx = this.canvas.getContext("2d");
    assert(!!ctx);
    this.ctx = ctx;
    const size = dpr();
    this.ctx.scale(size, size);
  }
}
