import { npx, dpr, canvasLog } from '@/util';
import { resizeCanvas, renderCellData } from './util';
import { ContentView, IController, EventType } from '@/types';

export class Content implements ContentView {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private controller: IController;
  constructor(controller: IController, canvas: HTMLCanvasElement) {
    this.controller = controller;
    this.canvas = canvas;
    const ctx = this.canvas.getContext('2d')!;
    this.ctx = ctx;
    const size = dpr();
    this.ctx.scale(size, size);
  }
  getCanvas() {
    return this.canvas;
  }
  resize() {
    const { width, height } = this.controller.getDomRect();
    resizeCanvas(this.canvas, width, height);
  }
  render({ changeSet }: EventType) {
    if (changeSet.size === 0) {
      return;
    }

    const check =
      changeSet.has('row') ||
      changeSet.has('col') ||
      changeSet.has('sheetList') ||
      changeSet.has('currentSheetId') ||
      changeSet.has('cellStyle') ||
      changeSet.has('cellValue') ||
      changeSet.has('scroll');

    if (!check) {
      return;
    }
    canvasLog('render canvas content');
    this.clear();
    this.renderContent();
  }
  private clear() {
    const { width, height } = this.controller.getDomRect();
    this.ctx.clearRect(0, 0, npx(width), npx(height));
  }

  private renderContent(): void {
    const { controller, ctx } = this;
    const { width, height } = controller.getDomRect();
    const headerSize = controller.getHeaderSize();
    const { row, col } = controller.getScroll();

    let x = headerSize.width;
    let c = col;
    let y = headerSize.height;
    let r = row;

    while (x + controller.getColWidth(c) < width) {
      x += controller.getColWidth(c);
      c++;
    }

    while (y + controller.getRowHeight(r) < height) {
      y += controller.getRowHeight(r);
      r++;
    }
    const endRow = r;
    const endCol = c;
    ctx.save();
    for (let rowIndex = row; rowIndex < endRow; rowIndex++) {
      for (let colIndex = col; colIndex < endCol; colIndex++) {
        renderCellData(controller, ctx, rowIndex, colIndex);
      }
    }
    ctx.restore();
  }
}
