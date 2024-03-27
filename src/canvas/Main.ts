import {
  dpr,
  npx,
  isCol,
  isRow,
  isSheet,
  canvasLog,
  thinLineWidth,
  intToColumnName,
  containRange,
  getThemeColor,
} from '@/util';
import {
  EventType,
  ContentView,
  CanvasOverlayPosition,
  IController,
  Point,
  IRange,
} from '@/types';
import {
  fillRect,
  strokeRect,
  drawLines,
  drawTriangle,
  clearRect,
  drawAntLine,
  resizeCanvas,
  fillText,
  renderCellData,
} from './util';
import { getHeaderStyle } from './constant';

export class MainCanvas {
  private ctx: CanvasRenderingContext2D;
  private content: ContentView;
  private controller: IController;
  private isRendering = false;
  constructor(controller: IController, content: ContentView) {
    const canvas = controller.getMainDom().canvas!;
    this.controller = controller;
    this.ctx = canvas.getContext('2d')!;
    this.content = content;
    const size = dpr();
    this.ctx.scale(size, size);
  }
  resize() {
    const size = this.controller.getDomRect();
    const { width, height } = size;
    resizeCanvas(this.ctx.canvas, width, height);
    this.content.resize();
  }
  private clear() {
    const { width, height } = this.controller.getDomRect();
    this.ctx.clearRect(0, 0, npx(width), npx(height));
  }
  render = (params: EventType) => {
    if (params.changeSet.size === 0) {
      return;
    }
    if (this.isRendering) {
      canvasLog('It is rendering');
      return;
    }
    this.isRendering = true;
    this.content.render(params);
    this.clear();

    this.ctx.drawImage(this.content.getCanvas(), 0, 0);

    const { width, height } = this.controller.getDomRect();
    const headerSize = this.controller.getHeaderSize();
    const realContentHeight = this.renderRowsHeader(height);
    const realContentWidth = this.renderColsHeader(width);
    this.renderGrid(width - headerSize.width, height - headerSize.height);

    this.renderTriangle();

    const result = this.renderSelection(realContentWidth, realContentHeight);
    this.renderAntLine(result);

    this.renderMergeCell();

    this.isRendering = false;
  };

  private renderMergeCell() {
    const { controller } = this;
    const range = controller.getActiveCell();
    const mergeCells = controller.getMergeCells(controller.getCurrentSheetId());
    if (mergeCells.length === 0) {
      return;
    }
    for (const item of mergeCells) {
      const position = controller.computeCellPosition(item);
      const size = controller.getCellSize(item);
      if (size.width <= 0 || size.height <= 0) {
        continue;
      }
      // clear merge cell area
      clearRect(this.ctx, position.left, position.top, size.width, size.height);
      // render content
      renderCellData(controller, this.ctx, item.row, item.col);
      if (isSheet(range) || isRow(range) || isCol(range)) {
        continue;
      }
      if (containRange(range.row, range.col, item)) {
        this.ctx.strokeStyle = getThemeColor('primaryColor');
        this.ctx.lineWidth = dpr();
        // highlight line
        strokeRect(
          this.ctx,
          position.left,
          position.top,
          size.width,
          size.height,
        );
      }
    }
  }

  private renderGrid(width: number, height: number): void {
    const { controller } = this;
    const headerSize = controller.getHeaderSize();
    const { row: rowIndex, col: colIndex } = controller.getScroll();
    const { rowCount, colCount } = this.controller.getSheetInfo(
      this.controller.getCurrentSheetId(),
    )!;
    const lineWidth = thinLineWidth();
    this.ctx.save();
    this.ctx.fillStyle = getThemeColor('white');
    this.ctx.lineWidth = lineWidth;
    this.ctx.strokeStyle = getThemeColor('borderColor');
    this.ctx.translate(npx(headerSize.width), npx(headerSize.height));
    const pointList: Point[] = [];
    let y = 0;
    let x = 0;
    let maxX = 0;
    for (let i = colIndex; i < colCount; i++) {
      maxX += controller.getColWidth(i).len;
      if (maxX > width) {
        break;
      }
    }
    const realWidth = Math.min(maxX, width);
    let skip = false;
    for (let i = rowIndex; i < rowCount; i++) {
      if (!skip) {
        pointList.push([0, y], [realWidth, y]);
      } else {
        skip = false;
      }
      const h = controller.getRowHeight(i).len;
      if (h === 0) {
        skip = true;
      }
      y += h;
      if (y > height) {
        break;
      }
    }
    for (let i = colIndex; i < colCount; i++) {
      if (!skip) {
        pointList.push([x, 0], [x, y]);
      } else {
        skip = false;
      }
      const w = controller.getColWidth(i).len;
      if (w === 0) {
        skip = true;
      }
      x += w;
      if (x > realWidth) {
        break;
      }
    }
    pointList.push([0, y], [x, y]);
    pointList.push([x, 0], [x, y]);
    drawLines(this.ctx, pointList);
    this.ctx.restore();
  }
  private isHighlightRow(
    mergeCells: IRange[],
    range: IRange,
    row: number,
  ): boolean {
    if (isSheet(range)) {
      return true;
    }
    if (isCol(range)) {
      return true;
    }
    if (row >= range.row && row < range.row + range.rowCount) {
      return true;
    }
    return mergeCells.some((v) => row >= v.row && row < v.row + v.rowCount);
  }

