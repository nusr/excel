import { npx, dpr, canvasLog, CELL_HEIGHT, CELL_WIDTH } from '@/util';
import { resizeCanvas, renderCellData } from './util';
import { ContentView, IController, EventType } from '@/types';

export class Content implements ContentView {
  private ctx: CanvasRenderingContext2D;
  private controller: IController;
  constructor(controller: IController, canvas: HTMLCanvasElement) {
    this.controller = controller;
    const ctx = canvas.getContext('2d')!;
    this.ctx = ctx;
    const size = dpr();
    this.ctx.scale(size, size);
  }
  getCanvas() {
    return this.ctx.canvas;
  }
  resize() {
    const { width, height } = this.controller.getDomRect();
    resizeCanvas(this.ctx.canvas, width, height);
  }
  render({ changeSet }: EventType) {
    if (changeSet.size === 0) {
      return;
    }

    const check =
      changeSet.has('row') ||
      changeSet.has('col') ||
      changeSet.has('sheetList') ||
      changeSet.has('sheetId') ||
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

    while (x + controller.getColWidth(c).len < width) {
      x += controller.getColWidth(c).len;
      c++;
    }

    while (y + controller.getRowHeight(r).len < height) {
      y += controller.getRowHeight(r).len;
      r++;
    }
    const endRow = r;
    const endCol = c;
    ctx.save();

    const rowMap = new Map<number, number>();
    const colMap = new Map<number, number>();

    for (let rowIndex = row; rowIndex < endRow; rowIndex++) {
      for (let colIndex = col; colIndex < endCol; colIndex++) {
        const size = renderCellData(controller, ctx, rowIndex, colIndex);
        rowMap.set(
          rowIndex,
          Math.max(rowMap.get(rowIndex) || CELL_HEIGHT, size.height),
        );
        colMap.set(
          colIndex,
          Math.max(colMap.get(colIndex) || CELL_WIDTH, size.width),
        );
      }
    }
    for (const [r, h] of rowMap.entries()) {
      if (h <= 0) {
        continue;
      }
      controller.setRowHeight(r, h, false);
    }
    for (const [c, w] of colMap.entries()) {
      if (w <= 0) {
        continue;
      }
      controller.setColWidth(c, w, false);
    }

    ctx.restore();
  }
}
