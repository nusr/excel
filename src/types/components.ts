import { ModelCellType, Coordinate } from './model';
import type { Doc } from 'yjs';
import type { Remote } from 'comlink';
import { IRange } from './range';
import { WorkerMethod } from './event';

export interface OptionItem {
  value: string | number;
  label: string;
  disabled: boolean;
}

export interface CanvasOverlayPosition {
  top: number;
  left: number;
  width: number;
  height: number;
}

export type ActiveCellType = ModelCellType & Coordinate & CanvasOverlayPosition;

export type Point = [x: number, y: number];

export enum ScrollStatus {
  NONE = 0,
  VERTICAL,
  HORIZONTAL,
}

export enum EditorStatus {
  NONE = 0,
  EDIT_CELL,
  EDIT_FORMULA_BAR,
}

export type ThemeType = 'dark' | 'light';

export type ClipboardData = {
  'text/plain': string;
  'text/html': string;
  'custom/model': CustomClipboardData | null;
  'image/png': Blob | null;
};

/**
 * Interface representing the hooks for clipboard operations and document handling.
 */
export interface IHooks {
  /**
   * The worker method for handling remote operations.
   */
  worker: Remote<WorkerMethod>;

  /**
   * The Yjs Doc object.
   */
  doc: Doc;
}

export type CustomClipboardData = {
  type: 'cut' | 'copy';
  range: IRange;
  floatElementUuid: string;
};

export type DocumentItem = {
  id?: string;
  name: string;
  create_time: string;
  sync?: boolean;
};

export type HistoryItem = {
  id?: number;
  doc_id: string;
  update: string;
  create_time: string;
  sync?: boolean;
};
