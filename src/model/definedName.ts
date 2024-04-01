import {
  WorkBookJSON,
  ICommandItem,
  DefinedNameItem,
  IRange,
  IModel,
  IDefinedName,
} from '@/types';
import { DELETE_FLAG, transformData } from './History';

export class DefinedName implements IDefinedName {
  private definedNames: WorkBookJSON['definedNames'] = {};
  private model: IModel;
  constructor(model: IModel) {
    this.model = model;
  }
  toJSON() {
    return {
      definedNames: this.definedNames,
    };
  }
  fromJSON(json: WorkBookJSON): void {
    this.definedNames = { ...(json.definedNames || {}) };
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
      if (!t) {
        continue;
      }
      if (t.row === range.row && t.col === range.col && t.sheetId === sheetId) {
        return key;
      }
    }
    return '';
  }
  setDefineName(range: IRange, name: string): void {
    const oldName = this.getDefineName(range);
    if (oldName === name) {
      return;
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
