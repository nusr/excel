import { assert, dpr } from '@/util';
import type { IController } from '@/types';
import { RenderController } from './Controller';

export type BaseProps = {
  controller: IController;
  name?: string;
  renderController: RenderController;
};

export class Base {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  controller: IController;
  renderController: RenderController;
  constructor({ controller, name = 'Base', renderController }: BaseProps) {
    this.controller = controller;
    this.renderController = renderController;
    this.canvas = document.createElement('canvas');
    this.canvas.id = name;
    this.canvas.style.display = 'none';
    document.body.appendChild(this.canvas);
    const ctx = this.canvas.getContext('2d');
    assert(!!ctx);
    this.ctx = ctx;
    const size = dpr();
    this.ctx.scale(size, size);
  }
}
