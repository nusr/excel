import { dpr, resizeCanvas, npx, isCol, isRow, isSheet, theme } from '@/util';
import {
  EventType,
  ContentView,
  CanvasOverlayPosition,
  IController,
} from '@/types';
import { drawAntLine } from './util';

function computeRangePosition(
  controller: IController,
): CanvasOverlayPosition | null {
  const ranges = controller.getCopyRanges();
  if (ranges.length === 0) {
    return null;
  }
  const [range] = ranges;
  let result: CanvasOverlayPosition;
  const { width, height } = controller.getDomRect();
  const headerSize = controller.getHeaderSize();
  const activeCell = controller.computeCellPosition(range.row, range.col);
  if (isSheet(range)) {
    result = {
      left: headerSize.width,
      top: headerSize.height,
      width: width - headerSize.width,
      height: height - headerSize.height,
    };
  } else if (isCol(range)) {
    result = {
      left: activeCell.left,
      top: activeCell.top,
      width: activeCell.width,
      height,
    };
  } else if (isRow(range)) {
    result = {
      left: activeCell.left,
      top: activeCell.top,
      width,
      height: activeCell.height,
    };
  } else {
    const endCellRow = range.row + range.rowCount - 1;
    const endCellCol = range.col + range.colCount - 1;
    const endCell = controller.computeCellPosition(endCellRow, endCellCol);
    const width = endCell.left + endCell.width - activeCell.left;
    const height = endCell.top + endCell.height - activeCell.top;
    result = {
      left: activeCell.left,
      top: activeCell.top,
      width,
      height,
    };
  }
  return result;
}

export class MainCanvas implements ContentView {
  private ctx: CanvasRenderingContext2D;
  private content: ContentView;
  private selection: ContentView;
  private canvas: HTMLCanvasElement;
  private controller: IController;
  constructor(
    canvas: HTMLCanvasElement,
    controller: IController,
    content: ContentView,
    selection: ContentView,
  ) {
    this.canvas = canvas;
    this.controller = controller;
    this.ctx = canvas.getContext('2d')!;
    this.content = content;
    this.selection = selection;
    const size = dpr();
    this.ctx.scale(size, size);
  }
  getCanvas() {
    return this.canvas;
  }
  resize() {
    const { width, height } = this.controller.getDomRect();
    resizeCanvas(this.canvas, width, height);
    this.content.resize();
    this.selection.resize();
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
    this.selection.render(params);

    this.clear();
    this.ctx.drawImage(this.content.getCanvas(), 0, 0);
    this.ctx.drawImage(this.selection.getCanvas(), 0, 0);

    const position = computeRangePosition(this.controller);
    if (position) {
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
    return;
  };
}
