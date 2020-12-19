/**
 * convert column name to number. e.g A -> 1, a -> 1
 * @param { string } columnName
 */
export function columnNameToInt(columnName: string): number {
  const temp = columnName.toUpperCase();
  let num = 0;
  for (let i = 0; i < temp.length; i++) {
    num = temp.charCodeAt(i) - 64 + num * 26;
  }
  return num;
}
/**
 * convert number to column name
 * @param { string } number
 */
export function intToColumnName(number: number): string {
  let columnName = "";
  let dividend = Math.floor(Math.abs(number));
  let rest;

  while (dividend > 0) {
    rest = (dividend - 1) % 26;
    columnName = String.fromCharCode(65 + rest) + columnName;
    dividend = Math.floor((dividend - rest) / 26);
  }
  return columnName.toUpperCase();
}
