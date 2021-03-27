import { dpr, npxLine } from "@/util";
import { CanvasOverlayPosition } from "@/types";
import theme from "@/theme";
import { Base } from "./Base";
export class Selection extends Base {
  renderFillRect(fillStyle: string, data: CanvasOverlayPosition): void {
    this.save();
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
    this.restore();
  }
  render(
    width: number,
    height: number,
    selectAll: CanvasOverlayPosition | null
  ): void {
    const cellData = this.controller.queryActiveCellInfo();
    const activeCell = this.renderController.queryCell(
      cellData.row,
      cellData.col
    );
    const activeCellFillColor = cellData.style?.fillColor || theme.white;
    this.resize(width, height);
    if (selectAll) {
      this.renderFillRect(theme.selectionColor, selectAll);
      this.renderFillRect(activeCellFillColor, activeCell);
    }
  }
}
