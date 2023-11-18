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
  CELL_HEIGHT,
  CELL_WIDTH,
  XLSX_MAX_ROW_COUNT,
  XLSX_MAX_COL_COUNT,
} from '@/util';
import { parseFormula, CustomError } from '@/formula';

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
  private definedNames: WorkBookJSON['definedNames'] = {};
  constructor(history: IHistory) {
    this.history = history;
  }
  getSheetList(): WorkBookJSON['workbook'] {
    return this.workbook.slice();
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
    this.worksheets[sheet.sheetId] = {};
    this.customHeight[sheet.sheetId];
    this.customWidth[sheet.sheetId];
  }
  private getSheetIndex(sheetId?: string) {
    const id = sheetId || this.currentSheetId;
    const index = this.workbook.findIndex((item) => item.sheetId === id);
    assert(index >= 0);
    let lastIndex = (index + 1) % this.workbook.length;
    while (lastIndex !== index) {
      if (this.workbook[lastIndex].isHide) {
        lastIndex = (lastIndex + 1) % this.workbook.length;
      } else {
        break;
      }
    }
    return {
      index,
      lastIndex,
    };
  }
  deleteSheet(sheetId?: string): void {
    const id = sheetId || this.currentSheetId;
    const list = this.workbook.filter((v) => !v.isHide);
    assert(
      list.length >= 2,
      'A workbook must contains at least on visible worksheet',
    );
    const { index, lastIndex } = this.getSheetIndex(id);
    this.currentSheetId = this.workbook[lastIndex].sheetId;
    this.workbook.splice(index, 1);
    if (this.worksheets[id]) {
      this.worksheets[id] = {};
    }
  }
  hideSheet(sheetId?: string | undefined): void {
    const list = this.workbook.filter((v) => !v.isHide);
    assert(
      list.length >= 2,
      'A workbook must contains at least on visible worksheet',
    );
    const { index, lastIndex } = this.getSheetIndex(sheetId);
    this.workbook[index].isHide = true;
    this.currentSheetId = this.workbook[lastIndex].sheetId;
  }
  unhideSheet(sheetId?: string | undefined): void {
    const item = this.getSheetInfo(sheetId);
    item.isHide = false;
    this.currentSheetId = item.sheetId;
  }
  renameSheet(sheetName: string, sheetId?: string | undefined): void {
    assert(!!sheetName, 'You typed a invalid name for a sheet.');
    const item = this.workbook.find((v) => v.name === sheetName);
    if (item) {
      if (item.sheetId === sheetId) {
        return;
      }
      assert(false, 'Cannot rename a sheet to the same name as another sheet');
    }
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
  private getSheetId() {
    const list = this.workbook.filter((v) => !v.isHide);
    return list[0].sheetId;
  }
  fromJSON = (json: WorkBookJSON) => {
    modelLog('fromJSON', json);
    const {
      worksheets = {},
      workbook = [],
      mergeCells = [],
      customHeight = {},
      customWidth = {},
      definedNames = {},
    } = json;
    this.worksheets = worksheets;
    this.workbook = workbook;
    this.currentSheetId = this.getSheetId() || this.currentSheetId;
    this.mergeCells = mergeCells;
    this.customWidth = customWidth;
    this.customHeight = customHeight;
    this.definedNames = definedNames;
    this.computeAllCell();
    this.history.clear();
  };
  toJSON = (): WorkBookJSON => {
    const {
      worksheets = {},
      workbook = [],
      mergeCells = [],
      customHeight = {},
      customWidth = {},
      definedNames = {},
    } = this;
    const json = {
      workbook,
      worksheets,
      mergeCells,
      customHeight,
      customWidth,
      definedNames,
    };
    modelLog('toJSON', json);
    return json;
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
    value: ResultType[][],
    style: Partial<StyleType>[][],
    ranges: IRange[],
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
        if (t && typeof t === 'string' && t.startsWith('=')) {
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
  setCellStyle(style: Partial<StyleType>, ranges: IRange[]): void {
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
    const self = this;
    const result = parseFormula(
      formula,
      {
        get: (row: number, col: number, sheetId: string) => {
          const sheetInfo = this.getSheetInfo(sheetId || this.currentSheetId);
          if (row >= sheetInfo.rowCount || col >= sheetInfo.colCount) {
            throw new CustomError('#REF!');
          }
          const temp = self.getCell(new Range(row, col, 1, 1, sheetId));
          return temp.value;
        },
        set: () => {},
        convertSheetNameToSheetId: (sheetName: string): string => {
          const item = self.workbook.find((v) => v.name === sheetName);
          return item?.sheetId || '';
        },
      },
      {
        set() {
          throw new CustomError('#REF!');
        },
        get(name: string) {
          return self.definedNames[name];
        },
        has(name: string) {
          return name in self.definedNames;
        },
      },
    );
    return result.error ? result.error : result.result;
  }
  addRow(rowIndex: number, count: number): void {
    const sheetData = this.worksheets[this.currentSheetId];
    if (isEmpty(sheetData)) {
      return;
    }
    const sheetInfo = this.getSheetInfo();
    if (sheetInfo.rowCount >= XLSX_MAX_ROW_COUNT) {
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

    sheetInfo.rowCount += count;
  }
  addCol(colIndex: number, count: number): void {
    const sheetData = this.worksheets[this.currentSheetId];
    if (isEmpty(sheetData)) {
      return;
    }
    const sheetInfo = this.getSheetInfo();
    if (sheetInfo.colCount >= XLSX_MAX_COL_COUNT) {
      return;
    }
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

  hideCol(colIndex: number, count: number): void {
    this.customWidth[this.currentSheetId] =
      this.customWidth[this.currentSheetId] || {};
    for (let i = 0; i < count; i++) {
      const c = colIndex + i;
      this.customWidth[this.currentSheetId][c] = this.customWidth[
        this.currentSheetId
      ][c] || {
        widthOrHeight: CELL_WIDTH,
        isHide: true,
      };
      this.customWidth[this.currentSheetId][c].isHide = true;
    }
  }
  getColWidth(col: number): number {
    const temp = this.customWidth[this.currentSheetId];
    if (!temp || !temp[col]) {
      return CELL_WIDTH;
    }
    if (temp[col].isHide) {
      return 0;
    }
    return temp[col].widthOrHeight || CELL_WIDTH;
  }
  setColWidth(col: number, width: number): void {
    this.customWidth[this.currentSheetId] =
      this.customWidth[this.currentSheetId] || {};
    this.customWidth[this.currentSheetId][col] = this.customWidth[
      this.currentSheetId
    ][col] || { widthOrHeight: 0, isHide: false };
    this.customWidth[this.currentSheetId][col].widthOrHeight = width;
  }

  hideRow(rowIndex: number, count: number): void {
    this.customHeight[this.currentSheetId] =
      this.customHeight[this.currentSheetId] || {};
    for (let i = 0; i < count; i++) {
      const r = rowIndex + i;
      this.customHeight[this.currentSheetId][r] = this.customHeight[
        this.currentSheetId
      ][r] || {
        widthOrHeight: CELL_HEIGHT,
        isHide: true,
      };
      this.customHeight[this.currentSheetId][r].isHide = true;
    }
  }
  getRowHeight(row: number): number {
    const temp = this.customHeight[this.currentSheetId];
    if (!temp || !temp[row]) {
      return CELL_HEIGHT;
    }
    if (temp[row].isHide) {
      return 0;
    }
    return temp[row].widthOrHeight || CELL_HEIGHT;
  }
  setRowHeight(row: number, height: number): void {
    this.customHeight[this.currentSheetId] =
      this.customHeight[this.currentSheetId] || {};
    this.customHeight[this.currentSheetId][row] = this.customHeight[
      this.currentSheetId
    ][row] || { widthOrHeight: 0, isHide: false };
    this.customHeight[this.currentSheetId][row].widthOrHeight = height;
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
  pasteRange(fromRange: IRange, isCut: boolean): IRange {
    const currentSheetId = this.currentSheetId;
    const { activeCell } = this.getSheetInfo(currentSheetId);

    const { row, col, rowCount, colCount, sheetId } = fromRange;
    for (let r = row, i = 0, endRow = row + rowCount; r < endRow; r++, i++) {
      for (let c = col, j = 0, endCol = col + colCount; c < endCol; c++, j++) {
        const oldPath = `worksheets[${sheetId || currentSheetId}][${r}][${c}]`;
        const temp = get<ModelCellType>(this, oldPath, {});
        const realRow = activeCell.row + i;
        const realCol = activeCell.col + j;
        const path = `worksheets[${currentSheetId}][${realRow}][${realCol}]`;
        setWith(this, path, { ...temp });
        if (isCut) {
          setWith(this, oldPath, {});
        }
      }
    }
    this.computeAllCell();
    const range: IRange = {
      ...activeCell,
      rowCount,
      colCount,
    };

    return range;
  }
  deleteAll(sheetId?: string): void {
    const id = sheetId || this.currentSheetId;
    this.worksheets[id] = {};
    this.mergeCells = this.mergeCells.filter((v) => v.sheetId !== id);
    this.customHeight[id] = {};
    this.customWidth[id] = {};
    const definedNames: WorkBookJSON['definedNames'] = {};
    for (const key of Object.keys(this.definedNames)) {
      const t = this.definedNames[key];
      if (!t) {
        continue;
      }
      if (t.sheetId !== id) {
        definedNames[key] = t;
      }
    }
    this.definedNames = definedNames;
  }
  getDefineName(row: number, col: number): string {
    for (const key of Object.keys(this.definedNames)) {
      const t = this.definedNames[key];
      if (!t) {
        continue;
      }
      if (t.row === row && t.col === col) {
        return key;
      }
    }
    return '';
  }
}
