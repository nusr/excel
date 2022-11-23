import { h, Component } from '@/react';
import { MAIN_CANVAS_ID } from '@/util';

export const CanvasContainer: Component = () => {
  return h(
    'div',
    {
      className: 'relative canvas-container',
    },
    h('canvas', {
      className: 'full',
      id: MAIN_CANVAS_ID,
    }),
  );
};
CanvasContainer.displayName = 'CanvasContainer';
