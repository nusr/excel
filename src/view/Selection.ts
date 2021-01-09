import { assert, dpr, npx } from "@/util";
import { CellInfo } from "@/types";
import theme from "@/theme";
import { CanvasOption } from "@/controller/interface";
export class Selection {
  canvas: HTMLCanvasElement;
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
  setActiveCell(data: CellInfo): void {
    this.clear();
    this.setAttributes({
      strokeStyle: theme.primaryColor,
      lineWidth: dpr(),
      fillStyle: "transparent",
    });
    this.strokeRect(data.left, data.top, data.width, data.height);
  }
  getImageData(): ImageData {
    const { width, height } = this.canvas;
    return this.ctx.getImageData(0, 0, width, height);
  }
  resize(width: number, height: number): void {
    const { canvas } = this;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    canvas.width = npx(width);
    canvas.height = npx(height);
  }
  protected scale(x: number, y: number): void {
    this.ctx.scale(x, y);
  }
  protected clear(): void {
    const { width, height } = this.canvas;
    this.ctx.clearRect(0, 0, width, height);
  }
  protected strokeRect(
    x: number,
    y: number,
    width: number,
    height: number
  ): void {
    this.ctx.strokeRect(npx(x) - 0.5, npx(y) - 0.5, npx(width), npx(height));
  }
  protected fillRect(
    x: number,
    y: number,
    width: number,
    height: number
  ): void {
    this.ctx.fillRect(npx(x) - 0.5, npx(y) - 0.5, npx(width), npx(height));
  }
  protected setAttributes(options: Partial<CanvasOption>): void {
    Object.assign(this.ctx, options);
  }
}
