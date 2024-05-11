import {
  dpr,
  npx,
  isCol,
  isRow,
  isSheet,
  canvasLog,
  intToColumnName,
  getThemeColor,
  headerSizeSet,
  canvasSizeSet,
  DEFAULT_LINE_WIDTH,
} from '@/util';
import {
  EventType,
  ContentView,
  CanvasOverlayPosition,
  IController,
  Point,
  IRange,
  ContentParams,
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
} from './util';
import { getHeaderStyle } from './constant';

export class MainCanvas {
  private ctx: CanvasRenderingContext2D;
  private content: ContentView;
  private controller: IController;
  private isRendering = false;
  constructor(
    controller: IController,
    canvas: HTMLCanvasElement,
    content: ContentView,
  ) {
    this.controller = controller;
    this.ctx = canvas.getContext('2d')!;
    this.content = content;
    const size = dpr();
    this.ctx.scale(size, size);
  }
  resize() {
    const size = canvasSizeSet.get();
    const { width, height } = size;
    resizeCanvas(this.ctx.canvas, width, height);
    this.content.resize();
  }
  private clear() {
    const { width, height } = canvasSizeSet.get();
    clearRect(this.ctx, 0, 0, width, height);
  }
  render = (params: EventType): void => {
    if (params.changeSet.size === 0) {
      return;
    }
    if (this.isRendering) {
      canvasLog('It is rendering');
      return;
    }
    const { changeSet } = params;
    const checkContent =
      changeSet.has('row') ||
      changeSet.has('col') ||
      changeSet.has('workbook') ||
      changeSet.has('currentSheetId') ||
      changeSet.has('cellStyle') ||
      changeSet.has('cellValue') ||
      changeSet.has('scroll');

    this.isRendering = true;
    this.clear();

    this.ctx.strokeStyle = getThemeColor('primaryColor');
    this.ctx.lineWidth = DEFAULT_LINE_WIDTH * 2;

    const { width, height } = canvasSizeSet.get();
    const headerSize = headerSizeSet.get();

    this.ctx.fillStyle = getThemeColor('white');
    const { endRow, contentHeight } = this.renderRowsHeader(height);
    const { endCol, contentWidth } = this.renderColsHeader(width);
    this.renderGrid(width - headerSize.width, height - headerSize.height);
   
    this.renderTriangle();

    this.renderMergeCell();

    this.ctx.fillStyle = getThemeColor('selectionColor');
    const result = this.renderSelection({
      endRow,
      endCol,
      contentHeight,
      contentWidth,
    });
    this.renderAntLine(result);

    if (checkContent) {
      this.content.render({ endRow, endCol, contentHeight, contentWidth });
    }
    this.ctx.drawImage(this.content.getCanvas(), 0, 0);
    this.ctx.lineWidth = DEFAULT_LINE_WIDTH * 2;
    strokeRect(this.ctx, result.left, result.top, result.width, result.height);

    this.isRendering = false;
    this.content.check();
  };

  private renderMergeCell() {
    const { controller } = this;
    const mergeCells = controller.getMergeCellList(
      controller.getCurrentSheetId(),
    );
    if (mergeCells.length === 0) {
      return;
    }
    const activeCell = controller.getActiveRange().range;
    for (const range of mergeCells) {
      if (activeCell.row === range.row && activeCell.col === range.col) {
        continue;
      }
      this.clearRect(range);
    }
  }

