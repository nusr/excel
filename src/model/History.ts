import { IHistory, ICommand } from '@/types';
export class History implements IHistory {
  private position = -1;
  private commandList: ICommand[][] = [];
  private commands: ICommand[] = [];
  constructor({ change }: { change?: () => void }) {
    this.clear();
    if (change && typeof change === 'function') {
      this.change = change;
    }
  }
  push(command: ICommand) {
    if (command.execute && typeof command.execute === 'function') {
      command.execute();
    }
    this.commands.push(command);
  }
  execute() {
    if (this.commands.length === 0) {
      return;
    }
    const list = this.commands;
    this.clearRedo();
    this.commandList.push(list);
    this.position++;
    this.change();
    this.commands = [];
  }
  redo(): void {
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
    return this.position < this.commandList.length - 1 && this.position >= 0;
  }
  canUndo(): boolean {
    return this.position >= 0;
  }
  clear(): void {
    this.position = -1;
    this.commandList = [];
    this.commands = [];
  }
  private change() {
    console.log(this.position);
    console.log(this.commandList);
  }
  private clearRedo() {
    this.commandList = this.commandList.slice(0, this.position + 1);
  }
}
