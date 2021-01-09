import { isEmpty } from "lodash-es";
import { EBorderLineType, CanvasOption } from "@/controller/interface";
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
import { IController, IModelValue, IScrollValue, CellInfo } from "@/types";
import { Selection } from "./Selection";

export const HEADER_STYLE: Omit<CanvasOption, "direction"> = {
  textAlign: "center",
  textBaseline: "middle",
  font: `500 ${npx(12)}px 'Source Sans Pro',sans-serif`,
  fillStyle: EDefaultFillColor.ROW_COL_HEADER,
  lineWidth: thinLineWidth(),
  strokeStyle: EDefaultStrokeColor.GRID,
};

export class Draw {
  protected canvas: HTMLCanvasElement;
  protected ctx: CanvasRenderingContext2D;
  protected controller: IController;
  protected selection: Selection;
  constructor(controller: IController, canvas: HTMLCanvasElement) {
    this.controller = controller;
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    assert(!!ctx);
    this.ctx = ctx;
    const { width, height } = this.getCanvasSize();
    this.selection = new Selection(width, height);
    this.resize(width, height);
    const size = dpr();
    this.scale(size, size);
  }
  setActiveCell(data: CellInfo): void {
    this.selection.setActiveCell(data);
    this.ctx.drawImage(this.selection.canvas, 0, 0);
  }
  protected resize(width: number, height: number): void {
    const { canvas } = this;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    canvas.width = npx(width);
    canvas.height = npx(height);
    this.selection.resize(width, height);
  }

  protected scale(x: number, y: number): void {
    this.ctx.scale(x, y);
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
  render(scroll: IScrollValue, model: IModelValue): void {
    const { width, height } = this.getCanvasSize();
    const config = model.getRowTitleHeightAndColTitleWidth();
    this.resize(width, height);
    this.renderGrid(scroll, model);
    this.renderRowsHeader(scroll, model);
    this.renderColsHeader(scroll, model);
    this.renderTriangle(config);
    this.renderContent(model);
  }
  protected renderContent(model: IModelValue): void {
    const data = model.getCellsContent();
    console.log("renderContent", data);
    if (isEmpty(data)) {
      return;
    }
    this.save();
    this.setAttributes({
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
  }
  protected renderTriangle(config: IWindowSize): void {
    const offset = 2;
    const path = new Path2D();
    path.moveTo(npx(config.width / 2 - offset), npx(config.height - offset));
    path.lineTo(npx(config.width - offset), npx(config.height - offset));
    path.lineTo(npx(config.width - offset), npx(offset));

    this.save();
    this.setAttributes({
      fillStyle: EDefaultBackgroundColor.ROW_COL_HEADER,
    });
    this.fillRect(0, 0, config.width, config.height);
    this.setAttributes({
      fillStyle: EDefaultFillColor.SELECT_ALL_TRIANGLE,
    });
    this.fill(path);
    this.restore();
  }

  protected renderGrid(scroll: IScrollValue, model: IModelValue): void {
    const { rowIndex, colIndex } = scroll;
    const { rowCount, colCount } = model.getSheetInfo();
    const cell = model.queryCell(0, 0);
    const config = model.getRowTitleHeightAndColTitleWidth();
    const { width, height } = this.getDrawSize(config);
    const lineWidth = thinLineWidth();
    this.save();
    this.setAttributes({
      fillStyle: EDefaultBackgroundColor.CONTENT,
      lineWidth,
      strokeStyle: EDefaultStrokeColor.GRID,
    });
    this.translate(config.width, config.height);
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
    this.line(pointList);
    this.restore();
  }
  protected renderRowsHeader(scroll: IScrollValue, model: IModelValue): void {
    const { rowIndex } = scroll;
    const { rowCount } = model.getSheetInfo();
    const config = model.getRowTitleHeightAndColTitleWidth();
    const cell = model.queryCell(0, 0);
    const { height } = this.getDrawSize(config);
    this.save();
    this.setAttributes({ fillStyle: EDefaultBackgroundColor.ROW_COL_HEADER });
    this.fillRect(0, config.height, config.width, height);
    this.setAttributes(HEADER_STYLE);
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
    this.line(pointList);
    this.restore();
  }
  protected renderColsHeader(scroll: IScrollValue, model: IModelValue): void {
    const { colIndex } = scroll;
    const { colCount } = model.getSheetInfo();
    const config = model.getRowTitleHeightAndColTitleWidth();
    const cell = model.queryCell(0, 0);
    const { width } = this.getDrawSize(config);
    const pointList = [];
    this.save();
    this.setAttributes({ fillStyle: EDefaultBackgroundColor.ROW_COL_HEADER });
    this.fillRect(config.width, 0, width, config.height);
    this.setAttributes(HEADER_STYLE);
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
    this.line(pointList);
    this.restore();
  }
}
