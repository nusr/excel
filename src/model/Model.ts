import {
  StyleType,
  WorkBookJSON,
  WorksheetType,
  Coordinate,
  IModel,
  ResultType,
  IRange,
  ModelCellValue,
  CustomItem,
  FloatElement,
  IHistory,
  ChangeEventType,
  ICommandItem,
} from '@/types';
import {
  getDefaultSheetInfo,
  assert,
  Range,
  DEFAULT_ROW_COUNT,
  DEFAULT_COL_COUNT,
  isSameRange,
  CELL_HEIGHT,
  CELL_WIDTH,
  XLSX_MAX_ROW_COUNT,
  XLSX_MAX_COL_COUNT,
  coordinateToString,
  stringToCoordinate,
  getCustomWidthOrHeightKey,
  FORMULA_PREFIX,
  HIDE_CELL,
  isEmpty,
  convertToReference,
  modelLog,
} from '@/util';
import { parseFormula, CustomError } from '@/formula';
import { History } from './History';
const DELETE_FLAG = Symbol('delete');

const getKey = (item: ICommandItem) => {
  return item.type + (item.path ? '.' + item.path : '');
};

function setData(obj: Record<string, any>, key: string, value: any) {
  if (!obj || typeof obj !== 'object') {
    return;
  }
  const keyList = key.split('.');
  keyList.reduce((res, key, index, arr) => {
    if (index === arr.length - 1) {
      if (value === DELETE_FLAG) {
        delete res[key];
      } else {
        res[key] = value;
      }
    } else if (res[key] === null || res[key] === undefined) {
      res[key] = {};
    }
    return res[key];
  }, obj);
}

export class Model implements IModel {
  private history: IHistory;
  private currentSheetId = '';
  private rangeMap: WorkBookJSON['rangeMap'] = {};
  private workbook: WorkBookJSON['workbook'] = {};
  private mergeCells: WorkBookJSON['mergeCells'] = {};
  private worksheets: WorkBookJSON['worksheets'] = {};
  private definedNames: WorkBookJSON['definedNames'] = {};
  private customWidth: WorkBookJSON['customWidth'] = {};
  private customHeight: WorkBookJSON['customHeight'] = {};
  private drawings: WorkBookJSON['drawings'] = {};
  constructor() {
    this.history = new History({
      undo: (item: ICommandItem) => {
        if (item.type === 'currentSheetId') {
          if (
            !this.workbook[item.oldValue] ||
            this.workbook[item.oldValue].isHide
          ) {
            this.currentSheetId = this.getSheetId();
          } else {
            this.currentSheetId = item.oldValue;
          }
          return;
        }
        const key = getKey(item);
        setData(this, key, item.oldValue);
      },
      redo: (item: ICommandItem) => {
        if (item.type === 'currentSheetId') {
          if (
            !this.workbook[item.newValue] ||
            this.workbook[item.newValue].isHide
          ) {
            this.currentSheetId = this.getSheetId();
          } else {
            this.currentSheetId = item.newValue;
          }
          return;
        }
        const key = getKey(item);
        setData(this, key, item.newValue);
      },
      change: (list) => {
        modelLog(list);
      },
    });
  }

