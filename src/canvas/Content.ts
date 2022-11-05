import { isEmpty } from '@/lodash';
import { thinLineWidth, npx, dpr, intToColumnName } from '@/util';
import { Base } from './Base';
import theme from '@/theme';
import {
  fillRect,
  fillText,
  drawLines,
  renderCell,
  resizeCanvas,
} from './util';
import { HEADER_STYLE } from './constant';

export class Content extends Base {
  render(width: number, height: number): void {
    resizeCanvas(this.canvas, width, height);
    this.renderGrid();
    this.renderRowsHeader();
    this.renderColsHeader();
    this.renderTriangle();
    this.renderContent();
  }
  protected renderContent(): void {
    const { controller, renderController } = this;
    // const { model, renderController } = controller;
    const data = controller.getCellsContent();
    if (isEmpty(data)) {
      return;
    }
    this.ctx.save();
    for (const item of data) {
      const { row, col } = item;
      const result = renderController.queryCell(row, col);
      const cellInfo = this.controller.queryCell(item);
      const {
        wrapHeight = 0,
        fontSizeHeight = 0,
        textWidth = 0,
      } = renderCell(this.canvas, {
        ...cellInfo,
        ...result,
      });
      const height = Math.max(wrapHeight, fontSizeHeight);
      if (height > result.height) {
        console.log('height', height);
        renderController.setRowHeight(row, height);
      }
      if (textWidth > result.width) {
        console.log('col', textWidth);
        renderController.setRowHeight(col, textWidth);
      }
    }
    this.ctx.restore();
  }
  protected renderTriangle(): void {
    const { renderController } = this;

    const config = renderController.getHeaderSize();
    const offset = 2;
    const path = new Path2D();
    path.moveTo(npx(config.width / 2 - offset), npx(config.height - offset));
    path.lineTo(npx(config.width - offset), npx(config.height - offset));
    path.lineTo(npx(config.width - offset), npx(offset));

    this.ctx.save();
    this.ctx.fillStyle = theme.backgroundColor;

    fillRect(this.ctx, 0, 0, config.width, config.height);
    this.ctx.fillStyle = theme.triangleFillColor;
    this.ctx.fill(path);
    this.ctx.restore();
  }

  protected renderGrid(): void {
    const { controller } = this;
    const { renderController } = this;
    const rowIndex = controller.getRowIndex();
    const colIndex = controller.getColIndex();
    const { rowCount, colCount } = this.controller.getSheetInfo();
    const config = renderController.getHeaderSize();
    const { width, height } = renderController.getDrawSize();
    const lineWidth = thinLineWidth();
    this.ctx.save();
    this.ctx.fillStyle = theme.white;
    this.ctx.lineWidth = lineWidth;
    this.ctx.strokeStyle = theme.gridStrokeColor;
    this.ctx.translate(npx(config.width), npx(config.height));
    const pointList: Array<[x: number, y: number]> = [];
    let y = 0;
    let x = 0;
    for (let i = rowIndex; i <= rowCount; i++) {
      pointList.push([0, y], [width, y]);
      y += renderController.getRowHeight(i);
      if (y > height) {
        break;
      }
    }
    for (let i = colIndex; i <= colCount; i++) {
      pointList.push([x, 0], [x, y]);
      x += renderController.getColWidth(i);
      if (x > width) {
        break;
      }
    }
    pointList.push([0, height], [width, height], [width, 0], [width, height]);
    drawLines(this.ctx, pointList);
    this.ctx.restore();
  }
  fillRowText(row: number, rowWidth: number, y: number): void {
    this.ctx.fillStyle = theme.black;
    fillText(this.ctx, String(row), rowWidth / 2, y);
  }

  fillColText(colText: string, x: number, colHeight: number): void {
    this.ctx.fillStyle = theme.black;
    fillText(this.ctx, colText, x, colHeight / 2 + dpr());
  }
  protected renderRowsHeader(): void {
    const { renderController, controller } = this;
    const rowIndex = controller.getRowIndex();

    const { rowCount } = controller.getSheetInfo();
    const config = renderController.getHeaderSize();
    const { height } = renderController.getDrawSize();
    this.ctx.save();
    this.ctx.fillStyle = theme.backgroundColor;
    fillRect(this.ctx, 0, config.height, config.width, height);
    Object.assign(this.ctx, HEADER_STYLE);
    const pointList: Array<[x: number, y: number]> = [];
    let y = config.height;
    let i = rowIndex;

    for (; i < rowCount; i++) {
      const rowHeight = renderController.getRowHeight(i);
      let temp = y;
      if (i === rowIndex) {
        temp += thinLineWidth() / 2;
      }
      pointList.push([0, temp], [config.width, temp]);
      this.fillRowText(i + 1, config.width, temp + rowHeight / 2);
      y += rowHeight;
      if (y > height) {
        break;
      }
    }
    this.fillRowText(
      i + 1,
      config.width,
      y + renderController.getRowHeight(i) / 2,
    );
    pointList.push([0, y], [config.width, y], [0, 0], [0, y]);
    drawLines(this.ctx, pointList);
    this.ctx.restore();
  }
  protected renderColsHeader(): void {
    const { renderController, controller } = this;

    const colIndex = controller.getColIndex();
    const { colCount } = controller.getSheetInfo();
    const config = renderController.getHeaderSize();
    const { width } = renderController.getDrawSize();
    const pointList: Array<[x: number, y: number]> = [];
    this.ctx.save();
    this.ctx.fillStyle = theme.backgroundColor;
    fillRect(this.ctx, config.width, 0, width, config.height);
    Object.assign(this.ctx, HEADER_STYLE);

    let x = config.width;
    let i = colIndex;
    for (; i < colCount; i++) {
      const colWidth = renderController.getColWidth(i);
      let temp = x;
      if (i === colIndex) {
        temp += thinLineWidth() / 2;
      }
      pointList.push([temp, 0], [temp, config.height]);
      this.fillColText(intToColumnName(i), temp + colWidth / 2, config.height);
      x += colWidth;
      if (x > width) {
        break;
      }
    }
    this.fillColText(
      intToColumnName(i),
      x + renderController.getColWidth(i) / 2,
      config.height,
    );
    pointList.push([x, 0], [x, config.height], [0, 0], [x, 0]);
    drawLines(this.ctx, pointList);
    this.ctx.restore();
  }
}
