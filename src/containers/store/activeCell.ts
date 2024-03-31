import type { IRange, CanvasOverlayPosition, ModelCellType } from '@/types';
import { DEFAULT_POSITION } from '@/util';
import { BaseStore } from './base';

export type CellStoreType = CanvasOverlayPosition &
  Omit<IRange, 'sheetId'> &
  Required<Pick<ModelCellType, 'value' | 'formula'>> & {
    defineName: string;
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
  rowCount: 1,
  colCount: 1,
};

export const activeCellStore = new BaseStore<CellStoreType>(cellData);
