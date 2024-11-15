import React, {
  useRef,
  Fragment,
  useSyncExternalStore,
  memo,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { IController, ScrollStatus } from '@/types';
import { computeScrollRowAndCol } from '@/canvas';
import styles from './index.module.css';
import { scrollStore } from '../store';
import { computeScrollPosition } from '../../util';

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
  const size = computeScrollPosition();
  const { maxHeight, maxScrollHeight, maxScrollWidth, maxWidth } = size;
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
  controller.setScroll({ row, col, top, left, scrollLeft, scrollTop });
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
    const [toggleEvents] = useMemo(() => {
      function handlePointerUp() {
        state.current = { ...initState };
        toggleEvents(false);
      }
      function handlePointerMove(event: PointerEvent) {
        if (event.buttons <= 0) {
          toggleEvents(false);
          return;
        }
        if (state.current.scrollStatus === ScrollStatus.NONE) {
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
      function toggleEvents(state?: boolean) {
        const toggleEvent = state
          ? document.addEventListener
          : document.removeEventListener;
        toggleEvent('pointermove', handlePointerMove);
        toggleEvent('pointerup', handlePointerUp);
      }
      return [toggleEvents];
    }, []);
    useEffect(() => toggleEvents, [toggleEvents]);

    const addEvents = useCallback(
      (event: React.PointerEvent<HTMLDivElement>, status: ScrollStatus) => {
        if (event.buttons <= 0) {
          return;
        }
        toggleEvents(true);
        state.current.prevPageX = event.clientX;
        state.current.prevPageY = event.clientY;
        state.current.scrollStatus = status;
      },
      [toggleEvents],
    );

    const handleVerticalBarDown = useCallback(
      (event: React.PointerEvent<HTMLDivElement>) => {
        addEvents(event, ScrollStatus.VERTICAL);
      },
      [addEvents],
    );
    const handleHorizontalBarDown = useCallback(
      (event: React.PointerEvent<HTMLDivElement>) => {
        addEvents(event, ScrollStatus.HORIZONTAL);
      },
      [toggleEvents],
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
