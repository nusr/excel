import type { ModelJSON, IRangeMap, IRange, IModel } from '../types';

export class RangeMap implements IRangeMap {
  private model: IModel;
  private rangeMap: ModelJSON['rangeMap'] = {};
  constructor(model: IModel) {
    this.model = model;
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
    const rangeMap: ModelJSON['rangeMap'] = {};
    for (const range of Object.values(data)) {
      range.sheetId = range.sheetId || this.model.getCurrentSheetId();
      if (!this.model.validateRange(range)) {
        continue;
      }
      rangeMap[range.sheetId] = { ...range };
    }
    this.rangeMap = rangeMap;
  }
  toJSON() {
    return {...this.rangeMap}
  }
  getActiveRange() {
    const id = this.model.getCurrentSheetId();

    const range = this.rangeMap[id];
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
    this.rangeMap[newRange.sheetId] = { ...newRange };
  }
  deleteAll(sheetId?: string): void {
    delete this.rangeMap[sheetId || this.model.getCurrentSheetId()];
  }
}
