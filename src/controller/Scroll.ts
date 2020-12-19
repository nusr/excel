export interface ScrollValue {
  x: number;
  y: number;
  rowIndex: number;
  colIndex: number;
}
export class Scroll implements ScrollValue {
  x = 0;
  y = 0;
  rowIndex = 0;
  colIndex = 0;
}
