import {
  ModelJSON,
  ModelCellValue,
  Coordinate,
  IRange,
  IModel,
  IWorksheet,
  ResultType,
  StyleType,
  WorksheetData,
  EMergeCellType,
  ModelCellType,
  EHorizontalAlign,
  RequestFormulas,
  ResponseFormulas,
  IHooks,
  SYNC_FLAG,
} from '../types';
import {
  iterateRange,
  FORMULA_PREFIX,
  convertWorksheetKey,
  isEmpty,
  isFormula,
  deepEqual,
  TEXT_FLAG,
  DEFAULT_TEXT_FORMAT_CODE,
  omit,
  MERGE_CELL_LINE_BREAK,
  convertStringToResultType,
} from '../util';
import { numberFormat } from '../formula';
import { proxy } from 'comlink';
import { v4 } from 'uuid';
import type { CellMap } from '../protocol';

export class Worksheet implements IWorksheet {
  private model: IModel;
  private worker: IHooks['worker'];
  private computation = 0;
  private disposed = false;
  constructor(model: IModel, worker: IHooks['worker']) {
    this.model = model;
    this.worker = worker;
  }
  destroy() {
    this.disposed = true;
    this.computation++;
  }

  private get worksheets() {
    return this.model.getRoot().get('worksheets');
  }

  fromJSON(json: ModelJSON): void {
    const data = json.worksheets || {};

    const result: WorksheetData = [];
    for (const [key, cell] of Object.entries(data)) {
      const range = convertWorksheetKey(key);
      if (!range) {
        continue;
      }
      const temp: ModelCellValue = {
        ...range,
        ...cell,
      };
      result.push(temp);
    }
    for (const key of this.worksheets.keys()) this.model.getRoot().deleteCell(key);
    this.worksheets.clear();

    this.setWorksheet(result);
  }
  addMergeCell(range: IRange, type?: EMergeCellType) {
    const sheetId = range.sheetId || this.model.getCurrentSheetId();
    const isMergeContent = type === EMergeCellType.MERGE_CONTENT;
    const dataList: Array<{ value: ModelCellType; row: number; col: number }> =
      [];
    const info = this.model.getSheetInfo(range.sheetId);
    if (!info) {
      return;
    }
    iterateRange(range, info.rowCount, info.colCount, (row, col) => {
      const cellInfo = this.getCell({
        row,
        col,
        rowCount: 1,
        colCount: 1,
        sheetId,
      });
      if (cellInfo) {
        dataList.push({ value: { ...cellInfo }, row, col });
      }
      return false;
    });
    if (dataList.length === 0) {
      return;
    }
    let list: string[] = [
      numberFormat(dataList[0].value.value, dataList[0].value?.numberFormat),
    ];
    for (let i = 1; i < dataList.length; i++) {
      const item = dataList[i];
      const key = this.cellKey({ sheetId, row: item.row, col: item.col });
      const oldValue = { ...item.value };
      if (isMergeContent) {
        list.push(numberFormat(oldValue.value, oldValue?.numberFormat));
      }
      this.model.getRoot().deleteCell(key);
    }
    // If it exists formula, only use the first cell data
    if (dataList.some((v) => v.value.formula)) {
      list = [list[0]];
    }
    let realStyle: Partial<StyleType> = omit(dataList[0].value, ['value', 'formula']);
    let value: ResultType = dataList[0].value.value;
    if (
      type === EMergeCellType.MERGE_CELL ||
      type === EMergeCellType.MERGE_CENTER
    ) {
      realStyle.horizontalAlign = EHorizontalAlign.CENTER;
    } else if (type === EMergeCellType.MERGE_CONTENT) {
      realStyle.isWrapText = true;
    }
    const newRange: IRange = {
      row: range.row,
      col: range.col,
      rowCount: 1,
      colCount: 1,
      sheetId,
    };
    if (isMergeContent) {
      value = list.join(MERGE_CELL_LINE_BREAK);
    }
    if (range.row === dataList[0].row && range.col === dataList[0].col) {
      if (isMergeContent) {
        this.setCellValue(value, newRange);
      }
    } else {
      const key = this.cellKey({ sheetId, row: dataList[0].row, col: dataList[0].col });
      this.model.getRoot().deleteCell(key);
      this.setCellModel(newRange, {
        ...dataList[0].value,
        value,
        ...(isMergeContent && dataList[0].value.formula ? { formula: '' } : {}),
      });
    }
    this.updateCellStyle(realStyle, newRange);
  }
  addRow(rowIndex: number, count: number, isAbove = false): void {
    const order = this.model.getRoot().get('workbook').get(this.model.getCurrentSheetId())!.get('rows')!;
    order.insert(Math.min(order.length, Math.max(0, rowIndex + (isAbove ? 0 : 1))),
      Array.from({ length: count }, () => v4()));
  }
  deleteRow(rowIndex: number, count: number): void {
    const order = this.model.getRoot().get('workbook').get(this.model.getCurrentSheetId())!.get('rows')!;
    order.delete(rowIndex, Math.min(count, order.length - rowIndex));
  }
  addCol(colIndex: number, count: number, isRight = false): void {
    const order = this.model.getRoot().get('workbook').get(this.model.getCurrentSheetId())!.get('cols')!;
    order.insert(Math.min(order.length, Math.max(0, colIndex + (isRight ? 1 : 0))),
      Array.from({ length: count }, () => v4()));
  }
  deleteCol(colIndex: number, count: number): void {
    const order = this.model.getRoot().get('workbook').get(this.model.getCurrentSheetId())!.get('cols')!;
    order.delete(colIndex, Math.min(count, order.length - colIndex));
  }
  getWorksheet(sheetId?: string) {
    const id = sheetId || this.model.getCurrentSheetId();
    return this.getWorkData(id);
  }

