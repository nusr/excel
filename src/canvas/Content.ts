import {
  isEmpty,
  thinLineWidth,
  npx,
  dpr,
  intToColumnName,
  Range,
  theme,
} from '@/util';
import {
  fillRect,
  fillText,
  drawLines,
  renderCell,
  drawTriangle,
  resizeCanvas,
} from './util';
import { HEADER_STYLE } from './constant';
import { Point, ContentView, IController, EventType } from '@/types';

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

  private clear() {
    const { width, height } = this.controller.getDomRect();
    this.ctx.clearRect(0, 0, npx(width), npx(height));
  }

  render({ changeSet }: EventType) {
    if (changeSet.size === 0 || !changeSet.has('content')) {
      return;
    }
    const { width, height } = this.controller.getDomRect();
    const headerSize = this.controller.getHeaderSize();
    this.clear();
    const contentWidth = width - headerSize.width;
    const contentHeight = height - headerSize.height;
    this.renderGrid(contentWidth, contentHeight);
    this.renderRowsHeader(contentHeight);
    this.renderColsHeader(contentWidth);
    this.renderTriangle();
    this.renderContent();
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

    while (1) {
      const t = controller.getColWidth(c);
      if (x + t < width) {
        x += t;
        c++;
      } else {
        break;
      }
    }

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
    for (let r = row; r < endRow; r++) {
      x = headerSize.width;
      for (let c = col; c < endCol; c++) {
        const cellInfo = controller.getCell(
          new Range(r, c, 1, 1, currentSheetId),
        );
        if (isEmpty(cellInfo.value) && isEmpty(cellInfo.style)) {
          x += controller.getColWidth(c);
          continue;
        }
        const cellSize = controller.getCellSize(r, c);
        const { wrapHeight = 0, fontSizeHeight = 0 } = renderCell(ctx, {
          ...cellInfo,
          ...cellSize,
          top: y,
          left: x,
        });
        const t = Math.max(wrapHeight, fontSizeHeight);
        if (t > cellSize.height) {
          controller.setRowHeight(r, t);
        }
        x += controller.getColWidth(c);
      }
      y += controller.getRowHeight(r);
    }
    ctx.restore();
  }
  private renderTriangle(): void {
    const headerSize = this.controller.getHeaderSize();
    this.ctx.save();
    this.ctx.fillStyle = theme.backgroundColor;

    fillRect(this.ctx, 0, 0, headerSize.width, headerSize.height);
    this.ctx.fillStyle = theme.triangleFillColor;
    const offset = 2;
    drawTriangle(
      this.ctx,
      [headerSize.width / 2 - offset, headerSize.height - offset],
      [headerSize.width - offset, headerSize.height - offset],
      [headerSize.width - offset, offset],
    );

    this.ctx.restore();
  }

  private renderGrid(width: number, height: number): void {
    const { controller } = this;
    const headerSize = controller.getHeaderSize();
    const { row: rowIndex, col: colIndex } = controller.getScroll();
    const { rowCount, colCount } = this.controller.getSheetInfo(
      this.controller.getCurrentSheetId(),
    );
    const lineWidth = thinLineWidth();
    this.ctx.save();
    this.ctx.fillStyle = theme.white;
    this.ctx.lineWidth = lineWidth;
    this.ctx.strokeStyle = theme.gridStrokeColor;
    this.ctx.translate(npx(headerSize.width), npx(headerSize.height));
    const pointList: Array<Point> = [];
    let y = 0;
    let x = 0;
    let maxX = 0;
    for (let i = colIndex; i < colCount; i++) {
      maxX += controller.getColWidth(i);
      if (maxX > width) {
        break;
      }
    }
    const realWidth = Math.min(maxX, width);
    for (let i = rowIndex; i < rowCount; i++) {
      pointList.push([0, y], [realWidth, y]);
      y += controller.getRowHeight(i);
      if (y > height) {
        break;
      }
    }
    for (let i = colIndex; i < colCount; i++) {
      pointList.push([x, 0], [x, y]);
      x += controller.getColWidth(i);
      if (x > realWidth) {
        break;
      }
    }
    pointList.push([0, y], [x, y]);
    pointList.push([x, 0], [x, y]);
    drawLines(this.ctx, pointList);
    this.ctx.restore();
  }
  private fillRowText(row: number, rowWidth: number, y: number): void {
    this.ctx.fillStyle = theme.black;
    fillText(this.ctx, String(row), rowWidth / 2, y);
  }

  private fillColText(colText: string, x: number, colHeight: number): void {
    this.ctx.fillStyle = theme.black;
    fillText(this.ctx, colText, x, colHeight / 2 + dpr());
  }
  private renderRowsHeader(height: number): void {
    const { controller } = this;
    const { row: rowIndex } = controller.getScroll();
    const headerSize = controller.getHeaderSize();
    const { rowCount } = controller.getSheetInfo(
      controller.getCurrentSheetId(),
    );
    this.ctx.save();
    this.ctx.fillStyle = theme.backgroundColor;
    fillRect(this.ctx, 0, headerSize.height, headerSize.width, height);
    Object.assign(this.ctx, HEADER_STYLE);
    const pointList: Array<Point> = [];
    let y = headerSize.height;
    let i = rowIndex;

    for (; i < rowCount; i++) {
      const rowHeight = controller.getRowHeight(i);
      let temp = y;
      if (i === rowIndex) {
        temp += thinLineWidth() / 2;
      }
      pointList.push([0, temp], [headerSize.width, temp]);
      this.fillRowText(i + 1, headerSize.width, temp + rowHeight / 2);
      y += rowHeight;
      if (y > height) {
        break;
      }
    }
    pointList.push([0, y], [headerSize.width, y]);
    pointList.push([0, 0], [0, y]);
    drawLines(this.ctx, pointList);
    this.ctx.restore();
  }
  private renderColsHeader(width: number): void {
    const { controller } = this;

    const { col: colIndex } = controller.getScroll();
    const headerSize = controller.getHeaderSize();
    const { colCount } = controller.getSheetInfo(
      controller.getCurrentSheetId(),
    );
    const pointList: Array<Point> = [];
    this.ctx.save();
    this.ctx.fillStyle = theme.backgroundColor;
    fillRect(this.ctx, headerSize.width, 0, width, headerSize.height);
    Object.assign(this.ctx, HEADER_STYLE);

    let x = headerSize.width;
    let i = colIndex;
    for (; i < colCount; i++) {
      const colWidth = controller.getColWidth(i);
      let temp = x;
      if (i === colIndex) {
        temp += thinLineWidth() / 2;
      }
      pointList.push([temp, 0], [temp, headerSize.height]);
      this.fillColText(
        intToColumnName(i),
        temp + colWidth / 2,
        headerSize.height,
      );
      x += colWidth;
      if (x > width) {
        break;
      }
    }
    pointList.push([x, 0], [x, headerSize.height]);
    pointList.push([0, 0], [x, 0]);
    drawLines(this.ctx, pointList);
    this.ctx.restore();
  }
}
