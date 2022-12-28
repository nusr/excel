import { h, SmartComponent } from '@/react';
import { MAIN_CANVAS_ID, SCROLL_SIZE } from '@/util';

export const CanvasContainer: SmartComponent = (state, controller) => {
  const headerSize = controller.getHeaderSize();
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
          top: headerSize.height,
        },
      },
      h('div', {
        className: 'vertical-scroll-bar-content',
        style: {
          height: SCROLL_SIZE,
          transform: `translateY(${state.scroll.scrollTop}px)`,
        },
      }),
    ),
    h(
      'div',
      {
        className: 'horizontal-scroll-bar',
        style: {
          left: headerSize.height,
        },
      },
      h('div', {
        className: 'horizontal-scroll-bar-content',
        style: {
          width: SCROLL_SIZE,
          transform: `translateX(${state.scroll.scrollLeft}px)`,
        },
      }),
    ),
  );
};
CanvasContainer.displayName = 'CanvasContainer';
