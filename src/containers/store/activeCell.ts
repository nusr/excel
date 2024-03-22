import type { StyleType, ResultType } from '@/types';
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
  isMergeCell: boolean;
  rowCount: number;
  colCount: number;
  sheetId: string;
  tabColor: string;
};

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
  isMergeCell: false,
  rowCount: 1,
  colCount: 1,
  tabColor: '',
  sheetId: '',
};

export const activeCellStore = new BaseStore<CellStoreType>(cellData);
