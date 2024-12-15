import type {
  ModelJSON,
  WorksheetType,
  IWorkbook,
  IModel,
  YjsModelJson,
  TypedMap,
} from '../types';
import {
  getDefaultSheetInfo,
  DEFAULT_ROW_COUNT,
  DEFAULT_COL_COUNT,
  XLSX_MAX_COL_COUNT,
  XLSX_MAX_ROW_COUNT,
} from '../util';
import { $ } from '../i18n';
import { toast } from '../components';
import * as Y from 'yjs';

export class Workbook implements IWorkbook {
  private model: IModel;
  private currentSheetId: string = '';
  constructor(model: IModel) {
    this.model = model;
  }
  private get workbook() {
    return this.model.getRoot().get('workbook');
  }
  validateSheet(data: WorksheetType): boolean {
    if (!data) {
      return false;
    }
    if (
      !data.sheetId ||
      !data.name ||
      typeof data.isHide !== 'boolean' ||
      typeof data.sort !== 'number' ||
      typeof data.colCount !== 'number' ||
      typeof data.rowCount !== 'number'
    ) {
      return false;
    }
    if (
      data.rowCount > XLSX_MAX_ROW_COUNT ||
      data.colCount > XLSX_MAX_COL_COUNT ||
      data.rowCount <= 0 ||
      data.colCount <= 0
    ) {
      return false;
    }
    return true;
  }
  fromJSON(json: ModelJSON): void {
    const data = json.workbook || {};
    const currentSheetId = json.currentSheetId || '';

    const workbook = new Y.Map() as YjsModelJson['workbook'];
    for (const sheet of Object.values(data)) {
      if (!this.validateSheet(sheet)) {
        continue;
      }
      const item = new Y.Map(Object.entries(sheet)) as TypedMap<WorksheetType>;
      workbook.set(sheet.sheetId, item);
    }

    this.model.getRoot().set('workbook', workbook);
    let newSheetId = this.getSheetId() || '';
    const sheetInfo = workbook.get(currentSheetId);
    if (sheetInfo && !sheetInfo?.get('isHide')) {
      newSheetId = currentSheetId;
    }
    this.setCurrentSheetId(newSheetId);
  }
  updateSheetInfo(data: Partial<WorksheetType>, sheetId?: string) {
    const id = sheetId || this.getCurrentSheetId();
    const sheetInfo = this.workbook?.get(id);
    if (!sheetInfo) {
      return;
    }
    const keyList = Object.keys(data) as Array<keyof Partial<WorksheetType>>;
    for (const key of keyList) {
      if (key === 'sheetId' || sheetInfo.get(key) === data[key]) {
        continue;
      }
      sheetInfo.set(key, data[key]);
    }
  }
  getSheetList(): WorksheetType[] {
    if (!this.workbook) {
      return [];
    }
    const list = Array.from(this.workbook.values()).map((v) => v.toJSON());
    list.sort((a, b) => a.sort - b.sort);
    return list.slice();
  }
  addSheet() {
    if (!this.workbook) {
      this.model
        .getRoot()
        .set('workbook', new Y.Map() as YjsModelJson['workbook']);
    }
    const list = this.getSheetList();
    const item = getDefaultSheetInfo(list);
    const sheet: WorksheetType = {
      ...item,
      isHide: false,
      colCount: DEFAULT_COL_COUNT,
      rowCount: DEFAULT_ROW_COUNT,
    };
    this.workbook!.set(
      sheet.sheetId,
      new Y.Map(Object.entries(sheet)) as TypedMap<WorksheetType>,
    );
    return sheet;
  }

  deleteSheet(sheetId?: string): void {
    const id = sheetId || this.getCurrentSheetId();
    if (this.checkSheetSize(sheetId)) {
      this.workbook?.delete(id);
    }
  }
  hideSheet(sheetId?: string): void {
    if (this.checkSheetSize(sheetId)) {
      this.updateSheetInfo({ isHide: true }, sheetId);
    }
  }
  unhideSheet(sheetId: string): void {
    this.updateSheetInfo({ isHide: false }, sheetId);
  }
  renameSheet(sheetName: string, sheetId?: string): void {
    if (!sheetName) {
      toast.error($('the-value-cannot-be-empty'));
      return;
    }
    const id = sheetId || this.getCurrentSheetId();
    const sheetList = this.getSheetList();
    const item = sheetList.find((v) => v.name === sheetName);
    if (item) {
      if (item.sheetId === id) {
        return;
      }
      toast.error($('sheet-name-is-duplicate'));
      return;
    }
    this.updateSheetInfo({ name: sheetName }, id);
  }
  getSheetInfo(id?: string): WorksheetType | undefined {
    const sheetId = id || this.getCurrentSheetId();
    const item = this.workbook?.get(sheetId);
    if (!item) {
      return undefined;
    }
    return { ...item.toJSON() };
  }
  setCurrentSheetId(newSheetId: string): void {
    if (this.workbook?.get(newSheetId)) {
      this.currentSheetId = newSheetId;
    }
  }
  getCurrentSheetId(): string {
    if (this.workbook?.get(this.currentSheetId)) {
      return this.currentSheetId;
    }
    const sheetId = this.getSheetId();
    if (sheetId) {
      this.currentSheetId = sheetId;
      return sheetId;
    }
    return '';
  }

  private getSheetId(): string | undefined {
    const list = this.getSheetList();
    const result = list.filter((v) => !v.isHide);
    return result[0]?.sheetId;
  }
  deleteAll(sheetId?: string): void {
    this.deleteSheet(sheetId);
  }
  private checkSheetSize(sheetId?: string) {
    const id = sheetId || this.getCurrentSheetId();
    if (!this.workbook?.get(id)) {
      return false;
    }
    const sheetList = this.getSheetList();
    const list = sheetList.filter((v) => !v.isHide);
    if (list.length < 2) {
      toast.error($('a-workbook-must-contains-at-least-one-visible-worksheet'));
      return false;
    }
    return true;
  }
}
