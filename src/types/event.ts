import type { ResultType } from './parser';
import type { IRange } from './range';
import type {
  WorkBookJSON,
  WorksheetType,
  ChangeEventType,
  WorksheetData,
  AutoFilterItem,
} from './model';
import type {
  ThemeType,
  CanvasOverlayPosition,
  ScrollValue,
} from './components';
import type { Remote } from 'comlink';
import { type PointerEvent } from 'react';
import { type IController } from './controller';

export interface IWindowSize {
  width: number;
  height: number;
}

export interface IPosition {
  top: number;
  left: number;
}
export type RequestFormulas = {
  worksheets: WorkBookJSON['worksheets'];
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
  customHeight: WorkBookJSON['customHeight'];
  customWidth: WorkBookJSON['customWidth'];
  copyRange: IRange | undefined;
  currentMergeCells: IRange[];
  sheetData: WorksheetData;
  autoFilter?: AutoFilterItem;
};
export type RequestInit = { canvas: OffscreenCanvas; dpr: number };

export type ResponseRender = {
  rowMap: Record<string, number>;
  colMap: Record<string, number>;
};
export interface WorkerMainView {
  /**
   * clear offScreenCanvas
   * render offScreenCanvas
   */
  render(data: RequestRender): void;
  /**
   * resize canvas
   * resize offScreenCanvas
   */
  resize(data: IWindowSize): void;
}

export type WorkerMethod = {
  init(data: RequestInit): void;
  resize(data: IWindowSize): void;
  render(
    data: RequestRender,
    cb: (data: ResponseRender) => void,
  ): Promise<void>;
  computeFormulas(
    data: RequestFormulas,
    cb: (data: ResponseFormulas) => void,
  ): void;
};

export type RemoteWorkerMethod = Remote<WorkerMethod>;

export type WorkerType = Pick<WorkerMethod, 'computeFormulas'>;
export type RemoteWorkerType = Remote<WorkerType>;

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

export type ModalProps = ModalValue & { controller: IController; hide(): void };

export interface EventHandler {
  pointerMove(
    data: EventData,
    event: PointerEvent<HTMLCanvasElement>,
  ): boolean | ModalValue;
  pointerDown(
    data: EventData,
    event: PointerEvent<HTMLCanvasElement>,
  ): boolean | ModalValue;
}
