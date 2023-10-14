import React, { useRef, Fragment, useSyncExternalStore } from 'react';
import { IController, ScrollStatus, ScrollValue } from '@/types';
import { SCROLL_SIZE } from '@/util';
import { computeScrollRowAndCol, computeScrollPosition } from '@/canvas';
import styles from './index.module.css';
import { scrollStore } from '../store';

type Props = {
  controller: IController;
};

type State = {
  prevPageY: number;
  prevPageX: number;
  scrollStatus: ScrollStatus;
};

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
  const data: ScrollValue = {
    top,
    left,
    row,
    col,
    scrollLeft,
    scrollTop,
  };
  controller.setScroll(data);
}
export const ScrollBar: React.FunctionComponent<Props> = ({ controller }) => {
  const state = useRef<State>({
    prevPageX: 0,
    prevPageY: 0,
    scrollStatus: ScrollStatus.NONE,
  });
  const headerSize = controller.getHeaderSize();
  const { scrollLeft, scrollTop } = useSyncExternalStore(
    scrollStore.subscribe,
    scrollStore.getSnapshot,
  );
  function handleDrag(event: MouseEvent) {
    event.stopPropagation();
    if (state.current.scrollStatus === ScrollStatus.VERTICAL) {
      if (state.current.prevPageY) {
        scrollBar(controller, 0, event.pageY - state.current.prevPageY);
      }
      state.current.prevPageY = event.pageY;
    } else if (state.current.scrollStatus === ScrollStatus.HORIZONTAL) {
      if (state.current.prevPageX) {
        scrollBar(controller, event.pageX - state.current.prevPageX, 0);
      }
      state.current.prevPageX = event.pageX;
    }
  }
  function handleDragEnd() {
    state.current.scrollStatus = ScrollStatus.NONE;
    state.current.prevPageY = 0;
    state.current.prevPageX = 0;
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
  return (
    <Fragment>
      <div
        className={styles['vertical-scroll-bar']}
        data-testid="vertical-scroll-bar"
        style={{ top: headerSize.height }}
        onMouseLeave={handleDragEnd}
        onMouseDown={() => {
          if (state.current.scrollStatus) {
            return;
          }
          state.current.scrollStatus = ScrollStatus.VERTICAL;
          register();
        }}
      >
        <div
          className={styles['vertical-scroll-bar-content']}
          style={{
            height: SCROLL_SIZE,
            transform: `translateY(${scrollTop}px)`,
          }}
        ></div>
      </div>
      <div
        className={styles['horizontal-scroll-bar']}
        data-testid="horizontal-scroll-bar"
        style={{ left: headerSize.width }}
        onMouseLeave={handleDragEnd}
        onMouseDown={() => {
          if (state.current.scrollStatus) {
            return;
          }
          state.current.scrollStatus = ScrollStatus.HORIZONTAL;
          register();
        }}
      >
        <div
          className={styles['horizontal-scroll-bar-content']}
          style={{
            width: SCROLL_SIZE,
            transform: `translateX(${scrollLeft}px)`,
          }}
        ></div>
      </div>
    </Fragment>
  );
};
ScrollBar.displayName = 'ScrollBar';
