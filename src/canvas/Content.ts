import { npx, dpr, canvasLog, headerSizeSet, canvasSizeSet } from '@/util';
import { resizeCanvas, renderCellData } from './util';
import { ContentView, IController } from '@/types';

export class Content implements ContentView {
  private ctx: CanvasRenderingContext2D;
  private controller: IController;
  private rowMap = new Map<number, number>();
  private colMap = new Map<number, number>();
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
    const { width, height } = canvasSizeSet.get();
    resizeCanvas(this.ctx.canvas, width, height);
  }
  render() {
    canvasLog('render canvas content');
    this.clear();
    this.renderContent();
  }
  check() {
    const { controller } = this;
    if (this.rowMap.size === 0 && this.colMap.size === 0) {
      return;
    }
    canvasLog('render again');
    controller.batchUpdate(() => {
      for (const [r, h] of this.rowMap.entries()) {
        if (h <= 0 || controller.getRowHeight(r).len === h) {
          continue;
        }
        controller.setRowHeight(r, h);
      }
      for (const [c, w] of this.colMap.entries()) {
        if (w <= 0 || controller.getColWidth(c).len === w) {
          continue;
        }
        controller.setColWidth(c, w);
      }
    }, true);
  }

  private clear() {
    const { width, height } = canvasSizeSet.get();
    this.ctx.clearRect(0, 0, npx(width), npx(height));
  }

  private renderContent() {
    const { controller, ctx } = this;
    const { width, height } = canvasSizeSet.get();
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

    this.rowMap = new Map<number, number>();
    this.colMap = new Map<number, number>();

    for (let rowIndex = row; rowIndex < endRow; rowIndex++) {
      for (let colIndex = col; colIndex < endCol; colIndex++) {
        const size = renderCellData(controller, ctx, {
          row: rowIndex,
          col: colIndex,
          rowCount: 1,
          colCount: 1,
          sheetId: '',
        });
        const height = Math.max(this.rowMap.get(rowIndex) || 0, size.height);
        const width = Math.max(this.colMap.get(colIndex) || 0, size.width);
        if (height > controller.getRowHeight(rowIndex).len) {
          this.rowMap.set(rowIndex, height);
        }
        if (width > controller.getColWidth(colIndex).len) {
          this.colMap.set(colIndex, width);
        }
      }
    }
    ctx.restore();
  }
}
