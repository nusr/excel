import { columnNameToInt, rowLabelToInt } from "./convert";
import { Range } from "./range";
const LABEL_EXTRACT_REGEXP = /^([$])?([A-Za-z]+)([$])?([0-9]+)$/;

export function parseCell(ref: string, sheetId = ""): Range | null {
  if (typeof ref !== "string" || !ref) {
    return null;
  }
  let text = ref.trim();
  const index = text.indexOf("!");
  let sheetName = "";
  if (index > -1) {
    sheetName = text.slice(0, index);
    text = text.slice(index + 1);
  }
  const result = text.toUpperCase().match(LABEL_EXTRACT_REGEXP) || [];
  const [, , col, , row] = result;
  // console.log(text, result, col, row);
  const r = rowLabelToInt(row);
  const c = columnNameToInt(col);
  const range = new Range(r, c, col ? 1 : 0, row ? 1 : 0, sheetId || sheetName);
  return range.isValid() ? range : null;
}

export function parseReference(text: string, sheetId: string): Range | null {
  const [cell1, cell2] = text.split(":");
  const startCell = parseCell(cell1, sheetId);
  if (!startCell) {
    return null;
  }
  const endCell = parseCell(cell2, sheetId);
  if (!endCell) {
    startCell.sheetId = sheetId;
    return startCell;
  }
  const rowCount = endCell.row - startCell.row + 1;
  const colCount = endCell.col - startCell.col + 1;
  return new Range(startCell.row, startCell.col, rowCount, colCount, sheetId);
}
