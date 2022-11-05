import {
  npx,
  DEFAULT_FONT_CONFIG,
  isNumber,
  DEFAULT_FONT_SIZE,
  DEFAULT_FONT_COLOR,
  makeFont,
  npxLine,
  assert,
  ERROR_SET,
  ERROR_FORMULA_COLOR,
  isTestEnv,
} from "@/util";
import { isEmpty, isNil } from "@/lodash";
import { CellInfo, ErrorTypes, EWrap } from "@/types";

const getStyle = (
  key: "lineHeight" | "letterSpacing",
  dom: HTMLElement = document.body
): number => {
  if (isTestEnv()) {
    return 20;
  }
  return parseInt(window.getComputedStyle(dom)[key]);
};

const measureTextMap = new Map<string, TextMetrics>();

export function measureText(ctx: CanvasRenderingContext2D, char: string) {
  const mapKey = `${char}__${ctx.font}`;
  let temp = measureTextMap.get(mapKey);
  if (!temp) {
    const metrics = ctx.measureText(char);
    measureTextMap.set(mapKey, metrics);
    temp = metrics;
  }
  return temp;
}

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

function getFontSizeHeight(ctx: CanvasRenderingContext2D, char: string) {
  const { actualBoundingBoxDescent, actualBoundingBoxAscent } = measureText(
    ctx,
    char
  );
  const result = actualBoundingBoxDescent + actualBoundingBoxAscent;
  return Math.ceil(result);
}

export function fillText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number
) {
  ctx.fillText(text, npx(x), npx(y));
}

export function fillWrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  cellWidth: number,
  lineHeight: number
): number {
  let line = "";
  const textList = text.split("");
  let testWidth = 0;
  const realCellWidth = cellWidth * 2;
  let wrapHeight = lineHeight;
  for (let i = 0; i < textList.length; i++) {
    const char = textList[i];
    const { width } = measureText(ctx, char);
    if (testWidth + width > realCellWidth) {
      fillText(ctx, line, x, y);
      line = char;
      y += lineHeight;
      testWidth = width;
      wrapHeight += lineHeight;
    } else {
      testWidth += width;
      line = line + char;
    }
  }
  return wrapHeight;
}

export function fillTexts(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  cellWidth: number
) {
  let line = "";
  const textList = text.split("");
  let testWidth = 0;
  const realCellWidth = cellWidth * 2;
  let textWidth = 0;
  for (let i = 0; i < textList.length; i++) {
    const char = textList[i];
    const { width } = measureText(ctx, char);
    if (testWidth + width > realCellWidth) {
      if (i === 0) {
        textWidth = width;
        line = char;
      }
      break;
    } else {
      testWidth += width;
      line = line + char;
    }
  }
  fillText(ctx, line, x, y);
  return textWidth;
}

interface IRenderCellResult {
  wrapHeight?: number;
  fontSizeHeight?: number;
  textWidth?: number;
}

export function renderCell(
  canvas: HTMLCanvasElement,
  cellInfo: CellInfo & {
    left: number;
    top: number;
    width: number;
    height: number;
  }
): IRenderCellResult {
  const ctx = canvas.getContext("2d");
  assert(!!ctx);
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
  if (ERROR_SET.has(text as ErrorTypes)) {
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
  const x = left + (isNum ? width : 0);
  const result: IRenderCellResult = {};
  const fontSizeHeight = getFontSizeHeight(ctx, text[0]);
  const textHeight = Math.max(
    fontSizeHeight,
    getStyle("lineHeight", canvas),
    getStyle("lineHeight")
  );
  if (style?.wrapText === EWrap.AUTO_WRAP) {
    const y = top;
    result.wrapHeight = fillWrapText(ctx, text, x, y, width, textHeight);
  } else {
    const y = Math.floor(top + height / 2);
    result.textWidth = fillTexts(ctx, text, x, y, width);
  }
  return {
    ...result,
    fontSizeHeight: textHeight,
  };
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
