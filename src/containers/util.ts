import { QueryCellResult } from '@/types';
import { DEFAULT_FONT_COLOR, makeFont, DEFAULT_FONT_SIZE } from '@/util';
import { isEmpty } from '@/lodash';

export function getEditorStyle(style: QueryCellResult['style']): string {
  if (isEmpty(style)) {
    return '';
  }
  const font = makeFont(
    style?.isItalic ? 'italic' : 'normal',
    style?.isBold ? 'bold' : '500',
    style?.fontSize || DEFAULT_FONT_SIZE,
    style?.fontFamily,
  );
  return `background-color:${style?.fillColor || 'inherit'},color:${
    style?.fontColor || DEFAULT_FONT_COLOR
  },font:${font}`;
}
