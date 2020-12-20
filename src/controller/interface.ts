export type PointType = {
  x: number;
  y: number;
};

export type RectType = {
  width: number;
  height: number;
  backgroundColor?: string;
} & PointType;
export enum EBorderLineType {
  MEDIUM,
  THICK,
  DASHED,
  DOTTED,
  DOUBLE,
}
export type CanvasOption = {
  fillStyle: string;
  lineWidth: number;
  strokeStyle: string;
  textAlign: "left" | "right" | "center" | "start" | "end";
  textBaseline:
    | "top"
    | "hanging"
    | "middle"
    | "alphabetic"
    | "ideographic"
    | "bottom";
  /**
   * font-style:  none | normal | italic | oblique
   * font-variant none | normal | small-caps // 作用不大
   * font-weight  none | normal | bold | 数字
   * font-size 
   * line-height
   * font-family
   */
  font: string; // italic bold 14px/16px sans-serif;
  direction: "ltr" | "rtl" | "inherit";
};
