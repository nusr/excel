import type { ModelJSON, IRow, CustomItem, IModel, YjsModelJson } from '../types';
import {
  getCustomWidthOrHeightKey,
  CELL_HEIGHT,
  widthOrHeightKeyToData,
} from '../util';
import * as Y from 'yjs';

export class RowManager implements IRow {
  private model: IModel;

  constructor(model: IModel) {
    this.model = model;
  }
  private get customHeight() {
    return this.model.getRoot().get('customHeight');
  }
  private getModel() {
    const t = this.customHeight;
    if (!t) {
      this.model
        .getRoot()
        .set('customHeight', new Y.Map() as YjsModelJson['customHeight']);
    }
    return this.customHeight!;
  }
  fromJSON(json: ModelJSON): void {
    const data = json.customHeight || {};
    const customHeight = new Y.Map() as YjsModelJson['customWidth'];
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
        customHeight.set(key, value);
      }
    }
    this.model.getRoot().set('customHeight',customHeight);
  }
  hideRow(rowIndex: number, count: number): void {
    this.toggleHideRow(rowIndex, count, true);
  }
  private toggleHideRow(rowIndex: number, count: number, isHide: boolean) {
    const sheetId = this.model.getCurrentSheetId();
    for (let i = 0; i < count; i++) {
      const r = rowIndex + i;
      const key = getCustomWidthOrHeightKey(sheetId, r);
      const old = this.getRow(r);

      if (old.isHide === isHide) {
        continue;
      }
      const newData = { ...old, isHide };

      this.getModel().set(key, newData);
    }
  }
  unhideRow(rowIndex: number, count: number): void {
    this.toggleHideRow(rowIndex, count, false);
  }
  getRow(row: number, sheetId?: string): CustomItem {
    const id = sheetId || this.model.getCurrentSheetId();
    const key = getCustomWidthOrHeightKey(id, row);
    const temp = this.customHeight?.get(key);
    if (!temp) {
      return {
        len: CELL_HEIGHT,
        isHide: false,
      };
    }
    return { ...temp };
  }
  /* jscpd:ignore-start */
  setRowHeight(row: number, height: number, sheetId?: string): void {
    const id = sheetId || this.model.getCurrentSheetId();
    const key = getCustomWidthOrHeightKey(id, row);

    const oldData = this.getRow(row, sheetId);
    if (oldData.len === height) {
      return;
    }

    const newData = { ...oldData };
    newData.len = height;
    this.getModel().set(key, newData);
  }
  deleteAll(sheetId?: string): void {
    if (!this.customHeight) {
      return
    }
    const id = sheetId || this.model.getCurrentSheetId();
    for (const key of this.customHeight.keys()) {
      const { sheetId } = widthOrHeightKeyToData(key);
      if (sheetId === id) {
        this.customHeight.delete(key);
      }
    }
  }
  /* jscpd:ignore-end */
}
