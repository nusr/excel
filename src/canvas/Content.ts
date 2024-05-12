import { dpr, canvasLog, headerSizeSet, canvasSizeSet } from '@/util';
import { resizeCanvas, renderCell, clearRect, renderBorderItem } from './util';
import { ContentView, IController, IRange, ContentParams } from '@/types';

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
  render(params: ContentParams) {
    this.ctx.textAlign = 'left';
    this.ctx.textBaseline = 'top';
    canvasLog('render canvas content');
    this.clear();
    this.renderContent(params);
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
    clearRect(this.ctx, 0, 0, width, height);
  }

  private renderCell(
    row: number,
    col: number,
    mergeCell: IRange | undefined,
    maxWidth: number,
    maxHeight: number,
  ) {
    const { controller, ctx } = this;
    const range: IRange = {
      row: row,
      col: col,
      rowCount: 1,
      colCount: 1,
      sheetId: '',
    };
    const cellInfo = controller.getCell(range);
    if (!cellInfo) {
      return;
    }
    const cellSize = controller.getCellSize(mergeCell || range);
    if (cellSize.width <= 0 || cellSize.height <= 0) {
      return;
    }
    const position = controller.computeCellPosition(range);
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
    );
    const height = Math.max(this.rowMap.get(row) ?? 0, size.height);
    const width = Math.max(this.colMap.get(col) ?? 0, size.width);
    if (!mergeCell) {
      if (height > controller.getRowHeight(row).len) {
        this.rowMap.set(row, height);
      }
      if (width > controller.getColWidth(col).len) {
        this.colMap.set(col, width);
      }
    }
    const cellPosition = {
      top: position.top,
      left: position.left,
      height: Math.max(height, cellSize.height),
      width: Math.max(width, cellSize.width),
    };
    renderBorderItem(ctx, cellPosition, cellInfo.style?.borderTop, 'top');
    renderBorderItem(ctx, cellPosition, cellInfo.style?.borderBottom, 'bottom');
    renderBorderItem(ctx, cellPosition, cellInfo.style?.borderLeft, 'left');
    renderBorderItem(ctx, cellPosition, cellInfo.style?.borderRight, 'right');
  }

  private renderContent({
    endCol,
    endRow,
    contentHeight,
    contentWidth,
  }: ContentParams) {
    const { controller, ctx } = this;
    const headerSize = headerSizeSet.get();
    const { row, col } = controller.getScroll();

    const maxWidth = Math.floor(contentWidth - headerSize.width);
    const maxHeight = Math.floor(contentHeight - headerSize.height);
    ctx.save();

    this.rowMap = new Map<number, number>();
    this.colMap = new Map<number, number>();

    const mergeCells = controller.getMergeCellList(
      controller.getCurrentSheetId(),
    );
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
}
