import { WorkBookJSON } from './model';

export type ICommandItem = {
  type: keyof WorkBookJSON;
  path: string; // eg. worksheets.1.6_4.value, workbook.1.name
  oldValue: any; // undo
  newValue: any; // redo
};

export type CommandType = ICommandItem;

export interface IHistory {
  get(): ICommandItem[];
  push(...commands: ICommandItem[]): void;
  commit(): void;
  undo(): void;
  redo(): void;
  canRedo(): boolean;
  canUndo(): boolean;
  getLength(): number;
  clear(clearAll?: boolean): void;
}
