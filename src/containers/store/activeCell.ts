import type { ActiveCellType } from '@/types';
import { DEFAULT_POSITION } from '@/util';
import { BaseStore } from './base';

const cellData: ActiveCellType = {
  value: '',
  style: {},
  row: 0,
  col: 0,
  left: DEFAULT_POSITION,
  top: DEFAULT_POSITION,
  width: 0,
  height: 0,
};

export const activeCellStore = new BaseStore<ActiveCellType>(cellData);
