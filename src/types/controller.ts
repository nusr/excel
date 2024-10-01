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
  'custom/model': CustomClipboardData | null;
  'image/png': Blob | null
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
  paste(event?: ClipboardEvent): Promise<void>;
  copy(event?: ClipboardEvent): Promise<void>;
  cut(event?: ClipboardEvent): Promise<void>;
  getCopyRange(): IRange | undefined;
  setCopyRange(range: IRange | undefined): void;
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
