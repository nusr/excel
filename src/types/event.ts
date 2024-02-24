export type ChangeEventType =
  | 'antLine'
  | 'sheetList'
  | 'scroll'
  | 'floatElement'
  | 'row'
  | 'col'
  | 'cellValue'
  | 'cellStyle'
  | 'range'
  | 'defineName'
  | 'mergeCell'
  | 'sheetId';

export interface IWindowSize {
  width: number;
  height: number;
}

export interface IPosition {
  top: number;
  left: number;
}

export interface EventType {
  changeSet: Set<ChangeEventType>;
}
