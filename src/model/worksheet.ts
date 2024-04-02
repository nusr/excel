import {
  WorkBookJSON,
  ICommandItem,
  ModelCellValue,
  Coordinate,
  IRange,
  IModel,
  IWorksheet,
  ResultType,
  StyleType,
  WorksheetData,
} from '@/types';
import {
  coordinateToString,
  HIDE_CELL,
  FORMULA_PREFIX,
  isEmpty,
  deepEqual,
  stringToCoordinate,
} from '@/util';
import { DELETE_FLAG, transformData } from './History';
import { parseFormula, CustomError } from '@/formula';

export class Worksheet implements IWorksheet {
  private worksheets: WorkBookJSON['worksheets'] = {};
  private model: IModel;
  constructor(model: IModel) {
    this.model = model;
  }
  toJSON() {
    return {
      worksheets: this.worksheets,
    };
  }
  fromJSON(json: WorkBookJSON): void {
    const data = json.worksheets || {};
    this.worksheets = { ...data };
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
  addRow(rowIndex: number, count: number, isAbove = false): void {
    const id = this.model.getCurrentSheetId();
    const sheetData = this.worksheets[id];
    if (isEmpty(sheetData)) {
      return;
    }
    const list = Array.from(Object.keys(sheetData)).map((key) =>
      stringToCoordinate(key),
    );
    list.sort((a, b) => a.row - b.row);
    const endIndex = isAbove ? rowIndex : rowIndex + 1;
    for (let i = list.length - 1; i >= 0; i--) {
      const item = list[i];
      if (item.row < endIndex) {
        continue;
      }
      const key = coordinateToString(item.row, item.col);
      const newKey = coordinateToString(item.row + count, item.col);

      const newValue = sheetData[key] ? { ...sheetData[key] } : { value: '' };
      const oldData = sheetData[newKey]
        ? { ...sheetData[newKey] }
        : { value: '' };

      delete sheetData[key];
      this.model.push({
        type: 'worksheets',
        key: `${id}.${key}`,
        newValue: DELETE_FLAG,
        oldValue: newValue,
      });
      sheetData[newKey] = { ...newValue };
      this.model.push({
        type: 'worksheets',
        key: `${id}.${newKey}`,
        newValue: newValue,
        oldValue: oldData,
      });
    }
  }
  deleteRow(rowIndex: number, count: number): void {
    const id = this.model.getCurrentSheetId();
    const sheetData = this.worksheets[id];
    if (isEmpty(sheetData)) {
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
      const newValue = sheetData[key] ? { ...sheetData[key] } : { value: '' };
      if (item.row >= rowIndex + count) {
        const newKey = coordinateToString(item.row - count, item.col);
        const oldValue = sheetData[newKey]
          ? { ...sheetData[newKey] }
          : { value: '' };

        sheetData[newKey] = { ...newValue };
        this.model.push({
          type: 'worksheets',
          key: `${id}.${newKey}`,
          newValue: newValue,
          oldValue: oldValue,
        });
      }

      delete sheetData[key];
      this.model.push({
        type: 'worksheets',
        key: `${id}.${key}`,
        newValue: DELETE_FLAG,
        oldValue: newValue,
      });
    }
  }
  addCol(colIndex: number, count: number, isRight = false): void {
    const id = this.model.getCurrentSheetId();
    const sheetData = this.worksheets[id];
    if (isEmpty(sheetData)) {
      return;
    }

    const list = Array.from(Object.keys(sheetData)).map((key) =>
      stringToCoordinate(key),
    );
    list.sort((a, b) => a.col - b.col);
    const endIndex = isRight ? colIndex + 1 : colIndex;
    for (let i = list.length - 1; i >= 0; i--) {
      const item = list[i];
      if (item.col < endIndex) {
        continue;
      }

      const key = coordinateToString(item.row, item.col);
      const newKey = coordinateToString(item.row, item.col + count);
      const newValue = sheetData[key] ? { ...sheetData[key] } : { value: '' };
      const oldValue = sheetData[newKey]
        ? { ...sheetData[newKey] }
        : { value: '' };
      delete sheetData[key];
      this.model.push({
        type: 'worksheets',
        key: `${id}.${key}`,
        newValue: DELETE_FLAG,
        oldValue: newValue,
      });
      sheetData[newKey] = newValue;
      this.model.push({
        type: 'worksheets',
        key: `${id}.${newKey}`,
        newValue: newValue,
        oldValue: oldValue,
      });
    }
  }
  deleteCol(colIndex: number, count: number): void {
    const id = this.model.getCurrentSheetId();
    const sheetData = this.worksheets[id];

    if (isEmpty(sheetData)) {
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
      const newValue = sheetData[key] ? { ...sheetData[key] } : { value: '' };
      if (item.col >= colIndex + count) {
        const newKey = coordinateToString(item.row, item.col - count);
        const oldValue = sheetData[newKey]
          ? { ...sheetData[newKey] }
          : { value: '' };

        sheetData[newKey] = { ...newValue };
        this.model.push({
          type: 'worksheets',
          key: `${id}.${newKey}`,
          newValue: newValue,
          oldValue: oldValue,
        });
      }

      delete sheetData[key];
      this.model.push({
        type: 'worksheets',
        key: `${id}.${key}`,
        newValue: DELETE_FLAG,
        oldValue: newValue,
      });
    }
  }
  getWorksheet(sheetId?: string): WorksheetData | null {
    const id = sheetId || this.model.getCurrentSheetId();
    const item = this.worksheets[id];
    if (item) {
      return item;
    }
    return null;
  }
  computeFormulas() {
    const id = this.model.getCurrentSheetId();
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
          this.model.push({
            type: 'worksheets',
            key: `${id}.${k}.value`,
            newValue: newValue,
            oldValue: oldValue,
          });
        }
      }
    }
  }
  setWorksheet(data: WorksheetData, sheetId?: string): void {
    const id = sheetId || this.model.getCurrentSheetId();
    if (deepEqual(data, this.worksheets[id])) {
      return;
    }
    const oldData = this.worksheets[id]
      ? { ...this.worksheets[id] }
      : null;
    this.worksheets[id] = data;
    this.model.push({
      type: 'worksheets',
      key: id,
      newValue: data,
      oldValue: oldData ? oldData : DELETE_FLAG,
    });
  }
  getCell(range: IRange): ModelCellValue | null {
    const { row, col, sheetId } = range;
    const id = sheetId || this.model.getCurrentSheetId();
    if (
      this.model.getRowHeight(row, id).len === HIDE_CELL ||
      this.model.getColWidth(col, id).len === HIDE_CELL
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
  }
  setCell(
    value: ResultType[][],
    style: Array<Array<Partial<StyleType>>>,
    range: IRange,
  ): void {
    const id = range.sheetId || this.model.getCurrentSheetId();
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
            this.worksheets?.[id]?.[coordinateToString(temp.row, temp.col)];
          if (old?.formula) {
            this.setCellFormula('', temp);
          }
          this.setCellValue(t, temp);
        }
      }
    }
  }

  updateCellStyle(style: Partial<StyleType>, range: IRange): void {
    if (isEmpty(style)) {
      return;
    }
    const { row, col, rowCount, colCount } = range;
    for (let r = row, endRow = row + rowCount; r < endRow; r++) {
      for (let c = col, endCol = col + colCount; c < endCol; c++) {
        this.updateStyle(style, { row: r, col: c });
      }
    }
  }
  pasteRange(fromRange: IRange, isCut: boolean): IRange {
    const id = this.model.getCurrentSheetId();
    const activeCell = this.model.getActiveCell();

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
    this.model.iterateRange(fromRange, (r, c) => {
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
    });

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
    if (isEmpty(style)) {
      return;
    }
    const key = coordinateToString(range.row, range.col);
    const id = this.model.getCurrentSheetId();
    this.worksheets[id] = this.worksheets[id] || {};
    this.worksheets[id][key] = this.worksheets[id][key] || {};
    const sheetData = this.worksheets[id];
    sheetData[key].style = sheetData[key].style || {};
    const keyList = Object.keys(style) as Array<keyof Partial<StyleType>>;
    for (const k of keyList) {
      const oldValue = sheetData[key]?.style?.[k];

      const newValue = style[k];
      // @ts-ignore
      sheetData[key].style[k] = newValue;

      this.model.push({
        type: 'worksheets',
        key: `${id}.${key}.style.${k}`,
        newValue: newValue,
        oldValue: oldValue === undefined ? DELETE_FLAG : oldValue,
      });
    }
  }

  private setStyle(style: Partial<StyleType>, range: Coordinate) {
    const key = coordinateToString(range.row, range.col);
    const id = this.model.getCurrentSheetId();
    this.worksheets[id] = this.worksheets[id] || {};
    this.worksheets[id][key] = this.worksheets[id][key] || {};
    const sheetData = this.worksheets[id];
    const cellData = sheetData[key];
    const styleData = cellData.style || {};

    const oldStyle = { ...styleData };
    sheetData[key].style = style;

    this.model.push({
      type: 'worksheets',
      key: `${id}.${key}.style`,
      newValue: style,
      oldValue: isEmpty(oldStyle) ? DELETE_FLAG : oldStyle,
    });
  }
  private setCellValue(value: ResultType, range: Coordinate): void {
    const { row, col } = range;
    const id = this.model.getCurrentSheetId();

    const key = coordinateToString(row, col);
    this.worksheets[id] = this.worksheets[id] || {};
    this.worksheets[id][key] = this.worksheets[id][key] || {};
    const sheetData = this.worksheets[id];
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

    this.model.push({
      type: 'worksheets',
      key: `${id}.${key}.value`,
      newValue: newValue,
      oldValue: oldValue === undefined ? DELETE_FLAG : oldValue,
    });
  }
  private setCellFormula(formula: string, range: Coordinate): void {
    const { row, col } = range;
    const id = this.model.getCurrentSheetId();
    const key = coordinateToString(row, col);
    this.worksheets[id] = this.worksheets[id] || {};
    this.worksheets[id][key] = this.worksheets[id][key] || {};
    const sheetData = this.worksheets[id];
    const oldData = sheetData[key];
    const oldFormula = oldData.formula;
    if (oldFormula === formula) {
      return;
    }
    sheetData[key].formula = formula;

    this.model.push({
      type: 'worksheets',
      key: `${id}.${key}.formula`,
      newValue: formula,
      oldValue: oldFormula ? oldFormula : DELETE_FLAG,
    });
  }
  private parseFormula(formula: string) {
    const result = parseFormula(
      formula,
      {
        get: (range: IRange) => {
          const { row, col, sheetId } = range;
          const result: ResultType[] = [];
          const sheetInfo = this.model.getSheetInfo(sheetId);
          if (
            !sheetInfo ||
            row >= sheetInfo.rowCount ||
            col >= sheetInfo.colCount
          ) {
            throw new CustomError('#REF!');
          }
          this.model.iterateRange(range, (r, c) => {
            const temp = this.getCell({
              sheetId,
              row: r,
              col: c,
              rowCount: 1,
              colCount: 1,
            });
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
        get: (name: string) => this.model.checkDefineName(name),
        has: (name: string) => {
          const t = this.model.checkDefineName(name);
          return Boolean(t);
        },
      },
    );
    return result;
  }
  private convertSheetNameToSheetId = (sheetName: string): string => {
    const item = this.model.getSheetList().find((v) => v.name === sheetName);
    return item?.sheetId || '';
  };
}
