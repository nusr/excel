import {
  CELL_WIDTH,
  CELL_HEIGHT,
  COL_TITLE_WIDTH,
  ROW_TITLE_HEIGHT,
  IWindowSize,
} from "@/util";
import { isEmpty, get } from "lodash-es";
import { CellPosition, CellInfo, WorkBookJSON } from "@/types";

export interface IModelValue {
  rowCount: number;
  colCount: number;
  sheetList: WorkBookJSON["workbook"];
  currentSheetId: string;
  getCellsContent(): CellInfo[];
  toJSON(): WorkBookJSON;
  fromJSON(data: WorkBookJSON): void;
  getRowTitleHeightAndColTitleWidth(): IWindowSize;
  setCellValue(row: number, col: number, value: string): this;
  queryCell(row: number, col: number): CellInfo;
  clickPositionToCell(x: number, y: number, size: IWindowSize): CellPosition;
}
export const MOCK_MODEL: WorkBookJSON = {
  workbook: [
    {
      sheetId: "1",
      name: "Sheet1",
      activeCell: "A1",
    },
    {
      sheetId: "2",
      name: "test",
    },
  ],
  worksheets: {
    "1": {
      "0": {
        "0": [
          { value: "测试", formula: "SUM(F1:F17)" },
          {
            width: 100,
            height: 50,
            style: "1",
          },
        ],
        "1": [{ value: "124" }],
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
  },
};
const START_SHEET_ID = 1;
export class Model implements IModelValue {
  public rowCount = 30;
  public colCount = 30;
  public currentSheetId = String(START_SHEET_ID);
  protected workbook: WorkBookJSON["workbook"] = [
    { sheetId: this.currentSheetId, name: "Sheet1" },
  ];
  protected worksheets: WorkBookJSON["worksheets"] = {};
  protected styles: WorkBookJSON["styles"] = {};
  get sheetList(): WorkBookJSON["workbook"] {
    return this.workbook;
  }
  protected modelChange(): void {
    const data = this.worksheets[this.currentSheetId];
    console.log("modelChange", data);
  }
  getCellsContent(): CellInfo[] {
    const sheetData = this.worksheets[this.currentSheetId];
    if (isEmpty(sheetData)) {
      return [];
    }
    const result: CellInfo[] = [];
    const rowKeys = Object.keys(sheetData);
    for (const rowKey of rowKeys) {
      const colKeys = Object.keys(sheetData[rowKey]);
      for (const colKey of colKeys) {
        result.push(this.queryCell(Number(rowKey), Number(colKey)));
      }
    }
    return result;
  }
  fromJSON(json: WorkBookJSON): void {
    console.log("fromJSON", json);
    const { worksheets = {}, workbook = [], styles = {} } = json;
    this.worksheets = worksheets;
    this.workbook = workbook;
    this.styles = styles;
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
  setCellValue(row: number, col: number, value: string): this {
    console.log("setCellValue", row, col, value);
    let sheetData = this.worksheets[this.currentSheetId];
    if (isEmpty(sheetData)) {
      sheetData = this.worksheets[this.currentSheetId] = {};
    }
    if (isEmpty(sheetData[row])) {
      sheetData[row] = {};
    }
    if (isEmpty(sheetData[row][col])) {
      sheetData[row][col] = [{ value }];
    } else {
      sheetData[row][col][0].value = value;
    }
    this.modelChange();
    return this;
  }
  getRowTitleHeightAndColTitleWidth(): IWindowSize {
    return {
      width: COL_TITLE_WIDTH,
      height: ROW_TITLE_HEIGHT,
    };
  }
  queryCell(row: number, col: number): CellInfo {
    const cellData = get(
      this,
      `worksheets[${this.currentSheetId}][${row}][${col}]`,
      []
    );
    console.log("queryCell", row, col, cellData);
    const config = this.getRowTitleHeightAndColTitleWidth();
    let resultX = config.width;
    let resultY = config.height;
    let r = 0;
    let c = 0;
    while (c < col) {
      resultX += CELL_WIDTH;
      c++;
    }
    while (r < row) {
      resultY += CELL_HEIGHT;
      r++;
    }
    return {
      width: CELL_WIDTH,
      height: CELL_HEIGHT,
      value: get(cellData, "[0].value", ""),
      top: resultY,
      left: resultX,
      row,
      col,
    };
  }
  clickPositionToCell(x: number, y: number): CellPosition {
    const config = this.getRowTitleHeightAndColTitleWidth();
    let resultX = config.width;
    let resultY = config.height;
    let row = 0;
    let col = 0;
    while (resultX + CELL_WIDTH <= x) {
      resultX += CELL_WIDTH;
      col++;
    }
    while (resultY + CELL_HEIGHT <= y) {
      resultY += CELL_HEIGHT;
      row++;
    }
    return { row, col };
  }
}
