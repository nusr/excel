import { IBaseModel } from './model';
import { CanvasOverlayPosition, ScrollValue } from './components';
import { IRange } from './range';
import { ChangeEventType, IWindowSize, IPosition } from './event';

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
  modelChange: (val: Set<ChangeEventType>) => void;
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
  getViewSize: () => IWindowSize;
  getHeaderSize: () => IWindowSize;
  setHooks: (hooks: IHooks) => void;
  setNextActiveCell: (direction: 'left' | 'right' | 'down' | 'up') => IRange;
  getActiveRange: () => ActiveRange;
  getCellSize: (range: IRange) => IWindowSize;
  computeCellPosition: (range: IRange) => IPosition;
  getChangeSet: () => Set<ChangeEventType>;
  paste: (event?: ClipboardEvent) => void;
  copy: (event?: ClipboardEvent) => void;
  cut: (event?: ClipboardEvent) => void;
  getCopyRanges: () => IRange[];
  getDomRect: () => CanvasOverlayPosition;
  setMainDom: (dom: MainDom) => void;
  getMainDom: () => MainDom;
  setScroll: (scroll: ScrollValue) => void;
  getScroll: (sheetId?: string) => ScrollValue;
}
