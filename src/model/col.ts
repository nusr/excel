import { WorkBookJSON, ICommandItem, ICol, IModel, CustomItem } from '@/types';
import {
  getCustomWidthOrHeightKey,
  stringToCoordinate,
  coordinateToString,
  CELL_WIDTH,
  HIDE_CELL,
} from '@/util';
import { DELETE_FLAG, transformData } from './History';

export class ColManager implements ICol {
  private customWidth: WorkBookJSON['customWidth'] = {};
  private model: IModel;
  constructor(model: IModel) {
    this.model = model;
  }
  toJSON() {
    return {
      customWidth: this.customWidth,
    };
  }
  fromJSON(json: WorkBookJSON): void {
    this.customWidth = { ...(json.customWidth || {}) };
  }
  undo(item: ICommandItem): void {
    if (item.type === 'customWidth') {
      transformData(this, item, 'undo');
    }
  }
  redo(item: ICommandItem): void {
    if (item.type === 'customWidth') {
      transformData(this, item, 'redo');
    }
  }
  addCol(colIndex: number, count: number): void {
    const sheetInfo = this.model.getSheetInfo()!;

    const id = this.model.getCurrentSheetId();
    const sheetData = this.model.getWorksheet();
    const newCount = sheetInfo.colCount + count;
    if (!sheetData) {
      return;
    }
    for (let i = newCount - 1; i >= colIndex + count; i--) {
      const oldKey = getCustomWidthOrHeightKey(id, i - count);
      const newKey = getCustomWidthOrHeightKey(id, i);
      const oldValue = this.customWidth[oldKey]
        ? { ...this.customWidth[oldKey] }
        : undefined;
      const newValue = this.customWidth[newKey]
        ? { ...this.customWidth[newKey] }
        : undefined;
      if (oldValue) {
        delete this.customWidth[oldKey];
        this.model.push({
          type: 'customWidth',
          key: oldKey,
          newValue: DELETE_FLAG,
          oldValue: oldValue,
        });
      }
      if (newValue) {
        if (oldValue) {
          this.customWidth[newKey] = oldValue;
          this.model.push({
            type: 'customWidth',
            key: newKey,
            newValue: oldValue,
            oldValue: newValue,
          });
        } else {
          delete this.customWidth[newKey];
          this.model.push({
            type: 'customWidth',
            key: newKey,
            newValue: DELETE_FLAG,
            oldValue: newValue,
          });
        }
      }
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
      if (!sheetData[key]) {
        continue;
      }
      const newValue = sheetData[key] ? { ...sheetData[key] } : {};
      const oldValue = sheetData[newKey] ? { ...sheetData[newKey] } : {};
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
        oldValue: oldValue,
      });
    }
  }
  deleteCol(colIndex: number, count: number): void {
    const id = this.model.getCurrentSheetId();
    const sheetData = this.model.getWorksheet();

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

  hideCol(colIndex: number, count: number): void {
    const id = this.model.getCurrentSheetId();
    for (let i = 0; i < count; i++) {
      const c = colIndex + i;
      const key = getCustomWidthOrHeightKey(id, c);
      const old = this.getColWidth(c);
      if (old.isHide) {
        continue;
      }
      const newData = { ...old, isHide: true };
      this.customWidth[key] = newData;
      this.model.push({
        type: 'customWidth',
        key: key,
        newValue: { ...newData },
        oldValue: this.customWidth[key] ? old : DELETE_FLAG,
      });
    }
  }
  getColWidth(col: number, sheetId?: string): CustomItem {
    const id = sheetId || this.model.getCurrentSheetId();
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
    const id = sheetId || this.model.getCurrentSheetId();
    const key = getCustomWidthOrHeightKey(id, col);

    const oldData = this.getColWidth(col, sheetId);
    if (oldData.len === width) {
      return;
    }

    const newData = { ...oldData };
    const old = this.customWidth[key];

    newData.len = width;
    this.customWidth[key] = newData;
    this.model.push({
      type: 'customWidth',
      key: key,
      newValue: newData,
      oldValue: old ? old : DELETE_FLAG,
    });
  }
  deleteAll(sheetId?: string): void {
    const id = sheetId || this.model.getCurrentSheetId();
    for (const [key, value] of Object.entries(this.customWidth)) {
      if (key.startsWith(id)) {
        delete this.customWidth[key];
        this.model.push({
          type: 'customWidth',
          key: key,
          newValue: DELETE_FLAG,
          oldValue: value,
        });
      }
    }
  }
}
