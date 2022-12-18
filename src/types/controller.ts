import { WorkBookJSON, StyleType, WorksheetType } from './model';
import { Coordinate, CellInfo, CanvasOverlayPosition } from './components';
import { IRange } from './range';
import { IScrollValue } from './scroll';
import { ChangeEventType, IWindowSize } from './event';

export enum EBorderLineType {
  MEDIUM,
  THICK,
  DASHED,
  DOTTED,
  DOUBLE,
}
export type IHooks = {
  modelChange: (val: Set<ChangeEventType>) => void;
};
export interface IController extends IScrollValue {
  isChanged: boolean;
  getSheetInfo(sheetId?: string): WorksheetType;
  getCellsContent(sheetId?: string): Array<Coordinate>;
  getRanges(): IRange[];
  setHooks(hooks: IHooks): void;
  getActiveCell(): Coordinate;
  setActiveCell(
    row: number,
    col: number,
    colCount: number,
    rowCount: number,
  ): void;
  setCurrentSheetId(sheetId: string): void;
  getCurrentSheetId(): string;
  addSheet(): void;
  selectAll(row: number, col: number): void;
  selectCol(row: number, col: number): void;
  selectRow(row: number, col: number): void;
  fromJSON(json: WorkBookJSON): void;
  toJSON(): WorkBookJSON;
  updateSelection(row: number, col: number): void;
  windowResize(): void;
  setCellStyle(style: Partial<StyleType>, ranges?: IRange[]): void;
  setCellValue(data: Coordinate, value: string): void;
  getCell(data: Coordinate): CellInfo;
  canRedo(): boolean;
  canUndo(): boolean;
  undo(): void;
  redo(): void;
  getSheetList(): WorkBookJSON['workbook'];
  getColWidth(col: number): number;
  setColWidth(col: number, width: number): void;
  getRowHeight(row: number): number;
  setRowHeight(row: number, height: number): void;
  getCellSize(row: number, col: number): IWindowSize;
  computeCellPosition(row: number, col: number): CanvasOverlayPosition;
  addRow(rowIndex: number, count: number): void;
  addCol(colIndex: number, count: number): void;
}