  private isHighlightCol(
    mergeCells: IRange[],
    range: IRange,
    col: number,
  ): boolean {
    if (isSheet(range)) {
      return true;
    }

    if (isRow(range)) {
      return true;
    }
    if (col >= range.col && col < range.col + range.colCount) {
      return true;
    }
    return mergeCells.some((v) => col >= v.col && col < v.col + v.colCount);
  }
  private renderRowsHeader(height: number) {
    const { controller } = this;
    const { row: rowIndex } = controller.getScroll();
    const headerSize = controller.getHeaderSize();
    const { rowCount } = controller.getSheetInfo(
      controller.getCurrentSheetId(),
    )!;
    const mergeCells = controller.getMergeCells(controller.getCurrentSheetId());
    this.ctx.save();
    const range = this.controller.getActiveCell();
    this.ctx.fillStyle = getThemeColor('white');
    fillRect(this.ctx, 0, headerSize.height, headerSize.width, height);
    Object.assign(this.ctx, getHeaderStyle());
    const pointList: Point[] = [];
    let y = headerSize.height;
    let i = rowIndex;

    for (; i < rowCount && y < height; i++) {
      const rowHeight = controller.getRowHeight(i).len;
      let temp = y;
      if (i === rowIndex) {
        temp += thinLineWidth() / 2;
      }
      pointList.push([0, temp], [headerSize.width, temp]);
      if (rowHeight > 0) {
        const check = this.isHighlightRow(mergeCells, range, i);
        this.ctx.fillStyle = check
          ? getThemeColor('primaryColor')
          : getThemeColor('black');

        fillText(
          this.ctx,
          String(i + 1),
          headerSize.width / 2,
          temp + rowHeight / 2,
        );
      }
      y += rowHeight;
    }
    pointList.push([0, y], [headerSize.width, y]);
    pointList.push([0, 0], [0, y]);
    drawLines(this.ctx, pointList);
    this.ctx.restore();
    return i >= rowCount ? y : height;
  }
  private renderColsHeader(width: number) {
    const { controller } = this;

    const { col: colIndex } = controller.getScroll();
    const headerSize = controller.getHeaderSize();
    const { colCount } = controller.getSheetInfo(
      controller.getCurrentSheetId(),
    )!;
    const mergeCells = controller.getMergeCells(controller.getCurrentSheetId());
    const range = this.controller.getActiveCell();
    const pointList: Point[] = [];
    this.ctx.save();
    this.ctx.fillStyle = getThemeColor('white');
    fillRect(this.ctx, headerSize.width, 0, width, headerSize.height);
    Object.assign(this.ctx, getHeaderStyle());

    let x = headerSize.width;
    let i = colIndex;
    for (; i < colCount && x <= width; i++) {
      const colWidth = controller.getColWidth(i).len;
      let temp = x;
      if (i === colIndex) {
        temp += thinLineWidth() / 2;
      }
      pointList.push([temp, 0], [temp, headerSize.height]);
      if (colWidth > 0) {
        const check = this.isHighlightCol(mergeCells, range, i);
        this.ctx.fillStyle = check
          ? getThemeColor('primaryColor')
          : getThemeColor('black');
        fillText(
          this.ctx,
          intToColumnName(i),
          temp + colWidth / 2,
          headerSize.height / 2 + dpr(),
        );
      }
      x += colWidth;
    }
    pointList.push([x, 0], [x, headerSize.height]);
    pointList.push([0, 0], [x, 0]);
    drawLines(this.ctx, pointList);
    this.ctx.restore();
    return i >= colCount ? x : width;
  }
  private renderTriangle(): void {
    const headerSize = this.controller.getHeaderSize();
    this.ctx.save();
    this.ctx.fillStyle = getThemeColor('white');

    fillRect(this.ctx, 0, 0, headerSize.width, headerSize.height);
    this.ctx.fillStyle = getThemeColor('triangleFillColor');

    const offset = 2;
    const minY = Math.floor(offset);
    const maxY = Math.floor(headerSize.height - offset);
    const minX = Math.floor(headerSize.width * 0.4);
    const maxX = Math.floor(headerSize.width - offset);

    drawTriangle(this.ctx, [maxX, minY], [minX, maxY], [maxX, maxY]);

    this.ctx.restore();
  }
  private renderAntLine(position: CanvasOverlayPosition) {
    const { controller } = this;
    const ranges = controller.getCopyRanges();
    if (ranges.length === 0) {
      return;
    }
    const [range] = ranges;
    if (range.sheetId !== controller.getCurrentSheetId()) {
      return;
    }
    canvasLog('render canvas ant line');
    this.ctx.strokeStyle = getThemeColor('primaryColor');
    this.ctx.lineWidth = dpr();
    drawAntLine(
      this.ctx,
      position.left,
      position.top,
      position.width,
      position.height,
    );
  }

