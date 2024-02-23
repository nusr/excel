import type { IController, Coordinate } from '@/types';

export function getHitInfo(
  controller: IController,
  x: number,
  y: number,
): Coordinate | null {
  if (x < 0 || y < 0) {
    return null;
  }
  const scroll = controller.getScroll();
  const sheetInfo = controller.getSheetInfo(controller.getCurrentSheetId());
  const headerSize = controller.getHeaderSize();
  let resultX = headerSize.width;
  let resultY = headerSize.height;
  let { row, col } = scroll;
  while (resultX + controller.getColWidth(col).len <= x) {
    resultX += controller.getColWidth(col).len;
    col++;
  }
  while (resultY + controller.getRowHeight(row).len <= y) {
    resultY += controller.getRowHeight(row).len;
    row++;
  }
  if (row >= sheetInfo.rowCount || col >= sheetInfo.colCount) {
    return null;
  }
  return { row, col };
}
