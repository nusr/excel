import {
  StyleType,
  WorkBookJSON,
  WorksheetType,
  Coordinate,
  IModel,
  ResultType,
  IRange,
  ModelCellValue,
  CustomHeightOrWidthItem,
  ModelRowType,
} from '@/types';
import {
  getDefaultSheetInfo,
  assert,
  modelLog,
  Range,
  DEFAULT_ROW_COUNT,
  DEFAULT_COL_COUNT,
  isEmpty,
  setWith,
  isSameRange,
  CELL_HEIGHT,
  CELL_WIDTH,
  XLSX_MAX_ROW_COUNT,
  XLSX_MAX_COL_COUNT,
} from '@/util';
import { parseFormula, CustomError } from '@/formula';
import * as Y from 'yjs';

function convertToNumber(list: string[]) {
  const result = list
    .map((item) => parseInt(item, 10))
    .filter((v) => !isNaN(v));
  result.sort((a, b) => a - b);
  return result;
}

export class Model implements IModel {
  private model: Y.Map<any>;
  private doc: Y.Doc;
  private undoManager: Y.UndoManager;
  constructor() {
    const doc = new Y.Doc();
    const model = doc.getMap('model');
    const workbook = new Y.Array();
    const mergeCells = new Y.Array();
    const worksheets = new Y.Map();
    const customHeight = new Y.Map();
    const customWidth = new Y.Map();
    const definedNames = new Y.Map();
    model.set('workbook', workbook);
    model.set('currentSheetId', '');
    model.set('mergeCells', mergeCells);
    model.set('worksheets', worksheets);
    model.set('customHeight', customHeight);
    model.set('customWidth', customWidth);
    model.set('definedNames', definedNames);
    this.model = model;
    (window as any).model = model;
    this.undoManager = new Y.UndoManager(workbook);
    this.doc = doc;
    doc.on('update', (update: Uint8Array, _, doc: Y.Doc, tr: Y.Transaction) => {
      console.log(update);
      console.log(doc);
      console.log(tr);
    });
  }
  private get workbook(): Y.Array<WorksheetType> {
    return this.model.get('workbook');
  }
  private set workbook(arr: WorksheetType[]) {
    const list = new Y.Array();
    list.push(arr);
    this.model.set('workbook', list);
  }
  private get mergeCells(): Y.Array<IRange> {
    return this.model.get('mergeCells');
  }
  private set mergeCells(arr: IRange[]) {
    const list = new Y.Array();
    list.push(arr);
    this.model.set('mergeCells', list);
  }

  private get definedNames(): Y.Map<IRange> {
    return this.model.get('definedNames');
  }
  private set definedNames(obj: Record<string, IRange>) {
    this.model.set('definedNames', new Y.Map(Object.entries(obj)));
  }

  private get customHeight(): Y.Map<CustomHeightOrWidthItem> {
    return this.model.get('customHeight');
  }
  private set customHeight(obj: WorkBookJSON['customHeight']) {
    this.model.set('customHeight', new Y.Map(Object.entries(obj)));
  }

  private get customWidth(): Y.Map<CustomHeightOrWidthItem> {
    return this.model.get('customWidth');
  }
  private set customWidth(obj: WorkBookJSON['customWidth']) {
    this.model.set('customWidth', new Y.Map(Object.entries(obj)));
  }

  private get worksheets(): Y.Map<ModelRowType> {
    return this.model.get('worksheets');
  }
  private set worksheets(obj: WorkBookJSON['worksheets']) {
    this.model.set('worksheets', new Y.Map(Object.entries(obj)));
  }

