import { splitToWords } from '../util/split';
import { getThemeColor, sizeConfig } from '../theme';
import { npx, dpr } from '../util/dpr';
import { makeFont } from '../util/style';
import {
  DEFAULT_FONT_SIZE,
  ERROR_SET,
  MERGE_CELL_LINE_BREAK,
  DEFAULT_FORMAT_CODE,
  DEFAULT_LINE_WIDTH,
  BORDER_TYPE_MAP,
  type ErrorTypes,
} from '../util/constant';
import {
  CanvasOverlayPosition,
  Point,
  EUnderLine,
  IWindowSize,
  ModelCellType,
  StyleType,
  EHorizontalAlign,
  EVerticalAlign,
  BorderItem,
  ThemeType,
  BorderType,
} from '../types';
import { numberFormat, isDateFormat } from '../model/numberFormat';
import { isMergeContent } from '../util/util';

const measureTextMap = new Map<string, IWindowSize>();

export function measureText(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
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
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
): void {
  ctx.fillRect(npx(x), npx(y), npx(width), npx(height));
}
/* jscpd:ignore-start */
export function strokeRect(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
): void {
  ctx.strokeRect(npx(x), npx(y), npx(width), npx(height));
}

export function clearRect(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
): void {
  ctx.clearRect(npx(x), npx(y), npx(width), npx(height));
}
/* jscpd:ignore-end */

export function fillText(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
) {
  ctx.fillText(text, npx(x), npx(y));
}

