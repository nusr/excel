import {
  assert,
  dpr,
  npx,
  isCol,
  isRow,
  isSheet,
  canvasLog,
  COL_TITLE_WIDTH,
  ROW_TITLE_HEIGHT,
} from '@/util';
import { Content } from './Content';
import {
  CanvasOverlayPosition,
  EventType,
  IController,
  IWindowSize,
} from '@/types';
import theme from '@/theme';
import { Selection } from './Selection';
import { strokeRect } from './util';

type RenderParams = EventType['change'] & {
  canvasSize: IWindowSize;
};

export class MainCanvas {
  private ctx: CanvasRenderingContext2D;
  private controller: IController;
  private content: Content;
  private selection: Selection;
  constructor(
    controller: IController,
    ctx: CanvasRenderingContext2D,
    content: Content = new Content(controller),
    selection: Selection = new Selection(controller),
  ) {
    this.controller = controller;
    this.ctx = ctx;
    this.content = content;
    this.selection = selection;
    const size = dpr();
    this.ctx.scale(size, size);
  }

  private getSelection(
    activeCell: CanvasOverlayPosition,
    drawSize: IWindowSize,
  ): CanvasOverlayPosition | null {
    const { controller } = this;
    const ranges = controller.getRanges();
    const [range] = ranges;
    if (range.rowCount === range.colCount && range.rowCount === 1) {
      return null;
    }
    const contentWidth = drawSize.width - COL_TITLE_WIDTH;
    const contentHeight = drawSize.height - ROW_TITLE_HEIGHT;
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
  render = ({ changeSet, canvasSize }: RenderParams): void => {
    const isContentChange = changeSet.has('contentChange');
    const { width, height } = canvasSize;
    if (isContentChange) {
      canvasLog('render content');
      this.content.render(width, height);
    }
    const [range] = this.controller.getRanges();
    const activeCell = this.controller.computeCellPosition(
      range.row,
      range.col,
    );
    const selectAll = this.getSelection(activeCell, canvasSize);

    this.selection.render(width, height, selectAll);
    canvasLog('render selection');

    this.ctx.clearRect(0, 0, npx(width), npx(height));
    this.ctx.drawImage(this.content.canvas, 0, 0);
    this.ctx.drawImage(this.selection.canvas, 0, 0);

    this.ctx.strokeStyle = theme.primaryColor;
    this.ctx.lineWidth = dpr();
    const line = selectAll ? selectAll : activeCell;
    strokeRect(this.ctx, line.left, line.top, line.width, line.height);
  };
}
