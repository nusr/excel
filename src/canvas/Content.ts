import { isEmpty } from '@/lodash';
import {
  thinLineWidth,
  npx,
  dpr,
  intToColumnName,
  isTestEnv,
  resizeCanvas,
} from '@/util';
import theme from '@/theme';
import {
  fillRect,
  fillText,
  drawLines,
  renderCell,
  drawTriangle,
} from './util';
import { HEADER_STYLE } from './constant';
import type { Point, ContentView, IController, EventType } from '@/types';

export class Content implements ContentView {
  canvas: HTMLCanvasElement;
  protected ctx: CanvasRenderingContext2D;
  protected controller: IController;
  constructor(controller: IController, canvas: HTMLCanvasElement) {
    this.controller = controller;
    this.canvas = canvas;
    const ctx = this.canvas.getContext('2d')!;
    this.ctx = ctx;
    const size = dpr();
    this.ctx.scale(size, size);
  }
  resize(width: number, height: number) {
    resizeCanvas(this.canvas, width, height);
  }
  private clear(width: number, height: number) {
    this.ctx.clearRect(0, 0, npx(width), npx(height));
  }

  render({ changeSet, width, height }: EventType): void {
    if (!changeSet.has('contentChange')) {
      return;
    }
    const headerSize = this.controller.getHeaderSize();
    this.clear(width, height);
    const contentWidth = width - headerSize.width;
    const contentHeight = height - headerSize.height;
    this.renderGrid(contentWidth, contentHeight);
    this.renderRowsHeader(contentHeight);
    this.renderColsHeader(contentWidth);
    this.renderTriangle();
    this.renderContent(width, height);
  }
  private renderContent(width: number, height: number): void {
    const { controller } = this;
    const data = controller.getCellsContent();
    if (isEmpty(data)) {
      return;
    }
    this.ctx.save();
    const { row: rowIndex, col: colIndex } = controller.getScroll();
    for (const item of data) {
      const { row, col } = item;
      if (row < rowIndex || col < colIndex) {
        continue;
      }
      const result = controller.computeCellPosition(row, col);
      if (result.top > height || result.left > width) {
        continue;
      }

      const cellInfo = this.controller.getCell(item);
      const {
        wrapHeight = 0,
        fontSizeHeight = 0,
        textWidth = 0,
      } = renderCell(this.canvas, {
        ...cellInfo,
        ...result,
      });
      const t = Math.max(wrapHeight, fontSizeHeight);
      if (t > result.height) {
        controller.setRowHeight(row, t);
      }
      if (textWidth > result.width) {
        controller.setColWidth(col, textWidth);
      }
    }
    this.ctx.restore();
  }
  private renderTriangle(): void {
    if (isTestEnv()) {
      return;
    }
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
    const { rowCount, colCount } = this.controller.getSheetInfo();
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
    const { rowCount } = controller.getSheetInfo();
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
    const { colCount } = controller.getSheetInfo();
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
