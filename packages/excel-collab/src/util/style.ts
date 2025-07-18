/**
 * font-style:  none | normal | italic | oblique
 * font-variant none | normal | small-caps // 作用不大
 * font-weight  none | normal | bold | 数字
 * font-size
 * line-height
 * font-family
 * e.g italic bold 14px/16px sans-serif;
 */

import { EUnderLine, StyleType, ResultType } from '../types';
import { DEFAULT_FONT_SIZE, MUST_FONT_FAMILY } from './constant';
import { camelCase } from './lodash';
import { parseNumber } from './util';

export const FONT_SIZE_LIST = [
  6,
  8,
  9,
  10,
  DEFAULT_FONT_SIZE,
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
  fontSize = DEFAULT_FONT_SIZE,
  fontFamily = '',
): string {
  const temp = `${fontStyle} ${fontWeight} ${fontSize}px `;
  const fontFamilyList: string[] = [
    'Source Code Pro',
    fontFamily,
    MUST_FONT_FAMILY,
  ].filter((v) => v.trim());

  return temp + fontFamilyList.join(',');
}

export function convertToCssString(style: Partial<StyleType>): string {
  let result = '';
  if (style.fontColor) {
    result += `color:${style.fontColor};`;
  }
  if (style.fillColor) {
    result += `background-color:${style.fillColor};`;
  }
  if (style.fontSize) {
    result += `font-size:${style.fontSize}pt;`;
  }
  if (style.fontFamily) {
    result += `font-family:${style.fontFamily};`;
  }
  if (style.isItalic) {
    result += 'font-style:italic;';
  }
  if (style.isBold) {
    result += 'font-weight:700;';
  }
  if (style.isWrapText) {
    result += 'white-space:normal;';
  }
  if (style.underline && style.isStrike) {
    result += 'text-decoration-line:underline line-through;';
  } else if (style.underline) {
    result += 'text-decoration-line:underline;';
  } else if (style.isStrike) {
    result += 'text-decoration-line:line-through;';
  }
  if (style.underline === EUnderLine.DOUBLE) {
    result += 'text-decoration-style: double;';
  }

  return result;
}

function pickCSSStyle(style: Partial<CSSStyleDeclaration>): Partial<StyleType> {
  const {
    color,
    backgroundColor,
    fontSize,
    fontFamily,
    fontStyle,
    fontWeight,
    whiteSpace,
    textDecorationLine,
    textDecorationStyle,
  } = style;
  const result: Partial<StyleType> = {};
  if (color) {
    result.fontColor = color;
  }
  if (backgroundColor) {
    result.fillColor = backgroundColor;
  }
  if (fontSize) {
    const size = parseInt(fontSize, 10);
    if (!isNaN(size)) {
      result.fontSize = size;
    }
  }
  if (fontFamily) {
    result.fontFamily = fontFamily;
  }
  if (fontStyle === 'italic') {
    result.isItalic = true;
  }
  if (fontWeight && [700, 800, 900, 'bold'].includes(fontWeight)) {
    result.isBold = true;
  }
  if (
    whiteSpace &&
    [
      'normal',
      'pre-wrap',
      'pre-line',
      'break-spaces',
      'revert',
      'unset',
    ].includes(whiteSpace)
  ) {
    result.isWrapText = true;
  }
  if (textDecorationLine?.includes('underline')) {
    result.underline = EUnderLine.SINGLE;
    if (textDecorationStyle === 'double') {
      result.underline = EUnderLine.DOUBLE;
    }
  }
  if (textDecorationLine?.includes('line-through')) {
    result.isStrike = true;
  }
  return result;
}

function parseStyle(
  styleMap: Record<string, CSSStyleDeclaration>,
  style: CSSStyleDeclaration,
  className: string,
  tagName: string = '',
): Partial<StyleType> {
  let result: Partial<StyleType> = {};
  const name = tagName.toLowerCase();
  const t = styleMap[tagName] || styleMap[name];
  if (t) {
    result = pickCSSStyle(t);
  }
  if (styleMap[className]) {
    result = Object.assign(result, pickCSSStyle(styleMap[className]));
  }

  result = Object.assign(result, pickCSSStyle(style));

  if (name === 's' || name === 'strike') {
    result.isStrike = true;
  } else if (name === 'i') {
    result.isItalic = true;
  } else if (name === 'b' || name === 'strong') {
    result.isBold = true;
  } else if (name === 'u') {
    result.underline = EUnderLine.SINGLE;
  }
  return result;
}