  private renderGrid(width: number, height: number): void {
    const { controller } = this;
    const headerSize = headerSizeSet.get();
    const { row: rowIndex, col: colIndex } = controller.getScroll();
    const { rowCount, colCount } = this.controller.getSheetInfo(
      this.controller.getCurrentSheetId(),
    )!;
    this.ctx.save();
    this.ctx.lineWidth = DEFAULT_LINE_WIDTH;
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
  private isHighlightRow(range: IRange, row: number): boolean {
    if (isSheet(range)) {
      return true;
    }
    if (isCol(range)) {
      return true;
    }
    if (row >= range.row && row < range.row + range.rowCount) {
      return true;
    }
    return false;
  }

  private isHighlightCol(range: IRange, col: number): boolean {
    if (isSheet(range)) {
      return true;
    }

    if (isRow(range)) {
      return true;
    }
    if (col >= range.col && col < range.col + range.colCount) {
      return true;
    }
    return false;
  }
  private renderRowsHeader(height: number) {
    const { controller } = this;
    const { row: rowIndex } = controller.getScroll();
    const headerSize = headerSizeSet.get();
    const { rowCount } = controller.getSheetInfo(
      controller.getCurrentSheetId(),
    )!;
    this.ctx.save();
    const range = controller.getActiveRange().range;
    fillRect(this.ctx, 0, headerSize.height, headerSize.width, height);
    Object.assign(this.ctx, getHeaderStyle());
    const pointList: Point[] = [];
    let y = headerSize.height;
    let i = rowIndex;

    for (; i < rowCount && y < height; i++) {
      const rowHeight = controller.getRowHeight(i).len;
      let temp = y;
      if (i === rowIndex) {
        temp += DEFAULT_LINE_WIDTH / 2;
      }
      pointList.push([0, temp], [headerSize.width, temp]);
      if (rowHeight > 0) {
        const check = this.isHighlightRow(range, i);
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
    const contentHeight = i >= rowCount ? y : height;

    return { endRow: i, contentHeight: Math.floor(contentHeight) };
  }
  private renderColsHeader(width: number) {
    const { controller } = this;

    const { col: colIndex } = controller.getScroll();
    const headerSize = headerSizeSet.get();
    const { colCount } = controller.getSheetInfo(
      controller.getCurrentSheetId(),
    )!;
    const range = this.controller.getActiveRange().range;
    const pointList: Point[] = [];
    this.ctx.save();
    fillRect(this.ctx, headerSize.width, 0, width, headerSize.height);
    Object.assign(this.ctx, getHeaderStyle());

    let x = headerSize.width;
    let i = colIndex;
    for (; i < colCount && x <= width; i++) {
      const colWidth = controller.getColWidth(i).len;
      let temp = x;
      if (i === colIndex) {
        temp += DEFAULT_LINE_WIDTH / 2;
      }
      pointList.push([temp, 0], [temp, headerSize.height]);
      if (colWidth > 0) {
        const check = this.isHighlightCol(range, i);
        this.ctx.fillStyle = check
          ? getThemeColor('primaryColor')
          : getThemeColor('black');
        fillText(
          this.ctx,
          intToColumnName(i),
          temp + colWidth / 2,
          headerSize.height / 2,
        );
      }
      x += colWidth;
    }
    pointList.push([x, 0], [x, headerSize.height]);
    pointList.push([0, 0], [x, 0]);
    drawLines(this.ctx, pointList);
    this.ctx.restore();
    const contentWidth = i >= colCount ? x : width;
    return {
      endCol: i,
      contentWidth: Math.floor(contentWidth),
    };
  }
  private renderTriangle(): void {
    const headerSize = headerSizeSet.get();
    this.ctx.save();

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
    const range = controller.getCopyRange();
    if (!range || range.sheetId !== controller.getCurrentSheetId()) {
      return;
    }
    canvasLog('render canvas ant line');
    this.ctx.lineWidth = DEFAULT_LINE_WIDTH * 2;
    this.ctx.strokeStyle = getThemeColor('primaryColor');
    drawAntLine(
      this.ctx,
      position.left,
      position.top,
      position.width,
      position.height,
    );
  }

  private renderSelection(params: ContentParams): CanvasOverlayPosition {
    const { controller } = this;
    const range = controller.getActiveRange().range;
    canvasLog('render canvas selection');
    if (isSheet(range)) {
      const result = this.renderSelectAll(params);
      return result;
    }
    if (isCol(range)) {
      const result = this.renderSelectCol(params);
      return result;
    }
    if (isRow(range)) {
      const result = this.renderSelectRow(params);
      return result;
    }
    return this.renderSelectRange();
  }

  private renderActiveCell() {
    const { controller } = this;
    const range = controller.getActiveRange().range;
    const temp = controller.getActiveRange({
      row: range.row,
      col: range.col,
      rowCount: 1,
      colCount: 1,
      sheetId: range.sheetId,
    }).range;
    this.clearRect(temp);
  }

  private clearRect(range: IRange) {
    const { controller } = this;
    const cellSize = controller.getCellSize(range);
    if (cellSize.width <= 0 || cellSize.height <= 0) {
      return;
    }
    const activeCell = controller.computeCellPosition(range);
    const lineWidth = DEFAULT_LINE_WIDTH;
    clearRect(
      this.ctx,
      activeCell.left + lineWidth,
      activeCell.top + lineWidth,
      cellSize.width - lineWidth * 2,
      cellSize.height - lineWidth * 2,
    );
  }
  private renderSelectRange() {
    const { controller } = this;
    const headerSize = headerSizeSet.get();
    const range = controller.getActiveRange().range;

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

    // col header
    fillRect(this.ctx, activeCell.left, 0, width, headerSize.height);
    // row header
    fillRect(this.ctx, 0, activeCell.top, headerSize.width, height);
    const check = range.rowCount > 1 || range.colCount > 1;
    if (check) {
      // main
      fillRect(this.ctx, activeCell.left, activeCell.top, width, height);
    }

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
    return {
      left: activeCell.left,
      top: activeCell.top,
      width,
      height,
    };
  }
  private renderSelectAll(params: ContentParams): CanvasOverlayPosition {
    const { contentHeight, contentWidth } = params;
    const headerSize = headerSizeSet.get();
    // main
    fillRect(this.ctx, 0, 0, contentWidth, contentHeight);
    this.renderActiveCell();
    const width = contentWidth - headerSize.width;
    const height = contentHeight - headerSize.height;
    return {
      left: headerSize.width,
      top: headerSize.height,
      width,
      height,
    };
  }
  private renderSelectCol({ contentHeight }: ContentParams) {
    const { controller } = this;
    const headerSize = headerSizeSet.get();
    const range = controller.getActiveRange().range;
    const activeCell = controller.computeCellPosition(range);

    let strokeWidth = 0;
    for (
      let i = range.col, endCol = range.col + range.colCount;
      i < endCol;
      i++
    ) {
      strokeWidth += controller.getColWidth(i).len;
    }
    const realHeight = contentHeight - headerSize.height;

    // col header
    fillRect(this.ctx, activeCell.left, 0, strokeWidth, contentHeight);

    // row header
    fillRect(this.ctx, 0, activeCell.top, headerSize.width, realHeight);

    const list: Point[] = [
      [headerSize.width, headerSize.height],
      [headerSize.width, contentHeight],
    ];
    // row header highlight line
    drawLines(this.ctx, list);
    this.renderActiveCell();
    return {
      left: activeCell.left,
      top: headerSize.height,
      width: strokeWidth,
      height: realHeight,
    };
  }
  private renderSelectRow({ contentWidth }: ContentParams) {
    const { controller } = this;
    const headerSize = headerSizeSet.get();
    const range = controller.getActiveRange().range;
    const activeCell = controller.computeCellPosition(range);
    let strokeHeight = 0;
    for (
      let i = range.row, endRow = range.row + range.rowCount;
      i < endRow;
      i++
    ) {
      strokeHeight += controller.getRowHeight(i).len;
    }
    const realWidth = contentWidth - headerSize.width - DEFAULT_LINE_WIDTH;
    // col header
    fillRect(this.ctx, activeCell.left, 0, realWidth, headerSize.height);

    // row header
    fillRect(this.ctx, 0, activeCell.top, contentWidth, strokeHeight);

    const list: Point[] = [
      [activeCell.left, headerSize.height],
      [contentWidth, headerSize.height],
    ];
    // col header highlight line
    drawLines(this.ctx, list);
    this.renderActiveCell();
    return {
      left: headerSize.width,
      top: activeCell.top,
      width: realWidth,
      height: strokeHeight,
    };
  }
}
