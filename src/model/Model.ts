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
  getWorkSheetKey,
  getCustomWidthOrHeightKey,
  modelLog,
  FORMULA_PREFIX,
} from '@/util';
import { parseFormula, CustomError } from '@/formula';
import * as Y from 'yjs';

const modelName = 'model';

export class Model implements IModel {
  private doc: Y.Doc;
  private undoManager: Y.UndoManager;
  constructor() {
    const doc = new Y.Doc();
    const model = doc.getMap(modelName);

    this.doc = doc;
    doc.on('update', (...args: any[]) => {
      modelLog(args[3]);
    });
    this.undoManager = new Y.UndoManager(model);
  }
  private get model(): Y.Map<any> {
    return this.doc.getMap(modelName);
  }
  private get workbook(): Y.Array<WorksheetType> {
    if (!this.model.get('workbook')) {
      this.workbook = [];
    }
    return this.model.get('workbook');
  }
  private set workbook(arr: WorksheetType[]) {
    const list = new Y.Array<WorksheetType>();
    if (arr.length > 0) {
      list.push(arr);
    }
    this.model.set('workbook', list);
  }
  private get mergeCells(): Y.Array<IRange> {
    if (!this.model.get('mergeCells')) {
      this.mergeCells = [];
    }
    return this.model.get('mergeCells');
  }
  private set mergeCells(arr: IRange[]) {
    const list = new Y.Array<IRange>();
    if (arr.length > 0) {
      list.push(arr);
    }
    this.model.set('mergeCells', list);
  }

  private get definedNames(): Y.Map<IRange> {
    const result = this.model.get('definedNames');
    if (result) {
      return result;
    }
    const list = new Y.Map<IRange>();
    this.model.set('definedNames', list);
    return list;
  }
  private set definedNames(obj: Record<string, IRange>) {
    this.model.set('definedNames', new Y.Map(Object.entries(obj)));
  }

  private get customHeight(): Y.Map<CustomItem> {
    const result = this.model.get('customHeight');
    if (result) {
      return result;
    }
    const list = new Y.Map<CustomItem>();
    this.model.set('customHeight', list);
    return list;
  }
  private set customHeight(obj: WorkBookJSON['customHeight']) {
    this.model.set('customHeight', new Y.Map(Object.entries(obj)));
  }

  private get customWidth(): Y.Map<CustomItem> {
    const result = this.model.get('customWidth');
    if (result) {
      return result;
    }
    const list = new Y.Map<CustomItem>();
    this.model.set('customWidth', list);
    return list;
  }
  private set customWidth(obj: WorkBookJSON['customWidth']) {
    this.model.set('customWidth', new Y.Map(Object.entries(obj)));
  }

