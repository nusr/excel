import { EBorderLineType, CanvasOption } from "@/controller/interface";
import { thinLineWidth, npx, assert, dpr, npxLine } from "@/util";

export class BaseCanvas {
  protected canvas: HTMLCanvasElement;
  protected ctx: CanvasRenderingContext2D;
  constructor(width: number, height: number) {
    this.canvas = document.createElement("canvas");
    const ctx = this.canvas.getContext("2d");
    assert(!!ctx);
    this.ctx = ctx;
    this.resize(width, height);
    const size = dpr();
    this.scale(size, size);
  }
  resize(width: number, height: number): void {
    const { canvas } = this;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    canvas.width = npx(width);
    canvas.height = npx(height);
  }

  scale(x: number, y: number): void {
    this.ctx.scale(x, y);
  }
  clear(): void {
    const { width, height } = this.canvas;
    this.ctx.clearRect(0, 0, width, height);
  }
  clearRect(x: number, y: number, width: number, height: number): void {
    this.ctx.clearRect(x, y, width, height);
  }
  save(): void {
    this.ctx.save();
    this.ctx.beginPath();
  }
  restore(): void {
    this.ctx.restore();
  }
  beginPath(): void {
    this.ctx.beginPath();
  }
  stroke(): void {
    this.ctx.stroke();
  }
  translate(x: number, y: number): void {
    this.ctx.translate(npx(x), npx(y));
  }
  fill(path: Path2D, fillRule: "evenodd" | "nonzero" = "nonzero"): void {
    this.ctx.fill(path, fillRule);
  }
  fillRect(x: number, y: number, width: number, height: number): void {
    this.ctx.fillRect(npx(x) - 0.5, npx(y) - 0.5, npx(width), npx(height));
  }
  fillText(text: string | number, x: number, y: number): void {
    this.ctx.fillText(String(text), npx(x), npx(y));
  }
  setAttributes(options: Partial<CanvasOption>): void {
    Object.assign(this.ctx, options);
  }
  border(lineType: EBorderLineType, color: string): void {
    const { ctx } = this;
    ctx.lineWidth = thinLineWidth();
    ctx.strokeStyle = color;
    switch (lineType) {
      case EBorderLineType.MEDIUM:
        ctx.lineWidth = npx(2) - 0.5;
        break;
      case EBorderLineType.THICK:
        ctx.lineWidth = npx(3);
        break;
      case EBorderLineType.DASHED:
        ctx.setLineDash([npx(3), npx(3)]);
        break;
      case EBorderLineType.DOTTED:
        ctx.setLineDash([npx(1), npx(1)]);
        break;
      case EBorderLineType.DOUBLE:
        ctx.setLineDash([npx(2), 0]);
        break;
      default:
        throw new Error(
          `[border] not found lineType: ${lineType}, color: ${color}`
        );
    }
  }

  line(pointList: Array<Array<number>> = []): void {
    assert(pointList.length > 0);
    const { ctx } = this;
    ctx.beginPath();
    for (let i = 0; i < pointList.length; i += 2) {
      const first = pointList[i];
      const second = pointList[i + 1];
      ctx.moveTo(npxLine(first[0]), npxLine(first[1]));
      ctx.lineTo(npxLine(second[0]), npxLine(second[1]));
    }
    ctx.stroke();
  }
}