  private getSheetData(sheetId?: string) {
    const id = sheetId || this.currentSheetId;
    return this.worksheets[id];
  }
  getSheetList(): WorksheetType[] {
    const list = Object.values(this.workbook);
    list.sort((a, b) => a.sort - b.sort);
    return list;
  }
  getActiveCell(): IRange {
    const id = this.currentSheetId;
    const range = this.rangeMap[id];
    if (range) {
      return {
        ...range,
      };
    }
    return {
      row: 0,
      col: 0,
      rowCount: 1,
      colCount: 1,
      sheetId: id,
    };
  }
  setActiveCell(newRange: IRange): void {
    newRange.sheetId = newRange.sheetId || this.currentSheetId;
    const sheet = this.workbook[newRange.sheetId];
    if (!sheet) {
      return;
    }
    const { row, col } = newRange;
    if (row < 0 || col < 0 || row >= sheet.rowCount || col >= sheet.colCount) {
      return;
    }
    const oldValue = this.rangeMap[newRange.sheetId];
    if (oldValue && isSameRange(oldValue, newRange)) {
      return;
    }
    this.rangeMap[newRange.sheetId] = newRange;

    this.history.push({
      type: 'rangeMap',
      path: newRange.sheetId,
      newValue: newRange,
      oldValue: oldValue ? oldValue : DELETE_FLAG,
    });
  }
  addSheet(): void {
    const list = this.getSheetList();
    const item = getDefaultSheetInfo(list);
    const sheet: WorksheetType = {
      ...item,
      isHide: false,
      colCount: DEFAULT_COL_COUNT,
      rowCount: DEFAULT_ROW_COUNT,
      sort: list.length,
    };
    const check = this.workbook[sheet.sheetId];
    assert(!check, 'The sheet id is duplicate');
    this.worksheets[sheet.sheetId] = this.worksheets[sheet.sheetId] || {};
    this.workbook[sheet.sheetId] = sheet;

    this.history.push({
      type: 'workbook',
      path: sheet.sheetId,
      newValue: sheet,
      oldValue: DELETE_FLAG,
    });
    this.setCurrentSheetId(sheet.sheetId);

    this.setActiveCell({
      row: 0,
      col: 0,
      rowCount: 1,
      colCount: 1,
      sheetId: sheet.sheetId,
    });
  }

  deleteSheet(sheetId?: string): void {
    const id = sheetId || this.currentSheetId;
    const sheetList = this.getSheetList();
    const list = sheetList.filter((v) => !v.isHide);
    assert(
      list.length >= 2,
      'A workbook must contains at least on visible worksheet',
    );
    const newSheetId = this.getNextSheetId(id);
    const oldSheet = this.workbook[id];
    delete this.workbook[id];
    const oldData = this.worksheets[id];
    delete this.worksheets[id];

    this.history.push({
      type: 'workbook',
      path: id,
      newValue: DELETE_FLAG,
      oldValue: oldSheet,
    });

    this.history.push({
      type: 'worksheets',
      path: id,
      newValue: DELETE_FLAG,
      oldValue: oldData,
    });

    this.setCurrentSheetId(newSheetId);
  }
  hideSheet(sheetId?: string | undefined): void {
    const id = sheetId || this.currentSheetId;
    const sheetList = this.getSheetList();
    const list = sheetList.filter((v) => !v.isHide);
    assert(
      list.length >= 2,
      'A workbook must contains at least on visible worksheet',
    );
    const newSheetId = this.getNextSheetId(sheetId);
    this.workbook[id].isHide = true;

    this.history.push({
      type: 'workbook',
      path: `${id}.isHide`,
      newValue: true,
      oldValue: false,
    });
    this.setCurrentSheetId(newSheetId);
  }
  unhideSheet(sheetId?: string | undefined): void {
    const id = sheetId || this.currentSheetId;
    this.workbook[id].isHide = false;

    this.history.push({
      type: 'workbook',
      path: `${id}.isHide`,
      newValue: false,
      oldValue: true,
    });
    this.setCurrentSheetId(id);
  }
  renameSheet(sheetName: string, sheetId?: string | undefined): void {
    assert(!!sheetName, 'You typed a invalid name for a sheet.');
    const id = sheetId || this.currentSheetId;
    const sheetList = this.getSheetList();
    const item = sheetList.find((v) => v.name === sheetName);
    if (item) {
      if (item.sheetId === sheetId) {
        return;
      }
      assert(false, 'Cannot rename a sheet to the same name as another sheet');
    }
    const sheetInfo = this.workbook[id];
    const oldName = sheetInfo.name;
    if (sheetInfo.name === sheetName) {
      return;
    }
    sheetInfo.name = sheetName;

    this.history.push({
      type: 'workbook',
      path: `${id}.name`,
      newValue: sheetName,
      oldValue: oldName,
    });
  }
  getSheetInfo(id?: string): WorksheetType | undefined {
    const sheetId = id || this.currentSheetId;
    const item = this.workbook[sheetId];
    if (item) {
      item.sheetId = sheetId;
    }
    return item;
  }
  setCurrentSheetId(newSheetId: string): void {
    if (this.currentSheetId !== newSheetId) {
      const oldSheetId = this.currentSheetId;
      this.currentSheetId = newSheetId;
      this.history.push({
        type: 'currentSheetId',
        path: '',
        newValue: newSheetId,
        oldValue: oldSheetId,
      });
    }
  }
  getCurrentSheetId(): string {
    return this.currentSheetId;
  }
  fromJSON = (json: WorkBookJSON): void => {
    const {
      workbook = {},
      mergeCells = {},
      customHeight = {},
      customWidth = {},
      definedNames = {},
      currentSheetId = '',
      drawings = {},
      rangeMap = {},
      worksheets = {},
    } = json;
    this.workbook = workbook;
    this.mergeCells = mergeCells;
    this.customWidth = customWidth;
    this.customHeight = customHeight;
    this.definedNames = definedNames;
    this.drawings = drawings;
    this.rangeMap = rangeMap;
    this.worksheets = worksheets;
    this.currentSheetId = currentSheetId || this.getSheetId();
    this.history.clear(true);
  };
  toJSON = (): WorkBookJSON => {
    return {
      workbook: { ...this.workbook },
      mergeCells: { ...this.mergeCells },
      customHeight: { ...this.customHeight },
      customWidth: { ...this.customWidth },
      definedNames: { ...this.definedNames },
      currentSheetId: this.currentSheetId,
      drawings: { ...this.drawings },
      rangeMap: { ...this.rangeMap },
      worksheets: { ...this.worksheets },
    };
  };

