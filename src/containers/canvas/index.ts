import { h } from '@/react';
import { MAIN_CANVAS_ID } from '@/util';
import { Component } from '@/types'

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
