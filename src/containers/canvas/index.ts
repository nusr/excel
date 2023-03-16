import { h, SmartComponent } from '@/react';
import { IController, ScrollStatus } from '@/types';
import { SCROLL_SIZE, getHitInfo } from '@/util';
import { computeScrollRowAndCol, computeScrollPosition } from '@/canvas';
const DOUBLE_CLICK_TIME = 300;
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
let lastTimeStamp = 0;

export const CanvasContainer: SmartComponent = (state, controller) => {
  const headerSize = controller.getHeaderSize();
  const scrollData = controller.getScroll();
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
      hook: {
        ref(dom) {
          const canvas = dom as HTMLCanvasElement;
          controller.setMainDom({ canvas });
        },
      },
      oncontextmenu(event) {
        event.preventDefault();
        state.contextMenuPosition = {
          top: event.clientY,
          left: event.clientX,
          width: 100,
          height: 100,
        };
        return false;
      },
      onmousemove(event) {
        const headerSize = controller.getHeaderSize();
        const rect = controller.getDomRect();
        const { clientX, clientY } = event;
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        if (event.buttons === 1) {
          if (x > headerSize.width && y > headerSize.height) {
            const position = getHitInfo(event, controller);
            if (!position) {
              return;
            }
            const activeCell = controller.getActiveCell();
            if (
              activeCell.row === position.row &&
              activeCell.col === position.col
            ) {
              return;
            }
            const colCount = Math.abs(position.col - activeCell.col) + 1;
            const rowCount = Math.abs(position.row - activeCell.row) + 1;
            controller.setActiveCell({
              row: Math.min(position.row, activeCell.row),
              col: Math.min(position.col, activeCell.col),
              rowCount,
              colCount,
              sheetId: '',
            });
          }
        }
      },
      onmousedown(event) {
        state.contextMenuPosition = undefined;
        const headerSize = controller.getHeaderSize();
        const canvasRect = controller.getDomRect();
        const { timeStamp, clientX, clientY } = event;
        const x = clientX - canvasRect.left;
        const y = clientY - canvasRect.top;
        const position = getHitInfo(event, controller);
        if (!position) {
          return;
        }
        if (headerSize.width > x && headerSize.height > y) {
          controller.setActiveCell({
            row: 0,
            col: 0,
            colCount: 0,
            rowCount: 0,
            sheetId: '',
          });
          return;
        }
        if (headerSize.width > x && headerSize.height <= y) {
          const sheetInfo = controller.getSheetInfo(
            controller.getCurrentSheetId(),
          );
          controller.setActiveCell({
            row: position.row,
            col: position.col,
            rowCount: 0,
            colCount: sheetInfo.colCount,
            sheetId: '',
          });
          return;
        }
        if (headerSize.width <= x && headerSize.height > y) {
          const sheetInfo = controller.getSheetInfo(
            controller.getCurrentSheetId(),
          );
          controller.setActiveCell({
            row: position.row,
            col: position.col,
            rowCount: sheetInfo.rowCount,
            colCount: 0,
            sheetId: '',
          });
          return;
        }
        const activeCell = controller.getActiveCell();
        const check =
          activeCell.row >= 0 &&
          activeCell.row === position.row &&
          activeCell.col === position.col;
        if (!check) {
          const inputDom = controller.getMainDom().input!;
          const isInputFocus = document.activeElement === inputDom;
          if (isInputFocus) {
            const value = inputDom.value;
            controller.setCellValues(
              [[value]],
              [],
              [controller.getActiveCell()],
            );
            state.isCellEditing = false;
            inputDom.value = '';
          }
          controller.setActiveCell({
            row: position.row,
            col: position.col,
            rowCount: 1,
            colCount: 1,
            sheetId: '',
          });
        } else {
          const delay = timeStamp - lastTimeStamp;
          if (delay < DOUBLE_CLICK_TIME) {
            state.isCellEditing = true;
          }
        }

        lastTimeStamp = timeStamp;
      },
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
          transform: `translateY(${scrollData.scrollTop}px)`,
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
          transform: `translateX(${scrollData.scrollLeft}px)`,
        },
      }),
    ),
  );
};
CanvasContainer.displayName = 'CanvasContainer';
