import { COL_TITLE_WIDTH, ROW_TITLE_HEIGHT, intToColumnName } from "@/util";
import { isEmpty, get, setWith } from "@/lodash";
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
import { Controller } from "../controller/controller";

export class Model {
  public currentSheetId = "";
  public workbook: WorkBookJSON["workbook"] = [];
  protected worksheets: WorkBookJSON["worksheets"] = {};
  public styles: WorkBookJSON["styles"] = {};
  public mergeCells: WorkBookJSON["mergeCells"] = [];
  protected controller: Controller;
  constructor(controller: Controller) {
    this.controller = controller;
  }
  setActiveCell(row: number, col: number): void {
    const index = this.workbook.findIndex(
      (v) => v.sheetId === this.currentSheetId
    );
    if (index >= 0) {
      const tempList = Array.from(this.workbook);
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
    const {
      worksheets = {},
      workbook = [],
      styles = {},
      mergeCells = [],
    } = json;
    this.worksheets = worksheets;
    this.workbook = workbook;
    this.styles = styles;
    this.currentSheetId = workbook[0].sheetId || this.currentSheetId;
    this.mergeCells = mergeCells;
    this.modelChange(true);
  }
  toJSON(): WorkBookJSON {
    const { worksheets, styles, workbook, mergeCells } = this;
    return {
      workbook,
      styles,
      worksheets,
      mergeCells,
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
