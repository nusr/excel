/**
 * font-style:  none | normal | italic | oblique
 * font-variant none | normal | small-caps // 作用不大
 * font-weight  none | normal | bold | 数字
 * font-size
 * line-height
 * font-family
 * e.g italic bold 14px/16px sans-serif;
 */
export type CanvasOption = Pick<
  CanvasRenderingContext2D,
  | "fillStyle"
  | "lineWidth"
  | "strokeStyle"
  | "textAlign"
  | "textBaseline"
  | "font"
  | "direction"
>;
