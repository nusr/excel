import { WorkBookJSON, ICommandItem, IRow, CustomItem, IModel } from '@/types';
import {
  getCustomWidthOrHeightKey,
  CELL_HEIGHT,
  HIDE_CELL,
  widthOrHeightKeyToData,
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
      customHeight: { ...this.customHeight },
    };
  }
  fromJSON(json: WorkBookJSON): void {
    const data = json.customHeight || {};
    const oldValue = { ...this.customHeight };
    this.customHeight = {};
    for (const [key, value] of Object.entries(data)) {
      const { sheetId, rowOrCol: row } = widthOrHeightKeyToData(key);
      if (!sheetId || row < 0) {
        continue;
      }
      const sheetInfo = this.model.getSheetInfo(sheetId);
      if (!sheetInfo || row >= sheetInfo.rowCount) {
        continue;
      }
      if (typeof value.isHide === 'boolean' && typeof value.len === 'number') {
        this.customHeight[key] = value;
      }
    }
    this.model.push({
      type: 'customHeight',
      key: '',
      newValue: this.customHeight,
      oldValue,
    });
  }
  undo(item: ICommandItem): void {
    if (item.type === 'customHeight') {
      transformData(this, item, 'undo');
    }
  }
  redo(item: ICommandItem): void {
    if (item.type === 'customHeight') {
      transformData(this, item, 'redo');
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
      const { sheetId } = widthOrHeightKeyToData(key);
      if (sheetId === id) {
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
