import type {
  ModelJSON,
  IRange,
  IMergeCell,
  IModel,
} from '../types';
import { toIRange } from '../util';
import { mergeCellKey } from '../protocol';
import i18n from '../i18n';

export class MergeCell implements IMergeCell {
  private readonly model: IModel;

  constructor(model: IModel) {
    this.model = model;
  }

  private get mergeCells() {
    return this.model.getRoot().get('mergeCells');
  }
  fromJSON(json: ModelJSON): void {
    const data = json.mergeCells || {};
    const mergeCells = this.mergeCells;
    mergeCells.clear();
    for (const range of Object.values(data)) {
      range.sheetId = range.sheetId || this.model.getCurrentSheetId();
      if (!this.model.validateRange(range)) {
        continue;
      }
      const key = this.key(range);
      mergeCells.set(key, toIRange(range));
      this.model.getRoot().bindRange(`merge:${key}`, range);
    }
  }

  getMergeCellList(sheetId?: string) {
    if (!this.mergeCells) {
      return [];
    }
    const id = sheetId || this.model.getCurrentSheetId();
    return Array.from(this.mergeCells).map(([key, range]) =>
      this.model.getRoot().range(`merge:${key}`, range))
      .filter((range): range is IRange => !!range && range.sheetId === id);
  }
  addMergeCell(range: IRange) {
    const ref = this.key(range);
    if (this.getMergeCellList(range.sheetId).some((value) => mergeCellKey(value) === mergeCellKey(range))) {
      this.model.emit('toastMessage', {
        type: 'error',
        message: i18n.t('merging-cell-is-duplicate'),
      });
      return false;
    }
    this.mergeCells!.set(ref, toIRange(range));
    this.model.getRoot().bindRange(`merge:${ref}`, range);
    return true;
  }
  private key(range: IRange) {
    const anchor = this.model.getRoot().anchorRange(range);
    return anchor ? JSON.stringify([
      range.sheetId, anchor.rows.first, anchor.rows.last, anchor.rows.full,
      anchor.cols.first, anchor.cols.last, anchor.cols.full,
    ]) : mergeCellKey(range);
  }
  deleteMergeCell(range: IRange): void {
    range.sheetId = range.sheetId || this.model.getCurrentSheetId();
    const ref = mergeCellKey(range);
    for (const [key, value] of this.mergeCells) {
      const projected = this.model.getRoot().range(`merge:${key}`, value);
      if (projected && mergeCellKey(projected) === ref) {
        this.mergeCells.delete(key);
        this.model.getRoot().anchors.delete(`merge:${key}`);
      }
    }
  }
  deleteAll(sheetId?: string): void {
    if (!this.mergeCells) {
      return;
    }
    const id = sheetId || this.model.getCurrentSheetId();
    for (const [key, value] of this.mergeCells.entries()) {
      if (value.sheetId === id) {
        this.mergeCells.delete(key);
      }
    }
  }
}
