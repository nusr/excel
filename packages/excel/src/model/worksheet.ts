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
  TypedMap,
  YjsModelJson,
  IHooks,
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
  getWorksheetKey,
} from '../util';
import { numberFormat } from '../formula';
import { proxy } from 'comlink';
import { Map } from 'yjs';

export class Worksheet implements IWorksheet {
  private model: IModel;
  private worker: IHooks['worker'];
  constructor(model: IModel, worker: IHooks['worker']) {
    this.model = model;
    this.worker = worker;
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
    this.model
      .getRoot()
      .set('worksheets', new Map() as YjsModelJson['worksheets']);

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
      const key = getWorksheetKey(sheetId, item.row, item.col);
      const oldValue = { ...item.value };
      if (isMergeContent) {
        list.push(numberFormat(oldValue.value, oldValue?.numberFormat));
      }
      this.worksheets?.delete(key);
    }
    // If it exists formula, only use the first cell data
    if (dataList.some((v) => v.value.formula)) {
      list = [list[0]];
    }
    let realStyle: Partial<StyleType> = omit(dataList[0], [
      'row',
      'col',
      'value',
    ]);
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
    } else {
      value = list[0];
    }
    if (range.row === dataList[0].row && range.col === dataList[0].col) {
      if (isMergeContent) {
        this.setCellValue(value, newRange);
      }
    } else {
      const key = getWorksheetKey(sheetId, dataList[0].row, dataList[0].col);
      this.worksheets?.delete(key);
      this.setCellValue(value, newRange);
    }
    this.updateCellStyle(realStyle, newRange);
  }
  addRow(rowIndex: number, count: number, isAbove = false): void {
    const list = this.getCoordinateList();
    const currentSheetId = this.model.getCurrentSheetId();
    const endIndex = isAbove ? rowIndex : rowIndex + 1;
    for (let i = list.length - 1; i >= 0; i--) {
      const item = list[i];
      if (item.row < endIndex) {
        continue;
      }
      const key = getWorksheetKey(currentSheetId, item.row, item.col);
      const newValue = omit(item, ['sheetId', 'row', 'col']);
      this.worksheets?.delete(key);
      this.setCellModel(
        { sheetId: currentSheetId, row: item.row + count, col: item.col },
        newValue,
      );
    }
  }
  deleteRow(rowIndex: number, count: number): void {
    const currentSheetId = this.model.getCurrentSheetId();
    const list = this.getCoordinateList();
    for (const item of list) {
      if (item.row < rowIndex) {
        continue;
      }
      const key = getWorksheetKey(currentSheetId, item.row, item.col);
      const newValue = omit(item, ['sheetId', 'row', 'col']);
      if (item.row >= rowIndex + count) {
        this.setCellModel(
          { sheetId: currentSheetId, row: item.row - count, col: item.col },
          newValue,
        );
      }
      this.worksheets?.delete(key);
    }
  }
  addCol(colIndex: number, count: number, isRight = false): void {
    const list = this.getCoordinateList(true);
    const currentSheetId = this.model.getCurrentSheetId();
    const endIndex = isRight ? colIndex + 1 : colIndex;
    for (let i = list.length - 1; i >= 0; i--) {
      const item = list[i];
      if (item.col < endIndex) {
        continue;
      }

      const key = getWorksheetKey(currentSheetId, item.row, item.col);
      /* jscpd:ignore-start */
      const newValue = omit(item, ['sheetId', 'row', 'col']);
      this.worksheets?.delete(key);
      this.setCellModel(
        { sheetId: currentSheetId, row: item.row, col: item.col + count },
        newValue,
      );
      /* jscpd:ignore-end */
    }
  }
  deleteCol(colIndex: number, count: number): void {
    const list = this.getCoordinateList(true);
    const currentSheetId = this.model.getCurrentSheetId();
    for (const item of list) {
      if (item.col < colIndex) {
        continue;
      }
      const key = getWorksheetKey(currentSheetId, item.row, item.col);
      const newValue = omit(item, ['sheetId', 'row', 'col']);
      /* jscpd:ignore-start */
      if (item.col >= colIndex + count) {
        this.setCellModel(
          { sheetId: currentSheetId, row: item.row, col: item.col - count },
          newValue,
        );
      }
      this.worksheets?.delete(key);
      /* jscpd:ignore-end */
    }
  }
  getWorksheet(sheetId?: string) {
    const id = sheetId || this.model.getCurrentSheetId();
    return this.getWorkData(id);
  }

  private getWorkData(sheetId: string = '') {
    const result: WorksheetData = [];
    if (!this.worksheets) {
      return result;
    }
    for (const [key, value] of this.worksheets.entries()) {
      const data = convertWorksheetKey(key);
      if (!data) {
        continue;
      }
      const t = value.toJSON() as ModelCellType;
      if (sheetId && data.sheetId === sheetId) {
        result.push({ ...data, ...t });
      } else {
        result.push({ ...data, ...t });
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
    const cell = this.getCellModel(range);
    if (!cell) {
      return undefined;
    }
    return {
      ...cell.toJSON(),
    };
  }
  deleteCell(range: IRange) {
    const id = range.sheetId || this.model.getCurrentSheetId();
    const info = this.model.getSheetInfo(id);
    if (!info || !this.worksheets) {
      return;
    }
    const keyList: string[] = [];
    iterateRange(range, info.rowCount, info.colCount, (row, col) => {
      const key = getWorksheetKey(id, row, col);
      keyList.push(key);
      return false;
    });
    for (const key of keyList) {
      this.worksheets.delete(key);
    }
  }
  async setCell(
    value: ResultType[][],
    style: Array<Array<Partial<StyleType>>>,
    range: IRange,
  ) {
    const { row, col } = range;
    for (let r = 0; r < value.length; r++) {
      for (let c = 0; c < value[r].length; c++) {
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
    const fromSheetData = this.getWorksheet(realSheetId);

    const realRange: IRange = {
      ...activeCell,
      rowCount,
      colCount,
    };

    if (fromSheetData.length === 0) {
      return realRange;
    }
    const sheetInfo = this.model.getSheetInfo(fromRange.sheetId);
    if (!sheetInfo) {
      return realRange;
    }
    iterateRange(fromRange, sheetInfo.rowCount, sheetInfo.colCount, (r, c) => {
      const oldPath = getWorksheetKey(realSheetId, r, c);
      const newValue = this.worksheets?.get(oldPath);
      const realRow = activeCell.row + (r - row);
      const realCol = activeCell.col + (c - col);
      const temp = newValue ? { ...newValue.toJSON() } : { value: '' };
      this.setCellModel(
        { sheetId: realRange.sheetId, row: realRow, col: realCol },
        temp,
      );

      if (isCut) {
        this.worksheets?.delete(oldPath);
      }
      return false;
    });

    return realRange;
  }
  deleteAll(sheetId?: string): void {
    const id = sheetId || this.model.getCurrentSheetId();
    if (!this.worksheets) {
      return;
    }
    for (const key of this.worksheets.keys()) {
      const range = convertWorksheetKey(key);
      if (range?.sheetId === id) {
        this.worksheets.delete(key);
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
    const oldFormula = cellModel?.get('formula');
    if (oldFormula === formula) {
      return;
    }
    cellModel?.set('formula', formula);
  }
  private validateSheetData(sheetData: WorksheetData) {
    const result: WorksheetData = [];
    const currentSheetId = this.model.getCurrentSheetId();
    for (const cell of sheetData) {
      if (isEmpty(cell) || cell.row < 0 || cell.col < 0) {
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
  private getCoordinateList(isCol = false) {
    const id = this.model.getCurrentSheetId();
    const sheetData = this.getWorkData(id);
    if (sheetData.length === 0) {
      return [];
    }
    sheetData.sort((a, b) => {
      if (isCol) {
        return a.col - b.col;
      } else {
        return a.row - b.row;
      }
    });
    return sheetData;
  }

  private getCellModel(
    range: IRange,
    mustBe = false,
  ): TypedMap<ModelCellType> | undefined {
    const { row, col, sheetId } = range;
    const id = sheetId || this.model.getCurrentSheetId();
    if (!id) {
      return undefined;
    }

    const key = getWorksheetKey(id, row, col);
    const cell = this.worksheets?.get(key);
    if (mustBe && !cell) {
      return this.setCellModel({ sheetId: id, row, col }, { value: '' });
    }
    return cell;
  }
  private setCellModel(
    range: Omit<IRange, 'colCount' | 'rowCount'>,
    data: ModelCellType,
  ) {
    const { row, col, sheetId } = range;
    const key = getWorksheetKey(
      sheetId || this.model.getCurrentSheetId(),
      row,
      col,
    );
    let worksheets = this.worksheets;

    if (!this.worksheets) {
      worksheets = new Map() as YjsModelJson['worksheets'];
      this.model.getRoot().set('worksheets', worksheets);
    }
    const cellData = new Map(Object.entries(data)) as TypedMap<ModelCellType>;
    worksheets!.set(key, cellData);
    return cellData;
  }
  private computeFormulasCallback = (result: ResponseFormulas) => {
    const { list } = result;
    let check = false;
    for (const item of list) {
      const old = this.worksheets?.get(item.key);
      if (!old) {
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
      } else if (oldValue !== item.newValue) {
        check = true;
        old.set('value', item.newValue);
      }
    }
    return check;
  };
  async computeFormulas(): Promise<boolean> {
    const sheetData = this.worksheets?.toJSON();
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

    return this.worker.computeFormulas(
      data,
      proxy(this.computeFormulasCallback),
    );
  }
}
