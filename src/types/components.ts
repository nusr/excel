import { ModelCellType, WorkBookJSON } from './model';
import { IWindowSize } from './event';
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

export interface StoreValue {
  sheetList: WorkBookJSON['workbook'];
  currentSheetId: string;
  isCellEditing: boolean;
  activeCell: ModelCellType & Coordinate;
  cellPosition: CanvasOverlayPosition;
  fontFamilyList: OptionItem[];
  contextMenuPosition?: CanvasOverlayPosition;
  scrollTop: number;
  scrollLeft: number;
  headerSize: IWindowSize;
  scrollStatus: ScrollStatus;
  canRedo: boolean;
  canUndo: boolean;
}

export type Point = [x: number, y: number];

export enum ScrollStatus {
  NONE = 0,
  VERTICAL,
  HORIZONTAL,
}
