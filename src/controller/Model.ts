import {
  CELL_WIDTH,
  CELL_HEIGHT,
  COL_TITLE_WIDTH,
  ROW_TITLE_HEIGHT,
  IWindowSize,
  eventEmitter,
} from "@/util";
import { isEmpty, get } from "lodash-es";
import {
  CellPosition,
  CellInfo,
  WorkBookJSON,
  Action,
  WorksheetType,
} from "@/types";
import { DISPATCH_ACTION, getDefaultSheetInfo, assert } from "@/util";

export interface IModelValue {
  sheetList: WorksheetType[];
  currentSheetId: string;
  addSheet(): void;
  getCellsContent(): CellInfo[];
  toJSON(): WorkBookJSON;
  fromJSON(data: WorkBookJSON): void;
  getSheetInfo(id?: string): WorksheetType;
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
          width: 100,
          height: 50,
          style: "1",
        },
        "1": { value: 124, style: "2" },
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
export class Model implements IModelValue {
  protected _currentSheetId = "";
  protected _workbook: WorksheetType[] = [];
  protected worksheets: WorkBookJSON["worksheets"] = {};
  protected styles: WorkBookJSON["styles"] = {};
  get sheetList(): WorksheetType[] {
    return this._workbook;
  }
  set sheetList(data: WorksheetType[]) {
    console.log("sheetList", data);
    this._workbook = data;
    this.dispatchAction({ type: "SET_SHEET_LIST", payload: data });
  }
  get currentSheetId(): string {
    return this._currentSheetId;
  }
  set currentSheetId(id: string) {
    this._currentSheetId = id;
    this.dispatchAction({ type: "SET_CURRENT_SHEET_ID", payload: id });
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
  dispatchAction(data: Action): void {
    console.log("model-emit-dispatchAction", data);
    eventEmitter.emit(DISPATCH_ACTION, data);
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
    this.sheetList = workbook;
    this.styles = styles;
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
      sheetData[row][col] = { value };
    } else {
      sheetData[row][col].value = value;
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
      value: get(cellData, "value", ""),
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
