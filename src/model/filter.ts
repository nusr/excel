import {
  WorkBookJSON,
  ICommandItem,
  IModel,
  AutoFilterItem,
  IFilter,
  IRange,
} from '@/types';
import { DELETE_FLAG, transformData } from './History';
import { MERGE_CELL_LINE_BREAK, HIDE_CELL } from '@/util';

export class FilterManger implements IFilter {
  private model: IModel;
  private autoFilter: WorkBookJSON['autoFilter'] = {};
  constructor(model: IModel) {
    this.model = model;
  }
  toJSON() {
    return {
      autoFilter: { ...this.autoFilter },
    };
  }
  fromJSON(json: WorkBookJSON): void {
    const data = json.autoFilter || {};
    const oldValue = { ...this.autoFilter };
    this.autoFilter = { ...data };
    this.model.push({
      type: 'autoFilter',
      key: '',
      newValue: { ...data },
      oldValue,
    });
  }
  undo(item: ICommandItem): void {
    if (item.type === 'autoFilter') {
      transformData(this, item, 'undo');
    }
  }
  redo(item: ICommandItem): void {
    if (item.type === 'autoFilter') {
      transformData(this, item, 'redo');
    }
  }

  deleteAll(sheetId?: string): void {
    const id = sheetId || this.model.getCurrentSheetId();
    const oldValue = this.autoFilter[id]
      ? { ...this.autoFilter[id] }
      : undefined;
    delete this.autoFilter[id];
    this.model.push({
      type: 'autoFilter',
      key: id,
      newValue: DELETE_FLAG,
      oldValue,
    });
  }
  addFilter(range: IRange): void {
    range.sheetId = range.sheetId || this.model.getCurrentSheetId();
    const newValue: AutoFilterItem = {
      range,
    };
    this.autoFilter[range.sheetId] = newValue;

    this.model.push({
      type: 'autoFilter',
      key: range.sheetId,
      newValue: { ...newValue },
      oldValue: DELETE_FLAG,
    });
  }
  deleteFilter(sheetId?: string): void {
    this.deleteAll(sheetId);
  }
  updateFilter(sheetId: string, value: Partial<AutoFilterItem>): void {
    /* jscpd:ignore-start */
    const id = sheetId || this.model.getCurrentSheetId();
    const keyList = Object.keys(value) as Array<keyof AutoFilterItem>;
    const item = this.autoFilter[id];
    for (const key of keyList) {
      if (item[key] !== value[key]) {
        const oldValue =
          typeof item[key] === 'object' && item[key]
            ? // @ts-ignore
              { ...item[key] }
            : item[key];
        // @ts-ignore
        item[key] = value[key];
        this.model.push({
          type: 'autoFilter',
          key: `${id}.${key}`,
          newValue: item[key],
          oldValue: oldValue,
        });
      }
    }
    /* jscpd:ignore-end */
    if (typeof value.col === 'undefined' || !value.value) {
      return;
    }
    const sheetInfo = this.model.getSheetInfo(item.range.sheetId);
    if (!sheetInfo) {
      return;
    }
    const { range } = item;
    if (value.value.type === 'normal') {
      const set = new Set(value.value.value);
      for (
        let r = range.row,
          end =
            range.rowCount === 0
              ? sheetInfo.rowCount
              : range.row + range.rowCount;
        r < end;
        r++
      ) {
        const cell = this.model.getCell({
          row: r,
          col: value.col,
          rowCount: 1,
          colCount: 1,
          sheetId: range.sheetId,
        });
        const v = cell ? cell.value : MERGE_CELL_LINE_BREAK;
        if (!set.has(v)) {
          this.model.setRowHeight(r, HIDE_CELL, range.sheetId);
        }
      }
    }
  }
  getFilter(sheetId?: string) {
    const id = sheetId || this.model.getCurrentSheetId();
    const data = this.autoFilter[id];
    return data ? { ...data } : undefined;
  }
}
