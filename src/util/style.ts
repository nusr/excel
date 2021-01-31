/**
 * font-style:  none | normal | italic | oblique
 * font-variant none | normal | small-caps // 作用不大
 * font-weight  none | normal | bold | 数字
 * font-size
 * line-height
 * font-family
 * e.g italic bold 14px/16px sans-serif;
 */
import { npx } from "./dpr";
import { CSSProperties } from "react";

export const DEFAULT_FONT_SIZE = 11;
export const DEFAULT_FONT_COLOR = "#333333";
export const MUST_FONT_FAMILY = "sans-serif";
export const DEFAULT_FONT_FAMILY = "Source Sans Pro";

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
  fontStyle: CSSProperties["fontStyle"] = "normal",
  fontWeight = "normal",
  fontSize: number = DEFAULT_FONT_SIZE,
  fontFamily: CSSProperties["fontFamily"] = DEFAULT_FONT_FAMILY
): string {
  const result = `${fontStyle} ${fontWeight} ${npx(
    fontSize
  )}px ${fontFamily},${MUST_FONT_FAMILY}`;
  console.log(result);
  return result;
}
