import type {
  ModelJSON,
  ICol,
  IModel,
  CustomItem,
} from '../types';
import {
  CELL_WIDTH,
  widthOrHeightKeyToData,
} from '../util';

export class ColManager implements ICol {
  private model: IModel;
  constructor(model: IModel) {
    this.model = model;
  }
  private get customWidth() {
    return this.model.getRoot().get('customWidth');
  }
  private getModel() {
    return this.customWidth!;
  }
  fromJSON(json: ModelJSON): void {
    const data = json.customWidth || {};
    const customWidth = this.customWidth;
    customWidth.clear();
    for (const [key, value] of Object.entries(data)) {
      const { sheetId, rowOrCol: col } = widthOrHeightKeyToData(key);
      if (!sheetId || col < 0) {
        continue;
      }
      const sheetInfo = this.model.getSheetInfo(sheetId);
      if (!sheetInfo || !Number.isInteger(col)) {
        continue;
      }
      if (typeof value.isHide === 'boolean' && typeof value.len === 'number') {
        customWidth.set(this.model.getRoot().sizeKey(sheetId, 'cols', col)!, value);
      }
    }
  }

  hideCol(colIndex: number, count: number): void {
    this.toggleHideCol(colIndex, count, true);
  }
  private toggleHideCol(colIndex: number, count: number, isHide: boolean) {
    const id = this.model.getCurrentSheetId();
    for (let i = 0; i < count; i++) {
      const c = colIndex + i;
      const key = this.model.getRoot().sizeKey(id, 'cols', c);
      if (key === undefined) throw new RangeError('Column is outside the worksheet');
      const oldData = this.getCol(c, id);
      if (oldData.isHide === isHide) {
        continue;
      }
      const newData = { ...oldData, isHide };
      this.getModel().set(key, newData);
    }
  }
  unhideCol(colIndex: number, count: number): void {
    this.toggleHideCol(colIndex, count, false);
  }
  getCol(col: number, sheetId?: string): CustomItem {
    const id = sheetId || this.model.getCurrentSheetId();
    const key = this.model.getRoot().sizeKey(id, 'cols', col);
    const temp = key === undefined ? undefined
      : this.customWidth.get(key) ?? this.customWidth.get(`${id}_overflow:${col}`);
    if (!temp) {
      return {
        len: CELL_WIDTH,
        isHide: false,
      };
    }
    return { ...temp };
  }
  setColWidth(col: number, width: number, sheetId?: string): void {
    const id = sheetId || this.model.getCurrentSheetId();
    const key = this.model.getRoot().sizeKey(id, 'cols', col);
    if (key === undefined) throw new RangeError('Column is outside the worksheet');

    const oldData = this.getCol(col, sheetId);
    if (oldData.len === width) {
      return;
    }

    const newData = { ...oldData, len: width };
    this.getModel().set(key, newData);
  }
  deleteAll(sheetId?: string): void {
    if (!this.customWidth) {
      return;
    }
    const id = sheetId || this.model.getCurrentSheetId();
    for (const key of this.customWidth.keys()) {
      const { sheetId } = widthOrHeightKeyToData(key);
      if (sheetId === id) {
        this.customWidth.delete(key);
      }
    }
  }
}
