import {
  npx,
  DEFAULT_FONT_SIZE,
  makeFont,
  ERROR_SET,
  dpr,
  isEmpty,
  splitToWords,
  sizeConfig,
  getThemeColor,
  MERGE_CELL_LINE_BREAK,
  DEFAULT_FORMAT_CODE,
  activeLineWidth,
} from '@/util';
import {
  CanvasOverlayPosition,
  ErrorTypes,
  BorderItem,
  Point,
  EUnderLine,
  IWindowSize,
  ResultType,
  StyleType,
  EHorizontalAlign,
  EVerticalAlign,
} from '@/types';
import { numberFormat, isDateFormat } from '@/model';

const measureTextMap = new Map<string, IWindowSize>();

export function measureText(
  ctx: CanvasRenderingContext2D,
  char: string,
): IWindowSize {
  const mapKey = `${char}__${ctx.font}`;
  if (measureTextMap.has(mapKey)) {
    return measureTextMap.get(mapKey)!;
  }
  const text = ctx.measureText(char);
  const { actualBoundingBoxAscent, actualBoundingBoxDescent } = text;
  const h = actualBoundingBoxAscent + actualBoundingBoxDescent;
  const w = text.width;
  const width = Math.ceil(w / dpr());
  const height = Math.ceil(h / dpr());
  const result = { width, height };
  measureTextMap.set(mapKey, result);
  return result;
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

export function fillText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
) {
  ctx.fillText(text, npx(x), npx(y));
}

