import {
  npx,
  DEFAULT_FONT_CONFIG,
  isNumber,
  DEFAULT_FONT_SIZE,
  DEFAULT_FONT_COLOR,
  makeFont,
  npxLine,
  assert,
  parseError,
  ERROR_FORMULA_COLOR,
} from "@/util";
import { isEmpty, isNil } from "@/lodash";
import { CellInfo } from "@/types";

export function fillRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number
): void {
  ctx.fillRect(npx(x) - 0.5, npx(y) - 0.5, npx(width), npx(height));
}
export function strokeRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number
): void {
  ctx.strokeRect(npx(x) - 0.5, npx(y) - 0.5, npx(width), npx(height));
}

export function fillText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number
): void {
  ctx.fillText(text, npx(x), npx(y));
}

export function renderCell(
  ctx: CanvasRenderingContext2D,
  cellInfo: CellInfo & {
    left: number;
    top: number;
    width: number;
    height: number;
  }
): void {
  const { style, value, left, top, width, height } = cellInfo;
  const isNum = isNumber(value);
  let font = DEFAULT_FONT_CONFIG;
  let fillStyle = DEFAULT_FONT_COLOR;
  if (!isEmpty(style)) {
    const fontSize = npx(style?.fontSize ? style.fontSize : DEFAULT_FONT_SIZE);
    font = makeFont(
      style?.isItalic ? "italic" : "normal",
      style?.isBold ? "bold" : "500",
      fontSize,
      style?.fontFamily
    );
    fillStyle = style?.fontColor || DEFAULT_FONT_COLOR;
    if (style?.fillColor) {
      ctx.fillStyle = style?.fillColor;
      fillRect(ctx, left, top, width, height);
    }
  }
  let text = String(value);
  if (parseError(value)) {
    fillStyle = ERROR_FORMULA_COLOR;
  } else if (
    typeof value === "boolean" ||
    ["TRUE", "FALSE"].includes(text.toUpperCase())
  ) {
    text = text.toUpperCase();
  } else if (isNil(value)) {
    text = "";
  }

  ctx.textAlign = isNum ? "right" : "left";
  ctx.font = font;
  ctx.fillStyle = fillStyle;
  ctx.textBaseline = "middle";
  fillText(ctx, text, left + (isNum ? width : 0), top + height / 2);
}

export function drawLines(
  ctx: CanvasRenderingContext2D,
  pointList: Array<[x: number, y: number]>
): void {
  assert(pointList.length > 0);
  ctx.beginPath();
  for (let i = 0; i < pointList.length; i += 2) {
    const first = pointList[i];
    const second = pointList[i + 1];
    ctx.moveTo(npxLine(first[0]), npxLine(first[1]));
    ctx.lineTo(npxLine(second[0]), npxLine(second[1]));
  }
  ctx.stroke();
}
export function resizeCanvas(
  canvas: HTMLCanvasElement,
  width: number,
  height: number
): void {
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";
  canvas.width = npx(width);
  canvas.height = npx(height);
}
