import { WorkBookJSON, ICommandItem, ICol, IModel, CustomItem } from '@/types';
import {
  getCustomWidthOrHeightKey,
  CELL_WIDTH,
  HIDE_CELL,
  widthOrHeightKeyToData,
} from '@/util';
import { DELETE_FLAG, transformData } from './History';

export class ColManager implements ICol {
  private model: IModel;
  private customWidth: WorkBookJSON['customWidth'] = {};
  constructor(model: IModel) {
    this.model = model;
  }
  toJSON() {
    return {
      customWidth: { ...this.customWidth },
    };
  }
  fromJSON(json: WorkBookJSON): void {
    const data = json.customWidth || {};
    const oldValue = { ...this.customWidth };
    this.customWidth = {};
    for (const [key, value] of Object.entries(data)) {
      const { sheetId, rowOrCol: col } = widthOrHeightKeyToData(key);
      if (!sheetId || col < 0) {
        continue;
      }
      const sheetInfo = this.model.getSheetInfo(sheetId);
      if (!sheetInfo || col >= sheetInfo.colCount) {
        continue;
      }
      if (typeof value.isHide === 'boolean' && typeof value.len === 'number') {
        this.customWidth[key] = value;
      }
    }
    this.model.push({
      type: 'customHeight',
      key: '',
      newValue: this.customWidth,
      oldValue,
    });
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
    return temp.isHide ? { isHide: true, len: HIDE_CELL } : { ...temp };
  }
  setColWidth(col: number, width: number, sheetId?: string): void {
    const id = sheetId || this.model.getCurrentSheetId();
    const key = getCustomWidthOrHeightKey(id, col);

    const oldData = this.getColWidth(col, sheetId);
    if (oldData.len === width) {
      return;
    }

    const newData = { ...oldData, len: width };
    const old = this.customWidth[key];
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
      const { sheetId } = widthOrHeightKeyToData(key);
      if (sheetId === id) {
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
