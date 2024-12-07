import type {
  ModelJSON,
  DefinedNameItem,
  IRange,
  IModel,
  IDefinedName,
  YjsModelJson,
} from '../types';
import {
  MAX_PARAMS_COUNT,
  parseReference,
  DEFINED_NAME_REG_EXP,
  toIRange,
} from '../util';
import * as Y from 'yjs';

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
    const definedNames = new Y.Map() as YjsModelJson['definedNames'];
    for (const [key, value] of Object.entries(data)) {
      if (!this.model.validateRange(value) || !this.validateDefinedName(key)) {
        continue;
      }
      definedNames.set(key, toIRange(value));
    }
    this.model.getRoot().set('definedNames', definedNames);
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
      range: v[1],
    }));
  }
  getDefineName(range: IRange): string {
    if (!this.definedNames) {
      return '';
    }
    const sheetId = range.sheetId || this.model.getCurrentSheetId();
    for (const [key, t] of this.definedNames.entries()) {
      if (t.row === range.row && t.col === range.col && t.sheetId === sheetId) {
        return key;
      }
    }
    return '';
  }
  setDefineName(range: IRange, name: string) {
    if (!name) {
      return false;
    }
    const oldName = this.getDefineName(range);
    if (oldName === name) {
      return false;
    }
    if (!this.definedNames) {
      this.model
        .getRoot()
        .set('definedNames', new Y.Map() as YjsModelJson['definedNames']);
    }

    const result: IRange = {
      row: range.row,
      col: range.col,
      sheetId: range.sheetId || this.model.getCurrentSheetId(),
      colCount: 1,
      rowCount: 1,
    };
    this.definedNames!.set(name, result);
    if (oldName) {
      this.definedNames?.delete(oldName);
    }

    return true;
  }
  checkDefineName(name: string): IRange | undefined {
    const range = this.definedNames?.get(name);
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
