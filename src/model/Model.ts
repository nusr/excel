import { COL_TITLE_WIDTH, ROW_TITLE_HEIGHT } from "@/util";
import { isEmpty, get, setWith, uniqueId, cloneDeep } from "lodash-es";
import {
  StyleType,
  IRange,
  QueryCellResult,
  IWindowSize,
  WorkBookJSON,
  WorksheetType,
  ModelCellType,
} from "@/types";
import { getDefaultSheetInfo, assert } from "@/util";
import { Controller } from "../controller/controller";

export const MOCK_MODEL: WorkBookJSON = {
  workbook: [
    {
      sheetId: "1",
      name: "Sheet1",
      activeCell: "A1",
      colCount: 30,
      rowCount: 30,
    },
    {
      sheetId: "2",
      name: "test",
      colCount: 30,
      rowCount: 30,
    },
  ],
  worksheets: {
    "1": {
      "0": {
        "0": {
          value: "测试",
          formula: "SUM(F1:F17)",
          // style: "1",
        },
        "1": {
          value: 124,
          // style: "2"
        },
      },
    },
  },
  styles: {
    "1": {
      fontColor: "#ff0000",
      fillColor: "#000000",
      fontSize: 12,
      fontFamily: "宋体",
      format: "$0.00",
      verticalAlign: 0,
      horizontalAlign: 0,
      wrapText: 0,
    },
    "2": {
      fontColor: "#ff0000",
      fillColor: "#000000",
      fontSize: 12,
      fontFamily: "宋体",
      format: "0",
      verticalAlign: 0,
      horizontalAlign: 0,
      wrapText: 0,
    },
  },
};
export class Model {
  protected _currentSheetId = "";
  protected _workbook: WorksheetType[] = [];
  protected worksheets: WorkBookJSON["worksheets"] = {};
  styles: WorkBookJSON["styles"] = {};
  protected controller: Controller;
  constructor(controller: Controller) {
    this.controller = controller;
  }
  get sheetList(): WorksheetType[] {
    return this._workbook;
  }
  set sheetList(data: WorksheetType[]) {
    this._workbook = data;
  }
  get currentSheetId(): string {
    return this._currentSheetId;
  }
  set currentSheetId(id: string) {
    this._currentSheetId = id;
  }
  addSheet(): void {
    const item = getDefaultSheetInfo(this.sheetList);
    this.sheetList = [...this.sheetList, item];
    this.currentSheetId = item.sheetId;
  }
  getSheetInfo(id: string = this.currentSheetId): WorksheetType {
    const item = this.sheetList.find((item) => item.sheetId === id);
    assert(item !== undefined);
    return item;
  }
  protected modelChange(): void {
    const data = this.worksheets[this.currentSheetId];
    console.log("modelChange", data);
    console.log(this.styles);
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
    console.log("fromJSON", json);
    const { worksheets = {}, workbook = [], styles = {} } = json;
    this.worksheets = worksheets;
    this.sheetList = workbook;
    this.styles = cloneDeep(styles);
    this.currentSheetId = workbook[0].sheetId || this.currentSheetId;
    this.modelChange();
  }
  toJSON(): WorkBookJSON {
    const { worksheets, styles, sheetList } = this;
    return {
      workbook: sheetList,
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
  setCellValue(ranges: IRange[], value = ""): void {
    const [range] = ranges;
    const { row, col } = range;
    setWith(
      this,
      `worksheets[${this.currentSheetId}][${row}][${col}].value`,
      value,
      Object
    );
    this.modelChange();
  }
  setCellStyle(ranges: IRange[], style: Partial<StyleType>): void {
    const [range] = ranges;
    const { row, col } = range;
    const stylePath = `worksheets[${this.currentSheetId}][${row}][${col}].style`;
    const oldStyleId = get(this, stylePath, "");
    if (oldStyleId) {
      const oldStyle = this.styles[oldStyleId];
      if (!isEmpty(oldStyle)) {
        this.styles[oldStyleId] = {
          ...oldStyle,
          ...style,
        };
      } else {
        this.styles[oldStyleId] = { ...style };
      }
    } else {
      const styleId = uniqueId("style");
      this.styles[styleId] = { ...style };
      setWith(this, stylePath, styleId, Object);
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
    const temp = style && this.styles[style] ? this.styles[style] : undefined;
    return { ...cellData, style: temp };
  }
}
