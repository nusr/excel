import { thinLineWidth, DEFAULT_FONT_CONFIG } from '@/util';
import { theme } from '@/util';

export const HEADER_STYLE: Pick<
  CanvasRenderingContext2D,
  | 'textAlign'
  | 'textBaseline'
  | 'font'
  | 'fillStyle'
  | 'lineWidth'
  | 'strokeStyle'
> = {
  textAlign: 'center',
  textBaseline: 'middle',
  font: DEFAULT_FONT_CONFIG,
  fillStyle: theme.black,
  lineWidth: thinLineWidth(),
  strokeStyle: theme.gridStrokeColor,
};
