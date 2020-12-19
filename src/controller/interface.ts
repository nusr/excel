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
  textAlign: string;
  textBaseline: string;
  font: string;
}