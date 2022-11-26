import { h, FunctionComponent } from '@/react';
import { MAIN_CANVAS_ID } from '@/util';

export const CanvasContainer: FunctionComponent = () => {
  return h(
    'div',
    {
      className: 'relative canvas-container',
    },
    h('canvas', {
      className: 'full canvas-content',
      id: MAIN_CANVAS_ID,
    }),
  );
};
CanvasContainer.displayName = 'CanvasContainer';
