import { dpr } from "@/util";
import { CanvasOverlayPosition } from "@/types";
import theme from "@/theme";
import { Base } from "./Base";
const DISTANCE = 0.5;
export class Selection extends Base {
  renderFillRect(fillStyle: string, data: CanvasOverlayPosition): void {
    this.save();
    this.setAttributes({
      lineWidth: dpr(),
      fillStyle,
    });
    this.fillRect(
      data.left + DISTANCE,
      data.top + DISTANCE,
      data.width - DISTANCE,
      data.height - DISTANCE
    );
    this.restore();
  }
  render(
    width: number,
    height: number,
    data: CanvasOverlayPosition[],
    activeCellFillColor: string
  ): void {
    this.resize(width, height);
    const [activeCell, all] = data;
    if (all) {
      this.renderFillRect(theme.selectionColor, all);
      this.renderFillRect(activeCellFillColor, activeCell);
    }
  }
}
