export function getHitInfo(event, controller) {
    const canvasSize = controller.getDomRect();
    const scroll = controller.getScroll();
    const sheetInfo = controller.getSheetInfo(controller.getCurrentSheetId());
    const headerSize = controller.getHeaderSize();
    const { pageX, pageY } = event;
    const x = pageX - canvasSize.left;
    const y = pageY - canvasSize.top;
    let resultX = headerSize.width;
    let resultY = headerSize.height;
    let row = scroll.row;
    let col = scroll.col;
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
    return { ...cellSize, row, col, pageY, pageX, x, y };
}
//# sourceMappingURL=event.js.map