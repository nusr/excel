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
   * Handles the copy or cut operation.
   *
   * @param textData - The data to be copied or cut to the clipboard.
   * @param type - The type of operation, either 'cut' or 'copy'.
   * @returns A promise that resolves when the operation is complete.
   */
  copyOrCut: (textData: ClipboardData, type: 'cut' | 'copy') => Promise<void>;

  /**
   * Handles the paste operation.
   *
   * @returns A promise that resolves with the pasted clipboard data.
   */
  paste: () => Promise<ClipboardData>;

  /**
   * The worker method for handling remote operations.
   */
  worker: Remote<WorkerMethod>;

  /**
   * The document object.
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
