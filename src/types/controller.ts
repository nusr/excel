import { IBaseModel } from './model';
import { Coordinate, CellInfo, CanvasOverlayPosition } from './components';
import { IRange } from './range';
import { IScrollValue } from './scroll';
import { ChangeEventType, IWindowSize } from './event';

export enum EBorderLineType {
  MEDIUM,
  THICK,
  DASHED,
  DOTTED,
  DOUBLE,
}

export type CanvasSize = {
  top: number;
  left: number;
  width: number;
  height: number;
  contentWidth: number;
  contentHeight: number;
};

export type IHooks = {
  modelChange: (val: Set<ChangeEventType>) => void;
};

export interface IController extends IScrollValue, IBaseModel {
  getViewSize(): IWindowSize;
  getHeaderSize(): IWindowSize;
  getRanges(): IRange[];
  setHooks(hooks: IHooks): void;
  getActiveCell(): Coordinate;
  getCell(data: Coordinate): CellInfo;
  canRedo(): boolean;
  canUndo(): boolean;
  undo(): void;
  redo(): void;
  getColWidth(col: number): number;
  setColWidth(col: number, width: number): void;
  getRowHeight(row: number): number;
  setRowHeight(row: number, height: number): void;
  getCellSize(row: number, col: number): IWindowSize;
  computeCellPosition(row: number, col: number): CanvasOverlayPosition;
  getChangeSet(): Set<ChangeEventType>;
}
