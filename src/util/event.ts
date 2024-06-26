import type { IController } from '@/types';
import { headerSizeSet } from './set';

type HitInfoResult = {
  row: number;
  col: number;
  marginX: number;
  marginY: number;
};

export function getHitInfo(
  controller: IController,
  x: number,
  y: number,
): HitInfoResult | undefined {
  if (x < 0 || y < 0) {
    return undefined;
  }
  const sheetInfo = controller.getSheetInfo(controller.getCurrentSheetId());
  if (!sheetInfo) {
    return undefined;
  }
  const scroll = controller.getScroll();
  const headerSize = headerSizeSet.get();
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
    return undefined;
  }
  return { row, col, marginX, marginY };
}
