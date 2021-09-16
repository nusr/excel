import { columnNameToInt, rowLabelToInt } from "./convert";
import { Range } from "./range";
import { DEFAULT_ROW_COUNT, DEFAULT_COL_COUNT } from "./constant";

const isCharacter = (char: string) =>
  (char >= "a" && char <= "z") || (char >= "A" && char <= "Z");
const isNum = (char: string) => char >= "0" && char <= "9";

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
  let i = 0;
  let rowText = "";
  let colText = "";
  if (text[i] === "$") {
    i++;
  }
  while (isCharacter(text[i])) {
    colText += text[i++];
  }
  if (text[i] === "$") {
    i++;
  }
  while (isNum(text[i])) {
    rowText += text[i++];
  }

  let rowCount = 1;
  let colCount = 1;
  let row = 0;
  let col = 0;
  if (rowText === "") {
    row = 0;
    colCount = 0;
    rowCount = DEFAULT_ROW_COUNT;
  } else {
    row = rowLabelToInt(rowText);
  }
  if (colText === "") {
    col = 0;
    colCount = DEFAULT_COL_COUNT;
    rowCount = 0;
  } else {
    col = columnNameToInt(colText);
  }
  const range = new Range(row, col, rowCount, colCount, sheetId || sheetName);
  return range;
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
