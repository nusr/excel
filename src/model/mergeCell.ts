import {
  WorkBookJSON,
  ICommandItem,
  IRange,
  IMergeCell,
  IModel,
} from '@/types';
import { convertToReference, assert } from '@/util';
import { DELETE_FLAG, transformData } from './History';
import { $ } from '@/i18n';

export class MergeCell implements IMergeCell {
  private mergeCells: WorkBookJSON['mergeCells'] = {};
  private model: IModel;
  constructor(model: IModel) {
    this.model = model;
  }
  toJSON() {
    return {
      mergeCells: this.mergeCells,
    };
  }
  fromJSON(json: WorkBookJSON): void {
    this.mergeCells = { ...(json.mergeCells || {}) };
  }
  undo(item: ICommandItem): void {
    if (item.type === 'mergeCells') {
      transformData(this, item, 'undo');
    }
  }
  redo(item: ICommandItem): void {
    if (item.type === 'mergeCells') {
      transformData(this, item, 'redo');
    }
  }
  getMergeCells(sheetId?: string): IRange[] {
    const id = sheetId || this.model.getCurrentSheetId();
    return Object.values(this.mergeCells).filter((v) => v.sheetId === id);
  }
  addMergeCell(range: IRange): void {
    if (range.colCount > 1 || range.rowCount > 1) {
      range.sheetId = range.sheetId || this.model.getCurrentSheetId();
      const ref = convertToReference(
        range,
        'absolute',
        this.convertSheetIdToName,
      );
      assert(!this.mergeCells[ref], $('merging-cell-is-duplicate'));
      this.mergeCells[ref] = range;
      this.model.push({
        type: 'mergeCells',
        key: ref,
        newValue: range,
        oldValue: DELETE_FLAG,
      });
    }
  }
  deleteMergeCell(range: IRange): void {
    range.sheetId = range.sheetId || this.model.getCurrentSheetId();
    const ref = convertToReference(
      range,
      'absolute',
      this.convertSheetIdToName,
    );
    if (!this.mergeCells[ref]) {
      return;
    }
    const oldRange = this.mergeCells[ref];
    delete this.mergeCells[ref];

    this.model.push({
      type: 'mergeCells',
      key: ref,
      newValue: DELETE_FLAG,
      oldValue: oldRange,
    });
  }
  deleteAll(sheetId?: string): void {
    const id = sheetId || this.model.getCurrentSheetId();
    for (const [key, value] of Object.entries(this.mergeCells)) {
      if (value.sheetId === id) {
        delete this.mergeCells[key];
        this.model.push({
          type: 'mergeCells',
          key: key,
          newValue: DELETE_FLAG,
          oldValue: value,
        });
      }
    }
  }
  private convertSheetIdToName = (sheetId: string) => {
    const data = this.model.getSheetInfo(sheetId);
    return data?.name || '';
  };
}
