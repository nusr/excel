import {
  WorkBookJSON,
  ICommandItem,
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
  RequestFormula,
  ResponseMessageType,
  InterpreterResult,
  ChangeEventType,
  CellDataMap,
  FormulaKeys,
} from '@/types';
import {
  coordinateToString,
  HIDE_CELL,
  iterateRange,
  FORMULA_PREFIX,
  isEmpty,
  isFormula,
  deepEqual,
  workerSet,
  isText,
  stringToCoordinate,
  MERGE_CELL_LINE_BREAK,
  convertStringToResultType,
} from '@/util';
import { DELETE_FLAG, transformData } from './History';
import { numberFormat } from '@/model';
import { parseFormula, CustomError, allFormulas } from '@/formula';

export class Worksheet implements IWorksheet {
  private worksheets: WorkBookJSON['worksheets'] = {};
  private model: IModel;
  private parseFormulaResolve: (value: boolean) => void = () => {};
  constructor(model: IModel) {
    this.model = model;
    this.initWorker();
  }

  toJSON() {
    return {
      worksheets: { ...this.worksheets },
    };
  }
  fromJSON(json: WorkBookJSON): void {
    const data = json.worksheets || {};
    this.worksheets = this.worksheets || {};
    const oldValue = { ...this.worksheets };
    this.worksheets = {};
    for (const [sheetId, sheetData] of Object.entries(data)) {
      this.worksheets[sheetId] = {};
      if (isEmpty(sheetData)) {
        continue;
      }
      this.worksheets[sheetId] = this.validateSheetData(sheetData);
    }

    this.model.push({
      type: 'worksheets',
      key: '',
      newValue: this.worksheets,
      oldValue,
    });
  }
  undo(item: ICommandItem): void {
    if (item.type === 'worksheets') {
      transformData(this, item, 'undo');
    }
  }
  redo(item: ICommandItem): void {
    if (item.type === 'worksheets') {
      transformData(this, item, 'redo');
    }
  }
  addMergeCell(range: IRange, type?: EMergeCellType): void {
    const sheetId = range.sheetId || this.model.getCurrentSheetId();
    const isMergeContent = type === EMergeCellType.MERGE_CONTENT;
    const dataList: Array<{ value: ModelCellType; row: number; col: number }> =
      [];
    iterateRange(range, this.model.getSheetInfo(range.sheetId), (row, col) => {
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
      numberFormat(
        dataList[0].value.value,
        dataList[0].value.style?.numberFormat,
      ),
    ];
    for (let i = 1; i < dataList.length; i++) {
      const item = dataList[i];
      const key = coordinateToString(item.row, item.col);
      const oldValue = { ...item.value };
      if (isMergeContent) {
        list.push(numberFormat(oldValue.value, oldValue.style?.numberFormat));
      }
      delete this.worksheets[sheetId][key];
      this.model.push({
        type: 'worksheets',
        key: `${sheetId}.${key}`,
        newValue: DELETE_FLAG,
        oldValue,
      });
    }
    // If it exists formula, only use the first cell data
    if (dataList.some((v) => v.value.formula)) {
      list = [list[0]];
    }
    let realStyle: Partial<StyleType> = {};
    let value: ResultType = dataList[0].value.value;
    if (dataList[0].value.style) {
      realStyle = { ...dataList[0].value.style };
    }
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
      const key = coordinateToString(dataList[0].row, dataList[0].col);
      delete this.worksheets[sheetId][key];
      this.model.push({
        type: 'worksheets',
        key: `${sheetId}.${key}`,
        newValue: DELETE_FLAG,
        oldValue: { ...dataList[0].value },
      });
      this.setCellValue(value, newRange);
    }
    this.updateCellStyle(realStyle, newRange);
  }
  addRow(rowIndex: number, count: number, isAbove = false): void {
    const list = this.getCoordinateList();
    const sheetData = this.worksheets[this.model.getCurrentSheetId()];
    const endIndex = isAbove ? rowIndex : rowIndex + 1;
    for (let i = list.length - 1; i >= 0; i--) {
      const item = list[i];
      if (item.row < endIndex) {
        continue;
      }
      const key = coordinateToString(item.row, item.col);
      const newKey = coordinateToString(item.row + count, item.col);
      const newValue = sheetData[key] ? { ...sheetData[key] } : { value: '' };
      const oldValue = sheetData[newKey]
        ? { ...sheetData[newKey] }
        : { value: '' };
      this.updateCell(key, DELETE_FLAG, newValue);
      this.updateCell(newKey, newValue, oldValue);
    }
  }
  deleteRow(rowIndex: number, count: number): void {
    const list = this.getCoordinateList();
    const sheetData = this.worksheets[this.model.getCurrentSheetId()];
    for (const item of list) {
      if (item.row < rowIndex) {
        continue;
      }
      const key = coordinateToString(item.row, item.col);
      const newValue = sheetData[key] ? { ...sheetData[key] } : { value: '' };
      if (item.row >= rowIndex + count) {
        const newKey = coordinateToString(item.row - count, item.col);
        const oldValue = sheetData[newKey]
          ? { ...sheetData[newKey] }
          : { value: '' };
        this.updateCell(newKey, newValue, oldValue);
      }
      this.updateCell(key, DELETE_FLAG, newValue);
    }
  }
  addCol(colIndex: number, count: number, isRight = false): void {
    const list = this.getCoordinateList(true);
    const sheetData = this.worksheets[this.model.getCurrentSheetId()];
    const endIndex = isRight ? colIndex + 1 : colIndex;
    for (let i = list.length - 1; i >= 0; i--) {
      const item = list[i];
      if (item.col < endIndex) {
        continue;
      }

      const key = coordinateToString(item.row, item.col);
      const newKey = coordinateToString(item.row, item.col + count);
      /* jscpd:ignore-start */
      const newValue = sheetData[key] ? { ...sheetData[key] } : { value: '' };
      const oldValue = sheetData[newKey]
        ? { ...sheetData[newKey] }
        : { value: '' };
      this.updateCell(key, DELETE_FLAG, newValue);
      this.updateCell(newKey, newValue, oldValue);
      /* jscpd:ignore-end */
    }
  }
  deleteCol(colIndex: number, count: number): void {
    const list = this.getCoordinateList(true);
    const sheetData = this.worksheets[this.model.getCurrentSheetId()];
    for (const item of list) {
      if (item.col < colIndex) {
        continue;
      }
      const key = coordinateToString(item.row, item.col);
      const newValue = sheetData[key] ? { ...sheetData[key] } : { value: '' };
      /* jscpd:ignore-start */
      if (item.col >= colIndex + count) {
        const newKey = coordinateToString(item.row, item.col - count);
        const oldValue = sheetData[newKey]
          ? { ...sheetData[newKey] }
          : { value: '' };
        this.updateCell(newKey, newValue, oldValue);
      }
      this.updateCell(key, DELETE_FLAG, newValue);
      /* jscpd:ignore-end */
    }
  }
  getWorksheet(sheetId?: string): WorksheetData | undefined {
    const id = sheetId || this.model.getCurrentSheetId();
    const item = this.worksheets[id];
    if (item) {
      return item;
    }
    return undefined;
  }
  computeFormulas(): boolean | Promise<boolean> {
    const id = this.model.getCurrentSheetId();
    const sheetData = this.worksheets[id];
    let check = false;
    if (isEmpty(sheetData)) {
      return check;
    }
    const worker = workerSet.get().worker;
    if (!worker) {
      const cache = new Map<string, InterpreterResult>();
      for (const [k, data] of Object.entries(sheetData)) {
        if (!data?.formula) {
          continue;
        }
        const coord = stringToCoordinate(k);
        const result = this.parseFormula(data.formula, coord, cache);
        if (!result) {
          continue;
        }
        const newValue = result.result[0];
        const oldValue = data.value;
        if (newValue !== oldValue) {
          data.value = newValue;
          check = true;
          this.model.push({
            type: 'worksheets',
            key: `${id}.${k}.value`,
            newValue: newValue,
            oldValue: oldValue,
          });
        }
      }
      return check;
    }

    return new Promise((resolve) => {
      const definedNames: RequestFormula['definedNames'] = {};
      for (const item of this.model.getDefineNameList()) {
        definedNames[item.name] = item.range;
      }
      const data: RequestFormula = {
        worksheets: this.worksheets,
        definedNames,
        currentSheetId: this.model.getCurrentSheetId(),
        workbook: this.model.getSheetList(),
        status: 'formula',
      };
      worker.postMessage(data);
      this.parseFormulaResolve = resolve;
    });
  }
  setWorksheet(data: WorksheetData, sheetId?: string): void {
    const id = sheetId || this.model.getCurrentSheetId();
    if (deepEqual(data, this.worksheets[id])) {
      return;
    }
    const oldData = this.worksheets[id] ? { ...this.worksheets[id] } : {};
    this.worksheets[id] = this.validateSheetData(data);
    this.model.push({
      type: 'worksheets',
      key: id,
      newValue: data,
      oldValue: oldData,
    });
  }
  getCell(range: IRange): ModelCellType | undefined {
    const { row, col, sheetId } = range;
    const id = sheetId || this.model.getCurrentSheetId();
    if (
      this.model.getRowHeight(row, id).len === HIDE_CELL ||
      this.model.getColWidth(col, id).len === HIDE_CELL
    ) {
      return undefined;
    }
    const key = coordinateToString(row, col);
    this.worksheets[id] = this.worksheets[id] || {};
    const sheetData = this.worksheets[id];
    const cellData = sheetData?.[key];
    if (isEmpty(cellData)) {
      return undefined;
    }
    return {
      ...cellData,
    };
  }
  setCell(
    value: ResultType[][],
    style: Array<Array<Partial<StyleType>>>,
    range: IRange,
  ): void {
    const { row, col } = range;
    for (let r = 0; r < value.length; r++) {
      for (let c = 0; c < value[r].length; c++) {
        const temp: Coordinate = {
          row: row + r,
          col: col + c,
        };
        if (style[r] && style[r][c]) {
          this.setStyle(style[r][c], temp);
        }
        this.setCellValue(value[r][c], { ...range, ...temp });
      }
    }
  }

