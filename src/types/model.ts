export enum EVerticalAlign {
  TOP,
  MIDDLE,
  BOTTOM,
}
export enum EHorizontalAlign {
  LEFT,
  CENTER,
  RIGHT,
}
export enum EWrap {
  OVERFLOW,
  AUTO_WRAP,
}
export type StyleType = {
  fontColor: string;
  fillColor: string;
  fontSize: number;
  fontFamily: string;
  verticalAlign: EVerticalAlign;
  horizontalAlign: EHorizontalAlign;
  wrapText: EWrap;
  format: string;
};
export type WorksheetType = {
  sheetId: string;
  name: string;
  activeCell?: string;
};

export type ModelCellType = {
  value: string | number;
  formula?: string;
};
export type ModelCellStyle = {
  width?: number;
  height?: number;
  style?: string;
};
export type ModelColConfig = [value: ModelCellType, style?: ModelCellStyle]
export type ModelColType = Record<string, ModelColConfig>
export type ModelRowType = Record<string,ModelColType>
export type WorkBookJSON = {
  workbook: WorksheetType[];
  worksheets: Record<string, ModelRowType>;
  styles: Record<string, Partial<StyleType>>;
};
