import type { CanvasOverlayPosition } from '../../types';
import { DEFAULT_POSITION } from '../../util';
import { create } from 'zustand';

export type CellStoreType = CanvasOverlayPosition & {
  defineName: string;
  value: string; // real value
  displayValue: string; // display value
  row: number;
  col: number;
  rowCount: number;
  colCount: number;
};

const cellData: CellStoreType = {
  value: '',
  displayValue: '',
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

export const useActiveCell = create<CellStoreType>(() => ({
  ...cellData,
}));
