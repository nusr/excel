import { splitToWords } from '../util';
import { getThemeColor } from '../theme';
import { npx, dpr } from '../util';
import { makeFont } from '../util';
import {
  DEFAULT_FONT_SIZE,
  MERGE_CELL_LINE_BREAK,
  DEFAULT_FORMAT_CODE,
  DEFAULT_LINE_WIDTH,
  BORDER_TYPE_MAP,
  isEmpty,
  anyError,
} from '../util';
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
import { numberFormat, isDateFormat } from '../formula';

const measureTextMap = new Map<string, IWindowSize>();

export function measureText(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  char: string,
): IWindowSize {
  const mapKey = `${char}__${ctx.font}`;
  const t = measureTextMap.get(mapKey);
  if (t) {
    return t;
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
      return text.split(MERGE_CELL_LINE_BREAK).flatMap((line, index) => [
        ...(index > 0 ? ['\n'] : []),
        ...splitByLineBreak(line),
      ]);
    }
    text = text.replaceAll(MERGE_CELL_LINE_BREAK, '');
  }
  return splitByLineBreak(text);
}

function splitByLineBreak(text: string): string[] {
  return text.split(/(\r\n|\r|\n)/).flatMap((part) =>
    /^(\r\n|\r|\n)$/.test(part) ? ['\n'] : splitToWords(part),
  );
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
function splitLongWords(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  textList: TextItem[],
  maxWidth: number,
  fontSize: number,
): TextItem[] {
  return textList.flatMap((item) => {
    if (item.str === '\n' || item.width <= maxWidth) return [item];
    const graphemes = typeof Intl !== 'undefined' && typeof Intl.Segmenter === 'function'
      ? [...new Intl.Segmenter([], { granularity: 'grapheme' }).segment(item.str)]
        .map(({ segment }) => segment)
      : [...item.str];
    return graphemes.map((grapheme) => {
      const size = measureText(ctx, grapheme);
      return {
        str: grapheme,
        width: size.width,
        height: size.height === 0 ? fontSize : size.height,
      };
    });
  });
}

export function renderCell(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  position: CanvasOverlayPosition,
  cellInfo: ModelCellType,
  isMergeCell?: boolean,
  theme?: ThemeType,
): IWindowSize {
  const { value, formula: _formula, ...style } = cellInfo;
  const result: IWindowSize = { height: 0, width: 0 };
  if (value === '' && isEmpty(style)) {
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
  if (anyError(text)) {
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
  const measuredTexts: TextItem[] = texts.map((item) => {
    const size = measureText(ctx, item);
    return {
      str: item,
      width: size.width,
      height: size.height === 0 ? fontSize : size.height,
    };
  });
  const textList = realStyle?.isWrapText
    ? splitLongWords(
        ctx,
        measuredTexts,
        Math.max(0, position.width - Math.ceil(fontSize / 4)),
        fontSize,
      )
    : measuredTexts;

  // fill text
  const { width, height, resultList } = computeCell(
    textList,
    position,
    realStyle,
  );
  if (width > 0 && height > 0) {
    const lineGap = Math.ceil((fontSize * (1.5 - 1)) / 2);
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
) {
  const fontSize = style?.fontSize ? style.fontSize : DEFAULT_FONT_SIZE;
  const lineGap = Math.ceil((fontSize * (1.5 - 1)) / 2);
  const verticalAlign = style?.verticalAlign ?? EVerticalAlign.MIDDLE;
  const { left, top, height } = cellInfo;
  const width = style?.isWrapText
    ? cellInfo.width
    : Math.max(cellInfo.width, ...texts.map((v) => v.width));
  const lines: Array<{
    text: string;
    width: number;
    height: number;
  }> = [];
  const sourceLines: TextItem[][] = [[]];
  for (const item of texts) {
    if (item.str === '\n') sourceLines.push([]);
    else sourceLines[sourceLines.length - 1].push(item);
  }

  for (const sourceLine of sourceLines) {
    if (style?.isWrapText) {
      const maxLineWidth = Math.max(0, width - lineGap);
      let line = '';
      let lineWidth = 0;
      let lineHeight = 0;
      const addLine = () => {
        lines.push({
          text: line,
          width: lineWidth,
          height: lineHeight || fontSize,
        });
        line = '';
        lineWidth = 0;
        lineHeight = 0;
      };
      for (const item of sourceLine) {
        if (line && lineWidth + item.width > maxLineWidth) addLine();
        line += item.str;
        lineWidth += item.width;
        lineHeight = Math.max(lineHeight, item.height);
      }
      addLine();
    } else {
      let line = '';
      let lineWidth = 0;
      let lineHeight = 0;
      let remainingWidth = width;
      for (const item of sourceLine) {
        if (remainingWidth < item.width) break;
        line += item.str;
        lineWidth += item.width;
        lineHeight = Math.max(lineHeight, item.height);
        remainingWidth -= item.width;
      }
      lines.push({
        text: line,
        width: lineWidth,
        height: lineHeight || fontSize,
      });
    }
  }

  const textWidth = Math.max(0, ...lines.map((line) => line.width)) + lineGap;
  const contentHeight = lines.reduce((total, line, index) =>
    total + line.height + (style?.isWrapText || index > 0 ? lineGap * 2 : 0), 0);
  const textHeight = Math.max(contentHeight, fontSize * 1.5) + lineGap;
  if (textWidth > width || textHeight > height) {
    return { width: textWidth, height: textHeight, resultList: [] };
  }

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
  let lineTop = y;
  const resultList = [];
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];
    if (line.text) {
      resultList.push({
        text: line.text,
        x: x + (style?.horizontalAlign === EHorizontalAlign.CENTER
          ? (textWidth - lineGap - line.width) / 2
          : style?.horizontalAlign === EHorizontalAlign.RIGHT
            ? textWidth - lineGap - line.width
            : 0),
        y: lineTop,
        width: line.width,
        height: line.height,
      });
    }
    lineTop += line.height + (style?.isWrapText || index < lines.length - 1 ? lineGap * 2 : 0);
  }
  return {
    width: textWidth,
    height: textHeight,
    resultList,
  };
}