export function drawLines(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
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
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
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

export function getDoubleLine(
  pointList: Point[],
  position: 'top' | 'bottom' | 'left' | 'right',
  isShort: boolean,
) {
  const result = pointList.slice();
  const [start, end] = pointList;
  const t = DEFAULT_LINE_WIDTH * 2;
  const other = isShort ? t : 0;
  if (position === 'bottom') {
    result.push([start[0] + other, start[1] - t], [end[0] - other, end[1] - t]);
  } else if (position === 'top') {
    result.push([start[0] + other, start[1] + t], [end[0] - other, end[1] + t]);
  } else if (position === 'left') {
    result.push([start[0] + t, start[1] + other], [end[0] + t, end[1] - other]);
  } else if (position === 'right') {
    result.push([start[0] - t, start[1] + other], [end[0] - t, end[1] - other]);
  }
  return result;
}

function splitWords(
  text: string,
  isWrapText?: boolean,
  isMergeContent?: boolean,
): string[] {
  if (isMergeContent) {
    if (isWrapText) {
      return text.split(MERGE_CELL_LINE_BREAK);
    } else {
      return splitToWords(text.replaceAll(MERGE_CELL_LINE_BREAK, ''));
    }
  } else {
    return splitToWords(text);
  }
}

export function drawAntLine(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  ctx.setLineDash([npx(8), npx(6)]);
  const offset = DEFAULT_LINE_WIDTH;
  strokeRect(
    ctx,
    x + offset,
    y + offset,
    width - offset * 2,
    height - offset * 2,
  );
  ctx.setLineDash([]);
}

function getLineDash(type?: BorderType) {
  let dash: number[] = [];
  if (type === 'hair') {
    dash = [DEFAULT_LINE_WIDTH, DEFAULT_LINE_WIDTH];
  } else if (type === 'dotted' || type === 'mediumDashed') {
    dash = [DEFAULT_LINE_WIDTH * 2, DEFAULT_LINE_WIDTH * 2];
  } else if (type === 'dashed') {
    dash = [DEFAULT_LINE_WIDTH * 4, DEFAULT_LINE_WIDTH * 4];
  } else if (type === 'dashDot' || type === 'mediumDashDot') {
    dash = [
      DEFAULT_LINE_WIDTH * 4,
      DEFAULT_LINE_WIDTH * 4,
      DEFAULT_LINE_WIDTH * 8,
      DEFAULT_LINE_WIDTH * 4,
    ];
  } else if (type === 'dashDotDot' || type === 'mediumDashDotDot') {
    dash = [
      DEFAULT_LINE_WIDTH * 4,
      DEFAULT_LINE_WIDTH * 4,
      DEFAULT_LINE_WIDTH * 8,
      DEFAULT_LINE_WIDTH * 4,
      DEFAULT_LINE_WIDTH * 4,
      DEFAULT_LINE_WIDTH * 4,
    ];
  }
  return dash;
}

export function renderBorderItem(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  cellInfo: CanvasOverlayPosition,
  borderItem: BorderItem | undefined,
  position: 'top' | 'bottom' | 'left' | 'right',
  theme?: ThemeType,
) {
  if (!borderItem) {
    return;
  }
  const { top, left, width, height } = cellInfo;

  let list: Point[] = [];
  if (position === 'top') {
    list = [
      [left, top],
      [left + width, top],
    ];
  } else if (position === 'bottom') {
    list = [
      [left, top + height],
      [left + width, top + height],
    ];
  } else if (position === 'left') {
    list = [
      [left, top],
      [left, top + height],
    ];
  } else if (position === 'right') {
    list = [
      [left + width, top],
      [left + width, top + height],
    ];
  }
  const { type, color } = borderItem;
  ctx.lineWidth = BORDER_TYPE_MAP[type];
  ctx.strokeStyle = color || getThemeColor('black', theme);
  const lineDash = getLineDash(type);
  if (type === 'double') {
    list = getDoubleLine(list, position, true);
  }
  if (lineDash.length > 0) {
    ctx.setLineDash(lineDash.map((v) => npx(v)));
  }
  drawLines(ctx, list);
  if (lineDash.length > 0) {
    ctx.setLineDash([]);
  }
}

type TextItem = { str: string; width: number; height: number };
export function renderCell(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  position: CanvasOverlayPosition,
  cellInfo: ModelCellType,
  isMergeCell?: boolean,
  theme?: ThemeType,
): IWindowSize {
  const value = cellInfo.value;
  const result: IWindowSize = { height: 0, width: 0 };
  if (value === '') {
    return result;
  }
  const format = cellInfo?.numberFormat || DEFAULT_FORMAT_CODE;
  const isRight = format === DEFAULT_FORMAT_CODE && typeof value === 'number';
  const text = numberFormat(value, format);
  const fontSize = cellInfo?.fontSize ? cellInfo.fontSize : DEFAULT_FONT_SIZE;
  const font = makeFont(
    cellInfo?.isItalic ? 'italic' : 'normal',
    cellInfo?.isBold ? 'bold' : '500',
    npx(fontSize),
    cellInfo?.fontFamily,
  );

  // draw background color
  if (cellInfo?.fillColor) {
    ctx.fillStyle = cellInfo?.fillColor;
    fillRect(ctx, position.left, position.top, position.width, position.height);
  }
  // error text
  let fillStyle = cellInfo?.fontColor || getThemeColor('contentColor', theme);
  if (ERROR_SET.has(text as ErrorTypes)) {
    fillStyle = getThemeColor('errorFormulaColor', theme);
  }

  ctx.font = font;
  ctx.fillStyle = fillStyle;

  const realStyle = { ...cellInfo };
  let align = realStyle?.horizontalAlign;
  if (realStyle?.horizontalAlign === undefined && isRight) {
    align = EHorizontalAlign.RIGHT;
  }
  realStyle.horizontalAlign = align;

  // show all date text
  const isDate = !realStyle?.isWrapText && isDateFormat(format);
  const texts = isDate
    ? [text]
    : splitWords(text, cellInfo?.isWrapText, isMergeCell);
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
    position,
    realStyle,
    isMergeContent(Boolean(isMergeCell), text),
  );
  if (width > 0 && height > 0) {
    const lineGap = Math.ceil((fontSize * (sizeConfig.lineHeight - 1)) / 2);
    let list: Point[] = [];
    for (const item of resultList) {
      fillText(ctx, item.text, item.x, item.y);
      if (realStyle?.underline) {
        ctx.strokeStyle = fillStyle;
        const t = item.y + item.height + lineGap / 2;
        const point: Point[] = [
          [item.x, t],
          [item.x + item.width, t],
        ];
        if (realStyle?.underline === EUnderLine.DOUBLE) {
          list = list.concat(getDoubleLine(point, 'bottom', false));
        } else {
          list = list.concat(point);
        }
      }
      if (realStyle?.isStrike) {
        ctx.strokeStyle = fillStyle;
        const t = item.y + item.height / 2 + lineGap / 2;
        list = list.concat([
          [item.x, t],
          [item.x + item.width, t],
        ]);
      }
    }
    // underline strike
    drawLines(ctx, list);
  }

  result.height = Math.ceil(height);
  result.width = Math.ceil(width);

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
