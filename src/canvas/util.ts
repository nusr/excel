import {
  npx,
  DEFAULT_FONT_CONFIG,
  DEFAULT_FONT_SIZE,
  makeFont,
  ERROR_SET,
  dpr,
  isEmpty,
  splitToWords,
  sizeConfig,
  getThemeColor,
  MERGE_CELL_LINE_BREAK,
  DEFAULT_FORMAT,
  isNumber,
} from '@/util';
import {
  ModelCellType,
  CanvasOverlayPosition,
  ErrorTypes,
  Point,
  EUnderLine,
  IController,
  IWindowSize,
  IRange,
  ResultType,
  StyleType,
  EHorizontalAlign,
} from '@/types';
import { numberFormat } from '@/model'

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

interface IRenderCellResult {
  height: number;
  width: number;
  fontSizeHeight?: number;
}

function drawUnderlineData(
  ctx: CanvasRenderingContext2D,
  isNum: boolean,
  style: ModelCellType['style'],
  textHeight: number,
  x: number,
  y: number,
  textWidth: number,
) {
  let list: Point[] = [];
  if (style?.underline) {
    let pointList: Point[] = [];
    const isDouble = style?.underline === EUnderLine.DOUBLE;
    const t = Math.floor(y + textHeight);
    if (isNum) {
      pointList = [
        [x - textWidth, t],
        [x, t],
      ];
    } else {
      pointList = [
        [x, t],
        [x + textWidth, t],
      ];
    }
    list = list.concat(getPointList(pointList, isDouble));
  }
  if (style?.isStrike) {
    let pointList: Point[] = [];
    const t = Math.floor(y + textHeight * 0.2);
    if (isNum) {
      pointList = [
        [x - textWidth, t],
        [x, t],
      ];
    } else {
      pointList = [
        [x, t],
        [x + textWidth, t],
      ];
    }
    list = list.concat(getPointList(pointList, false));
  }
  drawLines(ctx, list);
}

export function renderCellData(
  controller: IController,
  ctx: CanvasRenderingContext2D,
  range: IRange,
): IWindowSize {
  let cellInfo = controller.getCell(range);
  const result: IWindowSize = {
    width: 0,
    height: 0,
  };
  if (!cellInfo) {
    return result;
  }
  const cellSize = controller.getCellSize(range);
  if (cellSize.width <= 0 || cellSize.height <= 0) {
    return result;
  }
  const position = controller.computeCellPosition(range);
  const newSize = renderCell(
    ctx,
    {
      top: position.top,
      left: position.left,
      width: cellSize.width,
      height: cellSize.height,
    },
    cellInfo.value,
    cellInfo.style,
  );
  return newSize;
}

