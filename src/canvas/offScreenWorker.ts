import {
  RequestRender,
  Point,
  IRange,
  CanvasOverlayPosition,
  IPosition,
  IWindowSize,
  WorkerMainView,
  ContentParams,
} from '@/types';
import {
  clearRect,
  fillRect,
  strokeRect,
  fillText,
  drawLines,
  drawTriangle,
  drawAntLine,
  renderBorderItem,
  renderCell,
} from './util';
import { getThemeColor } from '@/theme';
import {
  DEFAULT_LINE_WIDTH,
  CELL_HEIGHT,
  CELL_WIDTH,
  HIDE_CELL,
  BORDER_TYPE_MAP,
} from '@/util/constant';
import { getHeaderStyle } from './constant';
import { intToColumnName } from '@/util/convert';
import { isSheet, isCol, isRow, containRange } from '@/util/range';
import { npx, dpr } from '@/util/dpr';
import { getCustomWidthOrHeightKey, coordinateToString } from '@/util/util';

const lineWidth = Math.max(...Object.values(BORDER_TYPE_MAP));

/**
 * run OffScreenWorker in Web Worker env
 */
export class OffScreenWorker implements WorkerMainView {
  private canvas: OffscreenCanvas;
  private ctx: OffscreenCanvasRenderingContext2D;
  private width: number = 0;
  private height: number = 0;
  private isRendering = false;
  private rowMap: Record<string, number> = {};
  private colMap: Record<string, number> = {};
  private eventData: Omit<RequestRender, 'status' | 'changeSet'> = {
    theme: 'light',
    sheetData: {},
    canvasSize: {
      top: 0,
      left: 0,
      width: 0,
      height: 0,
    },
    headerSize: {
      width: 0,
      height: 0,
    },
    currentSheetInfo: {
      isHide: false,
      rowCount: 0,
      colCount: 0,
      name: '',
      sheetId: '',
      tabColor: '',
      sort: 1,
    },
    scroll: {
      left: 0,
      top: 0,
      row: 0,
      col: 0,
      scrollLeft: 0,
      scrollTop: 0,
    },
    range: {
      row: 0,
      col: 0,
      rowCount: 1,
      colCount: 1,
      sheetId: '',
    },
    copyRange: undefined,
    customHeight: {},
    customWidth: {},
    currentMergeCells: [],
  };
  constructor(canvas: OffscreenCanvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    const size = dpr();
    this.ctx.scale(size, size);
  }
  render(data: RequestRender) {
    if (data.changeSet.size === 0) {
      return;
    }
    if (this.isRendering) {
      return;
    }
    this.isRendering = true;
    this.eventData = data;
    this.clear();
    const { ctx } = this;
    ctx.strokeStyle = getThemeColor('primaryColor', data.theme);
    ctx.fillStyle = getThemeColor('white', data.theme);
    ctx.lineWidth = DEFAULT_LINE_WIDTH * 2;

    const { width, height } = this.eventData.canvasSize;
    const headerSize = this.eventData.headerSize;
    const { endRow, contentHeight } = this.renderRowsHeader(height);
    const { endCol, contentWidth } = this.renderColsHeader(width);
    this.renderGrid(width - headerSize.width, height - headerSize.height);
    this.renderTriangle();

    this.renderMergeCell();

    this.ctx.fillStyle = getThemeColor('selectionColor', this.eventData.theme);
    const result = this.renderSelection({
      endRow,
      endCol,
      contentHeight,
      contentWidth,
    });
    this.renderAntLine(result);
    this.renderContent({ endRow, endCol, contentHeight, contentWidth });
    this.ctx.lineWidth = lineWidth;
    strokeRect(this.ctx, result.left, result.top, result.width, result.height);
    this.isRendering = false;
    return { rowMap: this.rowMap, colMap: this.colMap };
  }
  resize(data: IWindowSize) {
    this.width = data.width;
    this.height = data.height;
    this.canvas.width = npx(data.width);
    this.canvas.height = npx(data.height);
  }
  private clear() {
    clearRect(this.ctx, 0, 0, this.width, this.height);
  }

