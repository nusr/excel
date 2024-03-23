import type {
  StyleType,
  IRange,
  CanvasOverlayPosition,
  ModelCellType,
} from '@/types';
import { DEFAULT_POSITION } from '@/util';
import { BaseStore } from './base';

export type CellStoreType = Partial<StyleType> &
  CanvasOverlayPosition &
  IRange &
  Pick<ModelCellType, 'value' | 'formula'> & {
    defineName: string;
    isMergeCell: boolean;
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
  sheetId: '',
};

export const activeCellStore = new BaseStore<CellStoreType>(cellData);
