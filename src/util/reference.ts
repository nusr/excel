import type { Coordinate } from "@/types";
import { assert } from "./assert";
import { columnNameToInt } from "./convert";
import { Range } from "./range";
function isCharacter(text: string): boolean {
  return (text >= "a" && text <= "z") || (text >= "A" && text <= "Z");
}
function isNum(text: string): boolean {
  return text >= "0" && text <= "9";
}
function parseCell(text: string): Coordinate {
  const charList = [];
  const numList = [];
  let i = 0;
  do {
    if (isCharacter(text[i])) {
      charList.push(text[i++]);
    }
  } while (isCharacter(text[i]) && i < text.length);
  do {
    if (isNum(text[i])) {
      numList.push(text[i++]);
    }
  } while (isNum(text[i]) && i < text.length);
  assert(i === text.length);
  const col = columnNameToInt(charList.join("")) - 1;
  const row = parseInt(numList.join(""), 10) - 1;
  assert(!isNaN(col) && !isNaN(row) && col >= 0 && row >= 0);
  return { row, col };
}
export function parseReference(text: string, sheetId: string): Range {
  const [cell1, cell2] = text.split(":");
  const startCell = parseCell(cell1);
  if (!cell2) {
    return new Range(startCell.row, startCell.col, 1, 1, sheetId);
  }
  const endCell = parseCell(cell2);
  const rowCount = endCell.row - startCell.row + 1;
  const colCount = endCell.col - startCell.col + 1;
  return new Range(startCell.row, startCell.col, rowCount, colCount, sheetId);
}
