import { QueryCellResult, WorkBookJSON } from './model';
export type OptionItem = {
  value: string | number;
  label: string;
  disabled?: boolean;
};
export type CanvasOverlayPosition = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export interface Coordinate {
  row: number;
  col: number;
}

export type CellInfo = QueryCellResult & Coordinate;

export interface StoreValue {
  sheetList: WorkBookJSON['workbook'];
  currentSheetId: string;
  isCellEditing: boolean;
  activeCell: CellInfo;
  cellPosition: CanvasOverlayPosition;
  canRedo: boolean;
  canUndo: boolean;
  fontFamilyList: OptionItem[];
  contextMenuPosition?: CanvasOverlayPosition;
}
