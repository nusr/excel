export const CELL_HEIGHT = 20;
export const CELL_WIDTH = 68;
export const ROW_TITLE_HEIGHT = 20;
export const COL_TITLE_WIDTH = 34;
export const DEFAULT_ACTIVE_CELL = { row: 0, col: 0 };
export function isLetter(char: string) {
  return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z');
}
