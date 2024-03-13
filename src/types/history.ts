export interface IHistory {
  get(): ICommand[];
  push(...commands: ICommand[]): void;
  commit(): void;
  undo(): void;
  redo(): void;
  canRedo(): boolean;
  canUndo(): boolean;
  getLength(): number;
  clear(clearAll?: boolean): void;
}

export interface ICommand {
  execute?: () => void;
  redo(): void;
  undo(): void;
}

export type ICommandItem = {
  path: string; // eg. worksheets.1.6_4.value, workbook.1.name
  oldValue: any; // undo
  newValue: any; // redo
};
