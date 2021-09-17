import { dpr, npxLine, isSheet } from "@/util";
import { CanvasOverlayPosition } from "@/types";
import theme from "@/theme";
import { Base } from "./Base";
import { fillRect, renderCell, resizeCanvas, drawLines } from "./util";

export class Selection extends Base {
  renderFillRect(fillStyle: string, data: CanvasOverlayPosition): void {
    this.ctx.fillStyle = fillStyle;
    this.ctx.lineWidth = dpr();
    const temp = npxLine(0.5);
    fillRect(
      this.ctx,
      data.left + temp,
      data.top + temp,
      data.width - temp,
      data.height - temp
    );
  }
  renderSelectedRange(): void {
    const { controller } = this;
    const { renderController } = controller;
    if (!renderController) {
      return;
    }
    const { ranges } = controller;
    const [range] = ranges;
    const size = renderController.getHeaderSize();
    this.ctx.fillStyle = theme.selectionColor;

    const pointList: Array<[x: number, y: number]> = [];
    if (isSheet(range)) {
      const canvasSize = renderController.getCanvasSize();
      fillRect(this.ctx, size.width, 0, canvasSize.width, size.height);
      fillRect(this.ctx, 0, size.height, size.width, canvasSize.height);
      return;
    }
    const top = renderController.queryCell(0, range.col);
    const left = renderController.queryCell(range.row, 0);

    let width = 0;
    let height = 0;
    for (let c = range.col, end = range.col + range.colCount; c < end; c++) {
      width += renderController.getColWidth(c);
    }
    for (let r = range.row, end = range.row + range.rowCount; r < end; r++) {
      height += renderController.getRowHeight(r);
    }
    fillRect(this.ctx, top.left, 0, width, size.height);
    fillRect(this.ctx, 0, left.top, size.width, height);

    this.ctx.strokeStyle = theme.primaryColor;
    this.ctx.lineWidth = dpr();
    pointList.push([top.left, size.height], [top.left + width, size.height]);
    pointList.push([size.width, left.top], [size.width, left.top + height]);
    drawLines(this.ctx, pointList);
  }
  render(
    width: number,
    height: number,
    selectAll: CanvasOverlayPosition | null
  ): void {
    resizeCanvas(this.canvas, width, height);

    const { controller } = this;
    const { renderController } = controller;
    if (!renderController) {
      return;
    }

    this.renderSelectedRange();

    if (!selectAll) {
      return;
    }

    const cellData = controller.queryCell(controller.queryActiveCell());
    const activeCell = renderController.queryCell(cellData.row, cellData.col);
    const activeCellFillColor = cellData.style?.fillColor || theme.white;
    this.renderFillRect(theme.selectionColor, selectAll);
    this.renderFillRect(activeCellFillColor, activeCell);
    renderCell(this.ctx, { ...cellData, ...activeCell });
  }
}