  getSheetList(): WorkBookJSON['workbook'] {
    if (!this.workbook) {
      return [];
    }
    return this.workbook.toArray();
  }
  setActiveCell(range: IRange): void {
    const list = this.getSheetList();
    const index = list.findIndex((v) => v.sheetId === range.sheetId);
    if (index < 0) {
      return;
    }
    const { row, col } = range;
    const sheet = list[index];
    if (row < 0 || col < 0 || row >= sheet.rowCount || col >= sheet.colCount) {
      return;
    }
    const oldValue = sheet.activeCell;
    if (isSameRange(oldValue, range)) {
      return;
    }
    this.workbook.get(index).activeCell = range;
  }
  addSheet(): void {
    const list = this.getSheetList();
    const item = getDefaultSheetInfo(list);
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
    const index = list.findIndex((v) => v.sheetId === this.getCurrentSheetId());
    if (index < 0) {
      this.workbook.push([sheet]);
    } else {
      this.workbook.insert(index + 1, [sheet]);
    }
    this.setCurrentSheetId(sheet.sheetId);
    this.setCurrentSheetId(sheet.sheetId);
    this.worksheets.set(sheet.sheetId, {});
    this.customHeight.set(sheet.sheetId, {});
    this.customWidth.set(sheet.sheetId, {});
  }

  deleteSheet(sheetId?: string): void {
    const id = sheetId || this.getCurrentSheetId();
    const sheetList = this.getSheetList();
    const list = sheetList.filter((v) => !v.isHide);
    assert(
      list.length >= 2,
      'A workbook must contains at least on visible worksheet',
    );
    const { index, lastIndex } = this.getSheetIndex(id);
    this.setCurrentSheetId(sheetList[lastIndex].sheetId);
    this.workbook.delete(index);
    this.worksheets.delete(id);
  }
  hideSheet(sheetId?: string | undefined): void {
    const sheetList = this.getSheetList();
    const list = sheetList.filter((v) => !v.isHide);
    assert(
      list.length >= 2,
      'A workbook must contains at least on visible worksheet',
    );
    const { index, lastIndex } = this.getSheetIndex(sheetId);
    this.workbook.get(index).isHide = true;
    this.setCurrentSheetId(sheetList[lastIndex].sheetId);
  }
  unhideSheet(sheetId?: string | undefined): void {
    const list = this.getSheetList();
    const index = list.findIndex(
      (v) => v.sheetId === (sheetId || this.getCurrentSheetId()),
    );
    const item = this.workbook.get(index);
    item.isHide = false;
    this.setCurrentSheetId(item.sheetId);
  }
  renameSheet(sheetName: string, sheetId?: string | undefined): void {
    assert(!!sheetName, 'You typed a invalid name for a sheet.');
    const sheetList = this.getSheetList();
    const item = sheetList.find((v) => v.name === sheetName);
    if (item) {
      if (item.sheetId === sheetId) {
        return;
      }
      assert(false, 'Cannot rename a sheet to the same name as another sheet');
    }
    const index = sheetList.findIndex(
      (v) => v.sheetId === (sheetId || this.currentSheetId),
    );
    const sheetInfo = this.workbook.get(index);
    sheetInfo.name = sheetName;
  }
  getSheetInfo(id: string = this.currentSheetId): WorksheetType {
    const list = this.getSheetList();
    const item = list.find((v) => v.sheetId === id);
    // assert(item !== undefined);
    return item!;
  }
  setCurrentSheetId(id: string): void {
    this.model.set('currentSheetId', id || '');
    this.computeAllCell();
  }
  getCurrentSheetId(): string {
    return this.model.get('currentSheetId') || '';
  }
  private get currentSheetId() {
    return this.model.get('currentSheetId') || '';
  }

  private set currentSheetId(id: string) {
    this.model.set('currentSheetId', id || '');
  }
  fromJSON = (json: WorkBookJSON): void => {
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
  };
  toJSON = (): WorkBookJSON => {
    const json = {
      workbook: this.workbook.toArray(),
      worksheets: this.worksheets.toJSON(),
      mergeCells: this.mergeCells.toArray(),
      customHeight: this.customHeight.toJSON(),
      customWidth: this.customWidth.toJSON(),
      definedNames: this.definedNames.toJSON(),
    };
    modelLog('toJSON', json);
    return json;
  };

