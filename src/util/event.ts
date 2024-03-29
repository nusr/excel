import type { IController } from '@/types';

type HitInfoResult = {
  row: number;
  col: number;
  marginX: number;
  marginY: number;
};

export function stopPropagation(event: Event) {
  event.preventDefault();
  event.stopPropagation();
}

export function getHitInfo(
  controller: IController,
  x: number,
  y: number,
): HitInfoResult | null {
  if (x < 0 || y < 0) {
    return null;
  }
  const sheetInfo = controller.getSheetInfo(controller.getCurrentSheetId());
  if (!sheetInfo) {
    return null;
  }
  const scroll = controller.getScroll();
  const headerSize = controller.getHeaderSize();
  let resultX = headerSize.width;
  let resultY = headerSize.height;
  let marginX = x - headerSize.width;
  let marginY = y - headerSize.height;
  let { row, col } = scroll;
  while (resultX + controller.getColWidth(col).len <= x) {
    const t = controller.getColWidth(col).len;
    resultX += t;
    marginX -= t;
    col++;
  }
  while (resultY + controller.getRowHeight(row).len <= y) {
    const t = controller.getRowHeight(row).len;
    resultY += t;
    marginY -= t;
    row++;
  }
  if (row >= sheetInfo.rowCount || col >= sheetInfo.colCount) {
    return null;
  }
  return { row, col, marginX, marginY };
}
