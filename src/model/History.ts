import { IHistory, ICommandItem } from '@/types';

type ChangeType = 'undoRedo' | 'commit';

type Options = {
  change: (list: ICommandItem[], type: ChangeType) => void;
  maxLength: number;
  redo: (item: ICommandItem) => void;
  undo: (item: ICommandItem) => void;
};

const noop = () => {};
export class History implements IHistory {
  private position = -1;
  private commandList: ICommandItem[][] = [];
  private commands: ICommandItem[] = [];
  private isNoChange = false;
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
    if (commands.length === 0) {
      return;
    }
    this.commands = this.commands.concat(commands);
  }
  commit() {
    if (this.isNoChange || this.commands.length === 0) {
      return;
    }
    const list = this.commands.filter(
      (v) => v.t !== 'scroll' && v.t !== 'antLine' && v.t !== 'rangeMap',
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
  private change(_list: ICommandItem[], type: ChangeType) {
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
