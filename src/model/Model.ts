import { isEmpty, get, setWith } from "@/lodash";
import {
  StyleType,
  QueryCellResult,
  WorkBookJSON,
  WorksheetType,
  Coordinate,
  ModelCellType,
  ResultType,
} from "@/types";
import {
  getDefaultSheetInfo,
  assert,
  modelLog,
  Range,
  getListMaxNum,
  STYLE_ID_PREFIX,
  intToColumnName,
  DEFAULT_ROW_COUNT,
  DEFAULT_COL_COUNT,
} from "@/util";
import { Controller } from "../controller/controller";
import { parseFormula } from "../parser";

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
      const activeCell = `${intToColumnName(col)}${row + 1}`;
      tempList.splice(index, 1, { ...this.workbook[index], activeCell });
      this.workbook = tempList;
    }
    this.modelChange();
  }
  addSheet(): void {
    const item = getDefaultSheetInfo(this.workbook);
    this.workbook = [
      ...this.workbook,
      { ...item, colCount: DEFAULT_COL_COUNT, rowCount: DEFAULT_ROW_COUNT },
    ];
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
  computeFormula = (formula: string): ResultType => {
    const result = parseFormula(formula, {
      queryCells: this.queryCells,
      currentSheetId: this.currentSheetId,
    });
    return result.error ? result.error : result.result;
  };
  setCellValue(value: ResultType, range: Range): void {
    const { row, col } = range;
    const configPath = `worksheets[${
      range.sheetId || this.currentSheetId
    }][${row}][${col}]`;
    setWith(this, `${configPath}.value`, value);
  }
  setCellFormula(formula: string, range: Range): void {
    const { row, col } = range;
    const configPath = `worksheets[${
      range.sheetId || this.currentSheetId
    }][${row}][${col}]`;
    setWith(this, `${configPath}.formula`, formula);
  }
  setCellValues(value: string, ranges: Range[]): void {
    const [range] = ranges;
    if (value.startsWith("=")) {
      const formula = value.slice(1);
      this.setCellFormula(formula, range);
    } else {
      this.setCellFormula("", range);
      this.setCellValue(value, range);
    }
    this.modelChange();
  }
  setCellStyle(style: Partial<StyleType>, ranges: Range[]): void {
    const [range] = ranges;
    const { row, col, rowCount, colCount } = range;
    for (let r = row, endRow = row + rowCount; r < endRow; r++) {
      for (let c = col, endCol = col + colCount; c < endCol; c++) {
        const stylePath = `worksheets[${this.currentSheetId}][${r}][${c}].style`;
        const oldStyleId = get<string>(this, stylePath, "");
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
          setWith(this, stylePath, styleId);
        }
      }
    }
    this.modelChange();
  }
  queryCells = (range: Range): QueryCellResult[] => {
    const result = [];
    const { row, col, rowCount, colCount, sheetId } = range;
    for (let r = row, endRow = row + rowCount; r < endRow; r++) {
      for (let c = col, endCol = col + colCount; c < endCol; c++) {
        result.push(this.queryCell(row, col, sheetId || this.currentSheetId));
      }
    }
    return result;
  };
  queryCell = (
    row: number,
    col: number,
    sheetId: string = this.currentSheetId
  ): QueryCellResult => {
    const cellData = get<ModelCellType>(
      this,
      `worksheets[${sheetId}][${row}][${col}]`,
      {}
    );
    const { style } = cellData;
    let temp = undefined;
    if (style && this.styles[style]) {
      temp = this.styles[style];
    }
    return { ...cellData, style: temp };
  };
}
