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
  ModelCellType,
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
  WORK_SHEETS_PREFIX,
  coordinateToString,
  stringToCoordinate,
} from '@/util';
import { parseFormula, CustomError } from '@/formula';
import * as Y from 'yjs';

function getSheetKey(sheetId: string) {
  return `${WORK_SHEETS_PREFIX}${sheetId}`;
}

const modelName = 'model';

export class Model implements IModel {
  private doc: Y.Doc;
  private undoManager: Y.UndoManager;
  constructor() {
    const doc = new Y.Doc();
    const model = doc.getMap(modelName);

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

    this.doc = doc;
    // doc.on('update', (...args: any[]) => {
    //   console.log(args[3]);
    // });
    this.undoManager = new Y.UndoManager(model);
  }
  private get model(): Y.Map<any> {
    return this.doc.getMap(modelName);
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

  private get customHeight(): Y.Map<CustomItem> {
    return this.model.get('customHeight');
  }
  private set customHeight(obj: WorkBookJSON['customHeight']) {
    this.model.set('customHeight', new Y.Map(Object.entries(obj)));
  }

  private get customWidth(): Y.Map<CustomItem> {
    return this.model.get('customWidth');
  }
  private set customWidth(obj: WorkBookJSON['customWidth']) {
    this.model.set('customWidth', new Y.Map(Object.entries(obj)));
  }

  private getSheetData(sheetId?: string): Y.Map<ModelCellType> | undefined {
    const t = this.model.get(getSheetKey(sheetId || this.currentSheetId));
    return t;
  }
  private setSheetData(sheetId: string, data: Record<string, ModelCellType>) {
    const result = new Y.Map<ModelCellType>(Object.entries(data));
    this.model.set(getSheetKey(sheetId || this.currentSheetId), result);
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
    const index = list.findIndex((v) => v.sheetId === this.currentSheetId);
    if (index < 0) {
      this.workbook.push([sheet]);
    } else {
      this.workbook.insert(index + 1, [sheet]);
    }
    this.currentSheetId = sheet.sheetId;
    this.setSheetData(sheet.sheetId, {});
  }

  deleteSheet(sheetId?: string): void {
    const id = sheetId || this.currentSheetId;
    const sheetList = this.getSheetList();
    const list = sheetList.filter((v) => !v.isHide);
    assert(
      list.length >= 2,
      'A workbook must contains at least on visible worksheet',
    );
    const { index, lastIndex } = this.getSheetIndex(id);
    this.currentSheetId = sheetList[lastIndex].sheetId;
    this.workbook.delete(index);
    this.model.delete(getSheetKey(id));
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
    this.currentSheetId = sheetList[lastIndex].sheetId;
  }
  unhideSheet(sheetId?: string | undefined): void {
    const list = this.getSheetList();
    const index = list.findIndex(
      (v) => v.sheetId === (sheetId || this.currentSheetId),
    );
    const item = this.workbook.get(index);
    item.isHide = false;
    this.currentSheetId = item.sheetId;
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
  getSheetInfo(id?: string): WorksheetType {
    const list = this.getSheetList();
    const sheetId = id || this.currentSheetId;
    const item = list.find((v) => v.sheetId === sheetId);
    assert(item !== undefined);
    return item;
  }
  setCurrentSheetId(id: string): void {
    this.currentSheetId = id;
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
    const {
      workbook = [],
      mergeCells = [],
      customHeight = {},
      customWidth = {},
      definedNames = {},
    } = json;
    this.workbook = workbook;
    this.currentSheetId = this.getSheetId() || this.currentSheetId;
    this.mergeCells = mergeCells;
    this.customWidth = customWidth;
    this.customHeight = customHeight;
    this.definedNames = definedNames;
    for (const [key, value] of Object.entries(json)) {
      if (key.startsWith(WORK_SHEETS_PREFIX)) {
        this.model.set(key, new Y.Map<ModelCellType>(Object.entries(value)));
      }
    }
    this.computeAllCell();
    this.undoManager.clear(true, true);
  };
  toJSON = (): WorkBookJSON => {
    const json: any = {
      workbook: this.workbook.toArray(),
      mergeCells: this.mergeCells.toArray(),
      customHeight: this.customHeight.toJSON(),
      customWidth: this.customWidth.toJSON(),
      definedNames: this.definedNames.toJSON(),
    };
    for (const [key, value] of this.model.entries()) {
      if (key.startsWith(WORK_SHEETS_PREFIX)) {
        json[key] = value.toJSON();
      }
    }
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
    const key = coordinateToString(row, col);
    const sheetData = this.getSheetData(sheetId);
    const cellData = sheetData?.get(key) || {};
    return {
      ...cellData,
      row,
      col,
    };
  };

  addRow(rowIndex: number, count: number): void {
    const sheetInfo = this.getSheetInfo();
    if (sheetInfo.rowCount >= XLSX_MAX_ROW_COUNT) {
      return;
    }
    sheetInfo.rowCount += count;
    const sheetData = this.getSheetData();
    if (!sheetData) {
      return;
    }
    for (const [key, value] of sheetData.entries()) {
      const range = stringToCoordinate(key);
      if (range.row < rowIndex) {
        continue;
      }
      const newKey = coordinateToString(range.row + count, range.col);
      sheetData.set(newKey, { ...value });
      sheetData.set(key, {});
    }
  }
  addCol(colIndex: number, count: number): void {
    const sheetInfo = this.getSheetInfo();
    if (sheetInfo.colCount >= XLSX_MAX_COL_COUNT) {
      return;
    }
    sheetInfo.colCount += count;
    const sheetData = this.getSheetData();
    if (!sheetData) {
      return;
    }
    for (const [key, value] of sheetData.entries()) {
      const range = stringToCoordinate(key);
      if (range.col < colIndex) {
        continue;
      }
      const newKey = coordinateToString(range.row, range.col + count);
      sheetData.set(newKey, { ...value });
      sheetData.set(key, {});
    }
  }
  deleteCol(colIndex: number, count: number): void {
    const sheetInfo = this.getSheetInfo();
    sheetInfo.colCount -= count;
    const sheetData = this.getSheetData();
    if (!sheetData) {
      return;
    }
    for (const [key, value] of sheetData.entries()) {
      const range = stringToCoordinate(key);
      if (range.col < colIndex) {
        continue;
      }
      const newKey = coordinateToString(range.row, range.col - count);
      sheetData.set(newKey, { ...value });
      sheetData.set(key, {});
    }
  }
  deleteRow(rowIndex: number, count: number): void {
    const sheetInfo = this.getSheetInfo();
    sheetInfo.rowCount -= count;
    const sheetData = this.getSheetData();
    if (!sheetData) {
      return;
    }
    for (const [key, value] of sheetData.entries()) {
      const range = stringToCoordinate(key);
      if (range.row < rowIndex) {
        continue;
      }
      const newKey = coordinateToString(range.row - count, range.col);
      sheetData.set(newKey, { ...value });
      sheetData.set(key, {});
    }
  }

  hideCol(colIndex: number, count: number): void {
    for (let i = 0; i < count; i++) {
      const c = colIndex + i;
      const key = `${this.currentSheetId}_${c}`;
      const oldData = this.customWidth.get(key);
      if (oldData && oldData.isHide) {
        continue;
      }
      const data = oldData || {
        widthOrHeight: CELL_WIDTH,
        isHide: true,
      };
      data.isHide = true;
      this.customWidth.set(key, data);
    }
  }
  getColWidth(col: number): number {
    const key = `${this.currentSheetId}_${col}`;
    const temp = this.customWidth.get(key);
    if (!temp) {
      return CELL_WIDTH;
    }
    return temp.isHide ? 0 : temp.widthOrHeight || CELL_WIDTH;
  }
  setColWidth(col: number, width: number): void {
    const key = `${this.currentSheetId}_${col}`;

    const data = this.customWidth.get(key);
    if (data && data.widthOrHeight === width) {
      return;
    }

    const newData = data || {
      widthOrHeight: 0,
      isHide: false,
    };

    newData.widthOrHeight = width;
    this.customWidth.set(key, newData);
  }

  hideRow(rowIndex: number, count: number): void {
    for (let i = 0; i < count; i++) {
      const r = rowIndex + i;
      const key = `${this.currentSheetId}_${r}`;
      const newData = this.customHeight.get(key);

      if (newData && newData.isHide) {
        continue;
      }

      const data = newData || {
        widthOrHeight: CELL_HEIGHT,
        isHide: true,
      };
      data.isHide = true;
      this.customHeight.set(key, data);
    }
  }
  getRowHeight(row: number): number {
    const key = `${this.currentSheetId}_${row}`;
    const temp = this.customHeight.get(key);
    if (!temp) {
      return CELL_HEIGHT;
    }

    return temp.isHide ? 0 : temp.widthOrHeight || CELL_HEIGHT;
  }
  setRowHeight(row: number, height: number): void {
    const key = `${this.currentSheetId}_${row}`;

    const oldData = this.customHeight.get(key);
    if (oldData && oldData.widthOrHeight === height) {
      return;
    }

    const data = oldData || {
      widthOrHeight: 0,
      isHide: false,
    };
    data.widthOrHeight = height;
    this.customHeight.set(key, data);
  }
  canRedo(): boolean {
    return this.undoManager.canRedo();
  }
  canUndo(): boolean {
    return this.undoManager.canUndo();
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
    const sheetData = this.getSheetData(sheetId);

    const realRange: IRange = {
      ...activeCell,
      rowCount,
      colCount,
    };

    if (!sheetData) {
      return realRange;
    }
    if (!this.getSheetData(currentSheetId)) {
      this.setSheetData(currentSheetId, {});
    }
    const currentSheetData = this.getSheetData(currentSheetId)!;
    for (let r = row, i = 0, endRow = row + rowCount; r < endRow; r++, i++) {
      for (let c = col, j = 0, endCol = col + colCount; c < endCol; c++, j++) {
        const oldPath = coordinateToString(r, c);
        const temp = sheetData.get(oldPath) || {};
        const realRow = activeCell.row + i;
        const realCol = activeCell.col + j;
        const path = coordinateToString(realRow, realCol);
        currentSheetData.set(path, { ...temp });
        if (isCut) {
          sheetData.delete(oldPath);
        }
      }
    }
    this.computeAllCell();

    return realRange;
  }
  deleteAll(sheetId?: string): void {
    const id = sheetId || this.currentSheetId;
    this.model.delete(id);
    this.mergeCells = this.mergeCells.toArray().filter((v) => v.sheetId !== id);
    for (const key of this.customHeight.keys()) {
      if (key.startsWith(id)) {
        this.customHeight.delete(key);
      }
    }
    for (const key of this.customWidth.keys()) {
      if (key.startsWith(id)) {
        this.customWidth.delete(key);
      }
    }
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
    if (!this.getSheetData()) {
      this.setSheetData('', {});
    }
    const sheetData = this.getSheetData()!;
    const key = `${row}_${col}`;
    const data = sheetData.get(key) || {};
    if (data.value === value) {
      return;
    }
    data.value = value;
    sheetData.set(key, data);
  }
  private setCellFormula(formula: string, range: Coordinate): void {
    const { row, col } = range;
    if (!this.getSheetData()) {
      this.setSheetData('', {});
    }
    const sheetData = this.getSheetData()!;
    const key = `${row}_${col}`;
    const data = sheetData.get(key) || {};
    if (data.formula === formula) {
      return;
    }
    data.formula = formula;
    sheetData.set(key, data);
  }
  private computeAllCell() {
    for (const [key, sheetData] of this.model.entries()) {
      if (!key.startsWith(WORK_SHEETS_PREFIX)) {
        continue;
      }
      for (const value of sheetData.values()) {
        if (value?.formula) {
          value.value = this.parseFormula(value.formula);
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
    const key = coordinateToString(range.row, range.col);
    if (!this.getSheetData()) {
      this.setSheetData('', {});
    }
    const sheetData = this.getSheetData()!;
    const cellData = sheetData.get(key) || {};
    cellData.style = style;
    sheetData.set(key, cellData);
  }
  transaction(func: () => void): void {
    this.doc.transact(func);
  }
}
