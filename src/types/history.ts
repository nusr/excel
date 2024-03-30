import { WorkBookJSON } from './model';

export type ICommandItem = {
  /**
   * type, eg. worksheets workbook
   */
  t: keyof WorkBookJSON | 'antLine' | 'scroll';
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
