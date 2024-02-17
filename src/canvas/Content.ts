import { isEmpty, npx, dpr, Range, canvasLog } from '@/util';
import { renderCell, resizeCanvas } from './util';
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
    const currentSheetId = controller.getCurrentSheetId();
    const { row, col } = controller.getScroll();

    let x = headerSize.width;
    let c = col;
    let y = headerSize.height;
    let r = row;

    // eslint-disable-next-line no-constant-condition
    while (1) {
      const t = controller.getColWidth(c);
      if (x + t < width) {
        x += t;
        c++;
      } else {
        break;
      }
    }

    // eslint-disable-next-line no-constant-condition
    while (1) {
      const t = controller.getRowHeight(r);
      if (y + t < height) {
        y += t;
        r++;
      } else {
        break;
      }
    }
    const endRow = r;
    const endCol = c;
    ctx.save();
    y = headerSize.height;
    for (let rowIndex = row; rowIndex < endRow; rowIndex++) {
      x = headerSize.width;
      for (let colIndex = col; colIndex < endCol; colIndex++) {
        const cellInfo = controller.getCell(
          new Range(rowIndex, colIndex, 1, 1, currentSheetId),
        );
        if (!cellInfo) {
          continue;
        }
        if (isEmpty(cellInfo.value) && isEmpty(cellInfo.style)) {
          x += controller.getColWidth(colIndex);
          continue;
        }
        const cellSize = controller.getCellSize(rowIndex, colIndex);
        if (cellSize.width <= 0 || cellSize.height <= 0) {
          continue;
        }
        const { wrapHeight = 0 } = renderCell(ctx, {
          ...cellInfo,
          ...cellSize,
          top: y,
          left: x,
        });
        if (wrapHeight > cellSize.height) {
          controller.setRowHeight(rowIndex, wrapHeight, false);
        }
        x += controller.getColWidth(colIndex);
      }
      y += controller.getRowHeight(rowIndex);
    }
    ctx.restore();
  }
}
