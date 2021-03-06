import { COL_TITLE_WIDTH, ROW_TITLE_HEIGHT, intToColumnName } from "@/util";
import { isEmpty, get, setWith, cloneDeep } from "lodash";
import {
  StyleType,
  QueryCellResult,
  IWindowSize,
  WorkBookJSON,
  WorksheetType,
  Coordinate,
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
import type { Controller } from "../controller";

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
          value: "",
          formula: "SUM(F1,F17)",
          style: "1",
        },
        "1": {
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
      "4": {
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
    },
    "2": {
      fontSize: 16,
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
    this.modelChange();
  }
  addSheet(): void {
    const item = getDefaultSheetInfo(this.workbook);
    this.workbook = [...this.workbook, item];
    this.currentSheetId = item.sheetId;
    this.modelChange();
  }
  getSheetInfo(id: string = this.currentSheetId): WorksheetType {
    const item = this.workbook.find((item) => item.sheetId === id);
    assert(item !== undefined);
    return item;
  }
  protected modelChange(isRecovering = false): void {
    modelLog("modelChange", isRecovering);
    if (!isRecovering) {
      this.controller.history.onChange(this.toJSON());
    }
  }
  getCellsContent(): Array<Coordinate> {
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
    this.modelChange(true);
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
