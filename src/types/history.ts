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