export function renderCell(
  ctx: CanvasRenderingContext2D,
  cellInfo: CanvasOverlayPosition,
  value: ResultType,
  style?: Partial<StyleType>,
  isMergeContent?: boolean,
): IRenderCellResult {
  const { left, top, width, height } = cellInfo;
  const result: IRenderCellResult = { height: 0, width: 0 };
  const format = style?.numberFormat ?? DEFAULT_FORMAT;
  const isRight = format === DEFAULT_FORMAT && isNumber(value);
  const text = numberFormat(format, value);
  if (!text && isEmpty(style)) {
    return result;
  }
  let font = DEFAULT_FONT_CONFIG;
  let fillStyle: string = getThemeColor('contentColor');
  const fontSize = style?.fontSize ? style.fontSize : DEFAULT_FONT_SIZE;
  if (!isEmpty(style)) {
    font = makeFont(
      style?.isItalic ? 'italic' : 'normal',
      style?.isBold ? 'bold' : '500',
      npx(fontSize),
      style?.fontFamily,
    );
    fillStyle = style?.fontColor || getThemeColor('contentColor');
    if (style?.fillColor) {
      ctx.fillStyle = style?.fillColor;
      fillRect(ctx, left, top, width, height);
    }
  }
  if (ERROR_SET.has(text as ErrorTypes)) {
    fillStyle = getThemeColor('errorFormulaColor');
  }

  const lineGap = Math.ceil((fontSize * (sizeConfig.lineHeight - 1)) / 2);
  let offsetX = 0;

  const align = isRight ? EHorizontalAlign.RIGHT : style?.horizontalAlign;
  if (align === EHorizontalAlign.CENTER) {
    ctx.textAlign = 'center';
    offsetX = Math.ceil(width / 2 + lineGap);
  } else if (align === EHorizontalAlign.RIGHT) {
    ctx.textAlign = 'right';
    offsetX = width - lineGap;
  } else {
    ctx.textAlign = 'left';
    offsetX = lineGap;
  }

  ctx.font = font;
  ctx.fillStyle = fillStyle;
  ctx.textBaseline = 'middle';

  if (style?.underline) {
    ctx.strokeStyle = fillStyle;
  }

  const textHeight = Math.ceil(fontSize * sizeConfig.lineHeight);
  const x = left + offsetX;
  result.height = textHeight;
  if (style?.isWrapText) {
    if (isMergeContent) {
      result.height = lineGap * 2;
      let y = top + result.height;
      const texts = text.split(MERGE_CELL_LINE_BREAK);
      for (let i = 0;i < texts.length;i++) {
        y += lineGap;
        const item = texts[i];
        const size = measureText(ctx, item);
        result.width = Math.max(result.width, size.width);
        fillText(ctx, item, x, y);
        drawUnderlineData(ctx, isRight, style, size.height, x, y, size.width);
        y += size.height + lineGap;
        result.height += size.height + lineGap * 2;
      }
    } else {
      const texts = splitToWords(text);
      result.height = lineGap * 2;
      let y = top + result.height;
      let line = '';
      let textWidth = 0;
      let h = 0;
      for (let i = 0;i < texts.length;i++) {
        const testLine = line + texts[i];
        const size = measureText(ctx, testLine);
        if (size.width > width) {
          y += lineGap;
          if (i === 0) {
            textWidth = size.width;
            h = size.height;
            fillText(ctx, texts[i], x, y);
            line = '';
          } else {
            fillText(ctx, line, x, y);
            line = texts[i];
          }
          drawUnderlineData(ctx, isRight, style, h, x, y, textWidth);
          y += h + lineGap;
          result.height += h + lineGap * 2;
          result.width = Math.max(textWidth, result.width);
        } else {
          textWidth = size.width;
          h = size.height;
          line = testLine;
        }
      }
      if (line) {
        result.height += h + lineGap;
        result.width = Math.max(textWidth, result.width);
        fillText(ctx, line, x, y);
        drawUnderlineData(ctx, isRight, style, h, x, y, textWidth);
      }
      result.width += lineGap * 2;
    }
  } else {
    const texts = splitToWords(
      isMergeContent ? text.replaceAll(MERGE_CELL_LINE_BREAK, '') : text,
    );
    let line = '';
    let textWidth = 0;
    let h = 0;

    for (let i = 0;i < texts.length;i++) {
      const testLine = line + texts[i];
      const size = measureText(ctx, testLine);
      if (size.width > width) {
        if (i === 0) {
          textWidth = size.width;
          h = size.height;
          line = testLine;
        }
        break;
      } else {
        textWidth = size.width;
        h = size.height;
        line = testLine;
      }
    }
    const t = h > height ? h : height;
    const y = top + t / 2;
    result.height = h;
    fillText(ctx, line, x, y);
    drawUnderlineData(ctx, isRight, style, h, x, y, textWidth);
    result.width = textWidth + lineGap * 2;
  }
  result.height = Math.ceil(result.height);
  result.width = Math.ceil(result.width);
  return result;
}

export function drawLines(
  ctx: CanvasRenderingContext2D,
  pointList: Point[],
): void {
  if (pointList.length === 0) {
    return;
  }
  ctx.beginPath();
  for (let i = 0;i < pointList.length;i += 2) {
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
