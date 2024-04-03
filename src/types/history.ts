import type { WorkBookJSON } from './model';

export type ICommandItem = {
  /**
   * type, eg. worksheets workbook
   */
  type: keyof WorkBookJSON | 'antLine' | 'scroll' | 'noHistory';
  /**
   * key eg. 1.6_4.value, 1.name
   */
  key: string;
  /**
   * oldValue, undo
   */
  oldValue: any;
  /**
   * newValue redo
   */
  newValue: any;
};

export type CommandType = ICommandItem;

export interface IHistory {
  get(): ICommandItem[];
  push(command: ICommandItem): void;
  commit(): void;
  undo(): void;
  redo(): void;
  canRedo(): boolean;
  canUndo(): boolean;
  getLength(): number;
  clear(clearAll?: boolean): void;
}
