import { WorkBookJSON } from "./model";
import { CellPosition } from './store';
import { IWindowSize } from '@/util';
export interface IController {
  addSheet(): void;
  reset(): void;
  selectAll(): void;
  loadJSON(json: WorkBookJSON): void;
  selectRow(offsetX: number, offsetY: number): void;
  selectCol(offsetX: number, offsetY: number): void;
  setActiveCell(offsetX: number, offsetY: number): void;
  quitEditing(): void;
  enterEditing(): void;
  windowResize(): void;
  setCurrentSheetId(id: string): void;
  setCellValue(row: number, col: number, value: string): void;
  clickPositionToCell(offsetX: number, offsetY: number): CellPosition;
  getCanvasSize(): IWindowSize;
  getDrawSize(config: IWindowSize): IWindowSize;
}