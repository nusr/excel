import type { ResultType } from './parser';
import type { IRange } from './range';
import type {
  WorksheetType,
  ChangeEventType,
  AutoFilterItem,
  ScrollValue,
} from './model';
import type { ThemeType, CanvasOverlayPosition } from './components';
import { type PointerEvent } from 'react';
import { type IController } from './controller';
import { ModelJSON } from './yjs';

export interface IWindowSize {
  width: number;
  height: number;
}

export interface IPosition {
  top: number;
  left: number;
}
export type RequestFormulas = {
  worksheets: ModelJSON['worksheets'];
  definedNames: Record<string, IRange>;
  currentSheetId: string;
  workbook: WorksheetType[];
};

export type ResponseFormulas = {
  list: Array<{ key: string; newValue: ResultType; sheetId: string }>;
  result?: ResultType[];
};

export type RequestRender = {
  changeSet: Set<ChangeEventType>;
  theme: ThemeType;
  canvasSize: CanvasOverlayPosition;
  headerSize: IWindowSize;
  currentSheetInfo: WorksheetType;
  scroll: ScrollValue;
  range: IRange;
  customHeight: ModelJSON['customHeight'];
  customWidth: ModelJSON['customWidth'];
  copyRange: IRange | undefined;
  currentMergeCells: IRange[];
  sheetData: ModelJSON['worksheets'];
  autoFilter?: AutoFilterItem;
};
export type RequestInit = { canvas: OffscreenCanvas; dpr: number };

export type ResponseRender = {
  rowMap: Record<string, number>;
  colMap: Record<string, number>;
};

/**
 * Interface representing the main view of a worker.
 */
export interface WorkerMainView {
  /**
   * Renders the view with the provided data.
   * @param data - The data required to render the view.
   */
  render(data: RequestRender): void;

  /**
   * Resizes the view based on the provided window size.
   * @param data - The new size of the window.
   */
  resize(data: IWindowSize): void;
}

/**
 * Represents a set of methods that a worker can perform.
 */
export type WorkerMethod = {
  /**
   * Initializes the worker with the given data.
   * @param data - The initialization data.
   */
  init(data: RequestInit): void;

  /**
   * Resizes the worker's window with the given size data.
   * @param data - The window size data.
   */
  resize(data: IWindowSize): void;

  /**
   * Renders data and executes a callback upon completion.
   * @param data - The render request data.
   * @param cb - The callback to execute with the render response data.
   * @returns A promise that resolves when the render is complete.
   */
  render(
    data: RequestRender,
    cb: (data: ResponseRender) => void,
  ): Promise<void>;

  /**
   * Computes formulas and executes a callback with the results.
   * @param data - The formulas request data.
   * @param cb - The callback to execute with the formulas response data.
   * @returns A promise that resolves to a boolean indicating success.
   */
  computeFormulas(
    data: RequestFormulas,
    cb: (data: ResponseFormulas) => boolean,
  ): Promise<boolean>;
};

export type WorkerType = Pick<WorkerMethod, 'computeFormulas'>;

export type HitInfoResult = {
  row: number;
  col: number;
  marginX: number;
  marginY: number;
};
export type EventData = {
  position?: HitInfoResult;
  x: number;
  y: number;
  controller: IController;
};

export interface ModalValue {
  type: 'filter' | 'validation';
  row: number;
  col: number;
  x: number;
  y: number;
}

export type ModalProps = ModalValue & { hide(): void };

/**
 * Interface representing an event handler for pointer events.
 */
export interface EventHandler {
  /**
   * Handles the pointer move event.
   *
   * @param data - The event data.
   * @param event - The pointer event on an HTML canvas element.
   * @returns A boolean indicating whether the event was handled, or a ModalValue.
   */
  pointerMove(
    data: EventData,
    event: PointerEvent<HTMLCanvasElement>,
  ): boolean | ModalValue;

  /**
   * Handles the pointer down event.
   *
   * @param data - The event data.
   * @param event - The pointer event on an HTML canvas element.
   * @returns A boolean indicating whether the event was handled, or a ModalValue.
   */
  pointerDown(
    data: EventData,
    event: PointerEvent<HTMLCanvasElement>,
  ): boolean | ModalValue;
}
