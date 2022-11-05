import { assert, dpr, isTestEnv } from '@/util';
import type { IController } from '@/types';
import { RenderController } from './Controller';

export class Base {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  controller: IController;
  renderController: RenderController;
  constructor(
    controller: IController,
    renderController: RenderController,
    name = 'Base',
    canvas = document.createElement('canvas'),
  ) {
    this.controller = controller;
    this.renderController = renderController;
    this.canvas = canvas;
    this.canvas.id = name;
    this.canvas.style.display = 'none';
    if (!isTestEnv()) {
      document.body.appendChild(this.canvas);
    }
    const ctx = this.canvas.getContext('2d');
    assert(!!ctx);
    this.ctx = ctx;
    const size = dpr();
    this.ctx.scale(size, size);
  }
}