  private renderRowsHeader(height: number) {
    const { row: rowIndex } = this.eventData.scroll;
    const headerSize = this.eventData.headerSize;
    const { rowCount } = this.eventData.currentSheetInfo;
    this.ctx.save();
    const range = this.eventData.range;
    fillRect(this.ctx, 0, headerSize.height, headerSize.width, height);
    Object.assign(this.ctx, getHeaderStyle(this.eventData.theme));
    const pointList: Point[] = [];
    let y = headerSize.height;
    let i = rowIndex;

    for (; i < rowCount && y < height; i++) {
      const rowHeight = this.getRowHeight(i);
      let temp = y;
      if (i === rowIndex) {
        temp += DEFAULT_LINE_WIDTH / 2;
      }
      pointList.push([0, temp], [headerSize.width, temp]);
      if (rowHeight > 0) {
        const check = this.isHighlightRow(range, i);
        this.ctx.fillStyle = check
          ? getThemeColor('primaryColor', this.eventData.theme)
          : getThemeColor('black', this.eventData.theme);

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
    const { col: colIndex } = this.eventData.scroll;
    const headerSize = this.eventData.headerSize;
    const { colCount } = this.eventData.currentSheetInfo;
    const range = this.eventData.range;
    const pointList: Point[] = [];
    this.ctx.save();
    fillRect(this.ctx, headerSize.width, 0, width, headerSize.height);
    Object.assign(this.ctx, getHeaderStyle());

    let x = headerSize.width;
    let i = colIndex;
    for (; i < colCount && x <= width; i++) {
      const colWidth = this.getColWidth(i);
      let temp = x;
      if (i === colIndex) {
        temp += DEFAULT_LINE_WIDTH / 2;
      }
      pointList.push([temp, 0], [temp, headerSize.height]);
      if (colWidth > 0) {
        const check = this.isHighlightCol(range, i);
        this.ctx.fillStyle = check
          ? getThemeColor('primaryColor', this.eventData.theme)
          : getThemeColor('black', this.eventData.theme);
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
  private renderGrid(width: number, height: number): void {
    const headerSize = this.eventData.headerSize;
    const { row: rowIndex, col: colIndex } = this.eventData.scroll;
    const { rowCount, colCount } = this.eventData.currentSheetInfo;
    this.ctx.save();
    this.ctx.lineWidth = DEFAULT_LINE_WIDTH;
    this.ctx.strokeStyle = getThemeColor('borderColor', this.eventData.theme);
    this.ctx.translate(npx(headerSize.width), npx(headerSize.height));
    const pointList: Point[] = [];
    let y = 0;
    let x = 0;
    for (let i = rowIndex; i < rowCount && y <= height; i++) {
      while (i < rowCount && this.getRowHeight(i) === 0) {
        i++;
      }
      pointList.push([0, y], [width, y]);
      const h = this.getRowHeight(i);
      y += h;
    }
    for (let i = colIndex; i < colCount && x <= width; i++) {
      while (i < colCount && this.getColWidth(i) === 0) {
        i++;
      }
      pointList.push([x, 0], [x, y]);
      const w = this.getColWidth(i);
      x += w;
    }
    pointList.push([0, y], [x, y]);
    pointList.push([x, 0], [x, y]);
    drawLines(this.ctx, pointList);
    this.ctx.restore();
  }
  private renderTriangle(): void {
    const headerSize = this.eventData.headerSize;
    this.ctx.save();

    fillRect(this.ctx, 0, 0, headerSize.width, headerSize.height);
    this.ctx.fillStyle = getThemeColor(
      'triangleFillColor',
      this.eventData.theme,
    );

    const offset = 2;
    const minY = Math.floor(offset);
    const maxY = Math.floor(headerSize.height - offset);
    const minX = Math.floor(headerSize.width * 0.4);
    const maxX = Math.floor(headerSize.width - offset);

    drawTriangle(this.ctx, [maxX, minY], [minX, maxY], [maxX, maxY]);

    this.ctx.restore();
  }
  private getRowHeight(row: number) {
    const key = getCustomWidthOrHeightKey(
      this.eventData.currentSheetInfo.sheetId,
      row,
    );
    const data = this.eventData.customHeight[key];
    if (!data) {
      return CELL_HEIGHT;
    }
    return data.isHide ? HIDE_CELL : data.len;
  }
  private getColWidth(col: number) {
    const key = getCustomWidthOrHeightKey(
      this.eventData.currentSheetInfo.sheetId,
      col,
    );
    const data = this.eventData.customWidth[key];
    if (!data) {
      return CELL_WIDTH;
    }
    return data.isHide ? HIDE_CELL : data.len;
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

  private renderAntLine(position: CanvasOverlayPosition) {
    const range = this.eventData.copyRange;
    if (!range || range.sheetId !== this.eventData.currentSheetInfo.sheetId) {
      return;
    }
    this.ctx.lineWidth = lineWidth;
    this.ctx.strokeStyle = getThemeColor('primaryColor', this.eventData.theme);
    drawAntLine(
      this.ctx,
      position.left,
      position.top,
      position.width,
      position.height,
    );
  }
  private renderMergeCell() {
    const mergeCells = this.eventData.currentMergeCells;
    if (mergeCells.length === 0) {
      return;
    }
    const activeCell = this.eventData.range;
    for (const range of mergeCells) {
      if (activeCell.row === range.row && activeCell.col === range.col) {
        continue;
      }
      this.clearRect(range);
    }
  }
  /* jscpd:ignore-start */
  private getCellSize(range: IRange): IWindowSize {
    let { row, col, colCount, rowCount } = range;
    let r = row;
    let c = col;
    let endRow = row + rowCount;
    let endCol = col + colCount;
    const sheetInfo = this.eventData.currentSheetInfo;
    if (isSheet(range)) {
      c = 0;
      endCol = sheetInfo.colCount;
      r = 0;
      endRow = sheetInfo.rowCount;
    } else if (isCol(range)) {
      r = 0;
      endRow = sheetInfo.rowCount;
    } else if (isRow(range)) {
      c = 0;
      endCol = sheetInfo.colCount;
    }
    let width = 0;
    let height = 0;
    for (; r < endRow; r++) {
      height += this.getRowHeight(r);
    }
    for (; c < endCol; c++) {
      width += this.getColWidth(c);
    }
    return { width, height };
  }
  private computeCellPosition(range: IRange): IPosition {
    const { row, col } = range;
    const size = this.eventData.headerSize;
    const scroll = this.eventData.scroll;

    let resultX = size.width;
    let resultY = size.height;
    let r = scroll.row;
    let c = scroll.col;
    if (col >= scroll.col) {
      while (c < col) {
        resultX += this.getColWidth(c);
        c++;
      }
    } else {
      resultX = -size.width;
      while (c > col) {
        resultX -= this.getColWidth(c);
        c--;
      }
    }
    if (row >= scroll.row) {
      while (r < row) {
        resultY += this.getRowHeight(r);
        r++;
      }
    } else {
      resultY = -size.height;
      while (r > row) {
        resultY -= this.getRowHeight(r);
        r--;
      }
    }
    return {
      top: resultY,
      left: resultX,
    };
  }
  private getActiveRange(r?: IRange) {
    const range = r || this.eventData.range;
    const mergeCells = this.eventData.currentMergeCells;
    for (const item of mergeCells) {
      if (containRange(range, item)) {
        const newRange = {
          ...item,
          sheetId: item.sheetId,
        };
        return {
          range: newRange,
          isMerged: true,
        };
      }
    }
    return {
      range,
      isMerged: false,
    };
  }
  /* jscpd:ignore-end */
  private clearRect(range: IRange) {
    const cellSize = this.getCellSize(range);
    if (cellSize.width <= 0 || cellSize.height <= 0) {
      return;
    }
    const activeCell = this.computeCellPosition(range);
    const lineWidth = DEFAULT_LINE_WIDTH;
    clearRect(
      this.ctx,
      activeCell.left + lineWidth,
      activeCell.top + lineWidth,
      cellSize.width - lineWidth * 2,
      cellSize.height - lineWidth * 2,
    );
  }
  private renderContent(params: ContentParams) {
    const { endCol, endRow, contentHeight, contentWidth } = params;
    const { ctx } = this;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.lineWidth = DEFAULT_LINE_WIDTH * 2;
    const headerSize = this.eventData.headerSize;
    const { row, col } = this.eventData.scroll;

    const maxWidth = Math.floor(contentWidth - headerSize.width);
    const maxHeight = Math.floor(contentHeight - headerSize.height);
    ctx.save();

    this.rowMap = {};
    this.colMap = {};

    const mergeCells = this.eventData.currentMergeCells;
    for (let rowIndex = row; rowIndex < endRow; rowIndex++) {
      for (let colIndex = col; colIndex < endCol; colIndex++) {
        const mergeCell = mergeCells.find(
          (v) => v.row === rowIndex && v.col === colIndex,
        );

        this.renderCell(rowIndex, colIndex, mergeCell, maxWidth, maxHeight);
      }
    }
    ctx.restore();
  }
  private renderCell(
    row: number,
    col: number,
    mergeCell: IRange | undefined,
    maxWidth: number,
    maxHeight: number,
  ) {
    const { ctx } = this;
    const range: IRange = {
      row: row,
      col: col,
      rowCount: 1,
      colCount: 1,
      sheetId: '',
    };
    const key = coordinateToString(row, col)
    const cellInfo = this.eventData.sheetData[key];
    if (!cellInfo) {
      return;
    }
    const cellSize = this.getCellSize(mergeCell || range);
    if (cellSize.width <= 0 || cellSize.height <= 0) {
      return;
    }
    const position = this.computeCellPosition(range);
    ctx.lineWidth = DEFAULT_LINE_WIDTH * 2;
    const theme = this.eventData.theme;
    const size = renderCell(
      ctx,
      {
        top: position.top,
        left: position.left,
        width: Math.min(cellSize.width, maxWidth),
        height: Math.min(cellSize.height, maxHeight),
      },
      cellInfo.value,
      cellInfo.style,
      Boolean(mergeCell),
      theme,
    );
    const height = Math.max(this.rowMap[row] ?? 0, size.height);
    const width = Math.max(this.colMap[col] ?? 0, size.width);
    if (height >= CELL_HEIGHT) {
      this.rowMap[row] = height;
    }
    if (width >= CELL_WIDTH) {
      this.colMap[col] = width;
    }
    const cellPosition = {
      top: position.top,
      left: position.left,
      height: Math.max(height, cellSize.height),
      width: Math.max(width, cellSize.width),
    };

    renderBorderItem(
      ctx,
      cellPosition,
      cellInfo.style?.borderTop,
      'top',
      theme,
    );
    renderBorderItem(
      ctx,
      cellPosition,
      cellInfo.style?.borderBottom,
      'bottom',
      theme,
    );
    renderBorderItem(
      ctx,
      cellPosition,
      cellInfo.style?.borderLeft,
      'left',
      theme,
    );
    renderBorderItem(
      ctx,
      cellPosition,
      cellInfo.style?.borderRight,
      'right',
      theme,
    );
  }
  private renderSelection(params: ContentParams): CanvasOverlayPosition {
    const range = this.eventData.range;
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

  private renderSelectRange() {
    const headerSize = this.eventData.headerSize;
    const range = this.eventData.range;

    const activeCell = this.computeCellPosition({
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
    const endCell = this.computeCellPosition(temp);
    const endCellSize = this.getCellSize(temp);
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
    const headerSize = this.eventData.headerSize;
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
    const headerSize = this.eventData.headerSize;
    const range = this.eventData.range;
    const activeCell = this.computeCellPosition(range);

    let strokeWidth = 0;
    for (
      let i = range.col, endCol = range.col + range.colCount;
      i < endCol;
      i++
    ) {
      strokeWidth += this.getColWidth(i);
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
    const headerSize = this.eventData.headerSize;
    const range = this.eventData.range;
    const activeCell = this.computeCellPosition(range);
    let strokeHeight = 0;
    for (
      let i = range.row, endRow = range.row + range.rowCount;
      i < endRow;
      i++
    ) {
      strokeHeight += this.getRowHeight(i);
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

  private renderActiveCell() {
    const range = this.eventData.range;
    const temp = this.getActiveRange({
      row: range.row,
      col: range.col,
      rowCount: 1,
      colCount: 1,
      sheetId: range.sheetId,
    }).range;
    this.clearRect(temp);
  }
}
