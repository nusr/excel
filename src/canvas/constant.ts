import { getThemeColor } from '@/theme';
import { ThemeType } from '@/types';
import { DEFAULT_LINE_WIDTH } from '@/util/constant';
import { DEFAULT_FONT_CONFIG } from '@/util/style';

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
    font: DEFAULT_FONT_CONFIG,
    fillStyle: getThemeColor('black', theme),
    lineWidth: DEFAULT_LINE_WIDTH,
    strokeStyle: getThemeColor('borderColor', theme),
  };
}
