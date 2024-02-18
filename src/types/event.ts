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
  | 'defineName'
  | 'mergeCell';

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
