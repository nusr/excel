import {
  WorkBookJSON,
  ICommandItem,
  IModel,
  AutoFilterItem,
  IFilter,
  IRange,
} from '@/types';
import { DELETE_FLAG, transformData } from './History';
import { MERGE_CELL_LINE_BREAK } from '@/util';

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
    for (const [key, value] of Object.entries(data)) {
      value.range.sheetId = key;
      if (!this.model.validateRange(value.range)) {
        continue;
      }
      this.autoFilter[key] = value;
    }
    this.model.push({
      type: 'autoFilter',
      key: '',
      newValue: { ...this.autoFilter },
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
    if (!this.model.validateRange(range)) {
      return;
    }
    if (range.rowCount === 1 && range.colCount === 1) {
      return;
    }
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
    if (typeof value.col === 'number' && value.value) {
      this.applyFilter(item.range, value as Required<AutoFilterItem>);
      return;
    }
    if (typeof value.col === 'undefined' && !value.value) {
      this.clearFilter(item.range);
    }
  }
  private clearFilter(range: IRange) {
    const sheetInfo = this.model.getSheetInfo(range.sheetId);
    if (!sheetInfo) {
      return;
    }
    let r = range.row + 1;
    let end =
      range.rowCount === 0 ? sheetInfo.rowCount : range.row + range.rowCount;
    for (; r < end; r++) {
      this.model.unhideRow(r, 1);
    }
  }
  private applyFilter(range: IRange, autoFilter: Required<AutoFilterItem>) {
    const sheetInfo = this.model.getSheetInfo(range.sheetId);
    if (!sheetInfo) {
      return;
    }
    const { col, value } = autoFilter;
    if (value?.type === 'normal') {
      const set = new Set(value.value);
      let r = range.row + 1;
      let end =
        range.rowCount === 0 ? sheetInfo.rowCount : range.row + range.rowCount;
      for (; r < end; r++) {
        const cell = this.model.getCell(
          {
            row: r,
            col,
            rowCount: 1,
            colCount: 1,
            sheetId: range.sheetId,
          },
          true,
        );
        const v = cell ? cell.value : MERGE_CELL_LINE_BREAK;
        if (!set.has(v)) {
          this.model.hideRow(r, 1);
        } else {
          this.model.unhideRow(r, 1);
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
