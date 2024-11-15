import { ModelJSON, IRange, IMergeCell, IModel, YjsModelJson } from '@/types';
import { convertToReference, toIRange } from '@/util';
import { $ } from '@/i18n';
import { toast } from '@/components';
import * as Y from 'yjs';

export class MergeCell implements IMergeCell {
  private model: IModel;

  constructor(model: IModel) {
    this.model = model;
  }

  private get mergeCells() {
    return this.model.getRoot().get('mergeCells');
  }
  fromJSON(json: ModelJSON): void {
    const data = json.mergeCells || {};
    const mergeCells = new Y.Map() as YjsModelJson['mergeCells'];
    for (const range of Object.values(data)) {
      range.sheetId = range.sheetId || this.model.getCurrentSheetId();
      if (!this.model.validateRange(range)) {
        continue;
      }
      const ref = convertToReference(
        range,
        'absolute',
        this.convertSheetIdToName,
      );
      mergeCells.set(ref, toIRange(range));
    }
    this.model.getRoot().set('mergeCells', mergeCells);
  }

  getMergeCellList(sheetId?: string) {
    if (!this.mergeCells) {
      return [];
    }
    const id = sheetId || this.model.getCurrentSheetId();
    return Array.from(this.mergeCells.values()).filter((v) => v.sheetId === id);
  }
  addMergeCell(range: IRange) {
    const ref = convertToReference(
      range,
      'absolute',
      this.convertSheetIdToName,
    );
    if (this.mergeCells?.get(ref)) {
      toast.error($('merging-cell-is-duplicate'));
      return;
    }
    if (!this.mergeCells) {
      this.model
        .getRoot()
        .set('mergeCells', new Y.Map() as YjsModelJson['mergeCells']);
    }
    this.mergeCells!.set(ref, toIRange(range));
  }
  deleteMergeCell(range: IRange): void {
    range.sheetId = range.sheetId || this.model.getCurrentSheetId();
    const ref = convertToReference(
      range,
      'absolute',
      this.convertSheetIdToName,
    );

    this.mergeCells?.delete(ref);
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
  private convertSheetIdToName = (sheetId: string) => {
    const data = this.model.getSheetInfo(sheetId);
    return data?.name || '';
  };
}
