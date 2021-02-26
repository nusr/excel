import { WorkBookJSON } from "./model";
import { Coordinate } from "./store";
import { IWindowSize } from "./event";

export enum EBorderLineType {
  MEDIUM,
  THICK,
  DASHED,
  DOTTED,
  DOUBLE,
}

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
  clickPositionToCell(offsetX: number, offsetY: number): Coordinate;
  getCanvasSize(): IWindowSize;
  getDrawSize(config: IWindowSize): IWindowSize;
}
