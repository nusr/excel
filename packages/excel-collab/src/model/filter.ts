import type {
  ModelJSON,
  IModel,
  AutoFilterItem,
  IFilter,
  IRange,
  TypedMap,
  FilterValue,
} from '../types';
import { getFilterCriteria, matchesFilter, toIRange } from '../util';
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
    const autoFilter = this.autoFilter;
    autoFilter.clear();
    for (const [key, value] of Object.entries(data)) {
      value.range.sheetId = key;
      if (!this.model.validateRange(value.range)) {
        continue;
      }
      const temp = new Map(Object.entries(value)) as TypedMap<AutoFilterItem>;
      temp.set(
        'filters',
        this.createCriteria(key, getFilterCriteria(value)) as unknown as Record<
          string,
          FilterValue
        >,
      );

      autoFilter.set(key, temp);
      this.model.getRoot().bindRange(`filter:${key}`, value.range);
      if (value.col !== undefined) this.model.getRoot().bindFilterColumn(key, value.col);
      this.model.getRoot().bindFilterColumns(key, getFilterCriteria(value));
    }
  }

  deleteAll(sheetId?: string): void {
    const id = sheetId || this.model.getCurrentSheetId();
    this.autoFilter?.delete(id);
  }
  addFilter(range: IRange): void {
    range = {
      ...range,
      sheetId: range.sheetId || this.model.getCurrentSheetId(),
      row: range.rowCount === 0 ? 0 : range.row,
      col: range.colCount === 0 ? 0 : range.col,
    };
    if (!this.model.validateRange(range)) {
      return;
    }
    if (range.rowCount === 1 && range.colCount === 1) {
      return;
    }
    const newValue: AutoFilterItem = {
      range: toIRange(range),
    };
    const temp = new Map(Object.entries(newValue)) as TypedMap<AutoFilterItem>;
    temp.set('filters', new Map<FilterValue>() as unknown as Record<string, FilterValue>);
    this.autoFilter!.set(range.sheetId, temp);
    this.model.getRoot().bindRange(`filter:${range.sheetId}`, range);
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
    const current = this.getFilter(id);
    const range = value.range ? { ...value.range, sheetId: id } : current?.range;
    if (!range || !this.model.validateRange(range)) return;
    const filters =
      item.get('filters') instanceof Map
        ? (item.get('filters') as unknown as Map<FilterValue>)
        : this.createCriteria(id, getFilterCriteria(current));
    const columns = this.model.getRoot().get('workbook').get(id)?.get('cols');
    if ('col' in value && value.col !== undefined) {
      const info = this.model.getSheetInfo(id);
      if (
        !Number.isInteger(value.col) ||
        value.col < range.col ||
        value.col >= (range.colCount ? range.col + range.colCount : info?.colCount || 0)
      )
        return;
      const columnId = columns?.get(value.col);
      if (columnId === undefined) return;
      if (value.value) filters.set(columnId, value.value);
      else filters.delete(columnId);
    } else if ('value' in value && value.value === undefined && 'col' in value) {
      filters.clear();
    }
    if (value.filters) {
      filters.clear();
      for (const [column, criterion] of Object.entries(value.filters)) {
        const columnId = columns?.get(Number(column));
        if (columnId !== undefined) filters.set(columnId, criterion);
      }
    }
    if (!(item.get('filters') instanceof Map)) {
      item.set('filters', filters as unknown as Record<string, FilterValue>);
    }
    if (value.range) this.model.getRoot().bindRange(`filter:${id}`, value.range);
    if (value.col !== undefined) this.model.getRoot().bindFilterColumn(id, value.col);
    for (const key of keyList) {
      if (key === 'filters') continue;
      if (item.get(key) !== value[key]) {
        item.set(key, value[key]);
      }
    }
    /* jscpd:ignore-end */
  }
  private createCriteria(sheetId: string, filters: Record<string, FilterValue>): Map<FilterValue> {
    const result = new Map<FilterValue>();
    const columns = this.model.getRoot().get('workbook').get(sheetId)?.get('cols');
    for (const [column, criterion] of Object.entries(filters)) {
      const columnId = columns?.get(Number(column));
      if (columnId !== undefined) result.set(columnId, criterion);
    }
    return result;
  }
  isRowFiltered(row: number, sheetId: string): boolean {
    const filter = this.getFilter(sheetId);
    if (!filter) return false;
    const { range } = filter;
    if (row <= range.row || (range.rowCount > 0 && row >= range.row + range.rowCount)) return false;
    return Object.entries(getFilterCriteria(filter)).some(([column, value]) => {
      const col = Number(column);
      const cell = this.model.getCell({ row, col, rowCount: 1, colCount: 1, sheetId });
      return !matchesFilter(cell, value);
    });
  }
  getFilter(sheetId?: string) {
    const id = sheetId || this.model.getCurrentSheetId();
    return this.model.getRoot().filter(id);
  }
}
