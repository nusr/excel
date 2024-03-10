import { IHistory, ICommand } from '@/types';
export class History implements IHistory {
  private position = -1;
  private commandList: ICommand[][] = [];
  private commands: ICommand[] = [];
  private maxLength = 100;
  constructor({
    change,
    maxLength,
  }: {
    change?: () => void;
    maxLength?: number;
  }) {
    this.clear(true);
    if (change && typeof change === 'function') {
      this.change = change;
    }
    this.maxLength = maxLength || this.maxLength;
  }
  push(...commands: ICommand[]) {
    if (commands.length === 0) {
      return;
    }
    for (const item of commands) {
      if (item.execute && typeof item.execute === 'function') {
        item.execute();
      }
    }
    this.commands = this.commands.concat(commands);
  }
  commit() {
    if (this.commands.length === 0) {
      return;
    }
    this.position++;
    this.commandList[this.position] = [...this.commands];
    for (let i = this.position + 1; i < this.commandList.length; i++) {
      this.commandList[i] = [];
    }
    if (this.position >= this.maxLength) {
      this.commandList[this.position - this.maxLength] = [];
    }
    this.change();
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
        item.redo();
      }
    }
    this.change();
  }
  undo(): void {
    if (!this.canUndo()) {
      return;
    }
    const list = this.commandList[this.position];
    if (list.length > 0) {
      for (const item of list) {
        item.undo();
      }
    }
    this.position--;
    this.change();
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
    const lower = Math.max(this.commandList.length - this.maxLength, 0);
    return this.position > lower;
  }
  clear(clearAll: boolean = false): void {
    if (clearAll) {
      this.position = -1;
      this.commandList = [];
    }
    this.commands = [];
  }
  private change() {}
  get(): ICommand[] {
    if (this.position >= 0 && this.position < this.commandList.length) {
      return this.commandList[this.position];
    }
    return [];
  }
  getLength(): number {
    return Math.min(this.commandList.length, this.maxLength);
  }
}
