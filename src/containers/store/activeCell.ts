import type { CanvasOverlayPosition } from '@/types';
import { DEFAULT_POSITION } from '@/util';
import { BaseStore } from './base';

export type CellStoreType = CanvasOverlayPosition & {
  defineName: string;
  value: string;
  row: number;
  col: number;
  rowCount: number;
  colCount: number;
};

const cellData: CellStoreType = {
  value: '',
  row: 0,
  col: 0,
  left: DEFAULT_POSITION,
  top: DEFAULT_POSITION,
  width: 0,
  height: 0,
  defineName: '',
  rowCount: 1,
  colCount: 1,
};

export const activeCellStore = new BaseStore<CellStoreType>(cellData);
