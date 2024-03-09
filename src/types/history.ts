export interface IHistory {
  clear(): void;
  push(command: ICommand): void;
  execute(): void;
  canRedo(): boolean;
  canUndo(): boolean;
  undo(): void;
  redo(): void;
}

export interface ICommand {
  execute?: () => void;
  redo(): void;
  undo(): void;
}
