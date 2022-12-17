import {
  dpr,
  npx,
  COL_TITLE_WIDTH,
  ROW_TITLE_HEIGHT,
  resizeCanvas,
} from '@/util';
import theme from '@/theme';
import { Base } from './Base';
import { fillRect, renderCell, drawLines } from './util';
import type { CanvasOverlayPosition } from '@/types';

export class Selection extends Base {
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

    const ranges = controller.getRanges();
    const [range] = ranges;
    this.ctx.fillStyle = theme.selectionColor;
    const pointList: Array<[x: number, y: number]> = [];
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
    fillRect(this.ctx, top.left, 0, width, ROW_TITLE_HEIGHT);
    fillRect(this.ctx, 0, left.top, COL_TITLE_WIDTH, height);

    this.ctx.strokeStyle = theme.primaryColor;
    this.ctx.lineWidth = dpr();
    pointList.push(
      [top.left, ROW_TITLE_HEIGHT],
      [top.left + width, ROW_TITLE_HEIGHT],
    );
    pointList.push(
      [COL_TITLE_WIDTH, left.top],
      [COL_TITLE_WIDTH, left.top + height],
    );
    drawLines(this.ctx, pointList);
  }
  render(
    width: number,
    height: number,
    selectAll: CanvasOverlayPosition | null,
  ): void {
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
