import { WorkBookJSON, ICommandItem, IRangeMap, IRange, IModel } from '@/types';
import { isSameRange } from '@/util';
import { DELETE_FLAG, transformData } from './History';

export class RangeMap implements IRangeMap {
  private rangeMap: WorkBookJSON['rangeMap'] = {};
  private model: IModel;
  constructor(model: IModel) {
    this.model = model;
  }
  toJSON() {
    return {
      rangeMap: this.rangeMap,
    };
  }
  fromJSON(json: WorkBookJSON): void {
    this.rangeMap = { ...(json.rangeMap || {}) };
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
  getActiveCell(): IRange {
    const id = this.model.getCurrentSheetId();
    const range = this.rangeMap[id];
    if (range) {
      return {
        ...range,
      };
    }
    return {
      row: 0,
      col: 0,
      rowCount: 1,
      colCount: 1,
      sheetId: id,
    };
  }
  setActiveCell(newRange: IRange): void {
    newRange.sheetId = newRange.sheetId || this.model.getCurrentSheetId();
    const sheet = this.model.getSheetInfo(newRange.sheetId);
    if (!sheet) {
      return;
    }
    const { row, col } = newRange;
    if (row < 0 || col < 0 || row >= sheet.rowCount || col >= sheet.colCount) {
      return;
    }
    const oldValue = this.rangeMap[newRange.sheetId];
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
