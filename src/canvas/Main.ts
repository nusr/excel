import {
  assert,
  dpr,
  npx,
  isCol,
  isRow,
  isSheet,
  resizeCanvas,
} from '@/util';
import {
  CanvasOverlayPosition,
  EventType,
  IController,
  IWindowSize,
  BaseView,
  ContentView,
} from '@/types';
import theme from '@/theme';
import { strokeRect } from './util';

export class MainCanvas implements BaseView {
  private ctx: CanvasRenderingContext2D;
  private controller: IController;
  private content: ContentView;
  private selection: ContentView;
  private canvas: HTMLCanvasElement;
  constructor(
    controller: IController,
    canvas: HTMLCanvasElement,
    content: ContentView,
    selection: ContentView,
  ) {
    this.controller = controller;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.content = content;
    this.selection = selection;
    const size = dpr();
    this.ctx.scale(size, size);
  }

  private getSelection(
    activeCell: CanvasOverlayPosition,
    drawSize: IWindowSize,
  ): CanvasOverlayPosition | undefined {
    const { controller } = this;
    const ranges = controller.getRanges();
    const [range] = ranges;
    if (range.rowCount === range.colCount && range.rowCount === 1) {
      return undefined;
    }
    const headerSize = controller.getHeaderSize();
    const contentWidth = drawSize.width - headerSize.width;
    const contentHeight = drawSize.height - headerSize.height;
    if (isSheet(range)) {
      return {
        width: contentWidth,
        height: contentHeight,
        left: activeCell.left,
        top: activeCell.top,
      };
    }
    if (isCol(range)) {
      const width = controller.getColWidth(range.col);
      return {
        left: activeCell.left,
        top: activeCell.top,
        width: width,
        height: contentHeight,
      };
    }
    if (isRow(range)) {
      const height = controller.getRowHeight(range.row);
      return {
        left: activeCell.left,
        top: activeCell.top,
        width: contentWidth,
        height,
      };
    }

    const endCellRow = range.row + range.rowCount - 1;
    const endCellCol = range.col + range.colCount - 1;
    assert(endCellRow >= 0 && endCellCol >= 0);
    const endCell = controller.computeCellPosition(endCellRow, endCellCol);
    const width = endCell.left + endCell.width - activeCell.left;
    const height = endCell.top + endCell.height - activeCell.top;
    assert(width >= 0 && height >= 0);
    return {
      left: activeCell.left,
      top: activeCell.top,
      width: width,
      height: height,
    };
  }
  resize(width: number, height: number) {
    resizeCanvas(this.canvas, width, height);
    this.content.resize(width, height);
    this.selection.resize(width, height);
  }
  private clear(width: number, height: number) {
    this.ctx.clearRect(0, 0, npx(width), npx(height));
  }
  render = (params: EventType): void => {
    const { changeSet, width, height } = params;
    if (changeSet.size === 0) {
      return;
    }
    const [range] = this.controller.getRanges();
    const activeCell = this.controller.computeCellPosition(
      range.row,
      range.col,
    );
    const selectAll = this.getSelection(activeCell, { width, height });
    this.content.render(params);
    this.selection.render({
      ...params,
      selectAll: selectAll,
    });
    this.clear(width, height);
    this.ctx.drawImage(this.content.canvas, 0, 0);
    this.ctx.drawImage(this.selection.canvas, 0, 0);

    this.ctx.strokeStyle = theme.primaryColor;
    this.ctx.lineWidth = dpr();
    const line = selectAll ? selectAll : activeCell;
    strokeRect(this.ctx, line.left, line.top, line.width, line.height);
  };
}
