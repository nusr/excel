import { getThemeColor } from '../theme';
import { ThemeType } from '../types';
import { DEFAULT_LINE_WIDTH, DEFAULT_FONT_SIZE } from '../util';
import { makeFont } from '../util';
import { npx } from '../util';

export function getHeaderStyle(
  theme?: ThemeType,
): Pick<
  CanvasRenderingContext2D,
  | 'textAlign'
  | 'textBaseline'
  | 'font'
  | 'fillStyle'
  | 'lineWidth'
  | 'strokeStyle'
> {
  return {
    textAlign: 'center',
    textBaseline: 'middle',
    font: makeFont(undefined, '500', npx(DEFAULT_FONT_SIZE)),
    fillStyle: getThemeColor('black', theme),
    lineWidth: DEFAULT_LINE_WIDTH,
    strokeStyle: getThemeColor('borderColor', theme),
  };
}
