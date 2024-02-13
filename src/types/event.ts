export type ChangeEventType =
  | 'content'
  | 'antLine'
  | 'sheetList'
  | 'currentSheetId'
  | 'setActiveCell'
  | 'setCellStyle'
  | 'setCellValues'
  | 'scroll'
  | 'floatElement'
  | 'row'
  | 'col';

export interface IWindowSize {
  width: number;
  height: number;
}

export interface EventType {
  changeSet: Set<ChangeEventType>;
}

export interface IHitInfo {
  width: number;
  height: number;
  x: number;
  y: number;
  row: number;
  col: number;
}
