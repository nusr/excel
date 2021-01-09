import { isEmpty } from "lodash-es";
import { CanvasOption } from "@/controller/interface";
import {
  EDefaultBackgroundColor,
  thinLineWidth,
  EDefaultStrokeColor,
  EDefaultFillColor,
  npx,
  dpr,
  intToColumnName,
  isNumber,
} from "@/util";
import { Controller } from "@/controller";
import { Base } from "./Base";

export const HEADER_STYLE: Omit<CanvasOption, "direction"> = {
  textAlign: "center",
  textBaseline: "middle",
  font: `500 ${npx(12)}px 'Source Sans Pro',sans-serif`,
  fillStyle: EDefaultFillColor.ROW_COL_HEADER,
  lineWidth: thinLineWidth(),
  strokeStyle: EDefaultStrokeColor.GRID,
};

export class Content extends Base {
  protected controller: Controller;
  constructor(controller: Controller, width: number, height: number) {
    super(width, height);
    this.controller = controller;
  }
  render(width: number, height: number): void {
    this.clear();
    this.resize(width, height);
    this.renderGrid();
    this.renderRowsHeader();
    this.renderColsHeader();
    this.renderTriangle();
    this.renderContent();
  }
  protected renderContent(): void {
    const { model } = this.controller;
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
  protected renderTriangle(): void {
    const { model } = this.controller;
    const config = model.getRowTitleHeightAndColTitleWidth();
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

  protected renderGrid(): void {
    const { scroll, model } = this.controller;
    const { rowIndex, colIndex } = scroll;
    const { rowCount, colCount } = model.getSheetInfo();
    const cell = model.queryCell(0, 0);
    const config = model.getRowTitleHeightAndColTitleWidth();
    const { width, height } = this.controller.getDrawSize(config);
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
  protected renderRowsHeader(): void {
    const { scroll, model } = this.controller;
    const { rowIndex } = scroll;
    const { rowCount } = model.getSheetInfo();
    const config = model.getRowTitleHeightAndColTitleWidth();
    const cell = model.queryCell(0, 0);
    const { height } = this.controller.getDrawSize(config);
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
  protected renderColsHeader(): void {
    const { scroll, model } = this.controller;
    const { colIndex } = scroll;
    const { colCount } = model.getSheetInfo();
    const config = model.getRowTitleHeightAndColTitleWidth();
    const cell = model.queryCell(0, 0);
    const { width } = this.controller.getDrawSize(config);
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
