import { IBaseModel } from './model';
import { CanvasOverlayPosition } from './components';
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
  contentWidth: number;
  contentHeight: number;
} & CanvasOverlayPosition;

export type ClipboardData = Record<ClipboardType, string>;

export type IHooks = {
  modelChange: (val: Set<ChangeEventType>) => void;
  copyOrCut: (textData: ClipboardData, type: 'cut' | 'copy') => Promise<string>;
  paste: () => Promise<ClipboardData>;
};

export type ClipboardType = 'text/plain' | 'text/html';

export type MainDom = {
  input?: HTMLInputElement;
  canvas?: HTMLCanvasElement;
};

export interface IController extends IScrollValue, IBaseModel {
  getViewSize(): IWindowSize;
  getHeaderSize(): IWindowSize;
  setHooks(hooks: IHooks): void;
  getActiveCell(): IRange;
  getCellSize(row: number, col: number): IWindowSize;
  computeCellPosition(row: number, col: number): CanvasOverlayPosition;
  getChangeSet(): Set<ChangeEventType>;
  paste(event?: ClipboardEvent): void;
  copy(event?: ClipboardEvent): void;
  cut(event?: ClipboardEvent): void;
  getCopyRanges(): IRange[];
  getDomRect(): CanvasOverlayPosition;
  setMainDom(dom: MainDom): void;
  getMainDom(): MainDom;
}
