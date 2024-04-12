import {
  WorkBookJSON,
  WorksheetType,
  IWorkbook,
  ICommandItem,
  IModel,
} from '@/types';
import {
  getDefaultSheetInfo,
  assert,
  DEFAULT_ROW_COUNT,
  DEFAULT_COL_COUNT,
  XLSX_MAX_COL_COUNT,
  XLSX_MAX_ROW_COUNT,
} from '@/util';
import { DELETE_FLAG, transformData } from './History';
import { $ } from '@/i18n';

export class Workbook implements IWorkbook {
  private currentSheetId = '';
  private workbook: WorkBookJSON['workbook'] = {};
  private model: IModel;
  constructor(model: IModel) {
    this.model = model;
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
    if (data.rowCount > XLSX_MAX_ROW_COUNT) {
      return false;
    }
    if (data.colCount > XLSX_MAX_COL_COUNT) {
      return false;
    }

    return true;
  }
  toJSON() {
    return {
      workbook: this.workbook,
      currentSheetId: this.currentSheetId,
    };
  }
  fromJSON(json: WorkBookJSON): void {
    const workbook = json.workbook || {};
    const currentSheetId = json.currentSheetId || '';
    const oldValue = { ...this.workbook };

    this.workbook = {};
    this.currentSheetId = '';
    for (const sheet of Object.values(workbook)) {
      if (!this.validateSheet(sheet)) {
        continue;
      }
      this.workbook[sheet.sheetId] = sheet;
    }

    let newSheetId = this.getSheetId() || '';
    if (
      this.workbook[currentSheetId] &&
      !this.workbook[currentSheetId].isHide
    ) {
      newSheetId = currentSheetId;
    }
    this.setCurrentSheetId(newSheetId);
    this.model.push({
      type: 'workbook',
      key: '',
      newValue: this.workbook,
      oldValue,
    });
  }
  undo(item: ICommandItem): void {
    if (item.type === 'currentSheetId') {
      const sheetId = this.getSheetId();
      if (
        !this.workbook[item.oldValue] ||
        this.workbook[item.oldValue].isHide
      ) {
        if (sheetId) {
          this.currentSheetId = sheetId;
        }
      } else {
        this.currentSheetId = item.oldValue;
      }
      return;
    } else if (item.type === 'workbook') {
      transformData(this, item, 'undo');
    }
  }
  redo(item: ICommandItem): void {
    if (item.type === 'currentSheetId') {
      if (
        !this.workbook[item.newValue] ||
        this.workbook[item.newValue].isHide
      ) {
        const sheetId = this.getSheetId();
        if (sheetId) {
          this.currentSheetId = sheetId;
        }
      } else {
        this.currentSheetId = item.newValue;
      }
      return;
    } else if (item.type === 'workbook') {
      transformData(this, item, 'redo');
    }
  }
  updateSheetInfo(data: Partial<WorksheetType>, sheetId?: string) {
    const id = sheetId || this.currentSheetId;
    if (!this.workbook[id]) {
      return;
    }
    const keyList = Object.keys(data) as Array<keyof Partial<WorksheetType>>;
    for (const key of keyList) {
      if (key === 'sheetId') {
        continue;
      }
      const oldValue = this.workbook[id][key];
      if (oldValue === data[key]) {
        continue;
      }
      // @ts-ignore
      this.workbook[id][key] = data[key];
      this.model.push({
        type: 'workbook',
        key: `${id}.${key}`,
        newValue: data[key],
        oldValue: oldValue,
      });
    }
  }
  getSheetList(): WorksheetType[] {
    const list = Object.values(this.workbook);
    list.sort((a, b) => a.sort - b.sort);
    return list.slice();
  }
  addSheet() {
    const list = this.getSheetList();
    const item = getDefaultSheetInfo(list);
    const sheet: WorksheetType = {
      ...item,
      isHide: false,
      colCount: DEFAULT_COL_COUNT,
      rowCount: DEFAULT_ROW_COUNT,
    };
    if (!this.validateSheet(sheet)) {
      return null;
    }
    const check = this.workbook[sheet.sheetId];
    assert(!check, $('sheet-id-is-duplicate'));
    this.workbook[sheet.sheetId] = sheet;
    this.model.push({
      type: 'workbook',
      key: sheet.sheetId,
      newValue: { ...sheet },
      oldValue: DELETE_FLAG,
    });
    return sheet;
  }

  deleteSheet(sheetId?: string): void {
    const id = sheetId || this.currentSheetId;
    if (!this.workbook[id]) {
      return;
    }
    const sheetList = this.getSheetList();
    const list = sheetList.filter((v) => !v.isHide);
    assert(
      list.length >= 2,
      $('a-workbook-must-contains-at-least-one-visible-worksheet'),
    );
    const oldSheet = this.workbook[id];
    delete this.workbook[id];

    this.model.push({
      type: 'workbook',
      key: id,
      newValue: DELETE_FLAG,
      oldValue: oldSheet,
    });
  }
  hideSheet(sheetId?: string): void {
    const sheetList = this.getSheetList();
    const list = sheetList.filter((v) => !v.isHide);
    assert(
      list.length >= 2,
      $('a-workbook-must-contains-at-least-one-visible-worksheet'),
    );
    this.updateSheetInfo({ isHide: true }, sheetId);
  }
  unhideSheet(sheetId?: string): void {
    const id = sheetId || this.currentSheetId;
    this.updateSheetInfo({ isHide: false }, id);
  }
  renameSheet(sheetName: string, sheetId?: string): void {
    assert(!!sheetName, $('the-value-cannot-be-empty'));
    const id = sheetId || this.currentSheetId;
    const sheetList = this.getSheetList();
    const item = sheetList.find((v) => v.name === sheetName);
    if (item) {
      if (item.sheetId === id) {
        return;
      }
      assert(false, $('sheet-name-is-duplicate'));
    }
    this.updateSheetInfo({ name: sheetName }, id);
  }
  getSheetInfo(id?: string): WorksheetType | null {
    const sheetId = id || this.currentSheetId;
    const item = this.workbook[sheetId];
    if (!item) {
      return null;
    }
    if (item) {
      item.sheetId = sheetId;
    }
    return { ...item };
  }
  setCurrentSheetId(newSheetId: string): void {
    if (!newSheetId || !this.workbook[newSheetId]) {
      return;
    }
    if (this.currentSheetId !== newSheetId) {
      const oldSheetId = this.currentSheetId;
      this.currentSheetId = newSheetId;
      this.model.push({
        type: 'currentSheetId',
        key: '',
        newValue: newSheetId,
        oldValue: oldSheetId,
      });
    }
  }
  getCurrentSheetId(): string {
    return this.currentSheetId;
  }

  private getSheetId(): string | undefined {
    const list = this.getSheetList();
    const result = list.filter((v) => !v.isHide);
    return result[0]?.sheetId;
  }
  deleteAll(): void {}
}
