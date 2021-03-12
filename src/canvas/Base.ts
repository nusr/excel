import {
  thinLineWidth,
  npx,
  assert,
  dpr,
  npxLine,
  isNumber,
  DEFAULT_FONT_SIZE,
  DEFAULT_FONT_COLOR,
  makeFont,
} from "@/util";
import { isEmpty } from "@/lodash";
import { CanvasOption, EBorderLineType } from "@/types";
import type { Controller } from "@/controller";

export type BaseProps = {
  width: number;
  height: number;
  controller: Controller;
};

export class Base {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  controller: Controller;
  defaultFont = makeFont(undefined, "500", npx(DEFAULT_FONT_SIZE));
  constructor({ width, height, controller }: BaseProps) {
    this.controller = controller;
    this.canvas = document.createElement("canvas");
    this.canvas.style.display = "none";
    document.body.appendChild(this.canvas);
    const ctx = this.canvas.getContext("2d");
    assert(!!ctx);
    this.ctx = ctx;
    this.resize(width, height);
    const size = dpr();
    this.scale(size, size);
  }
  scale(x: number, y: number): void {
    this.ctx.scale(x, y);
  }
  resize(width: number, height: number): void {
    const { canvas } = this;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    canvas.width = npx(width);
    canvas.height = npx(height);
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
  strokeRect(x: number, y: number, width: number, height: number): void {
    this.ctx.strokeRect(npx(x) - 0.5, npx(y) - 0.5, npx(width), npx(height));
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
  renderCell(row: number, col: number): void {
    const cellInfo = this.controller.queryCell(row, col);
    const { left, top, height, width, style, displayValue } = cellInfo;
    const isNum = isNumber(displayValue);
    let font = this.defaultFont;
    let fillStyle = DEFAULT_FONT_COLOR;
    if (!isEmpty(style)) {
      const fontSize = npx(
        style?.fontSize ? style.fontSize : DEFAULT_FONT_SIZE
      );
      font = makeFont(
        style?.isItalic ? "italic" : "normal",
        style?.isBold ? "bold" : "500",
        fontSize,
        style?.fontFamily
      );
      fillStyle = style?.fontColor || DEFAULT_FONT_COLOR;
      if (style?.fillColor) {
        this.setAttributes({ fillStyle: style?.fillColor });
        this.fillRect(left, top, width, height);
      }
    }
    this.setAttributes({
      textAlign: isNum ? "right" : "left",
      font,
      fillStyle,
    });
    this.fillText(displayValue, left + (isNum ? width : 0), top + height / 2);
  }
}
