import { IBaseModel } from './model';
import { CanvasOverlayPosition, ScrollValue } from './components';
import { IRange } from './range';
import { IWindowSize, IPosition } from './event';

export enum EBorderLineType {
  MEDIUM,
  THICK,
  DASHED,
  DOTTED,
  DOUBLE,
}

export type CanvasSize = {
  contentWidth: number;
  contentHeight: number;
} & CanvasOverlayPosition;

export type ClipboardData = Record<ClipboardType, string>;

export interface IHooks {
  copyOrCut: (textData: ClipboardData, type: 'cut' | 'copy') => Promise<string>;
  paste: () => Promise<ClipboardData>;
}

export type ClipboardType = 'text/plain' | 'text/html';

export interface MainDom {
  input?: HTMLInputElement;
  canvas?: HTMLCanvasElement;
}

export type ActiveRange = {
  range: IRange;
  isMerged: boolean;
};

export interface IController extends IBaseModel {
  emitChange(): void;
  setNextActiveCell(direction: 'left' | 'right' | 'down' | 'up'): IRange;
  getActiveRange(): ActiveRange;
  getCellSize(range: IRange): IWindowSize;
  computeCellPosition(range: IRange): IPosition;
  paste(event?: ClipboardEvent): void;
  copy(event?: ClipboardEvent): void;
  cut(event?: ClipboardEvent): void;
  getCopyRanges(): IRange[];
  setScroll(scroll: ScrollValue): void;
  getScroll(sheetId?: string): ScrollValue;
  setFloatElementUuid(uuid: string): void;
  batchUpdate: (fn: () => void, isNoHistory?: boolean) => void;
}
