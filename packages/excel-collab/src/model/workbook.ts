import type { ModelJSON, WorksheetType, IWorkbook, IModel } from '../types';
import {
  DEFAULT_ROW_COUNT,
  DEFAULT_COL_COUNT,
  XLSX_MAX_COL_COUNT,
  XLSX_MAX_ROW_COUNT,
} from '../util';
import i18n from '../i18n';
import { v4 } from 'uuid';
import { createSharedSheet } from '../protocol';

export class Workbook implements IWorkbook {
  private readonly model: IModel;
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
      !Number.isInteger(data.rowCount) ||
      !Number.isInteger(data.colCount) ||
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

    const workbook = this.workbook;
    workbook.clear();
    for (const sheet of Object.values(data)) {
      if (!this.validateSheet(sheet)) {
        continue;
      }
      const item = createSharedSheet(sheet);
      workbook.set(sheet.sheetId, item);
    }

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
      if (
        key === 'sheetId' ||
        (key !== 'rowCount' && key !== 'colCount' && sheetInfo.get(key) === data[key])
      ) {
        continue;
      }
      if (key === 'rowCount' || key === 'colCount') {
        const order = sheetInfo.get(key === 'rowCount' ? 'rows' : 'cols')!;
        const length = data[key]!;
        if (
          !Number.isInteger(length) ||
          length <= 0 ||
          length > (key === 'rowCount' ? XLSX_MAX_ROW_COUNT : XLSX_MAX_COL_COUNT)
        ) {
          throw new RangeError('Invalid worksheet dimensions');
        }
        if (length > order.length) {
          order.insert(
            order.length,
            Array.from({ length: length - order.length }, () => v4()),
          );
        } else if (length < order.length) {
          order.delete(length, order.length - length);
        }
      }
      sheetInfo.set(key, data[key]);
    }
  }
  getSheetList(): WorksheetType[] {
    if (!this.workbook) {
      return [];
    }
    return this.model.getRoot().getSheets();
  }
  addSheet() {
    const list = this.getSheetList();
    const next = Math.max(0, ...list.map((sheet) => sheet.sort)) + 1;
    const sheet: WorksheetType = {
      sheetId: v4(),
      name: `Sheet${next}`,
      sort: next,
      isHide: false,
      colCount: DEFAULT_COL_COUNT,
      rowCount: DEFAULT_ROW_COUNT,
    };
    this.workbook!.set(sheet.sheetId, createSharedSheet(sheet));
    return this.getSheetInfo(sheet.sheetId)!;
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
      this.model.emit('toastMessage', {
        type: 'error',
        message: i18n.t('the-value-cannot-be-empty'),
      });
      return;
    }
    const id = sheetId || this.getCurrentSheetId();
    const sheetList = this.getSheetList();
    const item = sheetList.find(
      (v) => v.name.toLowerCase() === sheetName.toLowerCase() && v.sheetId !== id,
    );
    if (item) {
      this.model.emit('toastMessage', {
        type: 'error',
        message: i18n.t('sheet-name-is-duplicate'),
      });
      return;
    }
    this.updateSheetInfo({ name: sheetName }, id);
  }
  getSheetInfo(id?: string): WorksheetType | undefined {
    const sheetId = id || this.getCurrentSheetId();
    return this.getSheetList().find((sheet) => sheet.sheetId === sheetId);
  }
  setCurrentSheetId(newSheetId: string): void {
    if (this.workbook?.get(newSheetId)) {
      this.currentSheetId = newSheetId;
    } else {
      this.currentSheetId = this.getSheetId() || '';
    }
  }
  getCurrentSheetId(): string {
    if (this.workbook?.get(this.currentSheetId)) {
      return this.currentSheetId;
    }
    this.currentSheetId = this.getSheetId() || '';
    return this.currentSheetId;
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
    if (!this.getSheetInfo(id)?.isHide && list.length < 2) {
      this.model.emit('toastMessage', {
        type: 'error',
        message: i18n.t('a-workbook-must-contains-at-least-one-visible-worksheet'),
      });
      return false;
    }
    return true;
  }
}