  private getWorkData(sheetId: string) {
    const result: WorksheetData = [];
    if (!this.worksheets) {
      return result;
    }
    for (const [key, value] of Object.entries(this.model.getRoot().toJSON().worksheets)) {
      const data = convertWorksheetKey(key);
      if (!data) {
        continue;
      }
      if (data.sheetId === sheetId) {
        result.push({ ...data, ...value });
      }
    }
    return result;
  }

  setWorksheet(data: WorksheetData): void {
    const list = this.validateSheetData(data);
    for (const item of list) {
      const { sheetId, row, col, ...rest } = item;
      this.setCellModel({ sheetId: sheetId, row, col }, rest);
    }
  }
  getCell(range: IRange): ModelCellType | undefined {
    if (!this.getCellModel(range)) return undefined;
    return this.model.getRoot().cellJSON(this.cellKey(range));
  }
  deleteCell(range: IRange) {
    const id = range.sheetId || this.model.getCurrentSheetId();
    const info = this.model.getSheetInfo(id);
    if (!info || !this.worksheets) {
      return;
    }
    const keyList: string[] = [];
    iterateRange(range, info.rowCount, info.colCount, (row, col) => {
      const key = this.cellKey({ sheetId: id, row, col });
      keyList.push(key);
      return false;
    });
    for (const key of keyList) {
      this.model.getRoot().deleteCell(key);
    }
  }
  setCell(
    value: ResultType[][],
    style: Array<Array<Partial<StyleType>>>,
    range: IRange,
  ) {
    const { row, col } = range;
    const info = this.model.getSheetInfo(range.sheetId);
    if (!info) return;
    if (!Number.isInteger(row) || !Number.isInteger(col) || row < 0 || col < 0) {
      throw new RangeError('Cell coordinates are outside the worksheet');
    }
    for (let r = 0; r < value.length; r++) {
      if (row + r >= info.rowCount) break;
      for (let c = 0; c < value[r].length; c++) {
        if (col + c >= info.colCount) break;
        const temp: Coordinate = {
          row: row + r,
          col: col + c,
        };
        if (style[r] && style[r][c]) {
          this.updateStyle(style[r][c], {
            ...temp,
            sheetId: range.sheetId,
            rowCount: 1,
            colCount: 1,
          });
        }
        this.setCellValue(value[r][c], { ...range, ...temp });
      }
    }
  }

  setCellValue(value: ResultType, range: IRange) {
    const old = this.getCellModel(range, true)!;
    if (
      typeof value === 'string' &&
      isFormula(value) &&
      old?.get('numberFormat') !== DEFAULT_TEXT_FORMAT_CODE
    ) {
      this.setCellFormula(value, range);
    } else {
      if (old?.get('formula')) {
        this.setCellFormula('', range);
      }
      this.setValue(value, range);
    }
  }

