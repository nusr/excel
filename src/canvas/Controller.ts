import {
  COL_TITLE_WIDTH,
  ROW_TITLE_HEIGHT,
  CELL_WIDTH,
  CELL_HEIGHT,
} from '@/util';
import { IWindowSize, CanvasOverlayPosition } from '@/types';
export interface IHitInfo {
  width: number;
  height: number;
  x: number;
  y: number;
  row: number;
  col: number;
  pageX: number;
  pageY: number;
}

export class RenderController {
  private canvas: HTMLCanvasElement;
  private readonly rowMap: Map<number, number> = new Map([]);
  private readonly colMap: Map<number, number> = new Map([]);
  isChanged = true;
  isRendering = false;
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  getHeaderSize(): IWindowSize {
    return { width: COL_TITLE_WIDTH, height: ROW_TITLE_HEIGHT };
  }
  getColWidth(col: number): number {
    return this.colMap.get(col) || CELL_WIDTH;
  }
  setColWidth(col: number, width: number): void {
    this.colMap.set(col, width);
    if (this.isRendering) {
      this.isChanged = true;
    }
  }
  getRowHeight(row: number): number {
    return this.rowMap.get(row) || CELL_HEIGHT;
  }
  setRowHeight(row: number, height: number) {
    this.rowMap.set(row, height);
    if (this.isRendering) {
      this.isChanged = true;
    }
  }
  getCellSize(row: number, col: number): IWindowSize {
    return { width: this.getColWidth(col), height: this.getRowHeight(row) };
  }
  getHitInfo(event: MouseEvent): IHitInfo {
    const { pageX, pageY } = event;
    const size = this.canvas.getBoundingClientRect();
    const x = pageX - size.left;
    const y = pageY - size.top;
    const config = this.getHeaderSize();
    let resultX = config.width;
    let resultY = config.height;
    let row = 0;
    let col = 0;
    while (resultX + this.getColWidth(col) <= x) {
      resultX += this.getColWidth(col);
      col++;
    }
    while (resultY + this.getRowHeight(row) <= y) {
      resultY += this.getRowHeight(row);
      row++;
    }
    const cellSize = this.getCellSize(row, col);
    return { ...cellSize, row, col, pageY, pageX, x, y };
  }
  queryCell(row: number, col: number): CanvasOverlayPosition {
    const config = this.getHeaderSize();
    let resultX = config.width;
    let resultY = config.height;
    let r = 0;
    let c = 0;
    while (c < col) {
      resultX += this.getColWidth(c);
      c++;
    }
    while (r < row) {
      resultY += this.getRowHeight(r);
      r++;
    }
    const cellSize = this.getCellSize(row, col);
    return { ...cellSize, top: resultY, left: resultX };
  }
  getCanvasSize(): IWindowSize {
    const size = this.canvas.parentElement?.getBoundingClientRect();
    return {
      width: size?.width || 0,
      height: size?.height || 0,
    };
  }
  getDrawSize(): IWindowSize {
    const config = this.getHeaderSize();
    const size = this.getCanvasSize();
    const width = size.width - config.width;
    const height = size.height - config.height;
    return {
      width,
      height,
    };
  }
}
