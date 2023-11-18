import { ModelCellValue } from './model';

export interface OptionItem extends ExtendIndex {
  value: string | number;
  label: string;
  disabled: boolean;
}

export interface ExtendIndex {
  [key: string]: boolean | number | string | null | undefined;
}

export interface CanvasOverlayPosition {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface ScrollValue {
  left: number;
  top: number;
  row: number;
  col: number;
  scrollLeft: number;
  scrollTop: number;
}

export type ActiveCellType = ModelCellValue & CanvasOverlayPosition;

export type Point = [x: number, y: number];

export enum ScrollStatus {
  NONE = 0,
  VERTICAL,
  HORIZONTAL,
}
