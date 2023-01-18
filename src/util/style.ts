/**
 * font-style:  none | normal | italic | oblique
 * font-variant none | normal | small-caps // 作用不大
 * font-weight  none | normal | bold | 数字
 * font-size
 * line-height
 * font-family
 * e.g italic bold 14px/16px sans-serif;
 */
import { npx } from './dpr';

export const DEFAULT_FONT_SIZE = 11;
export const DEFAULT_FONT_COLOR = '#333333';
export const ERROR_FORMULA_COLOR = '#ff0000';
export const DEFAULT_FILL_COLOR = 'transparent';
export const MUST_FONT_FAMILY = 'sans-serif';

export const FONT_SIZE_LIST = [
  6,
  8,
  9,
  10,
  DEFAULT_FONT_SIZE,
  12,
  14,
  16,
  18,
  20,
  22,
  24,
  26,
  28,
  36,
  48,
  72,
];

export function makeFont(
  fontStyle: 'none' | 'normal' | 'italic' | 'oblique' = 'normal',
  fontWeight = 'normal',
  fontSize = 12,
  fontFamily: string = '',
): string {
  const temp = `${fontStyle} ${fontWeight} ${fontSize}px `;
  if (!fontFamily) {
    return temp + MUST_FONT_FAMILY;
  }
  return `${temp}${fontFamily},${MUST_FONT_FAMILY}`;
}

export const DEFAULT_FONT_CONFIG = makeFont(
  undefined,
  '500',
  npx(DEFAULT_FONT_SIZE),
);