  private renderSelection(
    contentWith: number,
    contentHeight: number,
  ): CanvasOverlayPosition {
    const { controller } = this;
    const range = controller.getActiveCell();
    canvasLog('render canvas selection');
    if (isSheet(range)) {
      const result = this.renderSelectAll(contentWith, contentHeight);
      return result;
    }
    if (isCol(range)) {
      const result = this.renderSelectCol(contentHeight);
      return result;
    }
    if (isRow(range)) {
      const result = this.renderSelectRow(contentWith);
      return result;
    }
    return this.renderSelectRange();
  }

  private renderActiveCell() {
    const { controller } = this;
    const range = controller.getActiveCell();
    if (range.rowCount === range.colCount && range.rowCount === 1) {
      return;
    }
    const temp = {
      row: range.row,
      col: range.col,
      rowCount: 1,
      colCount: 1,
      sheetId: '',
    };
    const activeCell = controller.computeCellPosition(temp);
    const cellSize = controller.getCellSize(temp);
    clearRect(
      this.ctx,
      activeCell.left,
      activeCell.top,
      cellSize.width,
      cellSize.height,
    );
    renderCellData(controller, this.ctx, range.row, range.col);
  }
  private renderSelectRange() {
    const { controller } = this;
    const headerSize = controller.getHeaderSize();
    const range = controller.getActiveCell();

    const activeCell = controller.computeCellPosition({
      row: range.row,
      col: range.col,
      rowCount: 1,
      colCount: 1,
      sheetId: '',
    });
    const endCellRow = range.row + range.rowCount - 1;
    const endCellCol = range.col + range.colCount - 1;

    const temp = {
      row: endCellRow,
      col: endCellCol,
      rowCount: 1,
      colCount: 1,
      sheetId: '',
    };
    const endCell = controller.computeCellPosition(temp);
    const endCellSize = controller.getCellSize(temp);
    const width = endCell.left + endCellSize.width - activeCell.left;
    const height = endCell.top + endCellSize.height - activeCell.top;

    this.ctx.fillStyle = getThemeColor('selectionColor');

    // col header
    fillRect(this.ctx, activeCell.left, 0, width, headerSize.height);
    // row header
    fillRect(this.ctx, 0, activeCell.top, headerSize.width, height);
    const check = range.rowCount > 1 || range.colCount > 1;
    if (check) {
      // main
      fillRect(this.ctx, activeCell.left, activeCell.top, width, height);
    }

    this.ctx.strokeStyle = getThemeColor('primaryColor');
    this.ctx.lineWidth = dpr();

    const list: Point[] = [
      [activeCell.left, headerSize.height],
      [activeCell.left + width, headerSize.height],
    ];
    list.push(
      [headerSize.width, activeCell.top],
      [headerSize.width, activeCell.top + height],
    );
    drawLines(this.ctx, list);
    if (check) {
      this.renderActiveCell();
    }
    // highlight line
    strokeRect(this.ctx, activeCell.left, activeCell.top, width, height);
    return {
      left: activeCell.left,
      top: activeCell.top,
      width,
      height,
    };
  }
  private renderSelectAll(
    contentWith: number,
    contentHeight: number,
  ): CanvasOverlayPosition {
    const { controller } = this;
    this.ctx.fillStyle = getThemeColor('selectionColor');
    const headerSize = controller.getHeaderSize();
    // main
    fillRect(this.ctx, 0, 0, contentWith, contentHeight);

    this.ctx.strokeStyle = getThemeColor('primaryColor');
    this.ctx.lineWidth = dpr();
    this.renderActiveCell();
    const width = contentWith - headerSize.width;
    const height = contentHeight - headerSize.height - thinLineWidth();
    // highlight line
    strokeRect(this.ctx, headerSize.width, headerSize.height, width, height);
    return {
      left: headerSize.width,
      top: headerSize.height,
      width,
      height,
    };
  }
  private renderSelectCol(height: number) {
    const { controller } = this;
    const headerSize = controller.getHeaderSize();
    const range = controller.getActiveCell();
    this.ctx.fillStyle = getThemeColor('selectionColor');
    const activeCell = controller.computeCellPosition({
      row: range.row,
      col: range.col,
      colCount: 1,
      rowCount: 1,
      sheetId: '',
    });

    let strokeWidth = 0;
    for (
      let i = range.col, endCol = range.col + range.colCount;
      i < endCol;
      i++
    ) {
      strokeWidth += controller.getColWidth(i).len;
    }
    const realHeight = height - headerSize.height - thinLineWidth();

    // col header
    fillRect(this.ctx, activeCell.left, 0, strokeWidth, headerSize.height);

    // row header
    fillRect(this.ctx, 0, activeCell.top, headerSize.width, realHeight);

    // main
    fillRect(
      this.ctx,
      activeCell.left,
      activeCell.top,
      strokeWidth,
      realHeight,
    );

    this.ctx.strokeStyle = getThemeColor('primaryColor');
    this.ctx.lineWidth = dpr();

    const list: Point[] = [
      [headerSize.width, headerSize.height],
      [headerSize.width, height],
    ];
    drawLines(this.ctx, list);
    this.renderActiveCell();
    // highlight line
    strokeRect(
      this.ctx,
      activeCell.left,
      activeCell.top,
      strokeWidth,
      realHeight,
    );
    return {
      left: activeCell.left,
      top: activeCell.top,
      width: strokeWidth,
      height: realHeight,
    };
  }
  private renderSelectRow(width: number) {
    const { controller } = this;
    const headerSize = controller.getHeaderSize();
    const range = controller.getActiveCell();
    this.ctx.fillStyle = getThemeColor('selectionColor');
    const activeCell = controller.computeCellPosition({
      row: range.row,
      col: range.col,
      colCount: 1,
      rowCount: 1,
      sheetId: '',
    });
    let strokeHeight = 0;
    for (
      let i = range.row, endRow = range.row + range.rowCount;
      i < endRow;
      i++
    ) {
      strokeHeight += controller.getRowHeight(i).len;
    }
    const realWidth = width - headerSize.width - thinLineWidth();
    // col header
    fillRect(this.ctx, activeCell.left, 0, realWidth, headerSize.height);
    // row header
    fillRect(this.ctx, 0, activeCell.top, headerSize.width, strokeHeight);

    // main
    fillRect(
      this.ctx,
      activeCell.left,
      activeCell.top,
      realWidth,
      strokeHeight,
    );

    this.ctx.strokeStyle = getThemeColor('primaryColor');
    this.ctx.lineWidth = dpr();
    const list: Point[] = [
      [activeCell.left, headerSize.height],
      [width, headerSize.height],
    ];
    drawLines(this.ctx, list);
    this.renderActiveCell();
    // highlight line
    strokeRect(
      this.ctx,
      activeCell.left,
      activeCell.top,
      realWidth,
      strokeHeight,
    );
    return {
      left: activeCell.left,
      top: activeCell.top,
      width: realWidth,
      height: strokeHeight,
    };
  }
}
