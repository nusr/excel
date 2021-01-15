import { dpr } from "@/util";
import { CellInfo } from "@/types";
import theme from "@/theme";
import { Base } from "./Base";
export class Selection extends Base {
  render(width: number, height: number, data: CellInfo): void {
    this.resize(width, height);
    this.setAttributes({
      strokeStyle: theme.primaryColor,
      lineWidth: dpr(),
      fillStyle: "transparent",
    });
    this.strokeRect(data.left, data.top, data.width, data.height);
  }
}
