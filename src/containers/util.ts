import { QueryCellResult } from "@/types";
import { DEFAULT_FONT_COLOR, makeFont, DEFAULT_FONT_SIZE } from "@/util";
import { isEmpty } from "@/lodash";
import type { CSSProperties } from "react";

export function getEditorStyle(
  style: QueryCellResult["style"]
): CSSProperties | undefined {
  if (isEmpty(style)) {
    return undefined;
  }
  const font = makeFont(
    style?.isItalic ? "italic" : "normal",
    style?.isBold ? "bold" : "500",
    style?.fontSize || DEFAULT_FONT_SIZE,
    style?.fontFamily
  );
  return {
    backgroundColor: style?.fillColor || "inherit",
    color: style?.fontColor || DEFAULT_FONT_COLOR,
    font,
  };
}
