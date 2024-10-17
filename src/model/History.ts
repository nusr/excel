import { IHistory, ICommandItem, HistoryChangeType } from '@/types';
import { noop } from '@/util';

type Options = {
  change: (list: ICommandItem[], type: HistoryChangeType) => void;
  maxLength: number;
  redo: (item: ICommandItem[]) => void;
  undo: (item: ICommandItem[]) => void;
};

export const DELETE_FLAG = '__DELETE__';

export function transformData(
  obj: Record<string, any>,
  item: ICommandItem,
  type: 'undo' | 'redo',
) {
  const key = item.type + (item.key ? '.' + item.key : '');
  setData(obj, key, type === 'undo' ? item.oldValue : item.newValue);
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
  push(...commands: ICommandItem[]) {
    this.commands = this.commands.concat(commands);
  }
  commit() {
    if (this.commands.length === 0) {
      return;
    }
    const list = this.commands.filter(
      (v) => v.type !== 'scroll' && v.type !== 'antLine',
    );
    if (list.length === 0) {
      this.change([...this.commands], 'commit');
      this.commands = [];
      return;
    }

    this.position++;

    this.commandList[this.position] = [...list];
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

    this.change([...this.commands], 'commit');
    this.commands = [];
  }
  redo(): void {
    const index = this.findRedoIndex();
    if (index < 0) {
      return;
    }
    const list = this.commandList[index];
    this.options.redo([...list]);
    this.position = index;
    this.change(list, 'redo');
  }
  undo(): void {
    const index = this.findUndoIndex();
    if (index < 0) {
      return;
    }
    const list = this.commandList[index];
    this.options.undo([...list]);
    this.position = index - 1;
    this.change(list, 'undo');
  }
  private findRedoIndex() {
    if (this.position >= this.commandList.length - 1) {
      return -1;
    }
    for (let i = this.position + 1; i < this.commandList.length; i++) {
      if (this.commandList[i].length > 0) {
        return i;
      }
    }
    return -1;
  }

  canRedo(): boolean {
    const index = this.findRedoIndex();
    return index >= 0;
  }
  private findUndoIndex() {
    if (this.position < 0) {
      return -1;
    }
    for (let i = this.position; i >= 0; i--) {
      if (this.commandList[i].length > 0) {
        return i;
      }
    }
    return -1;
  }
  canUndo(): boolean {
    const index = this.findUndoIndex();
    return index >= 0;
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
    return [...this.commands];
  }
  getLength(): number {
    return Math.min(this.commandList.length, this.options.maxLength);
  }
}
