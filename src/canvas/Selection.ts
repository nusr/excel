import { dpr, npxLine } from "@/util";
import { CanvasOverlayPosition } from "@/types";
import theme from "@/theme";
import { Base } from "./Base";
import { fillRect, renderCell, resizeCanvas } from "./util";
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
  render(
    width: number,
    height: number,
    selectAll: CanvasOverlayPosition | null
  ): void {
    resizeCanvas(this.canvas, width, height);
    if (selectAll) {
      const cellData = this.controller.queryActiveCellInfo();
      const activeCell = this.controller.renderController?.queryCell(
        cellData.row,
        cellData.col
      );
      const activeCellFillColor = cellData.style?.fillColor || theme.white;
      this.renderFillRect(theme.selectionColor, selectAll);
      if (activeCell) {
        this.renderFillRect(activeCellFillColor, activeCell);
        renderCell(this.ctx, { ...cellData, ...activeCell });
      }
    }
  }
}
