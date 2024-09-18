import type { WorkBookJSON, CustomItem, DrawingElement, ModelCellType, WorksheetType, StyleType, BorderItem } from './model';
import { IRange } from './range';

type ValueType = string | number | undefined | boolean | CustomItem | DrawingElement | IRange | ModelCellType | WorksheetType | Partial<StyleType> | BorderItem | WorkBookJSON['customWidth'] | WorkBookJSON['drawings'] | WorkBookJSON['workbook'] | WorkBookJSON['definedNames']

export type ICommandItem = {
  /**
   * type, eg. worksheets workbook
   */
  type: keyof WorkBookJSON | 'antLine' | 'scroll';
  /**
   * key eg. 1.6_4.value, 1.name
   */
  key: string;
  /**
   * oldValue, undo
   */
  oldValue: ValueType;
  /**
   * newValue redo
   */
  newValue: ValueType;
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

export type HistoryChangeType = 'undo' | 'redo' | 'commit';
