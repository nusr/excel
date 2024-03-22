import { thinLineWidth, DEFAULT_FONT_CONFIG, getThemeColor } from '@/util';

export function getHeaderStyle(): Pick<
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
    fillStyle: getThemeColor('black'),
    lineWidth: thinLineWidth(),
    strokeStyle: getThemeColor('borderColor'),
  };
}