  setCellValue(value: ResultType, range: IRange): void {
    const id = range.sheetId || this.model.getCurrentSheetId();
    if (typeof value === 'string' && isFormula(value)) {
      this.setCellFormula(value, range);
    } else {
      const old =
        this.worksheets?.[id]?.[coordinateToString(range.row, range.col)];
      if (old?.formula) {
        this.setCellFormula('', range);
      }
      this.setValue(value, range);
    }
  }

  updateCellStyle(style: Partial<StyleType>, range: IRange): void {
    if (isEmpty(style)) {
      return;
    }
    iterateRange(range, this.model.getSheetInfo(range.sheetId), (row, col) => {
      this.updateStyle(style, { row, col });
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

    if (!fromSheetData || isEmpty(fromSheetData)) {
      return realRange;
    }
    this.worksheets[id] = this.worksheets[id] || {};
    const currentSheetData = this.worksheets[id];
    iterateRange(
      fromRange,
      this.model.getSheetInfo(fromRange.sheetId),
      (r, c) => {
        const oldPath = coordinateToString(r, c);
        const newValue = fromSheetData[oldPath]
          ? { ...fromSheetData[oldPath] }
          : { value: '' };
        const realRow = activeCell.row + (r - row);
        const realCol = activeCell.col + (c - col);
        const path = coordinateToString(realRow, realCol);
        const oldValue = currentSheetData[path]
          ? { ...currentSheetData[path] }
          : { value: '' };
        currentSheetData[path] = { ...newValue };
        this.model.push({
          type: 'worksheets',
          key: `${id}.${path}`,
          newValue: newValue,
          oldValue: oldValue,
        });

        if (isCut) {
          delete fromSheetData[oldPath];
          this.model.push({
            type: 'worksheets',
            key: `${realSheetId}.${oldPath}`,
            newValue: DELETE_FLAG,
            oldValue: newValue,
          });
        }
        return false;
      },
    );

    return realRange;
  }
  deleteAll(sheetId?: string): void {
    const id = sheetId || this.model.getCurrentSheetId();
    if (isEmpty(this.worksheets[id])) {
      return;
    }
    const oldSheetData = this.worksheets[id] ? { ...this.worksheets[id] } : {};
    delete this.worksheets[id];
    this.model.push({
      type: 'worksheets',
      key: id,
      newValue: DELETE_FLAG,
      oldValue: { ...oldSheetData },
    });
  }
  private updateStyle(style: Partial<StyleType>, range: Coordinate) {
    const cellModel = this.getCellModel(range);
    cellModel.style = cellModel.style || {};
    if (isEmpty(style) && isEmpty(cellModel.style)) {
      return;
    }
    const keyList = Object.keys(style) as Array<keyof Partial<StyleType>>;
    for (const k of keyList) {
      const oldValue = cellModel.style?.[k];
      const newValue = style[k];
      if (deepEqual(oldValue, newValue)) {
        continue;
      }
      // @ts-ignore
      cellModel.style[k] = newValue;

      this.model.push({
        type: 'worksheets',
        key: `${this.model.getCurrentSheetId()}.${coordinateToString(
          range.row,
          range.col,
        )}.style.${k}`,
        newValue: newValue === undefined ? DELETE_FLAG : newValue,
        oldValue: oldValue === undefined ? DELETE_FLAG : oldValue,
      });
    }
  }

  private setStyle(style: Partial<StyleType>, range: Coordinate) {
    const cellModel = this.getCellModel(range);
    const styleData = cellModel.style || {};
    const oldStyle = { ...styleData };
    cellModel.style = style;

    this.model.push({
      type: 'worksheets',
      key: `${this.model.getCurrentSheetId()}.${coordinateToString(
        range.row,
        range.col,
      )}.style`,
      newValue: style,
      oldValue: isEmpty(oldStyle) ? DELETE_FLAG : oldStyle,
    });
  }
  private setValue(value: ResultType, range: Coordinate): void {
    const cellModel = this.getCellModel(range);
    const oldValue = cellModel.value;
    if (oldValue === value) {
      return;
    }
    const newValue = convertStringToResultType(value ?? '');
    cellModel.value = newValue;
    this.model.push({
      type: 'worksheets',
      key: `${this.model.getCurrentSheetId()}.${coordinateToString(
        range.row,
        range.col,
      )}.value`,
      newValue: newValue,
      oldValue: oldValue === undefined ? DELETE_FLAG : oldValue,
    });
  }
  private setCellFormula(formula: string, range: Coordinate): void {
    const cellModel = this.getCellModel(range);
    const oldFormula = cellModel.formula;
    if (oldFormula === formula) {
      return;
    }

    if (formula) {
      const result = this.parseFormula(formula, range, new Map());
      if (isText(result.result)) {
        this.setValue(formula, range);
        return;
      }
    }

    cellModel.formula = formula;
    this.model.push({
      type: 'worksheets',
      key: `${this.model.getCurrentSheetId()}.${coordinateToString(
        range.row,
        range.col,
      )}.formula`,
      newValue: formula,
      oldValue: oldFormula ? oldFormula : DELETE_FLAG,
    });
  }
  private validateSheetData(sheetData: WorksheetData) {
    const result: WorksheetData = {};
    for (const [key, cell] of Object.entries(sheetData)) {
      if (isEmpty(cell)) {
        continue;
      }
      const value = convertStringToResultType(cell.value ?? '');
      result[key] = {
        value,
      };
      if (!isEmpty(cell.style)) {
        result[key].style = { ...cell.style };
      }
      if (cell.formula) {
        if (cell.formula.startsWith(FORMULA_PREFIX)) {
          result[key].formula = cell.formula;
        } else {
          result[key].formula = FORMULA_PREFIX + cell.formula;
        }
      }
    }
    return result;
  }
  private getCoordinateList(isCol = false) {
    const id = this.model.getCurrentSheetId();
    const sheetData = this.worksheets[id];
    if (isEmpty(sheetData)) {
      return [];
    }
    const list = Array.from(Object.keys(sheetData)).map((key) =>
      stringToCoordinate(key),
    );
    list.sort((a, b) => {
      if (isCol) {
        return a.col - b.col;
      } else {
        return a.row - b.row;
      }
    });
    return list;
  }
  private updateCell(
    key: string,
    newValue: ModelCellType | typeof DELETE_FLAG,
    oldValue: ModelCellType,
  ) {
    const id = this.model.getCurrentSheetId();
    if (newValue === DELETE_FLAG) {
      delete this.worksheets[id][key];
    } else {
      this.worksheets[id][key] = { ...newValue };
    }
    this.model.push({
      type: 'worksheets',
      key: `${id}.${key}`,
      newValue,
      oldValue,
    });
  }
  private getCellModel(range: Coordinate) {
    const { row, col } = range;
    const id = this.model.getCurrentSheetId();
    const key = coordinateToString(row, col);
    this.worksheets[id] = this.worksheets[id] || {};
    this.worksheets[id][key] = this.worksheets[id][key] || {};
    return this.worksheets[id][key];
  }
  private parseFormula(
    formula: string,
    coord: Coordinate,
    cache: Map<string, InterpreterResult>,
  ) {
    const cellDataMap: CellDataMap = {
      handleCell: () => {
        return [];
      },
      getFunction: (name: string) => {
        return allFormulas[name as FormulaKeys];
      },
      getCell: (range) => {
        return this.model.getCell(range);
      },
      set: () => {
        throw new CustomError('#REF!');
      },
      getSheetInfo: (sheetId?: string, sheetName?: string) => {
        if (sheetName) {
          return this.model.getSheetList().find((v) => v.name === sheetName);
        }
        return this.model.getSheetInfo(
          sheetId || this.model.getCurrentSheetId(),
        );
      },
      setDefinedName: () => {
        throw new CustomError('#REF!');
      },
      getDefinedName: (name: string) => this.model.checkDefineName(name),
    };
    const result = parseFormula(formula, coord, cellDataMap, cache);
    return result;
  }
  private updateColAndRow(
    rowMap: Record<string, number>,
    colMap: Record<string, number>,
  ) {
    const rowKeys = Object.keys(rowMap);
    const colKeys = Object.keys(colMap);
    if (colKeys.length === 0 && rowKeys.length === 0) {
      return;
    }
    let check = false;
    for (const [row, h] of Object.entries(rowMap)) {
      const r = parseInt(row, 10);
      if (h !== this.model.getRowHeight(r).len) {
        this.model.setRowHeight(r, h);
        check = true;
      }
    }
    for (const [col, w] of Object.entries(colMap)) {
      const c = parseInt(col, 10);
      if (w !== this.model.getColWidth(c).len) {
        this.model.setColWidth(c, w);
        check = true;
      }
    }
    if (check) {
      this.model.emitChange(new Set<ChangeEventType>(['noHistory']));
    }
  }
  private initWorker() {
    const worker = workerSet.get().worker;
    if (!worker) {
      return;
    }
    worker.addEventListener(
      'message',
      (event: MessageEvent<ResponseMessageType>) => {
        if (event.data.status === 'formula') {
          const { list } = event.data;
          for (const item of list) {
            const id = item.sheetId;
            this.worksheets[id] = this.worksheets[id] || {};
            const oldValue = this.worksheets[id][item.key].value;
            this.worksheets[id][item.key].value = item.newValue;
            this.model.push({
              type: 'worksheets',
              key: `${id}.${item.key}.value`,
              newValue: item.newValue,
              oldValue: oldValue,
            });
          }
          this.parseFormulaResolve(true);
        } else if (event.data.status === 'render') {
          const { rowMap, colMap } = event.data;
          this.updateColAndRow(rowMap, colMap);
        }
      },
    );
  }
}
