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
export const DEFAULT_FONT_COLOR = '#333333';
export const ERROR_FORMULA_COLOR = '#ff0000';
export const DEFAULT_FILL_COLOR = 'transparent';
export const MUST_FONT_FAMILY = 'sans-serif';

export const FONT_SIZE_LIST = [6, 8, 9, 10, DEFAULT_FONT_SIZE, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];

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

export const DEFAULT_FONT_CONFIG = makeFont(undefined, '500', npx(DEFAULT_FONT_SIZE));

export function convertCanvasStyleToString(style: Partial<StyleType>): string {
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
  if (style.underline) {
    result += 'text-decoration:underline;';
    if (style.underline === EUnderLine.DOUBLE) {
      result += 'text-decoration-style: double;';
    } else {
      result += 'text-decoration-style: single;';
    }
  }

  return result;
}

function convertCSSStyleToCanvasStyle(
  style: Partial<CSSStyleDeclaration>,
  selectorCSSText: string,
): Partial<StyleType> {
  const { color, backgroundColor, fontSize, fontFamily, fontStyle, fontWeight, whiteSpace, textDecoration } = style;
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
  if (whiteSpace && ['normal', 'pre-wrap', 'pre-line', 'break-spaces', 'revert', 'unset'].includes(whiteSpace)) {
    result.isWrapText = true;
  }
  if (textDecoration === 'underline') {
    result.underline = EUnderLine.SINGLE;
    if (selectorCSSText.includes('text-underline-style:double')) {
      result.underline = EUnderLine.DOUBLE;
    }
  }
  return result;
}

export function parseStyle(styleList: NodeListOf<HTMLStyleElement>, selector: string): Partial<StyleType> {
  for (const item of styleList) {
    if (!item.sheet?.cssRules) {
      continue;
    }
    const cssText = item.textContent || '';
    for (const rule of item.sheet.cssRules) {
      if (rule instanceof CSSStyleRule && rule.selectorText === selector) {
        const startIndex = cssText.indexOf(selector);
        let endIndex = startIndex;
        while (cssText[endIndex] !== '}' && endIndex < cssText.length) {
          endIndex++;
        }
        let plainText = '';
        if (startIndex >= 0) {
          plainText = cssText.slice(startIndex + selector.length, endIndex).replace(/\s/g, '');
        }
        return convertCSSStyleToCanvasStyle(rule.style, plainText);
      }
    }
  }
  return {};
}
