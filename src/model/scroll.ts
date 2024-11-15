import {
  ModelJSON,
  IScroll,
  IModel,
  YjsModelJson,
  ModelScroll,
  TypedMap,
} from '@/types';
import * as Y from 'yjs';

export class ScrollManager implements IScroll {
  private model: IModel;
  constructor(model: IModel) {
    this.model = model;
  }
  private get scroll() {
    return this.model.getRoot().get('scroll');
  }
  fromJSON(json: ModelJSON): void {
    const data = json.scroll || {};
    const scroll = new Y.Map() as YjsModelJson['scroll'];
    for (const [sheetId, value] of Object.entries(data)) {
      if (!sheetId || value.row < 0 || value.col < 0) {
        continue;
      }
      scroll.set(
        sheetId,
        new Y.Map(Object.entries(value)) as TypedMap<ModelScroll>,
      );
    }
    this.model.getRoot().set('scroll', scroll);
  }
  deleteAll(sheetId?: string): void {
    this.scroll?.delete(sheetId || this.model.getCurrentSheetId());
  }
  getScroll(sheetId?: string): ModelScroll {
    const t = this.scroll?.get(sheetId || this.model.getCurrentSheetId());
    if (!t) {
      return { row: 0, col: 0 };
    }
    return t.toJSON();
  }
  setScroll(value: ModelScroll, sheetId?: string) {
    const id = sheetId || this.model.getCurrentSheetId();
    if (!this.scroll) {
      this.model.getRoot().set('scroll', new Y.Map() as YjsModelJson['scroll']);
    }
    const sheetInfo = this.model.getSheetInfo(id);
    if (!sheetInfo) {
      return false;
    }
    const maxRow = sheetInfo.rowCount - 1;
    const maxCol = sheetInfo.colCount - 1;
    if (value.row >= maxRow) {
      value.row = maxRow;
    } else if (value.row < 0) {
      value.row = 0;
    }
    if (value.col >= maxCol) {
      value.col = maxCol;
    } else if (value.col < 0) {
      value.col = 0;
    }
    const item = this.scroll?.get(id);
    if (!item) {
      this.scroll!.set(
        id,
        new Y.Map(Object.entries(value)) as TypedMap<ModelScroll>,
      );
      return false;
    }
    let check = false;
    if (item.get('row') !== value.row) {
      check = true;
      item.set('row', value.row);
    }
    if (item.get('col') !== value.col) {
      check = true;
      item.set('col', value.col);
    }
    return check;
  }
}
