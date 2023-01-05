import { h, SmartComponent } from '@/react';
import { IController } from '@/types';
import { MAIN_CANVAS_ID, SCROLL_SIZE, BOTTOM_BUFF } from '@/util';
import { computeRowAndCol } from '@/canvas';

function scrollBar(controller: IController, scrollX: number, scrollY: number) {
  const headerSize = controller.getHeaderSize();
  const domRect = controller.getDomRect();
  const viewSize = controller.getViewSize();
  const oldScroll = controller.getScroll();

  const maxHeight = viewSize.height - domRect.height + BOTTOM_BUFF;
  const maxWidth = viewSize.width - domRect.width + BOTTOM_BUFF;

  const maxScrollHeight =
    domRect.height - headerSize.height - SCROLL_SIZE * 1.5;
  const maxScrollWidth = domRect.width - headerSize.width - SCROLL_SIZE * 1.5;
  let scrollTop = oldScroll.scrollTop + scrollY;
  let scrollLeft = oldScroll.scrollLeft + scrollX;
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
  const result = computeRowAndCol(controller, left, top);
  controller.setScroll({
    ...result,
    scrollLeft,
    scrollTop,
  });
}

enum DragStatus {
  NONE = 0,
  VERTICAL,
  HORIZONTAL,
}

let dragStatus = DragStatus.NONE;
let prevPageY = 0;
let prevPageX = 0;
export const CanvasContainer: SmartComponent = (state, controller) => {
  const headerSize = controller.getHeaderSize();
  function handleDrag(event: MouseEvent) {
    if (dragStatus === DragStatus.VERTICAL) {
      if (prevPageY) {
        scrollBar(controller, 0, event.pageY - prevPageY);
      }
      prevPageY = event.pageY;
    } else if (dragStatus === DragStatus.HORIZONTAL) {
      if (prevPageX) {
        scrollBar(controller, event.pageX - prevPageX, 0);
      }
      prevPageX = event.pageX;
    }
  }
  function handleDragEnd() {
    dragStatus = DragStatus.NONE;
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
      },
      h('div', {
        className: 'vertical-scroll-bar-content',
        style: {
          height: SCROLL_SIZE,
          transform: `translateY(${state.scrollTop}px)`,
        },
        onmousedown() {
          if (dragStatus) {
            return;
          }
          dragStatus = DragStatus.VERTICAL;
          register();
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
      },
      h('div', {
        className: 'horizontal-scroll-bar-content',
        style: {
          width: SCROLL_SIZE,
          transform: `translateX(${state.scrollLeft}px)`,
        },
        onmousedown() {
          if (dragStatus) {
            return;
          }
          dragStatus = DragStatus.HORIZONTAL;
          register();
        },
      }),
    ),
  );
};
CanvasContainer.displayName = 'CanvasContainer';
