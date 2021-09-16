/**
 * convert column name to number. e.g A -> 0, a -> 0
 * @param { string } columnName
 */
export function columnNameToInt(columnName = ""): number {
  const temp = columnName.toUpperCase();
  let num = 0;
  for (let i = 0; i < temp.length; i++) {
    num = temp.charCodeAt(i) - 64 + num * 26;
  }
  return num - 1;
}
/**
 * convert number to column name 0 -> A
 * @param { string } number
 */
export function intToColumnName(temp: number): string {
  const num = temp + 1;
  let columnName = "";
  let dividend = Math.floor(Math.abs(num));
  let rest;

  while (dividend > 0) {
    rest = (dividend - 1) % 26;
    columnName = String.fromCharCode(65 + rest) + columnName;
    dividend = Math.floor((dividend - rest) / 26);
  }
  return columnName.toUpperCase();
}

export function rowLabelToInt(label: string): number {
  let result = parseInt(label, 10);
  if (window.isNaN(result)) {
    result = -1;
  } else {
    result = Math.max(result - 1, -1);
  }
  return result;
}

export function intToRowLabel(row: number): string {
  if (row >= 0) {
    return `${row + 1}`;
  }
  return "";
}
