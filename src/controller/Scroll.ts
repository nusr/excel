import { IScrollValue } from '@/types';
export class Scroll implements IScrollValue {
  private x = 0;
  private y = 0;
  private rowIndex = 0;
  private colIndex = 0;
  getX(): number {
    return this.x;
  }
  getY(): number {
    return this.y;
  }
  getColIndex(): number {
    return this.colIndex;
  }
  getRowIndex(): number {
    return this.rowIndex;
  }
}
