import { isEmpty } from "lodash-es";
import { EBorderLineType, CanvasOption } from "./interface";
import {
  EDefaultBackgroundColor,
  thinLineWidth,
  EDefaultStrokeColor,
  EDefaultFillColor,
  npx,
  assert,
  IWindowSize,
  getWidthHeight,
  dpr,
  npxLine,
  intToColumnName,
  isNumber,
} from "@/util";
import type { ScrollValue } from "./scroll";
import type { IModelValue } from "./model";

export const HEADER_STYLE = {
  textAlign: "center",
  textBaseline: "middle",
  font: `500 ${npx(12)}px 'Source Sans Pro',sans-serif`,
  fillStyle: EDefaultFillColor.ROW_COL_HEADER,
  lineWidth: thinLineWidth(),
  strokeStyle: EDefaultStrokeColor.GRID,
};

export class Draw {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    assert(ctx !== null, "[Draw] init canvas context error");
    this.ctx = ctx;
    const { width, height } = this.getCanvasSize();
    this.resize(width, height);
    const size = dpr();
    this.scale(size, size);
  }

  protected resize(width: number, height: number): this {
    const { canvas } = this;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    canvas.width = npx(width);
    canvas.height = npx(height);
    return this;
  }

  protected scale(x: number, y: number): this {
    this.ctx.scale(x, y);
    return this;
  }
  clear(): this {
    const { width, height } = this.canvas;
    this.ctx.clearRect(0, 0, width, height);
    return this;
  }
  clearRect(x: number, y: number, width: number, height: number): this {
    this.ctx.clearRect(x, y, width, height);
    return this;
  }
  save(): this {
    this.ctx.save();
    this.ctx.beginPath();
    return this;
  }
  restore(): this {
    this.ctx.restore();
    return this;
  }
  beginPath(): this {
    this.ctx.beginPath();
    return this;
  }
  stroke(): this {
    this.ctx.stroke();
    return this;
  }
  translate(x: number, y: number): this {
    this.ctx.translate(npx(x), npx(y));
    return this;
  }
  fill(path: Path2D, fillRule: "evenodd" | "nonzero" = "nonzero"): this {
    this.ctx.fill(path, fillRule);
    return this;
  }
  fillRect(x: number, y: number, width: number, height: number): this {
    this.ctx.fillRect(npx(x) - 0.5, npx(y) - 0.5, npx(width), npx(height));
    return this;
  }
  fillText(text: string | number, x: number, y: number): this {
    this.ctx.fillText(String(text), npx(x), npx(y));
    return this;
  }
  setAttributes(options: Partial<CanvasOption>): this {
    Object.assign(this.ctx, options);
    return this;
  }
  border(lineType: EBorderLineType, color: string): this | Error {
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
        return new Error(
          `[border] not found lineType: ${lineType}, color: ${color}`
        );
    }
    return this;
  }

  line(pointList: Array<Array<number>>): this {
    assert(pointList?.length > 0);
    const { ctx } = this;
    ctx.beginPath();
    for (let i = 0; i < pointList.length; i += 2) {
      const first = pointList[i];
      const second = pointList[i + 1];
      ctx.moveTo(npxLine(first[0]), npxLine(first[1]));
      ctx.lineTo(npxLine(second[0]), npxLine(second[1]));
    }
    ctx.stroke();
    return this;
  }
  getCanvasSize(): IWindowSize {
    const { width, height } = getWidthHeight();
    const toolbarDom = document.querySelector("#tool-bar-container");
    const sheetBarDom = document.querySelector("#sheet-bar-container");
    assert(toolbarDom !== null);
    assert(sheetBarDom !== null);
    const toolbarSize = toolbarDom.getBoundingClientRect();
    const sheetBarSize = sheetBarDom.getBoundingClientRect();
    return {
      width,
      height: height - toolbarSize.height - sheetBarSize.height,
    };
  }
  protected getDrawSize(config: IWindowSize): IWindowSize {
    const size = this.getCanvasSize();
    const width = size.width - config.width;
    const height = size.height - config.height;
    return {
      width,
      height,
    };
  }
  render(scroll: ScrollValue, model: IModelValue): this {
    const { width, height } = this.getCanvasSize();
    const config = model.getRowTitleHeightAndColTitleWidth();
    this.resize(width, height);
    this.renderGrid(scroll, model);
    this.renderRowsHeader(scroll, model);
    this.renderColsHeader(scroll, model);
    this.renderTriangle(config);
    this.renderContent(scroll, model);
    return this;
  }
  protected renderContent(scroll: ScrollValue, model: IModelValue): this {
    const data = model.getCellsContent();
    console.log("renderContent", data);
    if (isEmpty(data)) {
      return this;
    }
    this.save().setAttributes({
      textAlign: "left",
      textBaseline: "middle",
      font: `500 ${npx(12)}px 'Source Sans Pro',sans-serif`,
    });
    for (const item of data) {
      const { value, left, top, height, width } = item;
      const isNum = isNumber(value);
      this.setAttributes({ textAlign: isNum ? "right" : "left" });
      this.fillText(value, left + (isNum ? width : 0), top + height / 2);
    }
    this.restore();
    return this;
  }
  protected renderTriangle(config: IWindowSize): this {
    const offset = 2;
    const path = new Path2D();
    path.moveTo(npx(config.width / 2 - offset), npx(config.height - offset));
    path.lineTo(npx(config.width - offset), npx(config.height - offset));
    path.lineTo(npx(config.width - offset), npx(offset));

    this.save()
      .setAttributes({
        fillStyle: EDefaultBackgroundColor.ROW_COL_HEADER,
      })
      .fillRect(0, 0, config.width, config.height)
      .setAttributes({
        fillStyle: EDefaultFillColor.SELECT_ALL_TRIANGLE,
      })
      .fill(path)
      .restore();
    return this;
  }

  protected renderGrid(scroll: ScrollValue, model: IModelValue): void {
    const { rowIndex, colIndex } = scroll;
    const { rowCount, colCount } = model;
    const cell = model.queryCell(0, 0);
    const config = model.getRowTitleHeightAndColTitleWidth();
    const { width, height } = this.getDrawSize(config);
    const lineWidth = thinLineWidth();
    this.save()
      .setAttributes({
        fillStyle: EDefaultBackgroundColor.CONTENT,
        lineWidth,
        strokeStyle: EDefaultStrokeColor.GRID,
      })
      .translate(config.width, config.height);
    this.clear();
    const pointList = [];
    let y = 0;
    let x = 0;
    for (let i = rowIndex; i <= rowCount; i++) {
      pointList.push([0, y], [width, y]);
      y += cell.height;
      if (y > height) {
        break;
      }
    }
    for (let i = colIndex; i <= colCount; i++) {
      pointList.push([x, 0], [x, y]);
      x += cell.width;
      if (x > width) {
        break;
      }
    }
    pointList.push([0, height], [width, height], [width, 0], [width, height]);
    this.line(pointList).restore();
  }
  protected renderRowsHeader(scroll: ScrollValue, model: IModelValue): void {
    const { rowIndex } = scroll;
    const { rowCount } = model;
    const config = model.getRowTitleHeightAndColTitleWidth();
    const cell = model.queryCell(0, 0);
    const { height } = this.getDrawSize(config);
    this.save()
      .setAttributes({ fillStyle: EDefaultBackgroundColor.ROW_COL_HEADER })
      .fillRect(0, config.height, config.width, height)
      .setAttributes(HEADER_STYLE);
    const pointList = [];
    let y = config.height;
    let i = rowIndex;
    for (; i < rowCount; i++) {
      let temp = y;
      if (i === rowIndex) {
        temp += HEADER_STYLE.lineWidth / 2;
      }
      pointList.push([0, temp], [config.width, temp]);
      this.fillText(i + 1, config.width / 2, temp + cell.height / 2);
      y += cell.height;
      if (y > height) {
        break;
      }
    }
    this.fillText(i + 1, config.width / 2, y + cell.height / 2);
    pointList.push([0, y], [config.width, y], [0, 0], [0, y]);
    this.line(pointList).restore();
  }
  protected renderColsHeader(scroll: ScrollValue, model: IModelValue): void {
    const { colIndex } = scroll;
    const { colCount } = model;
    const config = model.getRowTitleHeightAndColTitleWidth();
    const cell = model.queryCell(0, 0);
    const { width } = this.getDrawSize(config);
    const pointList = [];
    this.save()
      .setAttributes({ fillStyle: EDefaultBackgroundColor.ROW_COL_HEADER })
      .fillRect(config.width, 0, width, config.height)
      .setAttributes(HEADER_STYLE);
    let x = config.width;
    let i = colIndex;
    for (; i < colCount; i++) {
      let temp = x;
      if (i === colIndex) {
        temp += HEADER_STYLE.lineWidth / 2;
      }
      pointList.push([temp, 0], [temp, config.height]);
      this.fillText(
        intToColumnName(i + 1),
        temp + cell.width / 2,
        config.height / 2 + dpr()
      );
      x += cell.width;
      if (x > width) {
        break;
      }
    }
    this.fillText(
      intToColumnName(i + 1),
      x + cell.width / 2,
      config.height / 2 + dpr()
    );
    pointList.push([x, 0], [x, config.height], [0, 0], [x, 0]);
    this.line(pointList).restore();
  }
}
