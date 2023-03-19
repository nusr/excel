import { ModelCellType } from './model';

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

export type ScrollValue = {
  left: number;
  top: number;
  row: number;
  col: number;
  scrollLeft: number;
  scrollTop: number;
};

export type ActiveCellType = ModelCellType & Coordinate & CanvasOverlayPosition;

export interface StoreValue {
  sheetList: OptionItem[];
  currentSheetId: string;
  activeCell: ActiveCellType;
  isCellEditing: boolean;
  fontFamilyList: OptionItem[];
  contextMenuPosition: CanvasOverlayPosition | undefined;
  sheetBarContextMenuLeft: number | undefined;
  isSheetNameEditing: boolean;
}

export type Point = [x: number, y: number];

export enum ScrollStatus {
  NONE = 0,
  VERTICAL,
  HORIZONTAL,
}
