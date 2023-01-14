import {
  StyleType,
  ModelCellType,
  WorkBookJSON,
  WorksheetType,
  Coordinate,
  IModel,
  ResultType,
} from '@/types';
import {
  getDefaultSheetInfo,
  assert,
  modelLog,
  Range,
  DEFAULT_ROW_COUNT,
  DEFAULT_COL_COUNT,
  isEmpty,
  get,
  setWith,
} from '@/util';
import { parseFormula } from '@/parser';

const XLSX_MAX_COL_COUNT = 16384; // XFD
const XLSX_MAX_ROW_COUNT = 1048576;

function convertToNumber(list: string[]) {
  const result = list
    .map((item) => parseInt(item, 10))
    .filter((v) => !isNaN(v));
  result.sort((a, b) => a - b);
  return result;
}

export class Model implements IModel {
  private currentSheetId = '';
  private workbook: WorkBookJSON['workbook'] = [];
  private worksheets: WorkBookJSON['worksheets'] = {};
  private mergeCells: WorkBookJSON['mergeCells'] = [];
  getSheetList(): WorkBookJSON['workbook'] {
    return this.workbook;
  }
  setActiveCell(row: number, col: number): void {
    const index = this.workbook.findIndex(
      (v) => v.sheetId === this.currentSheetId,
    );
    if (index >= 0) {
      const tempList = Array.from(this.workbook);
      tempList.splice(index, 1, {
        ...this.workbook[index],
        activeCell: {
          row,
          col,
        },
      });
      this.workbook = tempList;
    }
  }
  addSheet(): void {
    const item = getDefaultSheetInfo(this.workbook);
    this.workbook = [
      ...this.workbook,
      {
        ...item,
        colCount: DEFAULT_COL_COUNT,
        rowCount: DEFAULT_ROW_COUNT,
        activeCell: {
          row: 0,
          col: 0,
        },
      },
    ];
    this.currentSheetId = item.sheetId;
  }
  getSheetInfo(id: string = this.currentSheetId): WorksheetType {
    const item = this.workbook.find((item) => item.sheetId === id);
    assert(item !== undefined);
    return item;
  }
  setCurrentSheetId(id: string): void {
    this.currentSheetId = id;
    this.computeAllCell();
  }
  getCurrentSheetId(): string {
    return this.currentSheetId;
  }
  getCellsContent(sheetId: string): Array<Coordinate> {
    const sheetData = this.worksheets[sheetId];
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
    modelLog('fromJSON', json);
    const { worksheets = {}, workbook = [], mergeCells = [] } = json;
    this.worksheets = worksheets;
    this.workbook = workbook;
    this.currentSheetId = workbook[0].sheetId || this.currentSheetId;
    this.mergeCells = mergeCells;
    this.computeAllCell();
  }
  toJSON(): WorkBookJSON {
    const { worksheets, workbook, mergeCells } = this;
    return {
      workbook,
      worksheets,
      mergeCells,
    };
  }

