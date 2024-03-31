import React, { useRef, Fragment, useSyncExternalStore, memo } from 'react';
import { IController, ScrollStatus, ScrollValue } from '@/types';
import { SCROLL_SIZE } from '@/util';
import { computeScrollRowAndCol, computeScrollPosition } from '@/canvas';
import styles from './index.module.css';
import { scrollStore } from '../store';

interface Props {
  controller: IController;
}

interface State {
  prevPageY: number;
  prevPageX: number;
  scrollStatus: ScrollStatus;
}

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
export const ScrollBar: React.FunctionComponent<Props> = memo(
  ({ controller }) => {
    const state = useRef<State>({
      prevPageX: 0,
      prevPageY: 0,
      scrollStatus: ScrollStatus.NONE,
    });
    const { scrollLeft, scrollTop } = useSyncExternalStore(
      scrollStore.subscribe,
      scrollStore.getSnapshot,
    );
    function handleDrag(event: PointerEvent) {
      if (event.buttons !== 1) {
        return;
      }
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
      document.removeEventListener('pointermove', handleDrag);
      document.removeEventListener('pointerup', handleDragEnd);
    }
    function register(
      event: React.PointerEvent<HTMLDivElement>,
      status: ScrollStatus,
    ) {
      if (event.buttons !== 1) {
        return;
      }
      if (state.current.scrollStatus) {
        return;
      }
      state.current.scrollStatus = status;
      document.addEventListener('pointermove', handleDrag);
      document.addEventListener('pointerup', handleDragEnd);
    }
    return (
      <Fragment>
        <div
          className={styles['vertical-scroll-bar']}
          data-testid="vertical-scroll-bar"
          onPointerLeave={handleDragEnd}
          onPointerDown={(event) => {
            register(event, ScrollStatus.VERTICAL);
          }}
        >
          <div
            className={styles['vertical-scroll-bar-content']}
            style={{
              height: SCROLL_SIZE,
              transform: `translateY(${scrollTop}px)`,
            }}
          />
        </div>
        <div
          className={styles['horizontal-scroll-bar']}
          data-testid="horizontal-scroll-bar"
          onPointerLeave={handleDragEnd}
          onPointerDown={(event) => {
            register(event, ScrollStatus.HORIZONTAL);
          }}
        >
          <div
            className={styles['horizontal-scroll-bar-content']}
            style={{
              width: SCROLL_SIZE,
              transform: `translateX(${scrollLeft}px)`,
            }}
          />
        </div>
      </Fragment>
    );
  },
);
ScrollBar.displayName = 'ScrollBar';