  setCellValues(
    value: ResultType[][],
    style: Array<Array<Partial<StyleType>>>,
    ranges: IRange[],
  ): void {
    if (isEmpty(value)) {
      return;
    }
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
        if (t && typeof t === 'string' && t.startsWith(FORMULA_PREFIX)) {
          this.setCellFormula(t, temp);
        } else {
          this.setCellFormula('', temp);
          this.setCellValue(t, temp);
        }
      }
    }
  }

  setCellStyle(style: Partial<StyleType>, ranges: IRange[]): void {
    if (isEmpty(style)) {
      return;
    }
    const [range] = ranges;
    const { row, col, rowCount, colCount } = range;
    for (let r = row, endRow = row + rowCount; r < endRow; r++) {
      for (let c = col, endCol = col + colCount; c < endCol; c++) {
        this.setStyle(style, { row: r, col: c });
      }
    }
  }
  getCell = (range: IRange): ModelCellValue | null => {
    const { row, col, sheetId } = range;
    const id = sheetId || this.currentSheetId;
    if (
      this.getRowHeight(row, id).len === HIDE_CELL ||
      this.getColWidth(col, id).len === HIDE_CELL
    ) {
      return null;
    }
    const key = coordinateToString(row, col);
    this.worksheets[id] = this.worksheets[id] || {};
    const sheetData = this.worksheets[id];
    const cellData = sheetData?.[key] || {};
    return {
      ...cellData,
      row,
      col,
    };
  };

  addRow(rowIndex: number, count: number): void {
    const sheetInfo = this.getSheetInfo()!;
    if (sheetInfo.rowCount >= XLSX_MAX_ROW_COUNT) {
      return;
    }
    sheetInfo.rowCount += count;
    const sheetData = this.getSheetData();
    if (!sheetData) {
      return;
    }
    const list = Array.from(Object.keys(sheetData)).map((key) =>
      stringToCoordinate(key),
    );
    list.sort((a, b) => a.row - b.row);
    for (let i = list.length - 1; i >= 0; i--) {
      const item = list[i];
      if (item.row <= rowIndex) {
        break;
      }
      const key = coordinateToString(item.row, item.col);
      const newKey = coordinateToString(item.row + count, item.col);
      const value = sheetData[key];
      sheetData[newKey] = { ...value };
      delete sheetData[key];
    }
  }
  addCol(colIndex: number, count: number): void {
    const sheetInfo = this.getSheetInfo()!;
    if (sheetInfo.colCount >= XLSX_MAX_COL_COUNT) {
      return;
    }
    sheetInfo.colCount += count;
    const sheetData = this.getSheetData();
    if (!sheetData) {
      return;
    }
    const list = Array.from(Object.keys(sheetData)).map((key) =>
      stringToCoordinate(key),
    );
    list.sort((a, b) => a.col - b.col);
    for (let i = list.length - 1; i >= 0; i--) {
      const item = list[i];
      if (item.col <= colIndex) {
        break;
      }
      const key = coordinateToString(item.row, item.col);
      const newKey = coordinateToString(item.row, item.col + count);
      const value = sheetData[key];
      sheetData[newKey] = { ...value };
      delete sheetData[key];
    }
  }
  deleteCol(colIndex: number, count: number): void {
    const sheetInfo = this.getSheetInfo()!;
    sheetInfo.colCount -= count;
    const sheetData = this.getSheetData();
    for (const item of Object.values(this.drawings)) {
      if (item.fromCol >= colIndex) {
        item.fromCol -= count;
        if (item.fromCol < 0) {
          item.fromCol = 0;
        }
      }
      if (item.type === 'chart' && item.chartRange!.col >= colIndex) {
        item.chartRange!.col -= count;
        if (item.chartRange!.col < 0) {
          item.chartRange!.colCount += item.chartRange!.col;
          item.chartRange!.col = 0;
          if (item.chartRange!.colCount < 0) {
            item.chartRange!.colCount = 1;
          }
        }
      }
    }

    if (!sheetData) {
      return;
    }
    const list = Array.from(Object.keys(sheetData)).map((key) =>
      stringToCoordinate(key),
    );
    list.sort((a, b) => a.col - b.col);
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      if (item.col < colIndex) {
        continue;
      }
      const key = coordinateToString(item.row, item.col);
      if (item.col >= colIndex + count) {
        const newKey = coordinateToString(item.row, item.col - count);
        sheetData[newKey] = { ...sheetData[key] };
      }
      delete sheetData[key];
    }
  }
  deleteRow(rowIndex: number, count: number): void {
    const sheetInfo = this.getSheetInfo()!;
    sheetInfo.rowCount -= count;
    const sheetData = this.getSheetData();
    for (const item of Object.values(this.drawings)) {
      if (item.fromRow >= rowIndex) {
        item.fromRow -= count;
        if (item.fromRow < 0) {
          item.fromRow = 0;
        }
      }
      if (item.type === 'chart' && item.chartRange!.row >= rowIndex) {
        item.chartRange!.row -= count;
        if (item.chartRange!.row < 0) {
          item.chartRange!.rowCount += item.chartRange!.row;
          item.chartRange!.row = 0;
          if (item.chartRange!.rowCount < 0) {
            item.chartRange!.rowCount = 1;
          }
        }
      }
    }

    if (!sheetData) {
      return;
    }
    const list = Array.from(Object.keys(sheetData)).map((key) =>
      stringToCoordinate(key),
    );
    list.sort((a, b) => a.row - b.row);
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      if (item.row < rowIndex) {
        continue;
      }
      const key = coordinateToString(item.row, item.col);
      if (item.row >= rowIndex + count) {
        const newKey = coordinateToString(item.row - count, item.col);
        sheetData[newKey] = { ...sheetData[key] };
      }
      delete sheetData[key];
    }
  }

  hideCol(colIndex: number, count: number): void {
    for (let i = 0; i < count; i++) {
      const c = colIndex + i;
      const key = getCustomWidthOrHeightKey(this.currentSheetId, c);
      const old = this.customWidth[key];
      if (old && old.isHide) {
        continue;
      }
      const newData = old
        ? { ...old, isHide: true }
        : {
            len: CELL_WIDTH,
            isHide: true,
          };
      this.customWidth[key] = newData;
      this.history.push({
        type: 'customWidth',
        path: key,
        newValue: newData,
        oldValue: old,
      });
    }
  }
  getColWidth(col: number, sheetId?: string): CustomItem {
    const id = sheetId || this.currentSheetId;
    const key = getCustomWidthOrHeightKey(id, col);
    const temp = this.customWidth[key];
    if (!temp) {
      return {
        len: CELL_WIDTH,
        isHide: false,
      };
    }
    if (temp.isHide) {
      return {
        isHide: true,
        len: HIDE_CELL,
      };
    } else {
      return { ...temp };
    }
  }
  setColWidth(
    col: number,
    width: number,
    _isChanged: boolean,
    sheetId?: string,
  ): void {
    const id = sheetId || this.currentSheetId;
    const key = getCustomWidthOrHeightKey(id, col);

    const data = this.customWidth[key];
    if (data && data.len === width) {
      return;
    }

    const newData = data || {
      len: CELL_WIDTH,
      isHide: false,
    };

    newData.len = width;
    if (!_isChanged) {
      this.customWidth[key] = newData;
      return;
    }
    this.customWidth[key] = newData;
    this.history.push({
      type: 'customWidth',
      path: key,
      newValue: newData,
      oldValue: this.customWidth[key] ? this.customWidth[key] : DELETE_FLAG,
    });
  }

  hideRow(rowIndex: number, count: number): void {
    for (let i = 0; i < count; i++) {
      const r = rowIndex + i;
      const key = getCustomWidthOrHeightKey(this.currentSheetId, r);
      const old = this.customHeight[key];

      if (old && old.isHide) {
        continue;
      }
      const newData = old
        ? { ...old, isHide: true }
        : {
            len: CELL_HEIGHT,
            isHide: true,
          };
      this.customHeight[key] = newData;
      this.history.push({
        type: 'customHeight',
        path: key,
        newValue: newData,
        oldValue: old,
      });
    }
  }
  getRowHeight(row: number, sheetId?: string): CustomItem {
    const id = sheetId || this.currentSheetId;
    const key = getCustomWidthOrHeightKey(id, row);
    const temp = this.customHeight[key];
    if (!temp) {
      return {
        len: CELL_HEIGHT,
        isHide: false,
      };
    }

    if (temp.isHide) {
      return {
        isHide: true,
        len: HIDE_CELL,
      };
    } else {
      return { ...temp };
    }
  }
  setRowHeight(
    row: number,
    height: number,
    _isChanged: boolean,
    sheetId?: string,
  ): void {
    const id = sheetId || this.currentSheetId;
    const key = getCustomWidthOrHeightKey(id, row);

    const oldData = this.customHeight[key];
    if (oldData && oldData.len === height) {
      return;
    }

    const data = oldData || {
      len: HIDE_CELL,
      isHide: false,
    };
    data.len = height;
    if (!_isChanged) {
      this.customHeight[key] = data;
      return;
    }
    this.customHeight[key] = data;
    this.history.push({
      type: 'customHeight',
      path: key,
      newValue: data,
      oldValue: this.customHeight[key] ? this.customHeight[key] : DELETE_FLAG,
    });
  }
  canRedo(): boolean {
    return this.history.canRedo();
  }
  canUndo(): boolean {
    return this.history.canUndo();
  }
  undo(): void {
    this.history.undo();
  }
  redo(): void {
    this.history.redo();
  }

  pasteRange(fromRange: IRange, isCut: boolean): IRange {
    const { currentSheetId } = this;
    const activeCell = this.getActiveCell();

    const { row, col, rowCount, colCount, sheetId } = fromRange;
    const fromSheetData = this.getSheetData(sheetId);

    const realRange: IRange = {
      ...activeCell,
      rowCount,
      colCount,
    };

    if (!fromSheetData) {
      return realRange;
    }
    this.worksheets[currentSheetId] = this.worksheets[currentSheetId] || {};
    const currentSheetData = this.getSheetData(currentSheetId)!;
    this.iterateRange(fromRange, (r, c) => {
      const oldPath = coordinateToString(r, c);
      const temp = fromSheetData[oldPath] || {};
      const realRow = activeCell.row + (r - row);
      const realCol = activeCell.col + (c - col);
      const path = coordinateToString(realRow, realCol);
      currentSheetData[path] = { ...temp };
      if (isCut) {
        delete fromSheetData[oldPath];
      }
      return false;
    });

    return realRange;
  }
  deleteAll(sheetId?: string): void {
    const id = sheetId || this.currentSheetId;
    const oldSheetData = this.worksheets[id];
    delete this.worksheets[id];

    this.history.push({
      type: 'worksheets',
      path: id,
      newValue: DELETE_FLAG,
      oldValue: oldSheetData,
    });

    for (const [key, value] of Object.entries(this.mergeCells)) {
      if (value.sheetId === id) {
        delete this.mergeCells[key];
        this.history.push({
          type: 'mergeCells',
          path: key,
          newValue: DELETE_FLAG,
          oldValue: value,
        });
      }
    }

    for (const [key, value] of Object.entries(this.drawings)) {
      if (value.sheetId === id) {
        delete this.drawings[key];
        this.history.push({
          type: 'drawings',
          path: key,
          newValue: DELETE_FLAG,
          oldValue: value,
        });
      }
    }

    for (const [key, value] of Object.entries(this.customHeight)) {
      if (key.startsWith(id)) {
        delete this.customHeight[key];
        this.history.push({
          type: 'customHeight',
          path: key,
          newValue: DELETE_FLAG,
          oldValue: value,
        });
      }
    }

    for (const [key, value] of Object.entries(this.customWidth)) {
      if (key.startsWith(id)) {
        delete this.customWidth[key];
        this.history.push({
          type: 'customWidth',
          path: key,
          newValue: DELETE_FLAG,
          oldValue: value,
        });
      }
    }

    for (const [key, value] of Object.entries(this.definedNames)) {
      if (key.startsWith(id)) {
        delete this.definedNames[key];
        this.history.push({
          type: 'definedNames',
          path: key,
          newValue: DELETE_FLAG,
          oldValue: value,
        });
      }
    }
  }
  getDefineName(range: IRange): string {
    const sheetId = range.sheetId || this.currentSheetId;
    for (const [key, t] of Object.entries(this.definedNames)) {
      if (!t) {
        continue;
      }
      if (t.row === range.row && t.col === range.col && t.sheetId === sheetId) {
        return key;
      }
    }
    return '';
  }
  setDefineName(range: IRange, name: string): void {
    const oldName = this.getDefineName(range);
    if (
      oldName &&
      Object.prototype.hasOwnProperty.call(this.definedNames, oldName)
    ) {
      delete this.definedNames[oldName];
    }
    const result: IRange = {
      row: range.row,
      col: range.col,
      sheetId: this.currentSheetId,
      colCount: 1,
      rowCount: 1,
    };
    this.definedNames[name] = result;

    if (oldName) {
      this.history.push({
        type: 'definedNames',
        path: name,
        newValue: result,
        oldValue: DELETE_FLAG,
      });

      this.history.push({
        type: 'definedNames',
        path: oldName,
        newValue: DELETE_FLAG,
        oldValue: result,
      });
    } else {
      this.history.push({
        type: 'definedNames',
        path: name,
        newValue: result,
        oldValue: DELETE_FLAG,
      });
    }
  }
  checkDefineName(name: string): IRange | undefined {
    return this.definedNames[name];
  }

  private setCellValue(value: ResultType, range: Coordinate): void {
    const { row, col } = range;
    const id = this.currentSheetId;
    this.worksheets[id] = this.worksheets[id] || {};
    const sheetData = this.worksheets[id];
    const key = coordinateToString(row, col);
    sheetData[key] = sheetData[key] || {};
    const oldData = sheetData[key];
    if (oldData.value === value) {
      return;
    }
    const oldValue = oldData.value ?? '';
    const newValue = value ?? '';
    sheetData[key].value = newValue;

    this.history.push({
      type: 'worksheets',
      path: `${id}.${key}.value`,
      newValue: newValue,
      oldValue: oldValue,
    });
  }
  private setCellFormula(formula: string, range: Coordinate): void {
    const { row, col } = range;
    const id = this.currentSheetId;
    this.worksheets[id] = this.worksheets[id] || {};
    const sheetData = this.worksheets[id];
    const key = coordinateToString(row, col);
    sheetData[key] = sheetData[key] || {};
    const oldData = sheetData[key];
    const oldFormula = oldData.formula;
    if (oldFormula === formula) {
      return;
    }
    sheetData[key].formula = formula;

    this.history.push({
      type: 'worksheets',
      path: `${id}.${key}.formula`,
      newValue: formula,
      oldValue: oldFormula,
    });
  }
  private computeAllCell() {
    for (const [key, sheetData] of Object.entries(this.worksheets)) {
      if (!sheetData) {
        continue;
      }
      for (const [k, data] of Object.entries(sheetData)) {
        if (data?.formula) {
          const result = this.parseFormula(data.formula);
          const newValue = result.error ? result.error : result.result;
          const oldValue = data.value;
          if (newValue !== oldValue) {
            data.value = newValue;
            this.history.push({
              type: 'worksheets',
              path: `${key}.${k}.value`,
              newValue,
              oldValue,
            });
          }
        }
      }
    }
  }
  private iterateRange(
    range: IRange,
    fn: (row: number, col: number) => boolean,
  ) {
    const { row, col, rowCount, colCount, sheetId } = range;
    const sheetInfo = this.getSheetInfo(sheetId);
    if (!sheetInfo) {
      return;
    }
    if (colCount === 0 && rowCount > 0) {
      for (let r = row, endRow = row + sheetInfo.rowCount; r < endRow; r++) {
        if (fn(r, col)) {
          break;
        }
      }
    } else if (rowCount === 0 && colCount > 0) {
      for (let c = col, endCol = col + sheetInfo.colCount; c < endCol; c++) {
        if (fn(row, c)) {
          break;
        }
      }
    } else {
      for (
        let r = row, endRow = row + (rowCount || sheetInfo.rowCount);
        r < endRow;
        r++
      ) {
        for (
          let c = col, endCol = col + (colCount || sheetInfo.colCount);
          c < endCol;
          c++
        ) {
          if (fn(r, c)) {
            return;
          }
        }
      }
    }
  }
  private parseFormula(formula: string) {
    const result = parseFormula(
      formula,
      {
        get: (range: IRange) => {
          const { row, col, sheetId } = range;
          const result: ResultType[] = [];
          const sheetInfo = this.getSheetInfo(sheetId || this.currentSheetId);
          if (
            !sheetInfo ||
            row >= sheetInfo.rowCount ||
            col >= sheetInfo.colCount
          ) {
            throw new CustomError('#REF!');
          }
          this.iterateRange(range, (r, c) => {
            const temp = this.getCell(new Range(r, c, 1, 1, sheetId));
            if (temp) {
              result.push(temp.value);
            }
            return false;
          });
          return result;
        },
        set: () => {
          throw new CustomError('#REF!');
        },
        convertSheetNameToSheetId: this.convertSheetNameToSheetId,
      },
      {
        set: () => {
          throw new CustomError('#REF!');
        },
        get: (name: string) => this.checkDefineName(name),
        has: (name: string) => {
          const t = this.checkDefineName(name);
          return Boolean(t);
        },
      },
    );
    return result;
  }
  private getNextSheetId(sheetId?: string) {
    const id = sheetId || this.currentSheetId;
    const list = this.getSheetList();
    const index = list.findIndex((item) => item.sheetId === id);
    assert(index >= 0);
    const isLast = index === list.length - 1;
    let lastIndex = isLast
      ? (index - 1 + list.length) % list.length
      : (index + 1) % list.length;
    while (lastIndex !== index) {
      if (list[lastIndex].isHide) {
        lastIndex = isLast
          ? (lastIndex - 1 + list.length) % list.length
          : (lastIndex + 1) % list.length;
      } else {
        break;
      }
    }
    return list[lastIndex].sheetId;
  }
  private getSheetId() {
    const list = this.getSheetList();
    const result = list.filter((v) => !v.isHide);
    return result[0].sheetId;
  }
  private setStyle(style: Partial<StyleType>, range: Coordinate) {
    const key = coordinateToString(range.row, range.col);
    const id = this.currentSheetId;
    this.worksheets[id] = this.worksheets[id] || {};
    const sheetData = this.worksheets[id];
    sheetData[key] = sheetData[key] || {};
    const cellData = sheetData[key];

    const styleData = cellData.style || {};

    const oldStyle = { ...styleData };
    sheetData[key].style = style;

    this.history.push({
      type: 'worksheets',
      path: `${id}.${key}.style`,
      newValue: style,
      oldValue: oldStyle,
    });
  }
  getFloatElementList(sheetId: string): FloatElement[] {
    const id = sheetId || this.currentSheetId;
    const list = Object.values(this.drawings).filter((v) => v.sheetId === id);
    return list;
  }
  addFloatElement(data: FloatElement) {
    const oldData = this.drawings[data.uuid];
    assert(!oldData, 'The uuid is duplicate');
    if (data.type === 'chart') {
      const range = data.chartRange!;
      let check = false;
      this.iterateRange(range, (row: number, col: number) => {
        const data = this.getCell({
          row,
          col,
          rowCount: 1,
          colCount: 1,
          sheetId: '',
        });
        if (data?.value) {
          check = true;
          return true;
        } else {
          return false;
        }
      });
      assert(check, 'The cells must contain the data');
    } else if (data.type === 'floating-picture') {
      assert(!!data.imageSrc, 'Image is empty');
      if (typeof data.imageAngle !== 'number') {
        data.imageAngle = 0;
      }
    }
    this.drawings[data.uuid] = data;
    this.history.push({
      type: 'drawings',
      path: data.uuid,
      newValue: data,
      oldValue: DELETE_FLAG,
    });
  }
  updateFloatElement(uuid: string, value: Partial<FloatElement>) {
    const item = this.drawings[uuid];
    if (!item) {
      return;
    }
    const keyList = Object.keys(value) as Array<keyof FloatElement>;
    for (const key of keyList) {
      if (item[key] !== value[key]) {
        const oldValue = item[key];
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        item[key] = value[key];
        this.history.push({
          type: 'drawings',
          path: `${uuid}.${key}`,
          newValue: item[key],
          oldValue: oldValue,
        });
      }
    }
  }
  deleteFloatElement(uuid: string) {
    const oldData = this.drawings[uuid];
    if (!oldData) {
      return;
    }
    delete this.drawings[uuid];
    this.history.push({
      type: 'drawings',
      path: uuid,
      newValue: DELETE_FLAG,
      oldValue: oldData,
    });
  }
  getMergeCells(sheetId?: string): IRange[] {
    const id = sheetId || this.currentSheetId;
    return Object.values(this.mergeCells).filter((v) => v.sheetId === id);
  }
  addMergeCell(range: IRange): void {
    if (range.colCount > 1 || range.rowCount > 1) {
      range.sheetId = range.sheetId || this.currentSheetId;
      const ref = convertToReference(
        range,
        'absolute',
        this.convertSheetIdToName,
      );
      assert(!this.mergeCells[ref], 'The merging cell is duplicate');
      this.mergeCells[ref] = range;
      this.history.push({
        type: 'mergeCells',
        path: ref,
        newValue: range,
        oldValue: DELETE_FLAG,
      });
    }
  }
  deleteMergeCell(range: IRange): void {
    range.sheetId = range.sheetId || this.currentSheetId;
    const ref = convertToReference(
      range,
      'absolute',
      this.convertSheetIdToName,
    );
    if (!this.mergeCells[ref]) {
      return;
    }
    const oldRange = this.mergeCells[ref];
    delete this.mergeCells[ref];

    this.history.push({
      type: 'mergeCells',
      path: ref,
      newValue: DELETE_FLAG,
      oldValue: oldRange,
    });
  }
  emitChange(dataset: Set<ChangeEventType>) {
    if (dataset.has('cellValue')) {
      this.computeAllCell();
    }
    if (!dataset.has('undoRedo')) {
      this.history.commit();
    }
    this.history.clear(false);
  }
  private convertSheetIdToName = (sheetId: string) => {
    const data = this.workbook[sheetId];
    return data?.name || '';
  };
  private convertSheetNameToSheetId = (sheetName: string): string => {
    const item = this.getSheetList().find((v) => v.name === sheetName);
    return item?.sheetId || '';
  };
}