  private setCellValue(value: ResultType, range: Coordinate): void {
    const { row, col } = range;
    const configPath = `worksheets[${this.currentSheetId}][${row}][${col}]`;
    setWith(this, `${configPath}.value`, value);
  }
  private setCellFormula(formula: string, range: Coordinate): void {
    const { row, col } = range;
    const configPath = `worksheets[${this.currentSheetId}][${row}][${col}]`;
    setWith(this, `${configPath}.formula`, formula);
  }
  setCellValues(
    value: string[][],
    style: Partial<StyleType>[][],
    ranges: Range[],
  ): void {
    const [range] = ranges;
    const { row, col } = range;
    for (let r = 0; r < value.length; r++) {
      for (let c = 0; c < value[r].length; c++) {
        const t = value[r][c];
        const temp: Coordinate = {
          row: row + r,
          col: col + c,
        };
        if (style[r] && style[r][c]) {
          this.setStyle(style[r][c], temp);
        }
        if (t.startsWith('=')) {
          this.setCellFormula(t, temp);
        } else {
          this.setCellFormula('', temp);
          this.setCellValue(t, temp);
        }
      }
    }
    this.computeAllCell();
  }
  private setStyle(style: Partial<StyleType>, range: Coordinate) {
    const stylePath = `worksheets[${this.currentSheetId}][${range.row}][${range.col}].style`;
    setWith(this, stylePath, style);
  }
  setCellStyle(style: Partial<StyleType>, ranges: Range[]): void {
    const [range] = ranges;
    const { row, col, rowCount, colCount } = range;
    for (let r = row, endRow = row + rowCount; r < endRow; r++) {
      for (let c = col, endCol = col + colCount; c < endCol; c++) {
        this.setStyle(style, { row: r, col: c });
      }
    }
  }
  queryCell = (
    row: number,
    col: number,
    sheetId: string = '',
  ): ModelCellType => {
    const realSheetId = sheetId || this.currentSheetId;
    const cellData = get<ModelCellType>(
      this,
      `worksheets[${realSheetId}][${row}][${col}]`,
      {},
    );
    return cellData;
  };
  private computeAllCell() {
    const sheetData = this.worksheets[this.currentSheetId];
    if (isEmpty(sheetData)) {
      return [];
    }
    const rowKeys = Object.keys(sheetData);
    for (const rowKey of rowKeys) {
      const colKeys = Object.keys(sheetData[rowKey]);
      for (const colKey of colKeys) {
        const temp = sheetData[rowKey][colKey];
        if (temp?.formula) {
          temp.value = this.parseFormula(temp.formula);
        }
      }
    }
  }
  private parseFormula(formula: string) {
    const result = parseFormula(formula, {
      get: (row: number, col: number, sheetId: string) => {
        const temp = this.queryCell(row, col, sheetId);
        return temp.value;
      },
      set: () => {},
      convertSheetNameToSheetId: (sheetName: string): string => {
        const item = this.workbook.find((v) => v.name === sheetName);
        return item?.sheetId || '';
      },
    });
    return result.error ? result.error : result.result;
  }
  addRow(rowIndex: number, count: number): void {
    const sheetData = this.worksheets[this.currentSheetId];
    if (isEmpty(sheetData)) {
      return;
    }
    const rowKeys = convertToNumber(Object.keys(sheetData));
    for (let i = rowKeys.length - 1; i >= 0; i--) {
      const rowKey = rowKeys[i];
      if (rowKey < rowIndex) {
        continue;
      }
      const key = String(rowKey + count);
      sheetData[key] = {
        ...sheetData[rowKey],
      };
      sheetData[rowKey] = {};
    }
    const sheetInfo = this.getSheetInfo();
    if (sheetInfo.rowCount >= XLSX_MAX_ROW_COUNT) {
      return;
    }
    sheetInfo.rowCount += count;
  }
  addCol(colIndex: number, count: number): void {
    const sheetData = this.worksheets[this.currentSheetId];
    if (isEmpty(sheetData)) {
      return;
    }
    const sheetInfo = this.getSheetInfo();

    const rowKeys = Object.keys(sheetData);
    for (const rowKey of rowKeys) {
      const colKeys = convertToNumber(Object.keys(sheetData[rowKey]));
      for (let i = colKeys.length - 1; i >= 0; i--) {
        const colKey = colKeys[i];
        if (colKey < colIndex) {
          continue;
        }
        const key = String(colKey + count);
        sheetData[rowKey][key] = {
          ...sheetData[rowKey][colKey],
        };
        sheetData[rowKey][colKey] = {};
      }
    }
    if (sheetInfo.colCount >= XLSX_MAX_COL_COUNT) {
      return;
    }
    sheetInfo.colCount += count;
  }
  deleteCol(colIndex: number, count: number): void {
    const sheetData = this.worksheets[this.currentSheetId];
    if (isEmpty(sheetData)) {
      return;
    }
    const sheetInfo = this.getSheetInfo();

    const rowKeys = Object.keys(sheetData);
    for (const rowKey of rowKeys) {
      const colKeys = convertToNumber(Object.keys(sheetData[rowKey]));
      for (let i = 0; i < colKeys.length; i++) {
        const colKey = colKeys[i];
        if (colKey < colIndex) {
          continue;
        }
        const key = String(colKey - count);
        sheetData[rowKey][key] = {
          ...sheetData[rowKey][colKey],
        };
        sheetData[rowKey][colKey] = {};
      }
    }

    sheetInfo.colCount -= count;
  }
  deleteRow(rowIndex: number, count: number): void {
    const sheetData = this.worksheets[this.currentSheetId];
    if (isEmpty(sheetData)) {
      return;
    }
    const rowKeys = convertToNumber(Object.keys(sheetData));
    for (let i = 0; i < rowKeys.length; i++) {
      const rowKey = rowKeys[i];
      if (rowKey < rowIndex) {
        continue;
      }
      const key = String(rowKey - count);
      sheetData[key] = {
        ...sheetData[rowKey],
      };
      sheetData[rowKey] = {};
    }
    const sheetInfo = this.getSheetInfo();
    sheetInfo.rowCount -= count;
  }
}
