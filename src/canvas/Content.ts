import { isEmpty } from '@/lodash';
import {
  thinLineWidth,
  npx,
  dpr,
  intToColumnName,
  isTestEnv,
  COL_TITLE_WIDTH,
  ROW_TITLE_HEIGHT,
  resizeCanvas,
} from '@/util';
import { Base } from './Base';
import theme from '@/theme';
import {
  fillRect,
  fillText,
  drawLines,
  renderCell,
  drawTriangle,
} from './util';
import { HEADER_STYLE } from './constant';

export class Content extends Base {
  render(width: number, height: number): void {
    resizeCanvas(this.canvas, width, height);
    this.ctx.clearRect(0, 0, npx(width), npx(height));
    const contentWidth = width - COL_TITLE_WIDTH;
    const contentHeight = height - ROW_TITLE_HEIGHT;
    this.renderGrid(contentWidth, contentHeight);
    this.renderRowsHeader(contentHeight);
    this.renderColsHeader(contentWidth);
    this.renderTriangle();
    this.renderContent();
  }
  private renderContent(): void {
    const { controller } = this;
    const data = controller.getCellsContent();
    if (isEmpty(data)) {
      return;
    }
    this.ctx.save();
    const { row: rowIndex, col: colIndex } = controller.getScrollRowAndCol();
    for (const item of data) {
      const { row, col } = item;
      if (row < rowIndex || col < colIndex) {
        continue;
      }
      const result = controller.computeCellPosition(row, col);
      const cellInfo = this.controller.getCell(item);
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
        controller.setRowHeight(row, height);
      }
      if (textWidth > result.width) {
        controller.setRowHeight(col, textWidth);
      }
    }
    this.ctx.restore();
  }
  private renderTriangle(): void {
    if (isTestEnv()) {
      return;
    }

    this.ctx.save();
    this.ctx.fillStyle = theme.backgroundColor;

    fillRect(this.ctx, 0, 0, COL_TITLE_WIDTH, ROW_TITLE_HEIGHT);
    this.ctx.fillStyle = theme.triangleFillColor;
    const offset = 2;
    drawTriangle(
      this.ctx,
      {
        x: COL_TITLE_WIDTH / 2 - offset,
        y: ROW_TITLE_HEIGHT - offset,
      },
      {
        x: COL_TITLE_WIDTH - offset,
        y: ROW_TITLE_HEIGHT - offset,
      },
      {
        x: COL_TITLE_WIDTH - offset,
        y: offset,
      },
    );

    this.ctx.restore();
  }

  private renderGrid(width: number, height: number): void {
    const { controller } = this;
    const { row: rowIndex, col: colIndex } = controller.getScrollRowAndCol();
    const { rowCount, colCount } = this.controller.getSheetInfo();
    const lineWidth = thinLineWidth();
    this.ctx.save();
    this.ctx.fillStyle = theme.white;
    this.ctx.lineWidth = lineWidth;
    this.ctx.strokeStyle = theme.gridStrokeColor;
    this.ctx.translate(npx(COL_TITLE_WIDTH), npx(ROW_TITLE_HEIGHT));
    const pointList: Array<[x: number, y: number]> = [];
    let y = 0;
    let x = 0;
    for (let i = rowIndex; i <= rowCount; i++) {
      pointList.push([0, y], [width, y]);
      y += controller.getRowHeight(i);
      if (y > height) {
        break;
      }
    }
    for (let i = colIndex; i <= colCount; i++) {
      pointList.push([x, 0], [x, y]);
      x += controller.getColWidth(i);
      if (x > width) {
        break;
      }
    }
    pointList.push([0, height], [width, height], [width, 0], [width, height]);
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
    const { row: rowIndex } = controller.getScrollRowAndCol();

    const { rowCount } = controller.getSheetInfo();
    this.ctx.save();
    this.ctx.fillStyle = theme.backgroundColor;
    fillRect(this.ctx, 0, ROW_TITLE_HEIGHT, COL_TITLE_WIDTH, height);
    Object.assign(this.ctx, HEADER_STYLE);
    const pointList: Array<[x: number, y: number]> = [];
    let y = ROW_TITLE_HEIGHT;
    let i = rowIndex;

    for (; i < rowCount; i++) {
      const rowHeight = controller.getRowHeight(i);
      let temp = y;
      if (i === rowIndex) {
        temp += thinLineWidth() / 2;
      }
      pointList.push([0, temp], [COL_TITLE_WIDTH, temp]);
      this.fillRowText(i + 1, COL_TITLE_WIDTH, temp + rowHeight / 2);
      y += rowHeight;
      if (y > height) {
        break;
      }
    }
    this.fillRowText(
      i + 1,
      COL_TITLE_WIDTH,
      y + controller.getRowHeight(i) / 2,
    );
    pointList.push([0, y], [COL_TITLE_WIDTH, y], [0, 0], [0, y]);
    drawLines(this.ctx, pointList);
    this.ctx.restore();
  }
  private renderColsHeader(width: number): void {
    const { controller } = this;

    const { col: colIndex } = controller.getScrollRowAndCol();
    const { colCount } = controller.getSheetInfo();
    const pointList: Array<[x: number, y: number]> = [];
    this.ctx.save();
    this.ctx.fillStyle = theme.backgroundColor;
    fillRect(this.ctx, COL_TITLE_WIDTH, 0, width, ROW_TITLE_HEIGHT);
    Object.assign(this.ctx, HEADER_STYLE);

    let x = COL_TITLE_WIDTH;
    let i = colIndex;
    for (; i < colCount; i++) {
      const colWidth = controller.getColWidth(i);
      let temp = x;
      if (i === colIndex) {
        temp += thinLineWidth() / 2;
      }
      pointList.push([temp, 0], [temp, ROW_TITLE_HEIGHT]);
      this.fillColText(
        intToColumnName(i),
        temp + colWidth / 2,
        ROW_TITLE_HEIGHT,
      );
      x += colWidth;
      if (x > width) {
        break;
      }
    }
    this.fillColText(
      intToColumnName(i),
      x + controller.getColWidth(i) / 2,
      ROW_TITLE_HEIGHT,
    );
    pointList.push([x, 0], [x, ROW_TITLE_HEIGHT], [0, 0], [x, 0]);
    drawLines(this.ctx, pointList);
    this.ctx.restore();
  }
}
