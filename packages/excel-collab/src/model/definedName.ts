import type {
  ModelJSON,
  DefinedNameItem,
  IRange,
  IModel,
  IDefinedName,
} from '../types';
import {
  MAX_PARAMS_COUNT,
  parseReference,
  DEFINED_NAME_REG_EXP,
  toIRange,
} from '../util';

export class DefinedName implements IDefinedName {
  private model: IModel;

  constructor(model: IModel) {
    this.model = model;
  }
  private get definedNames() {
    return this.model.getRoot().get('definedNames');
  }
  validateDefinedName(name: string) {
    if (!name) {
      return false;
    }
    const range = parseReference(name, (sheetName: string) => {
      const list = this.model.getSheetList();
      const item = list.find((v) => v.name === sheetName);
      return item?.sheetId || '';
    });
    if (range) {
      const sheetInfo = this.model.getSheetInfo(range.sheetId);
      if (
        sheetInfo &&
        range.col < sheetInfo.colCount &&
        range.row < sheetInfo.rowCount
      ) {
        return false;
      }
    }
    if (DEFINED_NAME_REG_EXP.test(name) && name.length <= MAX_PARAMS_COUNT) {
      return true;
    }
    return false;
  }
  fromJSON(json: ModelJSON): void {
    const data = json.definedNames || {};
    const definedNames = this.definedNames;
    definedNames.clear();
    for (const [key, value] of Object.entries(data)) {
      const deleted = value.row === -1 && value.col === -1;
      if ((!deleted && !this.model.validateRange(value)) || !this.validateDefinedName(key)) {
        continue;
      }
      definedNames.set(key, toIRange(value));
      this.model.getRoot().bindRange(`name:${key}`, value);
    }
  }
  getDefineNameList(): DefinedNameItem[] {
    if (!this.definedNames) {
      return [];
    }
    const list = Array.from(this.definedNames.entries());
    if (list.length === 0) {
      return [];
    }
    return list.map((v) => ({
      name: v[0],
      range: this.model.getRoot().range(`name:${v[0]}`, v[1]) ??
        { ...v[1], row: -1, col: -1, rowCount: 1, colCount: 1 },
    }));
  }
  getDefineName(range: IRange): string {
    if (!this.definedNames) {
      return '';
    }
    const sheetId = range.sheetId || this.model.getCurrentSheetId();
    for (const { name: key, range: t } of this.getDefineNameList()) {
      if (t.row === range.row && t.col === range.col && t.sheetId === sheetId) {
        return key;
      }
    }
    return '';
  }
  setDefineName(range: IRange, name: string) {
    if (!name || !this.model.validateRange(range)) {
      return false;
    }
    const oldName = this.getDefineName(range);
    if (oldName === name) {
      return false;
    }

    const result: IRange = {
      row: range.row,
      col: range.col,
      sheetId: range.sheetId || this.model.getCurrentSheetId(),
      colCount: range.colCount,
      rowCount: range.rowCount,
    };
    this.definedNames!.set(name, result);
    this.model.getRoot().bindRange(`name:${name}`, result);
    if (oldName) {
      this.definedNames?.delete(oldName);
    }

    return true;
  }
  checkDefineName(name: string): IRange | undefined {
    const stored = this.definedNames?.get(name);
    const range = stored && (this.model.getRoot().range(`name:${name}`, stored) ??
      { ...stored, row: -1, col: -1, rowCount: 1, colCount: 1 });
    if (range) {
      return { ...range };
    }
    return undefined;
  }
  deleteAll(sheetId?: string): void {
    if (!this.definedNames) {
      return;
    }
    const id = sheetId || this.model.getCurrentSheetId();
    for (const [key, value] of this.definedNames.entries()) {
      if (value.sheetId === id) {
        this.definedNames.delete(key);
      }
    }
  }
}
