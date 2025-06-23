import type {
  ModelJSON,
  IModel,
  AutoFilterItem,
  IFilter,
  IRange,
  YjsModelJson,
  TypedMap,
} from '../types';
import { MERGE_CELL_LINE_BREAK, toIRange } from '../util';
import { Map } from 'yjs';

export class FilterManger implements IFilter {
  private model: IModel;

  constructor(model: IModel) {
    this.model = model;
  }
  private get autoFilter() {
    return this.model.getRoot().get('autoFilter');
  }
  fromJSON(json: ModelJSON): void {
    const data = json.autoFilter || {};
    const autoFilter = new Map() as YjsModelJson['autoFilter'];
    for (const [key, value] of Object.entries(data)) {
      value.range.sheetId = key;
      if (!this.model.validateRange(value.range)) {
        continue;
      }
      const temp = new Map(Object.entries(value)) as TypedMap<AutoFilterItem>;

      autoFilter.set(key, temp);
    }

    this.model.getRoot().set('autoFilter', autoFilter);
  }

  deleteAll(sheetId?: string): void {
    const id = sheetId || this.model.getCurrentSheetId();
    this.autoFilter?.delete(id);
  }
  addFilter(range: IRange): void {
    range.sheetId = range.sheetId || this.model.getCurrentSheetId();
    if (!this.model.validateRange(range)) {
      return;
    }
    if (range.rowCount === 1 && range.colCount === 1) {
      return;
    }
    if (!this.autoFilter) {
      this.model
        .getRoot()
        .set('autoFilter', new Map() as YjsModelJson['autoFilter']);
    }
    const newValue: AutoFilterItem = {
      range: toIRange(range),
    };
    const temp = new Map(Object.entries(newValue)) as TypedMap<AutoFilterItem>;
    this.autoFilter!.set(range.sheetId, temp);
  }
  deleteFilter(sheetId?: string): void {
    this.deleteAll(sheetId);
  }
  updateFilter(sheetId: string, value: Partial<AutoFilterItem>): void {
    /* jscpd:ignore-start */
    const id = sheetId || this.model.getCurrentSheetId();
    const keyList = Object.keys(value) as Array<keyof AutoFilterItem>;
    const item = this.autoFilter?.get(id);
    if (!item) {
      return;
    }
    for (const key of keyList) {
      if (item.get(key) !== value[key]) {
        item.set(key, value[key]);
      }
    }
    const range = item.get('range');
    /* jscpd:ignore-end */
    if (range && typeof value.col === 'number' && value.value) {
      this.applyFilter(range, value as Required<AutoFilterItem>);
      return;
    }
    if (range && typeof value.col === 'undefined' && !value.value) {
      this.clearFilter(range);
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
        const cell = this.model.getCell({
          row: r,
          col,
          rowCount: 1,
          colCount: 1,
          sheetId: range.sheetId,
        });
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
    const data = this.autoFilter?.get(id);
    if (data) {
      return data.toJSON();
    }
    return undefined;
  }
}
