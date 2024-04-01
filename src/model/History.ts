import { IHistory, ICommandItem } from '@/types';
import { noop } from '@/util';

export type HistoryChangeType = 'undoRedo' | 'commit';

type Options = {
  change: (list: ICommandItem[], type: HistoryChangeType) => void;
  maxLength: number;
  redo: (item: ICommandItem) => void;
  undo: (item: ICommandItem) => void;
};

export const DELETE_FLAG = Symbol('delete');

export function transformData(
  obj: Record<string, any>,
  item: ICommandItem,
  type: 'undo' | 'redo',
) {
  const key = item.type + (item.key ? '.' + item.key : '');
  if (type === 'undo') {
    setData(obj, key, item.oldValue);
  } else {
    setData(obj, key, item.newValue);
  }
}

function setData(obj: Record<string, any>, key: string, value: any): void {
  if (!obj || typeof obj !== 'object') {
    return;
  }
  const keyList = key.split('.');
  keyList.reduce((res, key, index, arr) => {
    if (index === arr.length - 1) {
      if (value === DELETE_FLAG) {
        delete res[key];
      } else {
        res[key] = value;
      }
    } else if (res[key] === null || res[key] === undefined) {
      res[key] = {};
    }
    return res[key];
  }, obj);
}
export class History implements IHistory {
  private position = -1;
  private commandList: ICommandItem[][] = [];
  private commands: ICommandItem[] = [];
  private options: Options = {
    change: noop,
    maxLength: 100,
    redo: noop,
    undo: noop,
  };
  constructor(options: Partial<Options>) {
    this.clear(true);
    this.options.maxLength = options.maxLength || this.options.maxLength;
    if (typeof options.change === 'function') {
      this.options.change = options.change;
    }
    if (typeof options.redo === 'function') {
      this.options.redo = options.redo;
    }
    if (typeof options.undo === 'function') {
      this.options.undo = options.undo;
    }
  }
  push(command: ICommandItem) {
    this.commands.push(command);
  }
  commit() {
    if (this.commands.length === 0) {
      return;
    }
    const list = this.commands.filter(
      (v) =>
        v.type !== 'scroll' && v.type !== 'antLine' && v.type !== 'rangeMap',
    );
    if (list.length === 0) {
      this.change(this.commands, 'commit');
      this.commands = [];
      return;
    }

    this.position++;

    this.commandList[this.position] = list;
    for (let i = this.position + 1; i < this.commandList.length; i++) {
      this.commandList[i] = [];
    }
    if (this.position >= this.options.maxLength) {
      this.commandList[this.position - this.options.maxLength] = [];
    }
    // Prevent this.commandList array from becoming extraordinarily large
    for (
      let i = 0;
      this.commandList.length > this.options.maxLength && i < this.position;
      i++
    ) {
      if (this.commandList[0].length === 0) {
        this.commandList.shift();
        this.position--;
      }
    }

    this.change(this.commands, 'commit');
    this.commands = [];
  }
  redo(): void {
    if (!this.canRedo()) {
      return;
    }
    this.position++;
    const list = this.commandList[this.position];
    if (list.length > 0) {
      for (const item of list) {
        this.options.redo(item as ICommandItem);
      }
    }
    this.change(list, 'undoRedo');
  }
  undo(): void {
    if (!this.canUndo()) {
      return;
    }
    const list = this.commandList[this.position];
    if (list.length > 0) {
      for (const item of list) {
        this.options.undo(item as ICommandItem);
      }
    }
    this.position--;
    this.change(list, 'undoRedo');
  }
  canRedo(): boolean {
    if (this.position >= this.commandList.length - 1) {
      return false;
    }
    let hasRecord = false;
    for (let i = this.position + 1; i < this.commandList.length; i++) {
      if (this.commandList[i].length > 0) {
        hasRecord = true;
        break;
      }
    }
    return hasRecord;
  }
  canUndo(): boolean {
    const lower = Math.max(this.commandList.length - this.options.maxLength, 0);
    return this.position > lower;
  }
  clear(clearAll: boolean = false): void {
    if (clearAll) {
      this.position = -1;
      this.commandList = [];
    }
    this.commands = [];
  }
  private change(_list: ICommandItem[], type: HistoryChangeType) {
    this.options.change(_list, type);
  }
  get(): ICommandItem[] {
    if (this.position >= 0 && this.position < this.commandList.length) {
      return this.commandList[this.position];
    }
    return [];
  }
  getLength(): number {
    return Math.min(this.commandList.length, this.options.maxLength);
  }
}
