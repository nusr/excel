import type { IHitInfo, IController } from '@/types';

export function getHitInfo(
  controller: IController,
  x: number,
  y: number,
): IHitInfo | null {
  if (x < 0 || y < 0) {
    return null;
  }
  const scroll = controller.getScroll();
  const sheetInfo = controller.getSheetInfo(controller.getCurrentSheetId());
  const headerSize = controller.getHeaderSize();
  let resultX = headerSize.width;
  let resultY = headerSize.height;
  let { row } = scroll;
  let { col } = scroll;
  while (resultX + controller.getColWidth(col) <= x) {
    resultX += controller.getColWidth(col);
    col++;
  }
  while (resultY + controller.getRowHeight(row) <= y) {
    resultY += controller.getRowHeight(row);
    row++;
  }
  if (row >= sheetInfo.rowCount || col >= sheetInfo.colCount) {
    return null;
  }
  const cellSize = controller.getCellSize(row, col);
  return { ...cellSize, row, col, x, y };
}