  private getSheetData(sheetId?: string): Y.Map<ModelCellType> | undefined {
    return this.model.get(getWorkSheetKey(sheetId || this.currentSheetId));
  }
  private setSheetData(sheetId: string, data: Record<string, ModelCellType>) {
    const result = new Y.Map<ModelCellType>(Object.entries(data));
    this.model.set(getWorkSheetKey(sheetId || this.currentSheetId), result);
  }
  getSheetList(): WorkBookJSON['workbook'] {
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
    this.model.delete(getWorkSheetKey(id));
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
      currentSheetId,
    } = json;
    this.workbook = workbook;
    this.currentSheetId = currentSheetId || this.getSheetId();
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
    const json = {
      workbook: this.workbook.toArray(),
      mergeCells: this.mergeCells.toArray(),
      customHeight: this.customHeight.toJSON(),
      customWidth: this.customWidth.toJSON(),
      definedNames: this.definedNames.toJSON(),
      currentSheetId: this.currentSheetId,
    };
    for (const [key, value] of this.model.entries()) {
      if (key.startsWith(WORK_SHEETS_PREFIX)) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
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
        if (t && typeof t === 'string' && t.startsWith(FORMULA_PREFIX)) {
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
    const list = Array.from(sheetData.keys()).map((key) =>
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
      const value = sheetData.get(key);
      sheetData.set(newKey, { ...value });
      sheetData.delete(key);
    }
    this.computeAllCell();
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
    const list = Array.from(sheetData.keys()).map((key) =>
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
      const value = sheetData.get(key);
      sheetData.set(newKey, { ...value });
      sheetData.delete(key);
    }
    this.computeAllCell();
  }
  deleteCol(colIndex: number, count: number): void {
    const sheetInfo = this.getSheetInfo();
    sheetInfo.colCount -= count;
    const sheetData = this.getSheetData();
    if (!sheetData) {
      return;
    }
    const list = Array.from(sheetData.keys()).map((key) =>
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
        sheetData.set(newKey, { ...sheetData.get(key) });
      }
      sheetData.delete(key);
    }
    this.computeAllCell();
  }
  deleteRow(rowIndex: number, count: number): void {
    const sheetInfo = this.getSheetInfo();
    sheetInfo.rowCount -= count;
    const sheetData = this.getSheetData();
    if (!sheetData) {
      return;
    }
    const list = Array.from(sheetData.keys()).map((key) =>
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
        sheetData.set(newKey, { ...sheetData.get(key) });
      }
      sheetData.delete(key);
    }
    this.computeAllCell();
  }

  hideCol(colIndex: number, count: number): void {
    for (let i = 0; i < count; i++) {
      const c = colIndex + i;
      const key = getCustomWidthOrHeightKey(this.currentSheetId, c);
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
    const key = getCustomWidthOrHeightKey(this.currentSheetId, col);
    const temp = this.customWidth.get(key);
    if (!temp) {
      return CELL_WIDTH;
    }
    return temp.isHide ? 0 : temp.widthOrHeight || CELL_WIDTH;
  }
  setColWidth(col: number, width: number): void {
    const key = getCustomWidthOrHeightKey(this.currentSheetId, col);

    const data = this.customWidth.get(key);
    if (data && data.widthOrHeight === width) {
      return;
    }

    const newData = data || {
      widthOrHeight: 0,
      isHide: false,
    };

    newData.widthOrHeight = width;
    if (width === 0) {
      newData.isHide = true;
    }
    this.customWidth.set(key, newData);
  }

  hideRow(rowIndex: number, count: number): void {
    for (let i = 0; i < count; i++) {
      const r = rowIndex + i;
      const key = getCustomWidthOrHeightKey(this.currentSheetId, r);
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
    const key = getCustomWidthOrHeightKey(this.currentSheetId, row);
    const temp = this.customHeight.get(key);
    if (!temp) {
      return CELL_HEIGHT;
    }

    return temp.isHide ? 0 : temp.widthOrHeight || CELL_HEIGHT;
  }
  setRowHeight(row: number, height: number): void {
    const key = getCustomWidthOrHeightKey(this.currentSheetId, row);

    const oldData = this.customHeight.get(key);
    if (oldData && oldData.widthOrHeight === height) {
      return;
    }

    const data = oldData || {
      widthOrHeight: 0,
      isHide: false,
    };
    data.widthOrHeight = height;
    if (height === 0) {
      data.isHide = true;
    }
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
    const fromSheetData = this.getSheetData(sheetId);

    const realRange: IRange = {
      ...activeCell,
      rowCount,
      colCount,
    };

    if (!fromSheetData) {
      return realRange;
    }
    if (!this.getSheetData(currentSheetId)) {
      this.setSheetData(currentSheetId, {});
    }
    const currentSheetData = this.getSheetData(currentSheetId)!;
    this.iterateRange(fromRange, (r, c) => {
      const oldPath = coordinateToString(r, c);
      const temp = fromSheetData.get(oldPath) || {};
      const realRow = activeCell.row + (r - row);
      const realCol = activeCell.col + (c - col);
      const path = coordinateToString(realRow, realCol);
      currentSheetData.set(path, { ...temp });
      if (isCut) {
        fromSheetData.delete(oldPath);
      }
    });

    this.computeAllCell();

    return realRange;
  }
  deleteAll(sheetId?: string): void {
    const id = sheetId || this.currentSheetId;
    this.model.delete(getWorkSheetKey(id));
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
    for (const [key, range] of this.definedNames.entries()) {
      if (range && range.sheetId === id) {
        this.definedNames.delete(key);
      }
    }
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
    const key = coordinateToString(row, col);
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
    const key = coordinateToString(row, col);
    const data = sheetData.get(key) || {};
    const result = this.parseFormula(formula);
    if (result.error) {
      data.value = result.error;
      data.formula = '';
    } else {
      data.formula = FORMULA_PREFIX + result.expressionStr;
      data.value = result.result;
    }
    sheetData.set(key, data);
  }
  private computeAllCell() {
    for (const [key, sheetData] of this.model.entries()) {
      if (!key.startsWith(WORK_SHEETS_PREFIX)) {
        continue;
      }
      for (const data of sheetData.values()) {
        if (data?.formula) {
          const result = this.parseFormula(data.formula);
          data.value = result.error ? result.error : result.result;
        }
      }
    }
  }
  private iterateRange(range: IRange, fn: (row: number, col: number) => void) {
    const { row, col, rowCount, colCount, sheetId } = range;
    const sheetInfo = this.getSheetInfo(sheetId);
    if (colCount === 0 && rowCount > 0) {
      for (let r = row, endRow = row + sheetInfo.rowCount; r < endRow; r++) {
        fn(r, col);
      }
    } else if (rowCount === 0 && colCount > 0) {
      for (let c = col, endCol = col + sheetInfo.colCount; c < endCol; c++) {
        fn(row, c);
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
          fn(r, c);
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
          if (row >= sheetInfo.rowCount || col >= sheetInfo.colCount) {
            throw new CustomError('#REF!');
          }
          this.iterateRange(range, (r, c) => {
            const temp = this.getCell(new Range(r, c, 1, 1, sheetId));
            result.push(temp.value);
          });
          return result;
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
        get: (name: string) => this.definedNames.get(name),
        has: (name: string) => {
          return this.definedNames.has(name);
        },
      },
    );
    return result;
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