  setCellValues(
    value: ResultType[][],
    style: Array<Array<Partial<StyleType>>>,
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

  setCellStyle(style: Partial<StyleType>, ranges: IRange[]): void {
    const [range] = ranges;
    const { row, col, rowCount, colCount } = range;
    for (let r = row, endRow = row + rowCount; r < endRow; r++) {
      for (let c = col, endCol = col + colCount; c < endCol; c++) {
        this.setStyle(style, { row: r, col: c });
      }
    }
  }
  getCell = (range: IRange): ModelCellValue => {
    const { row, col, sheetId } = range;
    const realSheetId = sheetId || this.currentSheetId;
    const sheetData = this.worksheets.get(realSheetId) || {};
    const cellData = sheetData?.[row]?.[col] || {};
    return {
      ...cellData,
      row,
      col,
    };
  };

  addRow(rowIndex: number, count: number): void {
    const sheetData = this.worksheets.get(this.currentSheetId);
    if (!sheetData || isEmpty(sheetData)) {
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
    const sheetData = this.worksheets.get(this.currentSheetId);
    if (!sheetData || isEmpty(sheetData)) {
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
    const sheetData = this.worksheets.get(this.currentSheetId);
    if (!sheetData || isEmpty(sheetData)) {
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
    const sheetData = this.worksheets.get(this.currentSheetId);
    if (!sheetData || isEmpty(sheetData)) {
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
    const data = this.customWidth.get(this.currentSheetId);
    const newData = data || {};

    for (let i = 0; i < count; i++) {
      const c = colIndex + i;
      newData[c] = newData[c] || {
        widthOrHeight: CELL_WIDTH,
        isHide: true,
      };
      newData[c].isHide = true;
    }
    this.customWidth.set(this.currentSheetId, newData);
  }
  getColWidth(col: number): number {
    const temp = this.customWidth.get(this.currentSheetId);
    if (!temp || !temp[col]) {
      return CELL_WIDTH;
    }
    if (temp[col].isHide) {
      return 0;
    }
    return temp[col].widthOrHeight || CELL_WIDTH;
  }
  setColWidth(col: number, width: number): void {
    const data = this.customWidth.get(this.currentSheetId);
    const newData = data || {};

    newData[col] = newData[col] || {
      widthOrHeight: 0,
      isHide: false,
    };
    newData[col].widthOrHeight = width;
    this.customWidth.set(this.currentSheetId, newData);
  }

  hideRow(rowIndex: number, count: number): void {
    const data = this.customHeight.get(this.currentSheetId);
    const newData = data || {};
    for (let i = 0; i < count; i++) {
      const r = rowIndex + i;
      newData[r] = newData[r] || {
        widthOrHeight: CELL_HEIGHT,
        isHide: true,
      };
      newData[r].isHide = true;
    }
    this.customHeight.set(this.currentSheetId, newData);
  }
  getRowHeight(row: number): number {
    const temp = this.customHeight.get(this.currentSheetId);
    if (!temp || !temp[row]) {
      return CELL_HEIGHT;
    }
    if (temp[row].isHide) {
      return 0;
    }
    return temp[row].widthOrHeight || CELL_HEIGHT;
  }
  setRowHeight(row: number, height: number): void {
    const data = this.customHeight.get(this.currentSheetId);
    const newData = data || {};

    newData[row] = newData[row] || {
      widthOrHeight: 0,
      isHide: false,
    };
    newData[row].widthOrHeight = height;
    this.customHeight.set(this.currentSheetId, newData);
  }
  canRedo(): boolean {
    return true;
  }
  canUndo(): boolean {
    return true;
  }
  undo(): void {
    this.undoManager.undo();
  }
  redo(): void {
    this.undoManager.redo();
  }

  pasteRange(fromRange: IRange, isCut: boolean): IRange {
    const { currentSheetId } = this;
    const { activeCell } = this.getSheetInfo(currentSheetId);

    const { row, col, rowCount, colCount, sheetId } = fromRange;
    const realSheetId = sheetId || currentSheetId;
    const sheetData = this.worksheets.get(realSheetId) || {};
    for (let r = row, i = 0, endRow = row + rowCount; r < endRow; r++, i++) {
      for (let c = col, j = 0, endCol = col + colCount; c < endCol; c++, j++) {
        const oldPath = `${r}.${c}`;
        const temp = sheetData?.[r]?.[c] || {};
        const realRow = activeCell.row + i;
        const realCol = activeCell.col + j;
        const path = `${realRow}.${realCol}`;
        setWith(sheetData, path, { ...temp });
        if (isCut) {
          setWith(sheetData, oldPath, {});
        }
      }
    }
    this.worksheets.set(realSheetId, sheetData);
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
    this.worksheets.delete(id);
    this.mergeCells = this.mergeCells.toArray().filter((v) => v.sheetId !== id);
    this.customHeight.set(id, {});
    this.customWidth.set(id, {});
    const definedNames: WorkBookJSON['definedNames'] = {};
    const oldDefineNames = this.definedNames.toJSON();
    for (const key of Object.keys(oldDefineNames)) {
      const t = oldDefineNames[key];
      if (!t) {
        continue;
      }
      if (t.sheetId !== id) {
        definedNames[key] = t;
      }
    }
    this.definedNames = definedNames;
  }
  getDefineName(range: IRange): string {
    const sheetId = range.sheetId || this.currentSheetId;
    for (const key of this.definedNames.keys()) {
      const t = this.definedNames.get(key);
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
    if (oldName in this.definedNames.toJSON()) {
      this.definedNames.delete(oldName);
    }
    const result: IRange = {
      ...range,
      sheetId: this.currentSheetId,
      colCount: 1,
      rowCount: 1,
    };
    this.definedNames.set(name, result);
    this.computeAllCell();
  }
  checkDefineName(name: string): IRange | undefined {
    return this.definedNames.get(name);
  }

  private setCellValue(value: ResultType, range: Coordinate): void {
    const { row, col } = range;
    const data = this.worksheets.get(this.currentSheetId) || {};

    const key = `${row}.${col}.value`;

    setWith(data, key, value);
    this.worksheets.set(this.currentSheetId, data);
  }
  private setCellFormula(formula: string, range: Coordinate): void {
    const { row, col } = range;
    const data = this.worksheets.get(this.currentSheetId) || {};
    const key = `${row}.${col}.formula`;

    setWith(data, key, formula);
    this.worksheets.set(this.currentSheetId, data);
  }
  private computeAllCell() {
    const sheetData = this.worksheets.get(this.currentSheetId);
    if (!sheetData || isEmpty(sheetData)) {
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
    const result = parseFormula(
      formula,
      {
        get: (row: number, col: number, sheetId: string) => {
          const sheetInfo = this.getSheetInfo(sheetId || this.currentSheetId);
          if (row >= sheetInfo.rowCount || col >= sheetInfo.colCount) {
            throw new CustomError('#REF!');
          }
          const temp = this.getCell(new Range(row, col, 1, 1, sheetId));
          return temp.value;
        },
        set: () => {
          throw new CustomError('#REF!');
        },
        convertSheetNameToSheetId: (sheetName: string): string => {
          const item = this.getSheetList().find((v) => v.name === sheetName);
          return item?.sheetId || '';
        },
      },
      {
        set: () => {
          throw new CustomError('#REF!');
        },
        get: (name: string) => {
          const t = this.definedNames.get(name);
          return t;
        },
        has: (name: string) => {
          return this.definedNames.has(name);
        },
      },
    );
    return result.error ? result.error : result.result;
  }
  private getSheetIndex(sheetId?: string) {
    const id = sheetId || this.currentSheetId;
    const list = this.getSheetList();
    const index = list.findIndex((item) => item.sheetId === id);
    assert(index >= 0);
    let lastIndex = (index + 1) % list.length;
    while (lastIndex !== index) {
      if (list[lastIndex].isHide) {
        lastIndex = (lastIndex + 1) % list.length;
      } else {
        break;
      }
    }
    return {
      index,
      lastIndex,
    };
  }
  private getSheetId() {
    const list = this.getSheetList();
    const result = list.filter((v) => !v.isHide);
    return result[0].sheetId;
  }
  private setStyle(style: Partial<StyleType>, range: Coordinate) {
    const sheetData = this.worksheets.get(this.currentSheetId) || {};
    const stylePath = `${range.row}.${range.col}.style`;
    setWith(sheetData, stylePath, style);
    this.worksheets.set(this.currentSheetId, sheetData);
  }
  transaction(func: () => void): void {
    this.doc.transact(func);
  }
}
