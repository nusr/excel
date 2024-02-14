export type ChangeEventType =
  | 'antLine'
  | 'sheetList'
  | 'currentSheetId'
  | 'scroll'
  | 'floatElement'
  | 'row'
  | 'col'
  | 'cellValue'
  | 'cellStyle'
  | 'range'
  | 'defineName';

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
