import { dpr, npx, isCol, isRow, isSheet, theme, canvasLog } from '@/util';
import {
  EventType,
  ContentView,
  CanvasOverlayPosition,
  IController,
  Point,
} from '@/types';
import {
  fillRect,
  renderCell,
  strokeRect,
  drawLines,
  clearRect,
  drawAntLine,
  resizeCanvas,
} from './util';

export class MainCanvas {
  private ctx: CanvasRenderingContext2D;
  private content: ContentView;
  private canvas: HTMLCanvasElement;
  private controller: IController;
  constructor(controller: IController, content: ContentView) {
    const canvas = controller.getMainDom().canvas!;
    this.canvas = canvas;
    this.controller = controller;
    this.ctx = canvas.getContext('2d')!;
    this.content = content;
    const size = dpr();
    this.ctx.scale(size, size);
  }
  resize() {
    const { width, height } = this.controller.getDomRect();
    resizeCanvas(this.canvas, width, height);
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
    this.content.render(params);
    this.clear();
    this.ctx.drawImage(this.content.getCanvas(), 0, 0);
    const result = this.renderSelection();
    this.renderAntLine(result);
  };

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
    this.ctx.strokeStyle = theme.primaryColor;
    this.ctx.lineWidth = dpr();
    drawAntLine(
      this.ctx,
      position.left,
      position.top,
      position.width,
      position.height,
    );
  }

  private renderSelection(): CanvasOverlayPosition {
    const { controller } = this;
    const range = controller.getActiveCell();
    canvasLog('render canvas selection');
    if (isSheet(range)) {
      return this.renderSelectAll();
    }
    if (isCol(range)) {
      return this.renderSelectCol();
    }
    if (isRow(range)) {
      return this.renderSelectRow();
    }
    return this.renderSelectRange();
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
    renderCell(this.ctx, { ...cellData, ...activeCell });
  }
  private renderSelectRange() {
    const { controller } = this;
    const headerSize = controller.getHeaderSize();
    const range = controller.getActiveCell();
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
    return {
      left: activeCell.left,
      top: activeCell.top,
      width: width,
      height: height,
    };
  }
  private renderSelectAll(): CanvasOverlayPosition {
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
    return {
      left: headerSize.width,
      top: headerSize.height,
      width: width - headerSize.width,
      height: height - headerSize.height,
    };
  }
  private renderSelectCol() {
    const { controller } = this;
    const headerSize = controller.getHeaderSize();
    const range = controller.getActiveCell();
    const { height } = controller.getDomRect();
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
    return {
      left: activeCell.left,
      top: activeCell.top,
      width: activeCell.width,
      height: height,
    };
  }
  private renderSelectRow() {
    const { controller } = this;
    const headerSize = controller.getHeaderSize();
    const range = controller.getActiveCell();
    const { width } = controller.getDomRect();
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
    return {
      left: activeCell.left,
      top: activeCell.top,
      width: width,
      height: activeCell.height,
    };
  }
}
