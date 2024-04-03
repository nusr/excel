import React, {
  useRef,
  Fragment,
  useSyncExternalStore,
  memo,
  useEffect,
  useCallback,
} from 'react';
import { IController, ScrollStatus, ScrollValue } from '@/types';
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
  const activeCell = controller.getActiveCell();
  if (data.row != oldScroll.row) {
    activeCell.row = data.row;
  }
  if (data.col !== oldScroll.col) {
    activeCell.col = data.col;
  }
  controller.setScroll(data);
  return data;
}
const initState: State = {
  prevPageX: 0,
  prevPageY: 0,
  scrollStatus: ScrollStatus.NONE,
};
export const ScrollBar: React.FunctionComponent<Props> = memo(
  ({ controller }) => {
    const state = useRef<State>({ ...initState });
    const { scrollLeft, scrollTop } = useSyncExternalStore(
      scrollStore.subscribe,
      scrollStore.getSnapshot,
    );
    useEffect(() => {
      function handleDragEnd() {
        state.current = { ...initState };
      }
      function handleDrag(event: PointerEvent) {
        if (
          event.buttons !== 1 ||
          state.current.scrollStatus === ScrollStatus.NONE
        ) {
          return;
        }
        if (state.current.scrollStatus === ScrollStatus.VERTICAL) {
          scrollBar(controller, 0, event.clientY - state.current.prevPageY);
          state.current.prevPageY = event.clientY;
        } else if (state.current.scrollStatus === ScrollStatus.HORIZONTAL) {
          scrollBar(controller, event.clientX - state.current.prevPageX, 0);
          state.current.prevPageX = event.clientX;
        }
      }
      document.addEventListener('pointermove', handleDrag);
      document.addEventListener('pointerup', handleDragEnd);
      return () => {
        document.removeEventListener('pointermove', handleDrag);
        document.removeEventListener('pointerup', handleDragEnd);
      };
    }, []);
    const handleVerticalBarDown = useCallback(
      (event: React.PointerEvent<HTMLDivElement>) => {
        if (event.buttons !== 1) {
          return;
        }
        state.current.prevPageX = event.clientX;
        state.current.prevPageY = event.clientY;
        state.current.scrollStatus = ScrollStatus.VERTICAL;
      },
      [],
    );
    const handleHorizontalBarDown = useCallback(
      (event: React.PointerEvent<HTMLDivElement>) => {
        if (event.buttons !== 1) {
          return;
        }
        state.current.prevPageX = event.clientX;
        state.current.prevPageY = event.clientY;
        state.current.scrollStatus = ScrollStatus.HORIZONTAL;
      },
      [],
    );
    return (
      <Fragment>
        <div
          className={styles['vertical-scroll-bar']}
          data-testid="vertical-scroll-bar"
          onPointerDown={handleVerticalBarDown}
        >
          <div
            className={styles['vertical-scroll-bar-content']}
            style={{
              transform: `translateY(${scrollTop}px)`,
            }}
            data-testid="vertical-scroll-bar-content"
          />
        </div>
        <div
          className={styles['horizontal-scroll-bar']}
          data-testid="horizontal-scroll-bar"
          onPointerDown={handleHorizontalBarDown}
        >
          <div
            className={styles['horizontal-scroll-bar-content']}
            style={{
              transform: `translateX(${scrollLeft}px)`,
            }}
            data-testid="horizontal-scroll-bar-content"
          />
        </div>
      </Fragment>
    );
  },
);
ScrollBar.displayName = 'ScrollBar';
