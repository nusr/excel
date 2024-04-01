import { npx, dpr, canvasLog, headerSizeSet } from '@/util';
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
      return false;
    }

    const check =
      changeSet.has('row') ||
      changeSet.has('col') ||
      changeSet.has('workbook') ||
      changeSet.has('currentSheetId') ||
      changeSet.has('cellStyle') ||
      changeSet.has('cellValue') ||
      changeSet.has('scroll');

    if (!check) {
      return false;
    }
    canvasLog('render canvas content');
    this.clear();
    return this.renderContent();
  }

  private clear() {
    const { width, height } = this.controller.getDomRect();
    this.ctx.clearRect(0, 0, npx(width), npx(height));
  }

  private renderContent() {
    let check = false;
    const { controller, ctx } = this;
    const { width, height } = controller.getDomRect();
    const headerSize = headerSizeSet.get();
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
          Math.max(
            rowMap.get(rowIndex) || 0,
            controller.getRowHeight(rowIndex).len,
            size.height,
          ),
        );
        colMap.set(
          colIndex,
          Math.max(
            colMap.get(colIndex) || 0,
            controller.getColWidth(colIndex).len,
            size.width,
          ),
        );
      }
    }
    controller.batchUpdate(() => {
      for (const [r, h] of rowMap.entries()) {
        if (h <= 0 || controller.getRowHeight(r).len === h) {
          continue;
        }
        check = true;
        controller.setRowHeight(r, h);
      }
      for (const [c, w] of colMap.entries()) {
        if (w <= 0 || controller.getColWidth(c).len === w) {
          continue;
        }
        check = true;
        controller.setColWidth(c, w);
      }
    }, false);
    ctx.restore();
    return check;
  }
}
