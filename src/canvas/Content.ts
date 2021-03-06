import isEmpty from "lodash/isEmpty";
import { CanvasOption, CellInfo } from "@/types";
import {
  thinLineWidth,
  npx,
  dpr,
  intToColumnName,
  isNumber,
  makeFont,
  DEFAULT_FONT_SIZE,
  DEFAULT_FONT_COLOR,
} from "@/util";
import { Controller } from "@/controller";
import { Base } from "./Base";
import theme from "@/theme";

const DEFAULT_FONT = makeFont(undefined, "500", npx(DEFAULT_FONT_SIZE));

export const HEADER_STYLE: Omit<CanvasOption, "direction"> = {
  textAlign: "center",
  textBaseline: "middle",
  font: DEFAULT_FONT,
  fillStyle: theme.black,
  lineWidth: thinLineWidth(),
  strokeStyle: theme.gridStrokeColor,
};

export class Content extends Base {
  protected controller: Controller;
  constructor(controller: Controller, width: number, height: number) {
    super({ width, height });
    this.controller = controller;
  }
  render(width: number, height: number): void {
    this.resize(width, height);
    this.renderGrid();
    this.renderRowsHeader();
    this.renderColsHeader();
    this.renderTriangle();
    this.renderContent();
  }
  protected renderContent(): void {
    const { controller } = this;
    const { model } = controller;
    const data = model.getCellsContent();
    if (isEmpty(data)) {
      return;
    }
    this.save();
    this.setAttributes({
      textBaseline: "middle",
    });
    for (const item of data) {
      const cellInfo = controller.queryCell(item.row, item.col);
      const { left, top, height, width, style, displayValue } = cellInfo;
      const isNum = isNumber(displayValue);
      let font = DEFAULT_FONT;
      let fillStyle = DEFAULT_FONT_COLOR;
      if (!isEmpty(style)) {
        const fontSize = npx(
          style?.fontSize ? style.fontSize : DEFAULT_FONT_SIZE
        );
        font = makeFont(
          style?.isItalic ? "italic" : "normal",
          style?.isBold ? "bold" : "500",
          fontSize,
          style?.fontFamily
        );
        fillStyle = style?.fontColor || DEFAULT_FONT_COLOR;
        if (style?.fillColor) {
          this.setAttributes({ fillStyle: style?.fillColor });
          this.fillRect(left, top, width, height);
        }
      }
      this.setAttributes({
        textAlign: isNum ? "right" : "left",
        font,
        fillStyle,
      });
      this.fillText(displayValue, left + (isNum ? width : 0), top + height / 2);
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
      fillStyle: theme.backgroundColor,
    });
    this.fillRect(0, 0, config.width, config.height);
    this.setAttributes({
      fillStyle: theme.triangleFillColor,
    });
    this.fill(path);
    this.restore();
  }

  protected renderGrid(): void {
    const { scroll, model } = this.controller;
    const { rowIndex, colIndex } = scroll;
    const { rowCount, colCount } = model.getSheetInfo();
    const cell = this.controller.queryCell(0, 0);
    const config = model.getRowTitleHeightAndColTitleWidth();
    const { width, height } = this.controller.getDrawSize(config);
    const lineWidth = thinLineWidth();
    this.save();
    this.setAttributes({
      fillStyle: theme.white,
      lineWidth,
      strokeStyle: theme.gridStrokeColor,
    });
    this.translate(config.width, config.height);
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
  fillRowText(
    row: number,
    rowWidth: number,
    y: number,
    activeCell: CellInfo
  ): void {
    const isActive = activeCell.row === row - 1;
    const fillStyle = isActive ? theme.primaryColor : theme.black;
    if (isActive) {
      this.setAttributes({ fillStyle: theme.buttonActiveColor });
      this.fillRect(0, activeCell.top, rowWidth, activeCell.height);
    }
    this.setAttributes({ fillStyle });
    this.fillText(row, rowWidth / 2, y);
  }

  fillColText(
    colText: string,
    x: number,
    colHeight: number,
    activeCell: CellInfo
  ): void {
    const isActive = intToColumnName(activeCell.col + 1) === colText;
    const fillStyle = isActive ? theme.primaryColor : theme.black;
    if (isActive) {
      this.setAttributes({ fillStyle: theme.buttonActiveColor });
      this.fillRect(activeCell.left, 0, activeCell.width, colHeight);
    }
    this.setAttributes({ fillStyle });
    this.fillText(colText, x, colHeight / 2 + dpr());
  }
  protected renderRowsHeader(): void {
    const { scroll, model } = this.controller;
    const { rowIndex } = scroll;
    const { rowCount } = model.getSheetInfo();
    const config = model.getRowTitleHeightAndColTitleWidth();
    const activeCell = this.controller.queryActiveCellInfo();
    const { height } = this.controller.getDrawSize(config);
    this.save();
    this.setAttributes({ fillStyle: theme.backgroundColor });
    this.fillRect(0, config.height, config.width, height);
    this.setAttributes(HEADER_STYLE);
    const pointList = [];
    let y = config.height;
    let i = rowIndex;
    for (; i < rowCount; i++) {
      let temp = y;
      if (i === rowIndex) {
        temp += thinLineWidth() / 2;
      }
      pointList.push([0, temp], [config.width, temp]);
      this.fillRowText(
        i + 1,
        config.width,
        temp + activeCell.height / 2,
        activeCell
      );
      y += activeCell.height;
      if (y > height) {
        break;
      }
    }
    this.fillRowText(
      i + 1,
      config.width,
      y + activeCell.height / 2,
      activeCell
    );
    pointList.push([0, y], [config.width, y], [0, 0], [0, y]);
    this.line(pointList);
    this.restore();
  }
  protected renderColsHeader(): void {
    const { scroll, model } = this.controller;
    const { colIndex } = scroll;
    const { colCount } = model.getSheetInfo();
    const config = model.getRowTitleHeightAndColTitleWidth();
    const activeCell = this.controller.queryActiveCellInfo();
    const { width } = this.controller.getDrawSize(config);
    const pointList = [];
    this.save();
    this.setAttributes({ fillStyle: theme.backgroundColor });
    this.fillRect(config.width, 0, width, config.height);
    this.setAttributes(HEADER_STYLE);
    let x = config.width;
    let i = colIndex;
    for (; i < colCount; i++) {
      let temp = x;
      if (i === colIndex) {
        temp += thinLineWidth() / 2;
      }
      pointList.push([temp, 0], [temp, config.height]);
      this.fillColText(
        intToColumnName(i + 1),
        temp + activeCell.width / 2,
        config.height,
        activeCell
      );
      x += activeCell.width;
      if (x > width) {
        break;
      }
    }
    this.fillColText(
      intToColumnName(i + 1),
      x + activeCell.width / 2,
      config.height,
      activeCell
    );
    pointList.push([x, 0], [x, config.height], [0, 0], [x, 0]);
    this.line(pointList);
    this.restore();
  }
}
