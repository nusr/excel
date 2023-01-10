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

export type CellInfo = ModelCellType & Coordinate;

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
  activeCell: CellInfo;
  cellPosition: CanvasOverlayPosition;
  canRedo: boolean;
  canUndo: boolean;
  fontFamilyList: OptionItem[];
  contextMenuPosition?: CanvasOverlayPosition;
  scrollTop: number;
  scrollLeft: number;
  headerSize: IWindowSize;
  scrollStatus: ScrollStatus,
}

export type Point = [x: number, y: number];

export enum ScrollStatus {
  NONE = 0,
  VERTICAL,
  HORIZONTAL,
}
