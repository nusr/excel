import { WorkBookJSON, ICommandItem, IRow, CustomItem, IModel } from '@/types';
import {
  coordinateToString,
  stringToCoordinate,
  getCustomWidthOrHeightKey,
  CELL_HEIGHT,
  HIDE_CELL,
} from '@/util';
import { DELETE_FLAG, transformData } from './History';

export class RowManager implements IRow {
  private customHeight: WorkBookJSON['customHeight'] = {};
  private model: IModel;
  constructor(model: IModel) {
    this.model = model;
  }
  toJSON() {
    return {
      customHeight: this.customHeight,
    };
  }
  fromJSON(json: WorkBookJSON): void {
    this.customHeight = { ...(json.customHeight || {}) };
  }
  undo(item: ICommandItem): void {
    if (item.type === 'customHeight') {
      transformData(this, item, 'undo')
    }
  }
  redo(item: ICommandItem): void {
    if (item.type === 'customHeight') {
      transformData(this, item, 'redo')
    }
  }
  addRow(rowIndex: number, count: number): void {
    const id = this.model.getCurrentSheetId();
    const sheetData = this.model.getWorksheet();
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

      const newValue = sheetData[key] ? { ...sheetData[key] } : {};
      const oldData = sheetData[newKey] ? { ...sheetData[newKey] } : {};
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
    const sheetData = this.model.getWorksheet();
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
  hideRow(rowIndex: number, count: number): void {
    for (let i = 0; i < count; i++) {
      const r = rowIndex + i;
      const key = getCustomWidthOrHeightKey(this.model.getCurrentSheetId(), r);
      const old = this.getRowHeight(r);

      if (old.isHide) {
        continue;
      }
      const newData = { ...old, isHide: true };

      this.customHeight[key] = newData;
      this.model.push({
        type: 'customHeight',
        key: key,
        newValue: newData,
        oldValue: this.customHeight[key] ? old : DELETE_FLAG,
      });
    }
  }
  getRowHeight(row: number, sheetId?: string): CustomItem {
    const id = sheetId || this.model.getCurrentSheetId();
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
    const id = sheetId || this.model.getCurrentSheetId();
    const key = getCustomWidthOrHeightKey(id, row);

    const oldData = this.getRowHeight(row, sheetId);
    if (oldData.len === height) {
      return;
    }

    const newData = { ...oldData };
    const old = this.customHeight[key];
    newData.len = height;
    this.customHeight[key] = newData;
    this.model.push({
      type: 'customHeight',
      key: key,
      newValue: newData,
      oldValue: old ? old : DELETE_FLAG,
    });
  }
  deleteAll(sheetId?: string): void {
    const id = sheetId || this.model.getCurrentSheetId();
    for (const [key, value] of Object.entries(this.customHeight)) {
      if (key.startsWith(id)) {
        delete this.customHeight[key];
        this.model.push({
          type: 'customHeight',
          key: key,
          newValue: DELETE_FLAG,
          oldValue: value,
        });
      }
    }
  }
}
