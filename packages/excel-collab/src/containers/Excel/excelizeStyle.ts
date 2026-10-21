import type { Style } from 'excelize-wasm';
import {
  EHorizontalAlign,
  EVerticalAlign,
  EUnderLine,
  type StyleType,
  type BorderType,
} from '../../types';
import { NUMBER_FORMAT_LIST } from '../../util';
import { getFormatFromId } from 'numfmt';

const BORDER_TYPES: BorderType[] = [
  'thin', 'medium', 'dashed', 'dotted', 'thick', 'double', 'hair',
  'mediumDashed', 'dashDot', 'mediumDashDot', 'dashDotDot', 'mediumDashDotDot',
];
const HORIZONTAL = ['left', 'center', 'right'];
const VERTICAL = ['top', 'center', 'bottom'];
const BORDER_SIDES = {
  left: 'borderLeft',
  right: 'borderRight',
  top: 'borderTop',
  bottom: 'borderBottom',
} as const;

function color(value?: string): string | undefined {
  const hex = value?.replace(/^#/, '').replace(/^([0-9a-f]{2})([0-9a-f]{6})$/i, '$2');
  return hex && /^[0-9a-f]{6}$/i.test(hex) ? `#${hex.toUpperCase()}` : undefined;
}

export function fromExcelizeStyle(source: Style): Partial<StyleType> {
  const result: Partial<StyleType> = {};
  const font = source.Font;
  if (font) {
    if (font.Size) result.fontSize = font.Size;
    if (font.Family) result.fontFamily = font.Family;
    if (font.Bold) result.isBold = true;
    if (font.Italic) result.isItalic = true;
    if (font.Strike) result.isStrike = true;
    if (font.Underline) {
      result.underline = font.Underline.toLowerCase().includes('double')
        ? EUnderLine.DOUBLE : EUnderLine.SINGLE;
    }
    const fontColor = color(font.Color);
    if (fontColor) result.fontColor = fontColor;
  }
  if (source.Fill?.Type === 'pattern' && source.Fill.Pattern) {
    const fillColor = color(source.Fill.Color?.[0]);
    if (fillColor) result.fillColor = fillColor;
  }
  const alignment = source.Alignment;
  if (alignment) {
    const horizontal = HORIZONTAL.indexOf(alignment.Horizontal ?? '');
    const vertical = VERTICAL.indexOf(alignment.Vertical ?? '');
    if (horizontal >= 0) result.horizontalAlign = horizontal as EHorizontalAlign;
    if (vertical >= 0) result.verticalAlign = vertical as EVerticalAlign;
    if (alignment.WrapText) result.isWrapText = true;
  }
  for (const border of source.Border ?? []) {
    const side = BORDER_SIDES[border.Type as keyof typeof BORDER_SIDES];
    const type = BORDER_TYPES[(border.Style ?? 0) - 1];
    if (side && type) result[side] = { type, color: color(border.Color) ?? '' };
  }
  const numberFormat = source.CustomNumFmt ??
    NUMBER_FORMAT_LIST.find((item) => item.id === source.NumFmt)?.formatCode ??
    (source.NumFmt !== undefined ? getFormatFromId(source.NumFmt) : undefined);
  if (numberFormat && numberFormat !== 'General') result.numberFormat = numberFormat;
  return result;
}

export function toExcelizeStyle(source: Partial<StyleType>): Style {
  const result: Style = {};
  if (source.numberFormat) result.CustomNumFmt = source.numberFormat;
  if (source.fillColor) {
    result.Fill = { Type: 'pattern', Pattern: 1, Color: [source.fillColor.replace(/^#/, '')] };
  }
  const font: NonNullable<Style['Font']> = {};
  if (source.fontSize !== undefined) font.Size = source.fontSize;
  if (source.fontFamily) font.Family = source.fontFamily;
  if (source.fontColor) font.Color = source.fontColor.replace(/^#/, '');
  if (source.isBold !== undefined) font.Bold = source.isBold;
  if (source.isItalic !== undefined) font.Italic = source.isItalic;
  if (source.isStrike !== undefined) font.Strike = source.isStrike;
  if (source.underline) {
    font.Underline = source.underline === EUnderLine.DOUBLE ? 'double' : 'single';
  }
  if (Object.keys(font).length) result.Font = font;
  const alignment: NonNullable<Style['Alignment']> = {};
  if (source.horizontalAlign !== undefined) alignment.Horizontal = HORIZONTAL[source.horizontalAlign];
  if (source.verticalAlign !== undefined) alignment.Vertical = VERTICAL[source.verticalAlign];
  if (source.isWrapText !== undefined) alignment.WrapText = source.isWrapText;
  if (Object.keys(alignment).length) result.Alignment = alignment;
  for (const [side, key] of Object.entries(BORDER_SIDES)) {
    const border = source[key];
    if (border) {
      (result.Border ??= []).push({
        Type: side,
        Style: BORDER_TYPES.indexOf(border.type) + 1,
        Color: border.color.replace(/^#/, ''),
      });
    }
  }
  return result;
}
