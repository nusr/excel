import { IBaseModel, ScrollValue } from './model';
import { CanvasOverlayPosition } from './components';
import { IRange } from './range';
import { IWindowSize, IPosition, WorkerMethod } from './event';
import type { Doc } from 'yjs';
import type { Remote } from 'comlink';

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
  'image/png': Blob | null;
};

export interface IHooks {
  copyOrCut: (textData: ClipboardData, type: 'cut' | 'copy') => Promise<void>;
  paste: () => Promise<ClipboardData>;
  worker: Remote<WorkerMethod>;
  doc: Doc;
}

export interface IController extends IBaseModel {
  getHooks(): IHooks;
  emitChange(): void;
  setNextActiveCell(direction: 'left' | 'right' | 'down' | 'up'): void;
  getCellSize(range: IRange): IWindowSize;
  computeCellPosition(range: IRange): IPosition;
  paste(event?: ClipboardEvent): Promise<void>;
  copy(event?: ClipboardEvent): Promise<void>;
  cut(event?: ClipboardEvent): Promise<void>;
  getCopyRange(): IRange | undefined;
  setCopyRange(range: IRange | undefined): void;
  setScroll(scroll: ScrollValue, sheetId?: string): void;
  getScroll(sheetId?: string): ScrollValue;
  setFloatElementUuid(uuid: string): void;
  getRowHeight(row: number, sheetId?: string): number;
  getColWidth(col: number, sheetId?: string): number;
  getSheetViewSize(): IWindowSize;
  getHeaderSize(): IWindowSize;
  setCanvasSize(size: CanvasOverlayPosition): void;
  getCanvasSize(): CanvasOverlayPosition;
}

export type CustomClipboardData = {
  type: 'cut' | 'copy';
  range: IRange;
  floatElementUuid: string;
};
