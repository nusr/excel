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
  setWith,
} from '@/util';
import { parseFormula, CustomError } from '@/formula';
import { History } from './History';
import { BaseCommand, DELETE_FLAG } from './Command';

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
    this.history = new History({});
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
    // this.history.push(
    //   new BaseCommand(
    //     'rangeMap',
    //     { [newRange.sheetId]: newRange },
    //     oldValue
    //       ? { [newRange.sheetId]: oldValue }
    //       : { [newRange.sheetId]: DELETE_FLAG },
    //   ),
    // );
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
    this.history.push(
      new BaseCommand(
        this,
        'workbook',
        { [sheet.sheetId]: sheet },
        { [sheet.sheetId]: DELETE_FLAG },
      ),
    );
    this.history.push(
      new BaseCommand(
        this,
        'currentSheetId',
        sheet.sheetId,
        this.currentSheetId,
      ),
    );
    this.history.push(
      new BaseCommand(
        this,
        'rangeMap',
        {
          [sheet.sheetId]: {
            row: 0,
            col: 0,
            rowCount: 1,
            colCount: 1,
            sheetId: sheet.sheetId,
          },
        },
        { [sheet.sheetId]: DELETE_FLAG },
      ),
    );
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

    this.history.push(
      new BaseCommand(
        this,
        'workbook',
        { [id]: DELETE_FLAG },
        { [id]: this.workbook[id] },
      ),
    );
    this.history.push(
      new BaseCommand(
        this,
        'worksheets',
        { [id]: DELETE_FLAG },
        { [id]: this.worksheets[id] },
      ),
    );
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
    const oldData: WorksheetType = this.workbook[id];
    const newData: WorksheetType = { ...oldData, isHide: true };
    this.history.push(
      new BaseCommand(this, 'workbook', { [id]: newData }, { [id]: oldData }),
    );
    this.setCurrentSheetId(newSheetId);
  }
  unhideSheet(sheetId?: string | undefined): void {
    const id = sheetId || this.currentSheetId;
    const oldData = this.workbook[id];
    this.history.push(
      new BaseCommand(
        this,
        'workbook',
        { [id]: { ...oldData, isHide: false } },
        { [id]: oldData },
      ),
    );
    this.setCurrentSheetId(oldData.sheetId);
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
      undo: () => {
        sheetInfo.name = oldName;
      },
      redo: () => {
        sheetInfo.name = sheetName;
      },
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
        undo: () => {
          if (!this.workbook[oldSheetId] || this.workbook[oldSheetId].isHide) {
            this.currentSheetId = this.getSheetId();
            return;
          }
          this.currentSheetId = oldSheetId;
        },
        redo: () => {
          if (!this.workbook[newSheetId] || this.workbook[oldSheetId].isHide) {
            this.currentSheetId = this.getSheetId();
            return;
          }
          this.currentSheetId = newSheetId;
        },
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
    const newData: WorkBookJSON['customWidth'] = {};
    const oldData: WorkBookJSON['customWidth'] = {};
    for (let i = 0; i < count; i++) {
      const c = colIndex + i;
      const key = getCustomWidthOrHeightKey(this.currentSheetId, c);
      const old = this.customWidth[key];
      if (old && old.isHide) {
        continue;
      }
      oldData[key] = old;
      newData[key] = old
        ? { ...old, isHide: true }
        : {
            len: CELL_WIDTH,
            isHide: true,
          };
    }
    this.history.push(new BaseCommand(this, 'customWidth', newData, oldData));
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
    this.history.push(
      new BaseCommand(
        this,
        'customWidth',
        { [key]: newData },
        this.customWidth[key]
          ? { [key]: this.customWidth[key] }
          : { [key]: DELETE_FLAG },
      ),
    );
  }

  hideRow(rowIndex: number, count: number): void {
    const newData: WorkBookJSON['customHeight'] = {};
    const oldData: WorkBookJSON['customHeight'] = {};
    for (let i = 0; i < count; i++) {
      const r = rowIndex + i;
      const key = getCustomWidthOrHeightKey(this.currentSheetId, r);
      const old = this.customHeight[key];

      if (old && old.isHide) {
        continue;
      }
      oldData[key] = old;
      newData[key] = old
        ? { ...old, isHide: true }
        : {
            len: CELL_HEIGHT,
            isHide: true,
          };
    }
    this.history.push(new BaseCommand(this, 'customHeight', newData, oldData));
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
    this.history.push(
      new BaseCommand(
        this,
        'customHeight',
        { [key]: data },
        this.customHeight[key]
          ? {
              [key]: this.customHeight[key],
            }
          : { [key]: DELETE_FLAG },
      ),
    );
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

    this.history.push(
      new BaseCommand(
        this,
        'worksheets',
        { [id]: DELETE_FLAG },
        { [id]: this.worksheets[id] },
      ),
    );

    const oldMergeCells: WorkBookJSON['mergeCells'] = {};
    const newMergeCells: Record<string, symbol> = {};
    for (const [key, value] of Object.entries(this.mergeCells)) {
      if (value.sheetId === id) {
        oldMergeCells[key] = value;
        newMergeCells[key] = DELETE_FLAG;
      }
    }
    this.history.push(
      new BaseCommand(this, 'mergeCells', newMergeCells, oldMergeCells),
    );

    const oldDrawings: WorkBookJSON['drawings'] = {};
    const newDrawings: Record<string, symbol> = {};
    for (const [key, value] of Object.entries(this.drawings)) {
      if (value.sheetId === id) {
        oldDrawings[key] = value;
        newDrawings[key] = DELETE_FLAG;
      }
    }
    this.history.push(
      new BaseCommand(this, 'drawings', newDrawings, oldDrawings),
    );

    const oldCustomHeight: WorkBookJSON['customHeight'] = {};
    const newCustomHeight: Record<string, symbol> = {};
    for (const [key, value] of Object.entries(this.customHeight)) {
      if (key.startsWith(id)) {
        oldCustomHeight[key] = value;
        newCustomHeight[key] = DELETE_FLAG;
      }
    }
    this.history.push(
      new BaseCommand(this, 'customHeight', newCustomHeight, oldCustomHeight),
    );

    const oldCustomWidth: WorkBookJSON['customWidth'] = {};
    const newCustomWidth: Record<string, symbol> = {};
    for (const [key, value] of Object.entries(this.customWidth)) {
      if (key.startsWith(id)) {
        oldCustomWidth[key] = value;
        newCustomWidth[key] = DELETE_FLAG;
      }
    }
    this.history.push(
      new BaseCommand(this, 'customWidth', newCustomWidth, oldCustomWidth),
    );

    const oldDefinedNames: WorkBookJSON['definedNames'] = {};
    const newDefinedNames: Record<string, symbol> = {};
    for (const [key, value] of Object.entries(this.definedNames)) {
      if (key.startsWith(id)) {
        oldDefinedNames[key] = value;
        newDefinedNames[key] = DELETE_FLAG;
      }
    }
    this.history.push(
      new BaseCommand(this, 'definedNames', newDefinedNames, oldDefinedNames),
    );
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
    if (oldName in this.definedNames) {
      delete this.definedNames[oldName];
    }
    const result: IRange = {
      row: range.row,
      col: range.col,
      sheetId: this.currentSheetId,
      colCount: 1,
      rowCount: 1,
    };
    this.history.push(
      new BaseCommand(
        this,
        'definedNames',
        { [name]: result },
        oldName ? { [oldName]: result } : { [name]: DELETE_FLAG },
      ),
    );
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
      undo: () => {
        sheetData[key].value = oldValue;
      },
      redo: () => {
        sheetData[key].value = newValue;
      },
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
      undo: () => {
        sheetData[key].formula = oldFormula;
      },
      redo: () => {
        sheetData[key].formula = formula;
      },
    });
  }
  private computeAllCell() {
    const dataList: Array<{
      path: string;
      oldValue: ResultType;
      newValue: ResultType;
    }> = [];
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
            dataList.push({ newValue, oldValue, path: `${key}.${k}.value` });
          }
        }
      }
    }
    if (dataList.length === 0) {
      return;
    }

    this.history.push({
      undo: () => {
        for (const item of dataList) {
          setWith(this.worksheets, item.path, item.oldValue);
        }
      },
      redo: () => {
        for (const item of dataList) {
          setWith(this.worksheets, item.path, item.newValue);
        }
      },
    });
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
      undo: () => {
        sheetData[key].style = oldStyle;
      },
      redo: () => {
        sheetData[key].style = style;
      },
    });
  }
  transaction(func: () => void): void {
    func();
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
    this.history.push(
      new BaseCommand(
        this,
        'drawings',
        { [data.uuid]: data },
        { [data.uuid]: DELETE_FLAG },
      ),
    );
  }
  updateFloatElement<T extends keyof FloatElement>(
    uuid: string,
    key: T,
    newValue: FloatElement[T],
  ) {
    const item = this.drawings[uuid];
    if (!item) {
      return;
    }
    const oldValue = item[key];
    if (oldValue !== newValue) {
      item[key] = newValue;
      this.history.push({
        undo: () => {
          item[key] = oldValue;
        },
        redo: () => {
          item[key] = newValue;
        },
      });
    }
  }
  deleteFloatElement(uuid: string) {
    const oldData = this.drawings[uuid];
    if (!oldData) {
      return;
    }
    this.history.push(
      new BaseCommand(
        this,
        'drawings',
        { [uuid]: DELETE_FLAG },
        { [uuid]: oldData },
      ),
    );
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
      this.history.push(
        new BaseCommand(
          this,
          'mergeCells',
          { [ref]: range },
          { [ref]: DELETE_FLAG },
        ),
      );
    }
  }
  deleteMergeCell(range: IRange): void {
    range.sheetId = range.sheetId || this.currentSheetId;
    const ref = convertToReference(
      range,
      'absolute',
      this.convertSheetIdToName,
    );
    this.history.push(
      new BaseCommand(
        this,
        'mergeCells',
        { [ref]: DELETE_FLAG },
        { [ref]: range },
      ),
    );
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
