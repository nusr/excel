import { COL_TITLE_WIDTH, ROW_TITLE_HEIGHT, intToColumnName } from "@/util";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import setWith from "lodash/setWith";
import cloneDeep from "lodash/cloneDeep";
import {
  StyleType,
  QueryCellResult,
  IWindowSize,
  WorkBookJSON,
  WorksheetType,
  ModelCellType,
} from "@/types";
import {
  getDefaultSheetInfo,
  assert,
  modelLog,
  Range,
  getListMaxNum,
  STYLE_ID_PREFIX,
} from "@/util";
import { Controller } from "../controller/controller";

export const MOCK_MODEL: WorkBookJSON = {
  workbook: [
    {
      sheetId: "Sheet1",
      name: "Sheet1",
      activeCell: "B2",
      colCount: 30,
      rowCount: 30,
    },
    {
      sheetId: "2",
      name: "test",
      colCount: 30,
      rowCount: 30,
      activeCell: "F5",
    },
  ],
  worksheets: {
    Sheet1: {
      "0": {
        "0": {
          // value: "测试",
          value: "",
          formula: "SUM(F1,F17)",
          style: "1",
        },
        "1": {
          // value: 124,
          value: "",
          formula: "SUM(1,4)",
          style: "2",
        },
      },
      "3": {
        0: {
          style: "style1",
        },
        1: {
          style: "style1",
        },
        2: {
          style: "style1",
        },
        3: {
          style: "style1",
        },
      },
    },
  },
  styles: {
    "1": {
      fontColor: "#ff0000",
      fillColor: "blue",
      fontSize: 12,
      fontFamily: "宋体",
      format: "$0.00",
      verticalAlign: 0,
      horizontalAlign: 0,
      wrapText: 0,
    },
    "2": {
      fontColor: "white",
      fillColor: "black",
      fontSize: 12,
      fontFamily: "宋体",
      format: "0",
      verticalAlign: 0,
      horizontalAlign: 0,
      wrapText: 0,
    },
    style1: {
      fillColor: "red",
    },
  },
};
export class Model {
  public currentSheetId = "";
  public workbook: WorksheetType[] = [];
  protected worksheets: WorkBookJSON["worksheets"] = {};
  public styles: WorkBookJSON["styles"] = {};
  protected controller: Controller;
  constructor(controller: Controller) {
    this.controller = controller;
  }
  setActiveCell(row: number, col: number): void {
    const index = this.workbook.findIndex(
      (v) => v.sheetId === this.currentSheetId
    );
    if (index >= 0) {
      const tempList = cloneDeep(this.workbook);
      const activeCell = `${intToColumnName(col + 1)}${row + 1}`;
      tempList.splice(index, 1, { ...this.workbook[index], activeCell });
      this.workbook = tempList;
    }
  }
  addSheet(): void {
    const item = getDefaultSheetInfo(this.workbook);
    this.workbook = [...this.workbook, item];
    this.currentSheetId = item.sheetId;
  }
  getSheetInfo(id: string = this.currentSheetId): WorksheetType {
    const item = this.workbook.find((item) => item.sheetId === id);
    assert(item !== undefined);
    return item;
  }
  protected modelChange(): void {
    const data = this.worksheets[this.currentSheetId];
    modelLog("modelChange", data);
  }
  getCellsContent(): Array<QueryCellResult & { row: number; col: number }> {
    const sheetData = this.worksheets[this.currentSheetId];
    if (isEmpty(sheetData)) {
      return [];
    }
    const result = [];
    const rowKeys = Object.keys(sheetData);
    for (const rowKey of rowKeys) {
      const colKeys = Object.keys(sheetData[rowKey]);
      for (const colKey of colKeys) {
        const row = Number(rowKey);
        const col = Number(colKey);
        result.push({
          ...this.queryCell(row, col),
          row,
          col,
        });
      }
    }
    return result;
  }
  fromJSON(json: WorkBookJSON): void {
    modelLog("fromJSON", json);
    const { worksheets = {}, workbook = [], styles = {} } = json;
    this.worksheets = worksheets;
    this.workbook = workbook;
    this.styles = cloneDeep(styles);
    this.currentSheetId = workbook[0].sheetId || this.currentSheetId;
    this.modelChange();
  }
  toJSON(): WorkBookJSON {
    const { worksheets, styles, workbook } = this;
    return {
      workbook,
      styles,
      worksheets,
    };
  }

  getRowTitleHeightAndColTitleWidth(): IWindowSize {
    return {
      width: COL_TITLE_WIDTH,
      height: ROW_TITLE_HEIGHT,
    };
  }
  setCellValue(value = ""): void {
    const { row, col } = this.controller.queryActiveCell();
    const configPath = `worksheets[${this.currentSheetId}][${row}][${col}]`;
    let formula = "";
    let realValue = "";
    if (value.startsWith("=")) {
      formula = value.trim().slice(1);
      realValue = "";
    } else {
      realValue = value.trim();
      formula = "";
    }
    setWith(this, `${configPath}.formula`, formula, Object);
    setWith(this, `${configPath}.value`, realValue, Object);
    this.modelChange();
  }
  setCellStyle(style: Partial<StyleType>, ranges: Range[]): void {
    const [range] = ranges;
    const { row, col, rowCount, colCount } = range;
    for (let r = row, endRow = row + rowCount; r < endRow; r++) {
      for (let c = col, endCol = col + colCount; c < endCol; c++) {
        const stylePath = `worksheets[${this.currentSheetId}][${r}][${c}].style`;
        const oldStyleId = get(this, stylePath, "");
        if (oldStyleId) {
          const oldStyle = this.styles[oldStyleId];
          if (isEmpty(oldStyle)) {
            this.styles[oldStyleId] = { ...style };
          } else {
            this.styles[oldStyleId] = {
              ...oldStyle,
              ...style,
            };
          }
        } else {
          const styleNum = getListMaxNum(
            Object.keys(this.styles),
            STYLE_ID_PREFIX
          );
          const styleId = `${STYLE_ID_PREFIX}${styleNum + 1}`;
          this.styles[styleId] = { ...style };
          setWith(this, stylePath, styleId, Object);
        }
      }
    }
    this.modelChange();
  }
  queryCell(row: number, col: number): QueryCellResult {
    const cellData: ModelCellType = get(
      this,
      `worksheets[${this.currentSheetId}][${row}][${col}]`,
      {}
    );
    const { style } = cellData;
    let temp = undefined;
    if (style && this.styles[style]) {
      temp = this.styles[style];
    }
    return { ...cellData, style: temp };
  }
}
