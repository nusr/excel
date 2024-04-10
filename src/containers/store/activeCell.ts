import type { IRange, CanvasOverlayPosition } from '@/types';
import { DEFAULT_POSITION } from '@/util';
import { BaseStore } from './base';

export type CellStoreType = CanvasOverlayPosition &
  Omit<IRange, 'sheetId'> & {
    defineName: string;
    value: string;
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
