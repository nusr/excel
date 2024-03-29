import { WorkBookJSON } from './model';

export type ICommandItem = {
  /**
   * type, eg. worksheets workbook
   */
  t: keyof WorkBookJSON;
  /**
   * key eg. 1.6_4.value, 1.name
   */
  k: string;
  /**
   * oldValue, undo
   */
  o: any;
  /**
   * newValue redo
   */
  n: any;
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
export type HistoryChangeType = 'commit' | 'redo' | 'undo' | 'batch';
export type HistoryOptions = {
  change: (list: ICommandItem[], type: HistoryChangeType) => void;
  maxLength: number;
  redo: (item: ICommandItem) => void;
  undo: (item: ICommandItem) => void;
};
