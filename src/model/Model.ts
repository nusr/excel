import {
  StyleType,
  ModelCellType,
  WorkBookJSON,
  WorksheetType,
  Coordinate,
  IModel,
  ResultType,
  IRange,
  IHistory,
  UndoRedoItem,
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
  isSameRange,
} from '@/util';
import { parseFormula } from '@/formula';

const CELL_HEIGHT = 19;
const CELL_WIDTH = 68;
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
  private customHeight: WorkBookJSON['customHeight'] = {};
  private customWidth: WorkBookJSON['customWidth'] = {};
  private history: IHistory;
  constructor(history: IHistory) {
    this.history = history;
  }
  getSheetList(): WorkBookJSON['workbook'] {
    return this.workbook;
  }
  setActiveCell(range: IRange): void {
    const index = this.workbook.findIndex((v) => v.sheetId === range.sheetId);
    if (index < 0) {
      return;
    }
    const { row, col } = range;
    const sheet = this.workbook[index];
    if (row < 0 || col < 0 || row >= sheet.rowCount || col >= sheet.colCount) {
      return;
    }
    const oldValue = sheet.activeCell;
    if (isSameRange(oldValue, range)) {
      return;
    }
    const key = `workbook.${index}.activeCell`;
    this.history.pushRedo('set', key, {
      ...oldValue,
    });
    setWith(this, key, { ...range });
  }
  addSheet(): void {
    const item = getDefaultSheetInfo(this.workbook);
    const sheet: WorksheetType = {
      ...item,
      isHide: false,
      colCount: DEFAULT_COL_COUNT,
      rowCount: DEFAULT_ROW_COUNT,
      activeCell: {
        row: 0,
        col: 0,
        rowCount: 1,
        colCount: 1,
        sheetId: item.sheetId,
      },
    };
    const index = this.workbook.findIndex(
      (item) => item.sheetId === this.currentSheetId,
    );
    if (index < 0) {
      this.workbook.push(sheet);
    } else {
      this.workbook.splice(index + 1, 0, sheet);
    }
    this.currentSheetId = sheet.sheetId;
  }
  private getSheetIndex(sheetId?: string) {
    const id = sheetId || this.currentSheetId;
    const index = this.workbook.findIndex((item) => item.sheetId === id);
    assert(index >= 0);
    let lastIndex = 0;
    if (index === 0) {
      lastIndex = index + 1;
    } else {
      lastIndex = index - 1;
    }
    return {
      index,
      lastIndex,
    };
  }
  deleteSheet(sheetId?: string): void {
    assert(
      this.workbook.length >= 2,
      'A workbook must contains at least on visible worksheet',
    );
    const { index, lastIndex } = this.getSheetIndex(sheetId);
    this.currentSheetId = this.workbook[lastIndex].sheetId;
    this.workbook.splice(index, 1);
  }
  hideSheet(sheetId?: string | undefined): void {
    const { index, lastIndex } = this.getSheetIndex(sheetId);
    this.workbook[index].isHide = true;
    this.currentSheetId = this.workbook[lastIndex].sheetId;
  }
  unhideSheet(sheetId?: string | undefined): void {
    const { index, lastIndex } = this.getSheetIndex(sheetId);
    this.workbook[index].isHide = false;
    this.currentSheetId = this.workbook[lastIndex].sheetId;
  }
  renameSheet(sheetName: string, sheetId?: string | undefined): void {
    assert(!!sheetName, 'You typed a invalid name for a sheet.');
    const sheetInfo = this.getSheetInfo(sheetId);
    sheetInfo.name = sheetName;
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
  fromJSON = (json: WorkBookJSON) => {
    modelLog('fromJSON', json);
    const {
      worksheets = {},
      workbook = [],
      mergeCells = [],
      customHeight = {},
      customWidth = {},
    } = json;
    this.worksheets = worksheets;
    this.workbook = workbook;
    this.currentSheetId = workbook[0].sheetId || this.currentSheetId;
    this.mergeCells = mergeCells;
    this.customWidth = customWidth;
    this.customHeight = customHeight;
    this.computeAllCell();
    this.history.clear();
  };
  toJSON = (): WorkBookJSON => {
    const { worksheets, workbook, mergeCells, customHeight, customWidth } =
      this;
    return {
      workbook,
      worksheets,
      mergeCells,
      customHeight,
      customWidth,
    };
  };

  private setCellValue(value: ResultType, range: Coordinate): void {
    const { row, col } = range;
    const key = `worksheets[${this.currentSheetId}][${row}][${col}].value`;
    this.history.pushRedo('set', key, get(this, key, undefined));

    setWith(this, key, value);
  }
  private setCellFormula(formula: string, range: Coordinate): void {
    const { row, col } = range;
    const key = `worksheets[${this.currentSheetId}][${row}][${col}].formula`;

    this.history.pushRedo('set', key, get(this, key, undefined));

    setWith(this, key, formula);
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
    this.history.pushRedo('set', stylePath, get(this, stylePath, {}));
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
  getCell = (range: IRange) => {
    const { row, col, sheetId } = range;
    const realSheetId = sheetId || this.currentSheetId;
    const cellData = get<ModelCellType>(
      this,
      `worksheets[${realSheetId}][${row}][${col}]`,
      {},
    );
    return {
      ...cellData,
      row,
      col,
    };
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
        const temp = this.getCell(new Range(row, col, 1, 1, sheetId));
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
  getColWidth(col: number): number {
    const temp = this.customWidth[this.currentSheetId];
    if (!temp) {
      return CELL_WIDTH;
    }
    if (typeof temp[col] === 'number') {
      return temp[col];
    }
    return CELL_WIDTH;
  }
  setColWidth(col: number, width: number): void {
    this.customWidth[this.currentSheetId] =
      this.customWidth[this.currentSheetId] || {};
    this.customWidth[this.currentSheetId][col] = width;
  }
  getRowHeight(row: number): number {
    const temp = this.customHeight[this.currentSheetId];
    if (!temp) {
      return CELL_HEIGHT;
    }
    if (typeof temp[row] === 'number') {
      return temp[row];
    }
    return CELL_HEIGHT;
  }
  setRowHeight(row: number, height: number): void {
    this.customHeight[this.currentSheetId] =
      this.customHeight[this.currentSheetId] || {};
    this.customHeight[this.currentSheetId][row] = height;
  }
  canRedo(): boolean {
    return this.history.canRedo();
  }
  canUndo(): boolean {
    return this.history.canUndo();
  }
  undo() {
    if (!this.canUndo()) {
      return;
    }
    this.executeOperate(this.history.undo());
  }
  redo() {
    if (!this.canRedo()) {
      return;
    }
    this.executeOperate(this.history.redo());
  }
  record(): void {
    this.history.onChange();
  }

  private executeOperate(list: UndoRedoItem[]) {
    for (const item of list) {
      const { op, path, value } = item;
      switch (op) {
        case 'set': {
          this.history.pushUndo(op, path, get(this, path, undefined));
          this.record();
          setWith(this, path, value);
          break;
        }
        // case 'add-array':
        //   break;
        // case 'delete-array':
        //   break;
        default:
          console.error(`not support type: ${op}`);
          break;
      }
    }
  }
}
