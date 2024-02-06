import type { IHitInfo, IController } from '@/types';

export function getHitInfo(
  controller: IController,
  clientX: number,
  clientY: number,
): IHitInfo | null {
  const canvasSize = controller.getDomRect();
  const scroll = controller.getScroll();
  const sheetInfo = controller.getSheetInfo(controller.getCurrentSheetId());
  const headerSize = controller.getHeaderSize();
  const x = clientX - canvasSize.left;
  const y = clientY - canvasSize.top;
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
  return { ...cellSize, row, col, pageY: clientY, pageX: clientX, x, y };
}
