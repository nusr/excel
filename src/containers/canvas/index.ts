import { h, SmartComponent } from '@/react';
import { IController, ScrollStatus } from '@/types';
import { MAIN_CANVAS_ID, SCROLL_SIZE } from '@/util';
import { computeScrollRowAndCol, computeScrollPosition } from '@/canvas';

function scrollBar(controller: IController, scrollX: number, scrollY: number) {
  const oldScroll = controller.getScroll();
  const { maxHeight, maxScrollHeight, maxScrollWidth, maxWidth } =
    computeScrollPosition(controller, oldScroll.left, oldScroll.top);

  let scrollTop = oldScroll.scrollTop + Math.ceil(scrollY);
  let scrollLeft = oldScroll.scrollLeft + Math.ceil(scrollX);
  if (scrollTop < 0) {
    scrollTop = 0;
  } else if (scrollTop > maxScrollHeight) {
    scrollTop = maxScrollHeight;
  }
  if (scrollLeft < 0) {
    scrollLeft = 0;
  } else if (scrollLeft > maxScrollWidth) {
    scrollLeft = maxScrollWidth;
  }
  const top = Math.floor((maxHeight * scrollTop) / maxScrollHeight);
  const left = Math.floor((maxWidth * scrollLeft) / maxScrollWidth);
  const { row, col } = computeScrollRowAndCol(controller, left, top);
  controller.setScroll({
    top,
    left,
    row,
    col,
    scrollLeft,
    scrollTop,
  });
}
let prevPageY = 0;
let prevPageX = 0;
let scrollStatus = ScrollStatus.NONE;
export const CanvasContainer: SmartComponent = (state, controller) => {
  const { headerSize } = state;

  function handleDrag(event: MouseEvent) {
    event.stopPropagation();
    if (scrollStatus === ScrollStatus.VERTICAL) {
      if (prevPageY) {
        scrollBar(controller, 0, event.pageY - prevPageY);
      }
      prevPageY = event.pageY;
    } else if (scrollStatus === ScrollStatus.HORIZONTAL) {
      if (prevPageX) {
        scrollBar(controller, event.pageX - prevPageX, 0);
      }
      prevPageX = event.pageX;
    }
  }
  function handleDragEnd() {
    scrollStatus = ScrollStatus.NONE;
    prevPageY = 0;
    prevPageX = 0;
    tearDown();
  }
  function tearDown() {
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', handleDragEnd);
  }
  function register() {
    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', handleDragEnd);
  }
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
        onmouseleave() {
          handleDragEnd();
        },
        onmousedown() {
          if (scrollStatus) {
            return;
          }
          scrollStatus = ScrollStatus.VERTICAL;
          register();
        },
      },
      h('div', {
        className: 'vertical-scroll-bar-content',
        style: {
          height: SCROLL_SIZE,
          transform: `translateY(${state.scrollTop}px)`,
        },
      }),
    ),
    h(
      'div',
      {
        className: 'horizontal-scroll-bar',
        style: {
          left: headerSize.width,
        },
        onmouseleave() {
          handleDragEnd();
        },
        onmousedown() {
          if (scrollStatus) {
            return;
          }
          scrollStatus = ScrollStatus.HORIZONTAL;
          register();
        },
      },
      h('div', {
        className: 'horizontal-scroll-bar-content',
        style: {
          width: SCROLL_SIZE,
          transform: `translateX(${state.scrollLeft}px)`,
        },
      }),
    ),
  );
};
CanvasContainer.displayName = 'CanvasContainer';