function convertToCssStyleDeclaration(cssStr: string) {
  const str = cssStr.replace(/\s+/g, '').replace('<!--', '');
  const regex = /([^{}]+)\s*\{([^}]*)\}/g;
  const matches: Record<string, Record<string, string | number>> = {};
  let match;
  while ((match = regex.exec(str)) !== null) {
    const name = (match[1] || '').trim();
    const cssText = (match[2] || '').trim();
    if (!name || !cssText) {
      continue;
    }
    matches[name] = {};
    const list = cssText.split(';');
    for (const item of list) {
      const [n, v] = item.split(':').map((v) => v.trim());
      if (!v || !n) {
        continue;
      }
      const realKey = camelCase(n);
      const [check, num] = parseNumber(v);
      const value = check ? num : v;
      matches[name][realKey] = value;
    }
  }
  return matches;
}

export function convertToPx(value: string): number {
  const num = parseInt(value, 10);
  if (isNaN(num)) {
    return -1;
  }
  // pt to px
  if (value.endsWith('pt')) {
    return Math.ceil((num * 96) / 72);
  }
  return num;
}
export function convertPxToPt(px: number, other = 'pt'): string {
  const pt = Math.floor((px * 72) / 96);
  return String(pt) + other;
}
export function parseText(text: string, splitter = '\t') {
  let list: string[];
  if (text.indexOf('\r\n') >= 0) {
    list = text.split('\r\n');
  } else {
    list = text.split('\n');
  }
  const result = list
    .map((v) => v.trim())
    .filter((v) => v)
    .map((v) =>
      v
        .split(splitter)
        .map((v) => v.trim())
        .filter((v) => v),
    );
  const textList: Array<Array<ResultType>> = [];
  for (const item of result) {
    if (item.length === 0) {
      continue;
    }
    textList.push(item);
  }
  return textList;
}

export function parseHTML(html: string) {
  let template: HTMLTemplateElement | undefined =
    document.createElement('template');
  template.innerHTML = html;
  const doc = template.content;
  const styleMap: Record<string, CSSStyleDeclaration> = {};
  for (const item of doc.querySelectorAll('style')) {
    const temp = convertToCssStyleDeclaration(item.textContent || '');
    for (const [key, value] of Object.entries(temp)) {
      styleMap[key] = Object.assign(styleMap[key] || {}, value);
    }
  }
  const textList: Array<Array<ResultType>> = [];
  const styleList: Array<Array<Partial<StyleType>>> = [];
  const trList = doc.querySelectorAll('tr');
  const colMap = new Map<number, number>();
  const rowMap = new Map<number, number>();
  let row = 0;
  for (const tr of trList) {
    const height = convertToPx(tr.style.height);
    if (height > 0) {
      rowMap.set(row++, height);
    }
    const texts: ResultType[] = [];
    const list: Array<Partial<StyleType>> = [];
    let col = 0;
    for (const td of tr.children) {
      if (td.tagName !== 'TD') {
        continue;
      }

      let temp = td as HTMLElement;
      const width = convertToPx(temp.style.width);
      if (width > 0 && !colMap.has(col)) {
        colMap.set(col++, width);
      }
      let itemStyle: Partial<StyleType> = {};
      while (temp.nodeType !== Node.TEXT_NODE) {
        const style = parseStyle(
          styleMap,
          temp.style || {},
          temp.className ? `.${temp.className}` : '',
          temp.tagName || '',
        );
        itemStyle = Object.assign(itemStyle, style);
        if (temp.firstChild) {
          temp = temp.firstChild as HTMLElement;
        } else {
          break;
        }
      }
      list.push(itemStyle);
      texts.push((temp.textContent ?? '').trim());
    }
    textList.push(texts);
    styleList.push(list);
  }
  template = undefined;
  return {
    textList,
    styleList,
    rowMap,
    colMap,
  };
}
