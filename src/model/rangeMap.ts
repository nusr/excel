import { ModelJSON, IRangeMap, IRange, IModel, YjsModelJson } from '@/types';
import { isSameRange, toIRange } from '@/util';
import * as Y from 'yjs';

export class RangeMap implements IRangeMap {
  private model: IModel;
  constructor(model: IModel) {
    this.model = model;
  }
  private get rangeMap() {
    return this.model.getRoot().get('rangeMap');
  }
  validateRange(range: IRange) {
    if (!range) {
      return false;
    }
    range.sheetId = range.sheetId || this.model.getCurrentSheetId();
    const sheetInfo = this.model.getSheetInfo(range.sheetId);
    if (!sheetInfo) {
      return false;
    }
    if (
      range.row < 0 ||
      range.col < 0 ||
      range.colCount < 0 ||
      range.rowCount < 0 ||
      range.row >= sheetInfo.rowCount ||
      range.col >= sheetInfo.colCount ||
      range.colCount > sheetInfo.colCount ||
      range.rowCount > sheetInfo.rowCount ||
      range.row + range.rowCount > sheetInfo.rowCount ||
      range.col + range.colCount > sheetInfo.colCount
    ) {
      return false;
    }
    return true;
  }
  fromJSON(json: ModelJSON): void {
    const data = json.rangeMap || {};
    const rangeMap = new Y.Map() as YjsModelJson['rangeMap'];
    for (const range of Object.values(data)) {
      range.sheetId = range.sheetId || this.model.getCurrentSheetId();
      if (!this.model.validateRange(range)) {
        continue;
      }
      rangeMap.set(range.sheetId, range);
    }
    this.model.getRoot().set('rangeMap', rangeMap);
  }
  getActiveRange() {
    const id = this.model.getCurrentSheetId();

    const range = this.rangeMap?.get(id);
    if (range) {
      range.sheetId = range.sheetId || id;
      return {
        range: { ...range },
        isMerged: false,
      };
    }
    return {
      range: {
        row: 0,
        col: 0,
        rowCount: 1,
        colCount: 1,
        sheetId: id,
      },
      isMerged: false,
    };
  }
  setActiveRange(newRange: IRange): void {
    newRange.sheetId = newRange.sheetId || this.model.getCurrentSheetId();
    if (!this.validateRange(newRange)) {
      return;
    }
    let rangeMap = this.rangeMap;
    if (!rangeMap) {
      rangeMap = new Y.Map() as YjsModelJson['rangeMap'];
      this.model.getRoot().set('rangeMap', rangeMap);
    }
    const oldValue = rangeMap.get(newRange.sheetId);
    if (oldValue && isSameRange(oldValue, newRange)) {
      return;
    }
    rangeMap.set(newRange.sheetId, toIRange(newRange));
  }
  deleteAll(sheetId?: string): void {
    this.rangeMap?.delete(sheetId || this.model.getCurrentSheetId());
  }
}
