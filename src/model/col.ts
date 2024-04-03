import { WorkBookJSON, ICommandItem, ICol, IModel, CustomItem } from '@/types';
import { getCustomWidthOrHeightKey, CELL_WIDTH, HIDE_CELL } from '@/util';
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
    const data = json.customWidth || {};
    const oldValue = { ...this.customWidth };
    this.customWidth = { ...data };
    this.model.push({
      type: 'customHeight',
      key: '',
      newValue: data,
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