export function drawLines(
  ctx: CanvasRenderingContext2D,
  pointList: Point[],
): void {
  if (pointList.length === 0) {
    return;
  }
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

export function getPointList(pointList: Point[], isExtra: boolean) {
  const [start, end] = pointList;
  const offset = dpr();
  const list: Point[] = [
    [start[0], start[1] - offset],
    [end[0], end[1] - offset],
  ];
  if (isExtra) {
    const t = offset * 2;
    list.push([start[0], start[1] - t], [end[0], end[1] - t]);
  }
  return list;
}

export function resizeCanvas(
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
): void {
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  const realWidth = npx(width);
  const realHeight = npx(height);
  canvas.width = realWidth;
  canvas.height = realHeight;
}

function splitWords(
  text: string,
  isWrapText?: boolean,
  isMergeContent?: boolean,
): string[] {
  if (isWrapText && isMergeContent) {
    return text.split(MERGE_CELL_LINE_BREAK);
  }
  if (isWrapText) {
    return splitToWords(text);
  }
  return splitToWords(
    isMergeContent ? text.replaceAll(MERGE_CELL_LINE_BREAK, '') : text,
  );
}

function getBorderStyle(border: BorderItem): {
  lineWidth: number;
  strokeStyle: string;
} {
  let strokeStyle = border.color || getThemeColor('black');
  let lineWidth = activeLineWidth();
  return {
    lineWidth,
    strokeStyle,
  };
}

export function renderBorder(
  ctx: CanvasRenderingContext2D,
  cellInfo: CanvasOverlayPosition,
  border: StyleType['border'],
) {
  const { top, left, width, height } = cellInfo;
  // top
  let borderStyle = getBorderStyle(border.top);
  ctx.lineWidth = borderStyle.lineWidth;
  ctx.strokeStyle = borderStyle.strokeStyle;
  drawLines(ctx, [
    [left, top],
    [left + width, top],
  ]);

  // bottom
  borderStyle = getBorderStyle(border.bottom);
  ctx.lineWidth = borderStyle.lineWidth;
  ctx.strokeStyle = borderStyle.strokeStyle;
  drawLines(ctx, [
    [left, top + height],
    [left + width, top + height],
  ]);

  // left
  borderStyle = getBorderStyle(border.left);
  ctx.lineWidth = borderStyle.lineWidth;
  ctx.strokeStyle = borderStyle.strokeStyle;
  drawLines(ctx, [
    [left, top],
    [left, top + height],
  ]);

  // right
  borderStyle = getBorderStyle(border.right);
  ctx.lineWidth = borderStyle.lineWidth;
  ctx.strokeStyle = borderStyle.strokeStyle;
  drawLines(ctx, [
    [left + width, top],
    [left + width, top + height],
  ]);
}

type TextItem = { str: string; width: number; height: number };
export function renderCell(
  ctx: CanvasRenderingContext2D,
  cellInfo: CanvasOverlayPosition,
  value: ResultType,
  style?: Partial<StyleType>,
  isMergeContent?: boolean,
): IWindowSize {
  const result: IWindowSize = { height: 0, width: 0 };
  if (value === '' && isEmpty(style)) {
    return result;
  }
  const format = style?.numberFormat || DEFAULT_FORMAT_CODE;
  const isRight = format === DEFAULT_FORMAT_CODE && typeof value === 'number';
  const text = numberFormat(value, format);
  const fontSize = style?.fontSize ? style.fontSize : DEFAULT_FONT_SIZE;
  const font = makeFont(
    style?.isItalic ? 'italic' : 'normal',
    style?.isBold ? 'bold' : '500',
    npx(fontSize),
    style?.fontFamily,
  );

  // draw background color
  if (style?.fillColor) {
    ctx.fillStyle = style?.fillColor;
    fillRect(ctx, cellInfo.left, cellInfo.top, cellInfo.width, cellInfo.height);
  }
  // error text
  let fillStyle = style?.fontColor || getThemeColor('contentColor');
  if (ERROR_SET.has(text as ErrorTypes)) {
    fillStyle = getThemeColor('errorFormulaColor');
  }

  ctx.font = font;
  ctx.fillStyle = fillStyle;

  const realStyle = style ? { ...style } : {};
  let align = realStyle?.horizontalAlign;
  if (realStyle?.horizontalAlign === undefined && isRight) {
    align = EHorizontalAlign.RIGHT;
  }
  realStyle.horizontalAlign = align;

  const texts = splitWords(text);
  const textList: TextItem[] = texts.map((item) => {
    const size = measureText(ctx, item);
    return {
      str: item,
      width: size.width,
      height: size.height === 0 ? fontSize : size.height,
    };
  });

  // fill text
  const { width, height, resultList } = computeCell(
    textList,
    cellInfo,
    realStyle,
    isMergeContent,
  );
  const lineGap = Math.ceil((fontSize * (sizeConfig.lineHeight - 1)) / 2);
  let list: Point[] = [];
  for (const item of resultList) {
    fillText(ctx, item.text, item.x, item.y);
    if (realStyle?.underline) {
      ctx.strokeStyle = fillStyle;
      const t = item.y + item.height + lineGap / 2;
      const p = getPointList(
        [
          [item.x, t],
          [item.x + item.width, t],
        ],
        realStyle?.underline === EUnderLine.DOUBLE,
      );
      list = list.concat(p);
    }
    if (realStyle?.isStrike) {
      ctx.strokeStyle = fillStyle;
      const t = item.y + item.height / 2 + lineGap / 2;
      const p = getPointList(
        [
          [item.x, t],
          [item.x + item.width, t],
        ],
        false,
      );
      list = list.concat(p);
    }
  }
  drawLines(ctx, list);

  result.height = Math.ceil(height);
  result.width = Math.ceil(width);
  if (!realStyle?.isWrapText && isDateFormat(format)) {
    // show all date info
    const temp = textList.reduce((prev, cur) => prev + cur.width, 0);
    result.width = Math.max(Math.ceil(temp), result.width);
  }

  return result;
}
function computeCell(
  texts: TextItem[],
  cellInfo: CanvasOverlayPosition,
  style?: Partial<StyleType>,
  isMergeContent?: boolean,
) {
  const fontSize = style?.fontSize ? style.fontSize : DEFAULT_FONT_SIZE;
  const lineGap = Math.ceil((fontSize * (sizeConfig.lineHeight - 1)) / 2);
  const verticalAlign = style?.verticalAlign ?? EVerticalAlign.MIDDLE;
  const { left, top, height } = cellInfo;
  const width = Math.max(cellInfo.width, ...texts.map((v) => v.width));
  const textList: Array<{
    text: string;
    x: number;
    y: number;
    width: number;
    height: number;
  }> = [];
  let textWidth = 0;
  let textHeight = 0;
  if (style?.isWrapText && isMergeContent) {
    let y = 0;
    for (let i = 0; i < texts.length; i++) {
      const item = texts[i];
      textWidth = Math.max(textWidth, item.width);
      const temp = item.height + lineGap * 2;
      textHeight += temp;
      textList.push({
        text: item.str,
        x: 0,
        y,
        width: item.width,
        height: item.height,
      });
      y += temp;
    }
  } else if (style?.isWrapText) {
    let y = 0;
    for (let i = 0; i < texts.length; ) {
      let temp = width;
      let line = '';
      let w = 0;
      let h = 0;
      while (i < texts.length) {
        const item = texts[i];
        if (temp >= item.width) {
          w += item.width;
          h = Math.max(h, item.height);
          temp -= item.width;
          line += item.str;
          i++;
        } else {
          break;
        }
      }
      if (line) {
        textWidth = Math.max(textWidth, w);
        const t = h + lineGap * 2;
        textHeight += t;
        textList.push({
          text: line,
          x: 0,
          y,
          width: w,
          height: h,
        });
        y += t;
      }
    }
  } else {
    let line = '';
    let temp = width;
    for (let i = 0; i < texts.length; i++) {
      const item = texts[i];
      if (temp >= item.width) {
        textWidth += item.width;
        textHeight = Math.max(textHeight, item.height);
        line += item.str;
        temp -= item.width;
      } else {
        break;
      }
    }
    textList.push({
      text: line,
      x: 0,
      y: 0,
      width: textWidth,
      height: textHeight,
    });
  }
  textHeight = Math.max(textHeight, fontSize * sizeConfig.lineHeight);
  textWidth += lineGap;
  textHeight += lineGap;
  if (textWidth <= width && textHeight <= height) {
    let x = left + lineGap;
    let y = top + (height - textHeight) / 2 + lineGap;
    if (verticalAlign === EVerticalAlign.TOP) {
      y = top + lineGap;
    } else if (verticalAlign === EVerticalAlign.BOTTOM) {
      y = top + (height - textHeight) + lineGap;
    }
    if (style?.horizontalAlign === EHorizontalAlign.CENTER) {
      x = left + (width - textWidth) / 2;
    } else if (style?.horizontalAlign === EHorizontalAlign.RIGHT) {
      x = left + (width - textWidth) - lineGap;
    }
    for (const item of textList) {
      item.x = item.x + x;
      item.y = item.y + y;
    }
  }
  return {
    width: textWidth,
    height: textHeight,
    resultList: textList,
  };
}
