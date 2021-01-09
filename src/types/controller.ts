import { WorkBookJSON } from "./model";
import { CellPosition } from './store';
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
}