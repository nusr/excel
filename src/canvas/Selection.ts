import { dpr, npxLine } from "@/util";
import { CanvasOverlayPosition } from "@/types";
import theme from "@/theme";
import { Base } from "./Base";
export class Selection extends Base {
  renderFillRect(fillStyle: string, data: CanvasOverlayPosition): void {
    this.setAttributes({
      lineWidth: dpr(),
      fillStyle,
    });
    const temp = npxLine(0.5);
    this.fillRect(
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
    this.resize(width, height);
    if (selectAll) {
      const cellData = this.controller.queryActiveCellInfo();
      const activeCell = this.renderController.queryCell(
        cellData.row,
        cellData.col
      );
      const activeCellFillColor = cellData.style?.fillColor || theme.white;
      this.renderFillRect(theme.selectionColor, selectAll);
      this.renderFillRect(activeCellFillColor, activeCell);
      this.renderCell(cellData.row, cellData.col);
    }
  }
}
