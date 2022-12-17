import { assert, createCanvas, dpr } from '@/util';
import type { IController } from '@/types';

export class Base {
  canvas: HTMLCanvasElement;
  protected ctx: CanvasRenderingContext2D;
  protected controller: IController;
  constructor(controller: IController, canvas = createCanvas()) {
    this.controller = controller;
    this.canvas = canvas;
    const ctx = this.canvas.getContext('2d');
    assert(!!ctx);
    this.ctx = ctx;
    const size = dpr();
    this.ctx.scale(size, size);
  }
}
