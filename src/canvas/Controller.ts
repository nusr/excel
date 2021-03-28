import {
  COL_TITLE_WIDTH,
  ROW_TITLE_HEIGHT,
  CELL_WIDTH,
  CELL_HEIGHT,
  assert,
} from "@/util";
import { IWindowSize, CanvasOverlayPosition } from "@/types";
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
export function getWindowWidthHeight(): IWindowSize {
  return {
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
  };
}

export class Controller {
  canvas: HTMLCanvasElement;
  protected canvasRect: ClientRect;
  protected readonly rowMap: Map<number, number> = new Map([]);
  protected readonly colMap: Map<number, number> = new Map([]);
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.canvasRect = this.canvas.getBoundingClientRect();
  }
  getHeaderSize(): IWindowSize {
    return { width: COL_TITLE_WIDTH, height: ROW_TITLE_HEIGHT };
  }
  getColWidth(col: number): number {
    return this.colMap.get(col) || CELL_WIDTH;
  }
  getRowHeight(row: number): number {
    return this.rowMap.get(row) || CELL_HEIGHT;
  }
  getCellSize(row: number, col: number): IWindowSize {
    return { width: this.getColWidth(col), height: this.getRowHeight(row) };
  }
  getHitInfo(event: MouseEvent): IHitInfo {
    const { pageX, pageY } = event;
    const x = pageX - this.canvasRect.left;
    const y = pageY - this.canvasRect.top;
    const config = this.getHeaderSize();
    let resultX = config.width;
    let resultY = config.height;
    let row = 0;
    let col = 0;
    while (resultX + CELL_WIDTH <= x) {
      resultX += CELL_WIDTH;
      col++;
    }
    while (resultY + CELL_HEIGHT <= y) {
      resultY += CELL_HEIGHT;
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
      resultX += CELL_WIDTH;
      c++;
    }
    while (r < row) {
      resultY += CELL_HEIGHT;
      r++;
    }
    const cellSize = this.getCellSize(row, col);
    return { ...cellSize, top: resultY, left: resultX };
  }
  getCanvasSize(): IWindowSize {
    const { width, height } = getWindowWidthHeight();
    const toolbarDom = document.getElementById("tool-bar-container");
    const sheetBarDom = document.getElementById("sheet-bar-container");
    const formulaBarDom = document.getElementById("formula-bar-container");
    // assert(toolbarDom !== null);
    // assert(sheetBarDom !== null);
    // assert(formulaBarDom !== null);
    const toolbarSize = toolbarDom?.getBoundingClientRect();
    const sheetBarSize = sheetBarDom?.getBoundingClientRect();
    const formulaBarSize = formulaBarDom?.getBoundingClientRect();
    return {
      width,
      height:
        height -
        (toolbarSize?.height || 0) -
        (sheetBarSize?.height || 0) -
        (formulaBarSize?.height || 0),
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