  updateCellStyle(style: Partial<ModelCellType>, range: IRange): void {
    if (isEmpty(style)) {
      return;
    }
    const info = this.model.getSheetInfo(range.sheetId);
    if (!info) {
      return;
    }
    iterateRange(range, info.rowCount, info.colCount, (row, col) => {
      this.updateStyle(style, {
        row,
        col,
        sheetId: range.sheetId,
        rowCount: 1,
        colCount: 1,
      });
      return false;
    });
  }
  pasteRange(fromRange: IRange, isCut: boolean): IRange {
    const id = this.model.getCurrentSheetId();
    const activeCell = this.model.getActiveRange().range;

    const { row, col, rowCount, colCount, sheetId } = fromRange;
    const realSheetId = sheetId || id;
    const sheetInfo = this.model.getSheetInfo(realSheetId);
    const target = this.model.getSheetInfo(activeCell.sheetId);
    if (!sheetInfo || !target || !this.model.validateRange(fromRange)) return activeCell;
    const realRange: IRange = {
      ...activeCell,
      rowCount: Math.min(rowCount || sheetInfo.rowCount, target.rowCount - activeCell.row),
      colCount: Math.min(colCount || sheetInfo.colCount, target.colCount - activeCell.col),
    };
    const cells: Array<{ oldPath: string; row: number; col: number; value: ModelCellType }> = [];
    iterateRange({ ...fromRange, rowCount: realRange.rowCount, colCount: realRange.colCount },
      sheetInfo.rowCount, sheetInfo.colCount, (r, c) => {
      const oldPath = this.cellKey({ sheetId: realSheetId, row: r, col: c });
      const newValue = this.model.getRoot().cellJSON(oldPath);
      cells.push({
        oldPath, row: activeCell.row + (r - row), col: activeCell.col + (c - col),
        value: newValue ? { ...newValue } : { value: '' },
      });
      return false;
    });
    if (isCut) {
      for (const cell of cells) this.model.getRoot().deleteCell(cell.oldPath);
    }
    for (const cell of cells) {
      this.setCellModel(
        { sheetId: realRange.sheetId, row: cell.row, col: cell.col },
        cell.value,
      );
    }

    return realRange;
  }
  deleteAll(sheetId?: string): void {
    const id = sheetId || this.model.getCurrentSheetId();
    if (!this.worksheets) {
      return;
    }
    for (const key of this.worksheets.keys()) {
      if (convertWorksheetKey(key)?.sheetId === id) {
        this.model.getRoot().deleteCell(key);
      }
    }
  }
  private updateStyle(style: Partial<ModelCellType>, range: IRange) {
    const cellModel = this.getCellModel(range, true)!;
    const keyList = Object.keys(style) as Array<keyof Partial<StyleType>>;
    for (const k of keyList) {
      const oldValue = cellModel.get(k);
      const newValue = style[k];
      if (deepEqual(oldValue, newValue)) {
        continue;
      }
      cellModel.set(k, newValue);
    }
  }

  private setValue(value: ResultType, range: IRange): void {
    const cellModel = this.getCellModel(range, true)!;
    const oldValue = cellModel?.get('value');
    if (oldValue === value) {
      return;
    }
    const newValue = convertStringToResultType(value ?? '');
    cellModel?.set('value', newValue);
  }
  private setCellFormula(formula: string, range: IRange) {
    const cellModel = this.getCellModel(range, true)!;
    const oldFormula = this.getCell(range)?.formula;
    if (oldFormula === formula) {
      return;
    }
    cellModel?.set('formula', formula);
    this.model.getRoot().bindFormula(this.cellKey(range), formula);
  }
  private validateSheetData(sheetData: WorksheetData) {
    const result: WorksheetData = [];
    const currentSheetId = this.model.getCurrentSheetId();
    for (const cell of sheetData) {
      const sheet = this.model.getSheetInfo(cell.sheetId || currentSheetId);
      if (isEmpty(cell) || !sheet || !Number.isInteger(cell.row) || !Number.isInteger(cell.col) ||
        cell.row < 0 || cell.col < 0 || cell.row >= sheet.rowCount || cell.col >= sheet.colCount) {
        continue;
      }
      const temp: ModelCellValue = {
        ...cell,
        sheetId: cell.sheetId || currentSheetId,
        value: convertStringToResultType(cell.value ?? ''),
      };
      if (cell.formula) {
        if (!cell.formula.startsWith(FORMULA_PREFIX)) {
          temp.formula = FORMULA_PREFIX + cell.formula;
        }
      }
      result.push(temp);
    }
    return result;
  }
  private cellKey(range: Pick<IRange, 'sheetId' | 'row' | 'col'>) {
    if (!Number.isInteger(range.row) || !Number.isInteger(range.col) || range.row < 0 || range.col < 0) {
      throw new RangeError('Cell coordinates are outside the worksheet');
    }
    const id = range.sheetId || this.model.getCurrentSheetId();
    const sheet = this.model.getRoot().get('workbook').get(id);
    const rowId = sheet?.get('rows')?.get(range.row);
    const colId = sheet?.get('cols')?.get(range.col);
    if (rowId === undefined || colId === undefined) {
      throw new RangeError('Cell coordinates are outside the worksheet');
    }
    return `${id}_${rowId}_${colId}`;
  }

