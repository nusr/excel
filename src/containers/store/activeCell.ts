import type { StyleType, ResultType, ExtendIndex } from '@/types';
import { DEFAULT_POSITION } from '@/util';
import { BaseStore } from './base';

export type CellStoreType = Partial<StyleType> & {
  value: ResultType;
  formula?: string;
  top: number;
  left: number;
  width: number;
  height: number;
  row: number;
  col: number;
  defineName: string;
} & ExtendIndex;

const cellData: CellStoreType = {
  value: '',
  formula: '',
  row: 0,
  col: 0,
  left: DEFAULT_POSITION,
  top: DEFAULT_POSITION,
  width: 0,
  height: 0,
  defineName: '',
};

export const activeCellStore = new BaseStore<CellStoreType>(cellData);
