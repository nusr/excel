import { dpr, npx, resizeCanvas, isCol, isRow, isSheet, theme } from '@/util';
import {
  fillRect,
  renderCell,
  getStyle,
  strokeRect,
  drawLines,
  clearRect,
} from './util';
import type { ContentView, IController, Point, EventType } from '@/types';

export class Selection implements ContentView {
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
    if (changeSet.size === 0) {
      return;
    }
    this.clear();
    const { controller } = this;
    const ranges = controller.getRanges();
    const [range] = ranges;
    if (isSheet(range)) {
      this.renderSelectAll();
      return;
    }
    if (isCol(range)) {
      this.renderSelectCol();
      return;
    }
    if (isRow(range)) {
      this.renderSelectRow();
      return;
    }
    this.renderSelectRange();
  }
  private renderActiveCell() {
    const { controller } = this;
    const cellData = controller.getCell(controller.getActiveCell());
    const activeCell = controller.computeCellPosition(
      cellData.row,
      cellData.col,
    );
    clearRect(
      this.ctx,
      activeCell.left,
      activeCell.top,
      activeCell.width,
      activeCell.height,
    );
    renderCell(
      this.ctx,
      { ...cellData, ...activeCell },
      getStyle('lineHeight', this.canvas),
    );
  }
  private renderSelectRange() {
    const { controller } = this;
    const headerSize = controller.getHeaderSize();
    const ranges = controller.getRanges();
    const [range] = ranges;
    const activeCell = controller.computeCellPosition(range.row, range.col);
    const endCellRow = range.row + range.rowCount - 1;
    const endCellCol = range.col + range.colCount - 1;

    const endCell = controller.computeCellPosition(endCellRow, endCellCol);
    const width = endCell.left + endCell.width - activeCell.left;
    const height = endCell.top + endCell.height - activeCell.top;

    this.ctx.fillStyle = theme.selectionColor;

    fillRect(this.ctx, activeCell.left, 0, width, headerSize.height);
    fillRect(this.ctx, 0, activeCell.top, headerSize.width, height);
    const check = range.rowCount > 1 || range.colCount > 1;
    if (check) {
      fillRect(this.ctx, activeCell.left, activeCell.top, width, height);
    }

    this.ctx.strokeStyle = theme.primaryColor;
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

    strokeRect(this.ctx, activeCell.left, activeCell.top, width, height);
  }
  private renderSelectAll() {
    const { controller } = this;
    const { width, height } = this.controller.getDomRect();
    this.ctx.fillStyle = theme.selectionColor;
    fillRect(this.ctx, 0, 0, width, height);

    const headerSize = controller.getHeaderSize();
    this.ctx.strokeStyle = theme.primaryColor;
    this.ctx.lineWidth = dpr();
    this.renderActiveCell();
    strokeRect(
      this.ctx,
      headerSize.width,
      headerSize.height,
      width - headerSize.width,
      height - headerSize.height,
    );
  }
  private renderSelectCol() {
    const { controller } = this;
    const headerSize = controller.getHeaderSize();
    const ranges = controller.getRanges();
    const { height } = controller.getDomRect();
    const [range] = ranges;
    this.ctx.fillStyle = theme.selectionColor;
    const activeCell = controller.computeCellPosition(range.row, range.col);
    fillRect(this.ctx, activeCell.left, 0, activeCell.width, headerSize.height);
    fillRect(this.ctx, 0, activeCell.top, headerSize.width, height);
    fillRect(
      this.ctx,
      activeCell.left,
      activeCell.top + activeCell.height,
      activeCell.width,
      height - activeCell.height,
    );

    this.ctx.strokeStyle = theme.primaryColor;
    this.ctx.lineWidth = dpr();
    const list: Point[] = [
      [headerSize.width, headerSize.height],
      [headerSize.width, height - headerSize.height],
    ];
    drawLines(this.ctx, list);
    strokeRect(
      this.ctx,
      activeCell.left,
      activeCell.top,
      activeCell.width,
      height,
    );
  }
  private renderSelectRow() {
    const { controller } = this;
    const headerSize = controller.getHeaderSize();
    const ranges = controller.getRanges();
    const { width } = controller.getDomRect();
    const [range] = ranges;
    this.ctx.fillStyle = theme.selectionColor;
    const activeCell = controller.computeCellPosition(range.row, range.col);
    fillRect(this.ctx, activeCell.left, 0, width, headerSize.height);
    fillRect(this.ctx, 0, activeCell.top, headerSize.width, activeCell.height);

    fillRect(
      this.ctx,
      activeCell.left + activeCell.width,
      activeCell.top,
      width - activeCell.width,
      activeCell.height,
    );

    this.ctx.strokeStyle = theme.primaryColor;
    this.ctx.lineWidth = dpr();
    const list: Point[] = [
      [activeCell.left, headerSize.height],
      [width - headerSize.width, headerSize.height],
    ];
    drawLines(this.ctx, list);
    strokeRect(
      this.ctx,
      activeCell.left,
      activeCell.top,
      width,
      activeCell.height,
    );
  }
}
