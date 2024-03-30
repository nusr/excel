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
  DefinedNameItem,
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
  modelToChangeSet,
  eventEmitter,
} from '@/util';
import { parseFormula, CustomError } from '@/formula';
import { History } from './History';
import { $ } from '@/i18n';

const DELETE_FLAG = Symbol('delete');

const getKey = (item: ICommandItem) => {
  return item.t + (item.k ? '.' + item.k : '');
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
        if (item.t === 'currentSheetId') {
          if (!this.workbook[item.o] || this.workbook[item.o].isHide) {
            this.currentSheetId = this.getSheetId();
          } else {
            this.currentSheetId = item.o;
          }
          return;
        }
        const key = getKey(item);
        setData(this, key, item.o);
      },
      redo: (item: ICommandItem) => {
        if (item.t === 'currentSheetId') {
          if (!this.workbook[item.n] || this.workbook[item.n].isHide) {
            this.currentSheetId = this.getSheetId();
          } else {
            this.currentSheetId = item.n;
          }
          return;
        }
        const key = getKey(item);
        setData(this, key, item.n);
      },
      change: (list, type) => {
        const changeSet = modelToChangeSet(list);
        if (type === 'undoRedo') {
          changeSet.add(type);
        }
        modelLog(changeSet);
        eventEmitter.emit('modelChange', { changeSet });
      },
    });
  }
  emitChange(set: Set<ChangeEventType>) {
    const changeSet = modelToChangeSet(this.history.get());
    if (
      changeSet.has('cellValue') ||
      changeSet.has('defineName') ||
      changeSet.has('sheetId')
    ) {
      this.computeAllCell();
    }
    if (set.has('scroll')) {
      this.history.push({ t: 'scroll', k: '', n: '', o: '' });
    }
    if (set.has('antLine')) {
      this.history.push({ t: 'antLine', k: '', n: '', o: '' });
    }
    if (!set.has('undoRedo')) {
      this.history.commit();
    }
    this.history.clear(false);
  }
  getSheetList(): WorksheetType[] {
    const list = Object.values(this.workbook);
    list.sort((a, b) => a.sort - b.sort);
    return list.slice();
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
      t: 'rangeMap',
      k: newRange.sheetId,
      n: newRange,
      o: oldValue ? oldValue : DELETE_FLAG,
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
    assert(!check, $('sheet-id-is-duplicate'));
    this.worksheets[sheet.sheetId] = this.worksheets[sheet.sheetId] || {};
    this.workbook[sheet.sheetId] = sheet;

    this.history.push({
      t: 'workbook',
      k: sheet.sheetId,
      n: { ...sheet },
      o: DELETE_FLAG,
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
    if (!this.workbook[id]) {
      return;
    }
    const sheetList = this.getSheetList();
    const list = sheetList.filter((v) => !v.isHide);
    assert(
      list.length >= 2,
      $('a-workbook-must-contains-at-least-one-visible-worksheet'),
    );
    const newSheetId = this.getNextSheetId(id);
    const oldSheet = this.workbook[id];
    delete this.workbook[id];
    const oldData = this.worksheets[id];
    delete this.worksheets[id];

    this.history.push({
      t: 'workbook',
      k: id,
      n: DELETE_FLAG,
      o: oldSheet,
    });

    this.history.push({
      t: 'worksheets',
      k: id,
      n: DELETE_FLAG,
      o: oldData,
    });

    this.setCurrentSheetId(newSheetId);
  }
  setTabColor(color: string, sheetId?: string): void {
    const id = sheetId || this.currentSheetId;
    if (!this.workbook[id]) {
      return;
    }
    if (this.workbook[id].tabColor === color) {
      return;
    }
    const old = this.workbook[id].tabColor;
    this.workbook[id].tabColor = color;

    this.history.push({
      t: 'workbook',
      k: `${id}.tabColor`,
      n: color,
      o: old,
    });
  }
  hideSheet(sheetId?: string | undefined): void {
    const id = sheetId || this.currentSheetId;
    if (!this.workbook[id]) {
      return;
    }
    if (this.workbook[id].isHide) {
      return;
    }
    const sheetList = this.getSheetList();
    const list = sheetList.filter((v) => !v.isHide);
    assert(
      list.length >= 2,
      $('a-workbook-must-contains-at-least-one-visible-worksheet'),
    );
    const newSheetId = this.getNextSheetId(sheetId);
    this.workbook[id].isHide = true;

    this.history.push({
      t: 'workbook',
      k: `${id}.isHide`,
      n: true,
      o: false,
    });
    this.setCurrentSheetId(newSheetId);
  }
  unhideSheet(sheetId?: string | undefined): void {
    const id = sheetId || this.currentSheetId;
    if (!this.workbook[id]) {
      return;
    }
    if (!this.workbook[id].isHide) {
      return;
    }
    this.workbook[id].isHide = false;

    this.history.push({
      t: 'workbook',
      k: `${id}.isHide`,
      n: false,
      o: true,
    });
    this.setCurrentSheetId(id);
  }
  renameSheet(sheetName: string, sheetId?: string | undefined): void {
    assert(!!sheetName, $('the-value-cannot-be-empty'));
    const id = sheetId || this.currentSheetId;
    const sheetList = this.getSheetList();
    const item = sheetList.find((v) => v.name === sheetName);
    if (item) {
      if (item.sheetId === sheetId) {
        return;
      }
      assert(false, $('sheet-name-is-duplicate'));
    }
    const sheetInfo = this.workbook[id];
    const oldName = sheetInfo.name;
    if (sheetInfo.name === sheetName) {
      return;
    }
    sheetInfo.name = sheetName;

    this.history.push({
      t: 'workbook',
      k: `${id}.name`,
      n: sheetName,
      o: oldName,
    });
  }
  getSheetInfo(id?: string): WorksheetType | undefined {
    const sheetId = id || this.currentSheetId;
    const item = this.workbook[sheetId];
    if (item) {
      item.sheetId = sheetId;
    }
    return { ...item };
  }
  setCurrentSheetId(newSheetId: string): void {
    if (!this.workbook[newSheetId]) {
      return;
    }
    if (this.currentSheetId !== newSheetId) {
      const oldSheetId = this.currentSheetId;
      this.currentSheetId = newSheetId;
      this.history.push({
        t: 'currentSheetId',
        k: '',
        n: newSheetId,
        o: oldSheetId,
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
    this.workbook = { ...workbook };
    this.mergeCells = { ...mergeCells };
    this.customWidth = { ...customWidth };
    this.customHeight = { ...customHeight };
    this.definedNames = { ...definedNames };
    this.drawings = { ...drawings };
    this.rangeMap = { ...rangeMap };
    this.worksheets = { ...worksheets };
    if (workbook[currentSheetId] && !workbook[currentSheetId].isHide) {
      this.currentSheetId = currentSheetId;
    } else {
      this.currentSheetId = this.getSheetId();
    }
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
    const id = range.sheetId || this.currentSheetId;
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
          const old =
            this.worksheets[id][coordinateToString(temp.row, temp.col)];
          if (old?.formula) {
            this.setCellFormula('', temp);
          }
          this.setCellValue(t, temp);
        }
      }
    }
  }

  updateCellStyle(style: Partial<StyleType>, ranges: IRange[]): void {
    if (isEmpty(style)) {
      return;
    }
    const [range] = ranges;
    const { row, col, rowCount, colCount } = range;
    for (let r = row, endRow = row + rowCount; r < endRow; r++) {
      for (let c = col, endCol = col + colCount; c < endCol; c++) {
        this.updateStyle(style, { row: r, col: c });
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
    const cellData = sheetData?.[key];
    if (isEmpty(cellData)) {
      return null;
    }
    return {
      ...cellData,
      row,
      col,
    };
  };

  addRow(rowIndex: number, count: number): void {
    if (count <= 0) {
      return;
    }
    const sheetInfo = this.getSheetInfo()!;
    if (sheetInfo.rowCount >= XLSX_MAX_ROW_COUNT) {
      return;
    }

    const id = this.currentSheetId;
    const sheetData = this.worksheets[id];
    const oldCount = sheetInfo.rowCount;
    const newCount = sheetInfo.rowCount + count;
    this.workbook[id].rowCount = newCount;
    this.history.push({
      t: 'workbook',
      k: `${id}.rowCount`,
      n: newCount,
      o: oldCount,
    });
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
      const newValue = value ? { ...value } : {};
      const oldData = sheetData[newKey] ? { ...sheetData[newKey] } : {};

      sheetData[newKey] = { ...newValue };
      delete sheetData[key];

      this.history.push({
        t: 'worksheets',
        k: `${id}.${key}`,
        n: DELETE_FLAG,
        o: newValue,
      });

      this.history.push({
        t: 'worksheets',
        k: `${id}.${newKey}`,
        n: newValue,
        o: oldData,
      });
    }
  }
  addCol(colIndex: number, count: number): void {
    if (count <= 0) {
      return;
    }
    const sheetInfo = this.getSheetInfo()!;
    if (sheetInfo.colCount >= XLSX_MAX_COL_COUNT) {
      return;
    }

    const id = this.currentSheetId;
    const sheetData = this.worksheets[id];
    const oldCount = sheetInfo.colCount;
    const newCount = sheetInfo.colCount + count;
    this.workbook[id].colCount = newCount;
    this.history.push({
      t: 'workbook',
      k: `${id}.colCount`,
      n: newCount,
      o: oldCount,
    });
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
      const newValue = value ? { ...value } : {};
      const oldValue = sheetData[newKey] ? { ...sheetData[newKey] } : {};

      sheetData[newKey] = { ...newValue };
      delete sheetData[key];

      this.history.push({
        t: 'worksheets',
        k: `${id}.${key}`,
        n: DELETE_FLAG,
        o: newValue,
      });

      this.history.push({
        t: 'worksheets',
        k: `${id}.${newKey}`,
        n: newValue,
        o: oldValue,
      });
    }
  }
  deleteCol(colIndex: number, count: number): void {
    if (count <= 0) {
      return;
    }
    const sheetInfo = this.getSheetInfo()!;
    const id = this.currentSheetId;
    const sheetData = this.worksheets[id];
    const oldCount = sheetInfo.colCount;
    const newCount = sheetInfo.colCount - count;
    this.workbook[id].colCount = newCount;
    this.history.push({
      t: 'workbook',
      k: `${id}.colCount`,
      n: newCount,
      o: oldCount,
    });

    for (const [uuid, item] of Object.entries(this.drawings)) {
      if (item.fromCol >= colIndex) {
        const oldValue = item.fromCol;
        if (item.fromCol >= count) {
          item.fromCol -= count;
        } else {
          item.fromCol = 0;
        }
        this.history.push({
          t: 'drawings',
          k: `${uuid}.fromCol`,
          n: item.fromCol,
          o: oldValue,
        });
      }
      if (item.type === 'chart' && item.chartRange!.col >= colIndex) {
        const oldCol = item.chartRange!.col;
        const oldColCount = item.chartRange!.colCount;
        if (item.chartRange!.col >= count) {
          item.chartRange!.col -= count;
        } else {
          const t = count - item.chartRange!.col;
          item.chartRange!.col = 0;
          if (item.chartRange!.colCount >= t) {
            item.chartRange!.colCount -= t;
          } else {
            item.chartRange!.colCount = 1;
          }
          this.history.push({
            t: 'drawings',
            k: `${uuid}.chartRange.colCount`,
            n: item.chartRange!.col,
            o: oldColCount,
          });
        }
        this.history.push({
          t: 'drawings',
          k: `${uuid}.chartRange.col`,
          n: item.chartRange!.col,
          o: oldCol,
        });
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
      const newValue = sheetData[key] ? { ...sheetData[key] } : {};
      if (item.col >= colIndex + count) {
        const newKey = coordinateToString(item.row, item.col - count);
        const oldValue = sheetData[newKey] ? { ...sheetData[newKey] } : {};

        sheetData[newKey] = { ...newValue };
        this.history.push({
          t: 'worksheets',
          k: `${id}.${newKey}`,
          n: newValue,
          o: oldValue,
        });
      }
      delete sheetData[key];
      this.history.push({
        t: 'worksheets',
        k: `${id}.${key}`,
        n: DELETE_FLAG,
        o: newValue,
      });
    }
  }
  deleteRow(rowIndex: number, count: number): void {
    if (count <= 0) {
      return;
    }
    const sheetInfo = this.getSheetInfo()!;
    const id = this.currentSheetId;
    const sheetData = this.worksheets[id];

    const oldCount = sheetInfo.rowCount;
    const newCount = sheetInfo.rowCount - count;
    this.workbook[id].rowCount = newCount;
    this.history.push({
      t: 'workbook',
      k: `${id}.rowCount`,
      n: newCount,
      o: oldCount,
    });

    for (const [uuid, item] of Object.entries(this.drawings)) {
      if (item.fromRow >= rowIndex) {
        const oldValue = item.fromRow;
        if (item.fromRow >= count) {
          item.fromRow -= count;
        } else {
          item.fromRow = 0;
        }
        this.history.push({
          t: 'drawings',
          k: `${uuid}.fromRow`,
          n: item.fromRow,
          o: oldValue,
        });
      }
      if (item.type === 'chart' && item.chartRange!.row >= rowIndex) {
        const oldRow = item.chartRange!.row;
        const oldRowCount = item.chartRange!.rowCount;
        if (item.chartRange!.row >= count) {
          item.chartRange!.row -= count;
        } else {
          const t = count - item.chartRange!.row;
          item.chartRange!.row = 0;
          if (item.chartRange!.rowCount >= t) {
            item.chartRange!.rowCount -= t;
          } else {
            item.chartRange!.rowCount = 1;
          }
          this.history.push({
            t: 'drawings',
            k: `${uuid}.chartRange.rowCount`,
            n: item.chartRange!.row,
            o: oldRowCount,
          });
        }
        this.history.push({
          t: 'drawings',
          k: `${uuid}.chartRange.row`,
          n: item.chartRange!.row,
          o: oldRow,
        });
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
      const newValue = sheetData[key] ? { ...sheetData[key] } : {};
      if (item.row >= rowIndex + count) {
        const newKey = coordinateToString(item.row - count, item.col);
        const oldValue = sheetData[newKey] ? { ...sheetData[newKey] } : {};
        sheetData[newKey] = { ...newValue };
        this.history.push({
          t: 'worksheets',
          k: `${id}.${newKey}`,
          n: newValue,
          o: oldValue,
        });
      }
      delete sheetData[key];
      this.history.push({
        t: 'worksheets',
        k: `${id}.${key}`,
        n: DELETE_FLAG,
        o: newValue,
      });
    }
  }

  hideCol(colIndex: number, count: number): void {
    for (let i = 0; i < count; i++) {
      const c = colIndex + i;
      const key = getCustomWidthOrHeightKey(this.currentSheetId, c);
      const old = this.getColWidth(c);
      if (old.isHide) {
        continue;
      }
      const newData = { ...old, isHide: true };
      this.customWidth[key] = newData;
      this.history.push({
        t: 'customWidth',
        k: key,
        n: { ...newData },
        o: this.customWidth[key] ? old : DELETE_FLAG,
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
  setColWidth(col: number, width: number, sheetId?: string): void {
    const id = sheetId || this.currentSheetId;
    const key = getCustomWidthOrHeightKey(id, col);

    const oldData = this.getColWidth(col, sheetId);
    if (oldData.len === width) {
      return;
    }

    const newData = { ...oldData };
    const old = this.customWidth[key];

    newData.len = width;
    this.customWidth[key] = newData;
    this.history.push({
      t: 'customWidth',
      k: key,
      n: newData,
      o: old ? old : DELETE_FLAG,
    });
  }

  hideRow(rowIndex: number, count: number): void {
    for (let i = 0; i < count; i++) {
      const r = rowIndex + i;
      const key = getCustomWidthOrHeightKey(this.currentSheetId, r);
      const old = this.getRowHeight(r);

      if (old.isHide) {
        continue;
      }
      const newData = { ...old, isHide: true };

      this.customHeight[key] = newData;
      this.history.push({
        t: 'customHeight',
        k: key,
        n: newData,
        o: this.customHeight[key] ? old : DELETE_FLAG,
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
  setRowHeight(row: number, height: number, sheetId?: string): void {
    const id = sheetId || this.currentSheetId;
    const key = getCustomWidthOrHeightKey(id, row);

    const oldData = this.getRowHeight(row, sheetId);
    if (oldData.len === height) {
      return;
    }

    const newData = { ...oldData };
    const old = this.customHeight[key];
    newData.len = height;
    this.customHeight[key] = newData;
    this.history.push({
      t: 'customHeight',
      k: key,
      n: newData,
      o: old ? old : DELETE_FLAG,
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
    const id = this.currentSheetId;
    const activeCell = this.getActiveCell();

    const { row, col, rowCount, colCount, sheetId } = fromRange;
    const realSheetId = sheetId || id;
    const fromSheetData = this.worksheets[realSheetId];

    const realRange: IRange = {
      ...activeCell,
      rowCount,
      colCount,
    };

    if (!fromSheetData) {
      return realRange;
    }
    this.worksheets[id] = this.worksheets[id] || {};
    const currentSheetData = this.worksheets[id];
    this.iterateRange(fromRange, (r, c) => {
      const oldPath = coordinateToString(r, c);
      const newValue = fromSheetData[oldPath]
        ? { ...fromSheetData[oldPath] }
        : {};
      const realRow = activeCell.row + (r - row);
      const realCol = activeCell.col + (c - col);
      const path = coordinateToString(realRow, realCol);
      const oldValue = currentSheetData[path]
        ? { ...currentSheetData[path] }
        : {};
      currentSheetData[path] = { ...newValue };
      this.history.push({
        t: 'worksheets',
        k: `${id}.${path}`,
        n: newValue,
        o: oldValue,
      });

      if (isCut) {
        delete fromSheetData[oldPath];
        this.history.push({
          t: 'worksheets',
          k: `${realSheetId}.${oldPath}`,
          n: DELETE_FLAG,
          o: newValue,
        });
      }
      return false;
    });

    return realRange;
  }
  deleteAll(sheetId?: string): void {
    const id = sheetId || this.currentSheetId;
    const oldSheetData = this.worksheets[id] ? { ...this.worksheets[id] } : {};
    delete this.worksheets[id];

    this.history.push({
      t: 'worksheets',
      k: id,
      n: DELETE_FLAG,
      o: { ...oldSheetData },
    });

    for (const [key, value] of Object.entries(this.mergeCells)) {
      if (value.sheetId === id) {
        delete this.mergeCells[key];
        this.history.push({
          t: 'mergeCells',
          k: key,
          n: DELETE_FLAG,
          o: value,
        });
      }
    }

    for (const [key, value] of Object.entries(this.drawings)) {
      if (value.sheetId === id) {
        delete this.drawings[key];
        this.history.push({
          t: 'drawings',
          k: key,
          n: DELETE_FLAG,
          o: { ...value },
        });
      }
    }

    for (const [key, value] of Object.entries(this.customHeight)) {
      if (key.startsWith(id)) {
        delete this.customHeight[key];
        this.history.push({
          t: 'customHeight',
          k: key,
          n: DELETE_FLAG,
          o: value,
        });
      }
    }

    for (const [key, value] of Object.entries(this.customWidth)) {
      if (key.startsWith(id)) {
        delete this.customWidth[key];
        this.history.push({
          t: 'customWidth',
          k: key,
          n: DELETE_FLAG,
          o: value,
        });
      }
    }

    for (const [key, value] of Object.entries(this.definedNames)) {
      if (value.sheetId === id) {
        delete this.definedNames[key];
        this.history.push({
          t: 'definedNames',
          k: key,
          n: DELETE_FLAG,
          o: value,
        });
      }
    }
  }
  getDefineNameList(): DefinedNameItem[] {
    const list = Object.entries(this.definedNames);
    if (list.length === 0) {
      return [];
    }
    return list.map((v) => ({
      name: v[0],
      range: v[1],
    }));
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
    if (oldName === name) {
      return;
    }

    const result: IRange = {
      row: range.row,
      col: range.col,
      sheetId: range.sheetId || this.currentSheetId,
      colCount: 1,
      rowCount: 1,
    };
    this.definedNames[name] = result;
    if (oldName) {
      delete this.definedNames[oldName];
    }

    if (oldName) {
      this.history.push({
        t: 'definedNames',
        k: name,
        n: result,
        o: DELETE_FLAG,
      });

      this.history.push({
        t: 'definedNames',
        k: oldName,
        n: DELETE_FLAG,
        o: result,
      });
    } else {
      this.history.push({
        t: 'definedNames',
        k: name,
        n: result,
        o: DELETE_FLAG,
      });
    }
  }
  checkDefineName(name: string): IRange | undefined {
    const range = this.definedNames[name];
    if (range) {
      return { ...this.definedNames[name] };
    }
    return undefined;
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
    const oldValue = oldData.value;
    let newValue = value;
    if (
      typeof value === 'string' &&
      ['TRUE', 'FALSE'].includes(value.toUpperCase())
    ) {
      newValue = value.toUpperCase() === 'TRUE' ? true : false;
    }

    sheetData[key].value = newValue;

    this.history.push({
      t: 'worksheets',
      k: `${id}.${key}.value`,
      n: newValue,
      o: oldValue === undefined ? DELETE_FLAG : oldValue,
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
      t: 'worksheets',
      k: `${id}.${key}.formula`,
      n: formula,
      o: oldFormula ? oldFormula : DELETE_FLAG,
    });
  }
  private computeAllCell() {
    const id = this.currentSheetId;
    const sheetData = this.worksheets[id];
    if (isEmpty(sheetData)) {
      return;
    }

    for (const [k, data] of Object.entries(sheetData)) {
      if (data?.formula) {
        const result = this.parseFormula(data.formula);
        const newValue = result.error ? result.error : result.result;
        const oldValue = data.value;
        if (newValue !== oldValue) {
          data.value = newValue;
          this.history.push({
            t: 'worksheets',
            k: `${id}.${k}.value`,
            n: newValue,
            o: oldValue,
          });
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
          const sheetInfo = this.getSheetInfo(sheetId);
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
  private updateStyle(style: Partial<StyleType>, range: Coordinate) {
    if (isEmpty(style)) {
      return;
    }
    const key = coordinateToString(range.row, range.col);
    const id = this.currentSheetId;
    this.worksheets[id] = this.worksheets[id] || {};
    const sheetData = this.worksheets[id];
    sheetData[key] = sheetData[key] || {};
    sheetData[key].style = sheetData[key].style || {};
    const keyList = Object.keys(style) as Array<keyof Partial<StyleType>>;
    for (const k of keyList) {
      const oldValue = sheetData[key]?.style?.[k];

      const newValue = style[k];
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      sheetData[key].style[k] = newValue;

      this.history.push({
        t: 'worksheets',
        k: `${id}.${key}.style.${k}`,
        n: newValue,
        o: oldValue === undefined ? DELETE_FLAG : oldValue,
      });
    }
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
      t: 'worksheets',
      k: `${id}.${key}.style`,
      n: style,
      o: isEmpty(oldStyle) ? DELETE_FLAG : oldStyle,
    });
  }
  getFloatElementList(sheetId: string): FloatElement[] {
    const id = sheetId || this.currentSheetId;
    const list = Object.values(this.drawings).filter((v) => v.sheetId === id);
    return list.slice();
  }
  addFloatElement(data: FloatElement) {
    const oldData = this.drawings[data.uuid];
    assert(!oldData, $('uuid-is-duplicate'));
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
      assert(check, $('cells-must-contain-data'));
    } else if (data.type === 'floating-picture') {
      assert(!!data.imageSrc, $('image-source-is-empty'));
      if (typeof data.imageAngle !== 'number') {
        data.imageAngle = 0;
      }
    }
    this.drawings[data.uuid] = data;
    this.history.push({
      t: 'drawings',
      k: data.uuid,
      n: data,
      o: DELETE_FLAG,
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
          t: 'drawings',
          k: `${uuid}.${key}`,
          n: item[key],
          o: oldValue,
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
      t: 'drawings',
      k: uuid,
      n: DELETE_FLAG,
      o: oldData,
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
      assert(!this.mergeCells[ref], $('merging-cell-is-duplicate'));
      this.mergeCells[ref] = range;
      this.history.push({
        t: 'mergeCells',
        k: ref,
        n: range,
        o: DELETE_FLAG,
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
      t: 'mergeCells',
      k: ref,
      n: DELETE_FLAG,
      o: oldRange,
    });
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
