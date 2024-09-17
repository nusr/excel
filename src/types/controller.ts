import { IBaseModel } from './model';
import { CanvasOverlayPosition, ScrollValue } from './components';
import { IRange } from './range';
import { IWindowSize, IPosition, RemoteWorkerMethod } from './event';

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

export type ClipboardData = {
  'text/plain': string;
  'text/html': string;
  'custom/model': string;
  images: Blob[]
};

export interface IHooks {
  copyOrCut: (textData: ClipboardData, type: 'cut' | 'copy') => Promise<void>;
  paste: () => Promise<ClipboardData>;
  worker: RemoteWorkerMethod
}

export interface IController extends IBaseModel {
  getWorker(): RemoteWorkerMethod;
  emitChange(): void;
  setNextActiveCell(direction: 'left' | 'right' | 'down' | 'up'): void;
  getCellSize(range: IRange): IWindowSize;
  computeCellPosition(range: IRange): IPosition;
  paste(event?: ClipboardEvent): void;
  copy(event?: ClipboardEvent): void;
  cut(event?: ClipboardEvent): void;
  getCopyRange(): Promise<IRange | undefined>;
  setScroll(scroll: ScrollValue): void;
  getScroll(sheetId?: string): ScrollValue;
  setFloatElementUuid(uuid: string): void;
  batchUpdate: (fn: () => boolean, isNoHistory?: boolean) => void;
}

export type CustomClipboardData = {
  type: 'cut' | 'copy',
  range: IRange,
  floatElementUuid: string,
}
