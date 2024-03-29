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
import { EUnderLine, StyleType } from '@/types';

export const DEFAULT_FONT_SIZE = 11;
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
  fontFamily = '',
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
  if (fontWeight && ['700', '800', '900', 'bold'].includes(fontWeight)) {
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
  tagName: string,
): Partial<StyleType> {
  let result: Partial<StyleType> = {};
  const t = styleMap[tagName] || styleMap[tagName.toLowerCase()];
  if (t) {
    result = pickCSSStyle(t);
  }
  if (styleMap[className]) {
    result = Object.assign(result, pickCSSStyle(styleMap[className]));
  }

  result = Object.assign(result, pickCSSStyle(style));

  if (tagName === 's' || tagName === 'strike') {
    result.isStrike = true;
  } else if (tagName === 'i') {
    result.isItalic = true;
  } else if (tagName === 'b' || tagName === 'strong') {
    result.isBold = true;
  } else if (tagName === 'u') {
    result.underline = EUnderLine.SINGLE;
  }
  return result;
}

function convertToCssStyleDeclaration(cssStr: string) {
  const str = cssStr.replace(/\s+/g, '').replace('<!--', '');
  const regex = /([^{}]+)\s*\{([^}]*)\}/g;
  const matches: Record<string, Partial<CSSStyleDeclaration>> = {};
  let match;
  while ((match = regex.exec(str)) !== null) {
    let div: HTMLDivElement | null = document.createElement('div');
    div.style.cssText = match[2];
    const key = match[1].trim();
    matches[key] = div.style;
    div = null;
  }
  return matches;
}

export function parseHTML(html: string) {
  let template: HTMLTemplateElement | null = document.createElement('template');
  template.innerHTML = html;
  const doc = template.content;
  const styleMap: Record<string, CSSStyleDeclaration> = {};
  for (const item of doc.querySelectorAll('style')) {
    const temp = convertToCssStyleDeclaration(item.textContent || '');
    for (const [key, value] of Object.entries(temp)) {
      styleMap[key] = Object.assign(styleMap[key] || {}, value);
    }
  }
  const textList: string[][] = [];
  const styleList: Array<Array<Partial<StyleType>>> = [];
  // TODO col width and row height
  // const colList = doc.querySelectorAll('col');
  const trList = doc.querySelectorAll('tr');
  for (const tr of trList) {
    const texts: string[] = [];
    const list: Array<Partial<StyleType>> = [];
    for (const td of tr.children) {
      if (td.tagName !== 'TD') {
        continue;
      }
      let temp = td as HTMLElement;
      let itemStyle: Partial<StyleType> = {};
      while (temp.nodeType !== Node.TEXT_NODE) {
        const style = parseStyle(
          styleMap,
          temp.style,
          temp.className ? `.${temp.className}` : '',
          temp.tagName,
        );
        itemStyle = Object.assign(itemStyle, style);
        if (temp.firstChild) {
          temp = temp.firstChild as HTMLElement;
        } else {
          break;
        }
      }
      list.push(itemStyle);
      texts.push(temp.textContent || '');
    }
    textList.push(texts);
    styleList.push(list);
  }
  template = null;
  return {
    textList,
    styleList,
  };
}
