/**
 * font-style:  none | normal | italic | oblique
 * font-variant none | normal | small-caps // 作用不大
 * font-weight  none | normal | bold | 数字
 * font-size
 * line-height
 * font-family
 * e.g italic bold 14px/16px sans-serif;
 */
import type { CSSProperties } from "react";
import { npx } from "./dpr";

export const DEFAULT_FONT_SIZE = 11;
export const DEFAULT_FONT_COLOR = "#333333";
export const ERROR_FORMULA_COLOR = "#ff0000";
export const DEFAULT_FILL_COLOR = "transparent";
export const MUST_FONT_FAMILY = "sans-serif";
export const DEFAULT_FONT_FAMILY = "宋体";

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

export const FONT_FAMILY_LIST = [
  DEFAULT_FONT_FAMILY,
  "Times New Roman",
  "Arial",
  "Tahoma",
  "Verdana",
  "微软雅黑",
  "黑体",
  "楷体",
  "仿宋",
  "新宋体",
  "华文新魏",
  "华文行楷",
  "华文隶书",
  "苹方",
];

export function makeFont(
  fontStyle: CSSProperties["fontStyle"] = "normal",
  fontWeight = "normal",
  fontSize = 12,
  fontFamily: CSSProperties["fontFamily"] = DEFAULT_FONT_FAMILY
): string {
  return `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily},${MUST_FONT_FAMILY}`;
}

export const DEFAULT_FONT_CONFIG = makeFont(
  undefined,
  "500",
  npx(DEFAULT_FONT_SIZE)
);
