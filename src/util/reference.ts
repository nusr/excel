import { assert } from "./assert";
import { columnNameToInt } from "./convert";
import { Range } from "./range";
function isCharacter(text: string): boolean {
  return (text >= "a" && text <= "z") || (text >= "A" && text <= "Z");
}
function isNum(text: string): boolean {
  return text >= "0" && text <= "9";
}
export function parseReference(text: string, sheetId: string): Range {
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
  return new Range(row, col, 1, 1, sheetId);
}