  private getCellModel(
    range: IRange,
    mustBe = false,
  ): CellMap | undefined {
    const { row, col, sheetId } = range;
    const id = sheetId || this.model.getCurrentSheetId();
    if (!id) {
      return undefined;
    }
    const sheet = this.model.getSheetInfo(id);
    if (!mustBe && (!sheet || !Number.isInteger(row) || !Number.isInteger(col) ||
      row < 0 || col < 0 || row >= sheet.rowCount || col >= sheet.colCount)) {
      return undefined;
    }

    const key = this.cellKey({ sheetId: id, row, col });
    return this.model.getRoot().cell(key, mustBe);
  }
  private setCellModel(
    range: Omit<IRange, 'colCount' | 'rowCount'>,
    data: ModelCellType,
  ) {
    const { row, col, sheetId } = range;
    const key = this.cellKey({ sheetId, row, col });
    this.model.getRoot().replaceCell(key, data);
    const cellData = this.model.getRoot().cell(key)!;
    return cellData;
  }
  private computeFormulasCallback(result: ResponseFormulas, expected: RequestFormulas) {
    const { list } = result;
    let check = false;
    for (const item of list) {
      const range = convertWorksheetKey(item.key);
      const old = range ? this.getCellModel({ ...range, rowCount: 1, colCount: 1 }) : undefined;
      const input = expected.worksheets[item.key];
      if (!old || !input?.formula || this.getCell({ ...range!, rowCount: 1, colCount: 1 })?.formula !== input.formula) {
        continue;
      }
      const oldValue = old.get('value');
      const oldFormula = old.get('formula');
      if (
        oldFormula &&
        item.newValue === TEXT_FLAG &&
        oldFormula !== oldValue
      ) {
        check = true;
        old.set('value', oldFormula);
        old.set('formula', '');
        input.value = oldFormula;
        input.formula = '';
      } else if (oldValue !== item.newValue) {
        check = true;
        this.model.getRoot().setComputedValue(this.cellKey(range!), item.newValue);
        input.value = item.newValue;
      }
    }
    return check;
  }
  async computeFormulas(): Promise<boolean> {
    const version = ++this.computation;
    const sheetData = this.model.getRoot().toJSON().worksheets;
    if (!sheetData || isEmpty(sheetData)) {
      return Promise.resolve(false);
    }
    const definedNames: RequestFormulas['definedNames'] = {};
    for (const item of this.model.getDefineNameList()) {
      definedNames[item.name] = item.range;
    }
    const data: RequestFormulas = {
      worksheets: sheetData,
      definedNames,
      currentSheetId: this.model.getCurrentSheetId(),
      workbook: this.model.getSheetList(),
    };

    const expected: RequestFormulas = {
      ...data,
      worksheets: Object.fromEntries(Object.entries(sheetData).map(([key, value]) => [key, { ...value }])),
    };
    return this.worker.computeFormulas(data, proxy((result: ResponseFormulas) => {
      if (this.disposed || version !== this.computation ||
        !deepEqual(expected.worksheets, this.model.getRoot().toJSON().worksheets) ||
        !deepEqual(expected.workbook, this.model.getSheetList()) ||
        !deepEqual(expected.definedNames, Object.fromEntries(
          this.model.getDefineNameList().map((item) => [item.name, item.range])))) return false;
      return this.model.transaction(() => this.computeFormulasCallback(result, expected), SYNC_FLAG.FORMULA_RESULT);
    }));
  }
}
