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
  dpr,
  isEmpty,
  splitToWords,
  convertResultTypeToString,
} from '@/util';
import {
  ModelCellType,
  CanvasOverlayPosition,
  ErrorTypes,
  Point,
  EUnderLine,
  IController,
} from '@/types';

const measureTextMap = new Map<string, number>();

export function measureText(
  ctx: CanvasRenderingContext2D,
  char: string,
): number {
  const mapKey = `${char}__${ctx.font}`;
  if (measureTextMap.has(mapKey)) {
    return measureTextMap.get(mapKey)!;
  }
  const { width } = ctx.measureText(char);
  const result = Math.ceil(width / dpr());
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
  wrapHeight?: number;
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
    const t = Math.floor(y + textHeight * (isDouble ? 0.7 : 0.6));
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
  if (list.length > 0) {
    drawLines(ctx, list);
  }
}

export function renderCellData(
  controller: IController,
  ctx: CanvasRenderingContext2D,
  row: number,
  col: number,
): boolean {
  const range = {
    row,
    col,
    colCount: 1,
    rowCount: 1,
    sheetId: '',
  };
  const cellInfo = controller.getCell(range);
  if (!cellInfo) {
    return false;
  }
  const cellSize = controller.getCellSize(range);
  if (cellSize.width <= 0 || cellSize.height <= 0) {
    return false;
  }
  const position = controller.computeCellPosition(range);
  const { wrapHeight = 0 } = renderCell(ctx, {
    ...cellInfo,
    top: position.top,
    left: position.left,
    width: cellSize.width,
    height: cellSize.height,
  });
  if (wrapHeight > cellSize.height) {
    controller.setRowHeight(row, wrapHeight, false);
  }
  return true;
}

export function renderCell(
  ctx: CanvasRenderingContext2D,
  cellInfo: ModelCellType & CanvasOverlayPosition,
): IRenderCellResult {
  const result: IRenderCellResult = {};
  const { style, value, left, top, width, height } = cellInfo;
  if (isEmpty(cellInfo.value) && isEmpty(cellInfo.style)) {
    return result;
  }
  const isNum = isNumber(value);
  let font = DEFAULT_FONT_CONFIG;
  let fillStyle = DEFAULT_FONT_COLOR;
  const fontSize = style?.fontSize ? style.fontSize : DEFAULT_FONT_SIZE;
  if (!isEmpty(style)) {
    font = makeFont(
      style?.isItalic ? 'italic' : 'normal',
      style?.isBold ? 'bold' : '500',
      npx(fontSize),
      style?.fontFamily,
    );
    fillStyle = style?.fontColor || DEFAULT_FONT_COLOR;
    if (style?.fillColor) {
      ctx.fillStyle = style?.fillColor;
      fillRect(ctx, left, top, width, height);
    }
  }
  const text = convertResultTypeToString(value);
  if (ERROR_SET.has(text as ErrorTypes)) {
    fillStyle = ERROR_FORMULA_COLOR;
  }

  const texts = splitToWords(text);
  if (texts.length === 0) {
    return result;
  }
  ctx.textAlign = isNum ? 'right' : 'left';
  ctx.font = font;
  ctx.fillStyle = fillStyle;
  ctx.textBaseline = 'middle';
  if (texts.length === 0) {
    return result;
  }
  const x = left + (isNum ? width : 0);
  if (style?.underline) {
    ctx.strokeStyle = fillStyle;
  }
  const textHeight = fontSize + 2;
  if (style?.isWrapText) {
    let y = top;
    const offset = 2;
    for (let i = 0; i < texts.length; ) {
      let t = width;
      const lastIndex = i;
      while (i < texts.length) {
        const w = measureText(ctx, texts[i]);
        if (w < t) {
          t -= w;
          i++;
        } else {
          break;
        }
      }
      if (lastIndex !== i) {
        const textData: string[] = [];
        for (let k = lastIndex; k < i; k++) {
          textData.push(texts[k]);
        }

        y = y + Math.floor(textHeight / 2) + offset;
        const b = textData.join('');
        fillText(ctx, b, x, y);
        drawUnderlineData(ctx, isNum, style, textHeight, x, y, width);
        y += Math.floor(textHeight / 2);
      }
    }
    y += offset;
    result.wrapHeight = y - top;
  } else {
    const offset = Math.max(0, Math.floor(height - textHeight) / 2);
    const y = Math.floor(top + textHeight / 2 + offset);
    let textWidth = 0;
    const textData: string[] = [];
    let t = width;
    for (let i = 0; i < texts.length; i++) {
      const w = measureText(ctx, texts[i]);
      if (w < t) {
        t -= w;
        textData.push(texts[i]);
        textWidth += w;
      }
    }

    fillText(ctx, textData.join(''), x, y);
    drawUnderlineData(ctx, isNum, style, textHeight, x, y, textWidth);
  }
  return result;
}

export function drawLines(
  ctx: CanvasRenderingContext2D,
  pointList: Point[],
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
