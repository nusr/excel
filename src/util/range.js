export function isSheet(range) {
    return isRow(range) && isCol(range);
}
export function isRow(range) {
    return range.col === range.rowCount && range.rowCount === 0;
}
export function isCol(range) {
    return range.row === range.colCount && range.colCount === 0;
}
export function isSameRange(oldRange, newRange) {
    if (!oldRange || !newRange) {
        return false;
    }
    return (oldRange.col === newRange.col &&
        oldRange.row === newRange.row &&
        oldRange.colCount === newRange.colCount &&
        oldRange.rowCount === newRange.rowCount &&
        oldRange.sheetId === newRange.sheetId);
}
export class Range {
    row = 0;
    col = 0;
    colCount = 0;
    rowCount = 0;
    sheetId = '';
    constructor(row, col, rowCount, colCount, sheetId) {
        this.row = row;
        this.col = col;
        this.colCount = colCount;
        this.rowCount = rowCount;
        this.sheetId = sheetId;
    }
    isValid() {
        return (this.row >= 0 && this.col >= 0 && this.colCount >= 0 && this.rowCount >= 0);
    }
    static makeRange(range) {
        return new Range(range.row, range.col, range.rowCount, range.colCount, range.sheetId);
    }
}
//# sourceMappingURL=range.js.map