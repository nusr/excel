import {
  npx,
  DEFAULT_FONT_CONFIG,
  isNumber,
  DEFAULT_FONT_SIZE,
  DEFAULT_FONT_COLOR,
  makeFont,
  assert,
  ERROR_SET,
  ERROR_FORMULA_COLOR,
  isTestEnv,
  dpr,
  isEmpty,
} from '@/util';
import { ModelCellType, ErrorTypes, Point, EUnderLine } from '@/types';

export const getStyle = (
  key: 'lineHeight' | 'letterSpacing',
  dom: HTMLElement = document.body,
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
  height: number,
): void {
  ctx.fillRect(npx(x), npx(y), npx(width), npx(height));
}
export function strokeRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
): void {
  ctx.strokeRect(npx(x), npx(y), npx(width), npx(height));
}

export function clearRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
): void {
  ctx.clearRect(npx(x), npx(y), npx(width), npx(height));
}

function getFontSizeHeight(ctx: CanvasRenderingContext2D, char: string) {
  const { actualBoundingBoxDescent, actualBoundingBoxAscent } = measureText(
    ctx,
    char,
  );
  const result = actualBoundingBoxDescent + actualBoundingBoxAscent;
  return Math.ceil(result);
}

export function fillText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
) {
  ctx.fillText(text, npx(x), npx(y));
}

export function fillWrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  cellWidth: number,
  lineHeight: number,
  underline?: EUnderLine,
): number {
  let line = '';
  const textList = text.split('');
  let testWidth = 0;
  const realCellWidth = cellWidth * 2;
  let wrapHeight = lineHeight;
  y += lineHeight / 2;
  for (let i = 0; i < textList.length; i++) {
    const char = textList[i];
    const { width } = measureText(ctx, char);
    if (testWidth + width > realCellWidth) {
      fillText(ctx, line, x, y);
      if (underline) {
        drawUnderline(
          ctx,
          [
            [x, y + lineHeight / 2],
            [x + cellWidth, y + lineHeight / 2],
          ],
          underline,
        );
      }
      line = char;
      y += lineHeight;
      testWidth = width;
      wrapHeight += lineHeight;
    } else {
      testWidth += width;
      line = line + char;
    }
  }
  if (line) {
    fillText(ctx, line, x, y);
    if (underline) {
      drawUnderline(
        ctx,
        [
          [x, y + lineHeight / 2],
          [x + testWidth / 2, y + lineHeight / 2],
        ],
        underline,
      );
    }
  }
  return wrapHeight;
}

export function fillTexts(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  cellWidth: number,
) {
  let line = '';
  const textList = [...text];
  let testWidth = 0;
  const realCellWidth = cellWidth * 2;
  for (let i = 0; i < textList.length; i++) {
    const char = textList[i];
    const { width } = measureText(ctx, char);
    if (testWidth + width > realCellWidth) {
      if (i === 0) {
        line = char;
        testWidth += width;
      }
      break;
    } else {
      testWidth += width;
      line = line + char;
    }
  }
  fillText(ctx, line, x, y);
  return testWidth;
}

interface IRenderCellResult {
  wrapHeight?: number;
  fontSizeHeight?: number;
  textWidth?: number;
}

export function renderCell(
  ctx: CanvasRenderingContext2D,
  cellInfo: ModelCellType & {
    left: number;
    top: number;
    width: number;
    height: number;
  },
  canvasLineHeight: number,
): IRenderCellResult {
  const { style, value, left, top, width, height } = cellInfo;
  const isNum = isNumber(value);
  let font = DEFAULT_FONT_CONFIG;
  let fillStyle = DEFAULT_FONT_COLOR;
  if (!isEmpty(style)) {
    const fontSize = npx(style?.fontSize ? style.fontSize : DEFAULT_FONT_SIZE);
    font = makeFont(
      style?.isItalic ? 'italic' : 'normal',
      style?.isBold ? 'bold' : '500',
      fontSize,
      style?.fontFamily,
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
    typeof value === 'boolean' ||
    ['TRUE', 'FALSE'].includes(text.toUpperCase())
  ) {
    text = text.toUpperCase();
  } else if (value === undefined || value === null) {
    text = '';
  }

  ctx.textAlign = isNum ? 'right' : 'left';
  ctx.font = font;
  ctx.fillStyle = fillStyle;
  ctx.textBaseline = 'middle';
  const x = left + (isNum ? width : 0);
  const result: IRenderCellResult = {};
  const fontSizeHeight = getFontSizeHeight(ctx, text[0]);
  const textHeight = Math.max(
    fontSizeHeight,
    canvasLineHeight,
    getStyle('lineHeight'),
  );
  if (style?.underline) {
    ctx.strokeStyle = fillStyle;
  }
  if (style?.isWrapText) {
    const y = top;
    result.wrapHeight = fillWrapText(
      ctx,
      text,
      x,
      y,
      width,
      textHeight,
      style?.underline,
    );
  } else {
    const y = Math.floor(top + height / 2);
    let textWidth = fillTexts(ctx, text, x, y, width);
    if (style?.underline) {
      const t = y + textHeight / 2;
      let list: Array<Point> = [];
      textWidth = Math.min(textWidth, width);
      if (!isNum) {
        list = [
          [x, t],
          [x + textWidth, t],
        ];
      } else {
        const a = left + width;
        list = [
          [a - textWidth, t],
          [a, t],
        ];
      }
      drawUnderline(ctx, list, style?.underline);
    }
  }
  return {
    ...result,
    fontSizeHeight: textHeight,
  };
}

export function drawLines(
  ctx: CanvasRenderingContext2D,
  pointList: Array<Point>,
): void {
  assert(pointList.length > 0);
  ctx.beginPath();
  for (let i = 0; i < pointList.length; i += 2) {
    const first = pointList[i];
    const second = pointList[i + 1];
    ctx.moveTo(npx(first[0]), npx(first[1]));
    ctx.lineTo(npx(second[0]), npx(second[1]));
  }
  ctx.stroke();
}

export function drawTriangle(
  ctx: CanvasRenderingContext2D,
  point1: Point,
  point2: Point,
  point3: Point,
) {
  ctx.beginPath();
  ctx.moveTo(npx(point1[0]), npx(point1[1]));
  ctx.lineTo(npx(point2[0]), npx(point2[1]));
  ctx.lineTo(npx(point3[0]), npx(point3[1]));
  ctx.fill();
}

export function drawAntLine(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  const oldDash = ctx.getLineDash();
  ctx.setLineDash([npx(8), npx(6)]);
  const offset = dpr() / 2;
  strokeRect(
    ctx,
    x + offset,
    y + offset,
    width - offset * 2,
    height - offset * 2,
  );
  ctx.setLineDash(oldDash);
}

export function drawUnderline(
  ctx: CanvasRenderingContext2D,
  pointList: Array<Point>,
  underline: EUnderLine,
) {
  const [start, end] = pointList;
  const offset = dpr();
  const list: Array<Point> = [
    [start[0], start[1] - offset],
    [end[0], end[1] - offset],
  ];
  if (underline === EUnderLine.DOUBLE) {
    const t = offset * 2;
    list.push([start[0], start[1] - t], [end[0], end[1] - t]);
  }
  drawLines(ctx, list);
}

export function resizeCanvas(
  canvas: HTMLCanvasElement,
  width: number,
  height: number
): void {
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";
  const realWidth = npx(width);
  const realHeight = npx(height);
  canvas.width = realWidth;
  canvas.height = realHeight;
}