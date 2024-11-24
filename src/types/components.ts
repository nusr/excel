import { IController } from './controller';
import { ModelCellType, Coordinate } from './model';
import type {
  ChartType,
  DefaultDataPoint,
  ChartData,
  UpdateMode,
  ChartOptions,
  Plugin,
} from 'chart.js';

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

export interface ChartProps<
  TType extends ChartType = ChartType,
  TData = DefaultDataPoint<TType>,
  TLabel = unknown,
> {
  width: number;
  height: number;
  uuid?: string;
  type: ChartType;
  data: ChartData<TType, TData, TLabel>;
  options?: ChartOptions<TType>;
  plugins?: Plugin<TType>[];
  redraw?: boolean;
  updateMode?: UpdateMode;
}

export type ThemeType = 'dark' | 'light';

export interface CollaborationProvider {
  addHistory(update: Uint8Array): void;
  retrieveHistory(): Promise<Uint8Array[]>;
  subscribe(): void;
  updateFile(file: File, base64: string): Promise<string>;
  downloadFile(filePath: string): Promise<string>;
}

export interface StateContextValue
  extends Pick<CollaborationProvider, 'updateFile' | 'downloadFile'> {
  isServer: boolean;
  controller: IController;
}
