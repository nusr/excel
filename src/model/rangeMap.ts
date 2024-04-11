import { WorkBookJSON, ICommandItem, IRangeMap, IRange, IModel } from '@/types';
import { isSameRange } from '@/util';
import { DELETE_FLAG, transformData } from './History';

export class RangeMap implements IRangeMap {
  private rangeMap: WorkBookJSON['rangeMap'] = {};
  private model: IModel;
  constructor(model: IModel) {
    this.model = model;
  }
  validateRange(range: IRange) {
    range.sheetId = range.sheetId || this.model.getCurrentSheetId();
    const sheetInfo = this.model.getSheetInfo(range.sheetId);
    if (!sheetInfo) {
      return false;
    }
    if (
      range.row < 0 ||
      range.col < 0 ||
      range.row >= sheetInfo.rowCount ||
      range.col >= sheetInfo.colCount
    ) {
      return false;
    }
    return true;
  }
  toJSON() {
    return {
      rangeMap: this.rangeMap,
    };
  }
  fromJSON(json: WorkBookJSON): void {
    const data = json.rangeMap || {};
    const oldValue = { ...this.rangeMap };
    this.rangeMap = { ...data };
    for (const range of Object.values(data)) {
      range.sheetId = range.sheetId || this.model.getCurrentSheetId();
      if (!this.model.validateRange(range)) {
        continue;
      }
      this.rangeMap[range.sheetId] = range;
    }
    this.model.push({
      type: 'rangeMap',
      key: '',
      newValue: this.rangeMap,
      oldValue,
    });
  }
  undo(item: ICommandItem): void {
    if (item.type === 'rangeMap') {
      transformData(this, item, 'undo');
    }
  }
  redo(item: ICommandItem): void {
    if (item.type === 'rangeMap') {
      transformData(this, item, 'redo');
    }
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
    if (!this.model.validateRange(newRange)) {
      return;
    }
    const oldValue = this.rangeMap[newRange.sheetId]
      ? { ...this.rangeMap[newRange.sheetId] }
      : undefined;
    if (oldValue && isSameRange(oldValue, newRange)) {
      return;
    }
    this.rangeMap[newRange.sheetId] = newRange;
    this.model.push({
      type: 'rangeMap',
      key: newRange.sheetId,
      newValue: newRange,
      oldValue: oldValue ? oldValue : DELETE_FLAG,
    });
  }
  deleteAll(): void {}
}
