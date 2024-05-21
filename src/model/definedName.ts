import {
  WorkBookJSON,
  ICommandItem,
  DefinedNameItem,
  IRange,
  IModel,
  IDefinedName,
} from '@/types';
import { DELETE_FLAG, transformData } from './History';
import { MAX_PARAMS_COUNT, parseReference, DEFINED_NAME_REG_EXP } from '@/util';

export class DefinedName implements IDefinedName {
  private model: IModel;
  private definedNames: WorkBookJSON['definedNames'] = {};
  constructor(model: IModel) {
    this.model = model;
  }
  toJSON() {
    return {
      definedNames: { ...this.definedNames },
    };
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
  fromJSON(json: WorkBookJSON): void {
    const data = json.definedNames || {};
    const oldValue = { ...this.definedNames };
    this.definedNames = {};
    for (const [key, value] of Object.entries(data)) {
      if (!this.model.validateRange(value) || !this.validateDefinedName(key)) {
        continue;
      }
      this.definedNames[key] = value;
    }
    this.model.push({
      type: 'definedNames',
      key: '',
      newValue: this.definedNames,
      oldValue,
    });
  }
  undo(item: ICommandItem): void {
    if (item.type === 'definedNames') {
      transformData(this, item, 'undo');
    }
  }
  redo(item: ICommandItem): void {
    if (item.type === 'definedNames') {
      transformData(this, item, 'redo');
    }
  }
  getDefineNameList(): DefinedNameItem[] {
    const list = Object.entries(this.definedNames);
    if (list.length === 0) {
      return [];
    }
    return list.map((v) => ({
      name: v[0],
      range: v[1],
    }));
  }
  getDefineName(range: IRange): string {
    const sheetId = range.sheetId || this.model.getCurrentSheetId();
    for (const [key, t] of Object.entries(this.definedNames)) {
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

    const result: IRange = {
      row: range.row,
      col: range.col,
      sheetId: range.sheetId || this.model.getCurrentSheetId(),
      colCount: 1,
      rowCount: 1,
    };
    this.definedNames[name] = result;
    if (oldName) {
      delete this.definedNames[oldName];
    }

    if (oldName) {
      this.model.push({
        type: 'definedNames',
        key: name,
        newValue: result,
        oldValue: DELETE_FLAG,
      });

      this.model.push({
        type: 'definedNames',
        key: oldName,
        newValue: DELETE_FLAG,
        oldValue: result,
      });
    } else {
      this.model.push({
        type: 'definedNames',
        key: name,
        newValue: result,
        oldValue: DELETE_FLAG,
      });
    }
    return true;
  }
  checkDefineName(name: string): IRange | undefined {
    const range = this.definedNames[name];
    if (range) {
      return { ...this.definedNames[name] };
    }
    return undefined;
  }
  deleteAll(sheetId?: string): void {
    const id = sheetId || this.model.getCurrentSheetId();
    for (const [key, value] of Object.entries(this.definedNames)) {
      if (value.sheetId === id) {
        delete this.definedNames[key];
        this.model.push({
          type: 'definedNames',
          key: key,
          newValue: DELETE_FLAG,
          oldValue: value,
        });
      }
    }
  }
}
