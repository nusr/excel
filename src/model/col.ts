import { ModelJSON, ICol, IModel, CustomItem, YjsModelJson } from '@/types';
import {
  getCustomWidthOrHeightKey,
  CELL_WIDTH,
  widthOrHeightKeyToData,
} from '@/util';
import * as Y from 'yjs';

export class ColManager implements ICol {
  private model: IModel;
  constructor(model: IModel) {
    this.model = model;
  }
  private get customWidth() {
    return this.model.getRoot().get('customWidth');
  }
  private getModel() {
    const t = this.customWidth;
    if (!t) {
      this.model.getRoot().set('customWidth', new Y.Map() as YjsModelJson['customWidth']);
    }
    return this.customWidth!;
  }
  fromJSON(json: ModelJSON): void {
    const data = json.customWidth || {};
    const customWidth = new Y.Map() as YjsModelJson['customWidth'];
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
        customWidth.set(key, value);
      }
    }
    this.model.getRoot().set('customWidth', customWidth);
  }

  hideCol(colIndex: number, count: number): void {
    this.toggleHideCol(colIndex, count, true);
  }
  private toggleHideCol(colIndex: number, count: number, isHide: boolean) {
    const id = this.model.getCurrentSheetId();
    for (let i = 0; i < count; i++) {
      const c = colIndex + i;
      const key = getCustomWidthOrHeightKey(id, c);
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
    const key = getCustomWidthOrHeightKey(id, col);
    const temp = this.customWidth?.get(key);
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
    const key = getCustomWidthOrHeightKey(id, col);

    const oldData = this.getCol(col, sheetId);
    if (oldData.len === width) {
      return;
    }

    const newData = { ...oldData, len: width };
    this.getModel().set(key, newData);
  }
  deleteAll(sheetId?: string): void {
    if (!this.customWidth) {
      return
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
