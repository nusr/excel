import { h, SmartComponent } from '@/react';
import {
  MAIN_CANVAS_ID,
  SCROLL_SIZE,
  ROW_TITLE_HEIGHT,
  COL_TITLE_WIDTH,
} from '@/util';

export const CanvasContainer: SmartComponent = (state) => {
  return h(
    'div',
    {
      className: 'relative canvas-container',
    },
    h('canvas', {
      className: 'full canvas-content',
      id: MAIN_CANVAS_ID,
    }),
    h(
      'div',
      {
        className: 'vertical-scroll-bar',
        style: {
          top: ROW_TITLE_HEIGHT,
        },
      },
      h('div', {
        className: 'vertical-scroll-bar-content',
        style: {
          height: SCROLL_SIZE,
          transform: `translateY(${state.scroll.top}px)`,
        },
      }),
    ),
    h(
      'div',
      {
        className: 'horizontal-scroll-bar',
        style: {
          left: COL_TITLE_WIDTH,
        },
      },
      h('div', {
        className: 'horizontal-scroll-bar-content',
        style: {
          width: SCROLL_SIZE,
          transform: `translateX(${state.scroll.left}px)`,
        },
      }),
    ),
  );
};
CanvasContainer.displayName = 'CanvasContainer';
