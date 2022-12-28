import { dpr, npx, resizeCanvas } from '@/util';
import theme from '@/theme';
import { fillRect, renderCell, drawLines } from './util';
import type {
  CanvasOverlayPosition,
  Point,
  ContentView,
  IController,
  EventType,
} from '@/types';

export class Selection implements ContentView {
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
  private renderFillRect(fillStyle: string, data: CanvasOverlayPosition): void {
    this.ctx.fillStyle = fillStyle;
    this.ctx.lineWidth = dpr();
    const temp = npx(0.5);
    fillRect(
      this.ctx,
      data.left + temp,
      data.top + temp,
      data.width - temp,
      data.height - temp,
    );
  }
  private renderSelectedRange(): void {
    const { controller } = this;
    const headerSize = controller.getHeaderSize();
    const ranges = controller.getRanges();
    const scroll = controller.getScroll();
    const [range] = ranges;
    this.ctx.fillStyle = theme.selectionColor;
    const pointList: Array<Point> = [];
    const top = controller.computeCellPosition(0, range.col);
    const left = controller.computeCellPosition(range.row, 0);

    let width = 0;
    let height = 0;
    for (let c = range.col, end = range.col + range.colCount; c < end; c++) {
      width += controller.getColWidth(c);
    }
    for (let r = range.row, end = range.row + range.rowCount; r < end; r++) {
      height += controller.getRowHeight(r);
    }
    top.left -= scroll.left;
    left.top -= scroll.top;
    width -= scroll.left;
    height -= scroll.top;
    fillRect(this.ctx, top.left, 0, width, headerSize.height);
    fillRect(this.ctx, 0, left.top, headerSize.width, height);

    this.ctx.strokeStyle = theme.primaryColor;
    this.ctx.lineWidth = dpr();
    pointList.push(
      [top.left, headerSize.height],
      [top.left + width, headerSize.height],
    );
    pointList.push(
      [headerSize.width, left.top],
      [headerSize.width, left.top + height],
    );
    drawLines(this.ctx, pointList);
  }
  render({ width, height, selectAll }: EventType): void {
    resizeCanvas(this.canvas, width, height);
    const { controller } = this;
    this.renderSelectedRange();
    if (!selectAll) {
      return;
    }

    const cellData = controller.getCell(controller.getActiveCell());
    const activeCell = controller.computeCellPosition(
      cellData.row,
      cellData.col,
    );
    const activeCellFillColor = cellData.style?.fillColor || theme.white;
    this.renderFillRect(theme.selectionColor, selectAll);
    this.renderFillRect(activeCellFillColor, activeCell);
    renderCell(this.canvas, { ...cellData, ...activeCell });
  }
}
