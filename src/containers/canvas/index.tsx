import React, { useRef, useEffect } from 'react';
import { IController, ScrollStatus, ChangeEventType } from '@/types';
import { SCROLL_SIZE, getHitInfo, copy, cut, paste } from '@/util';
import { computeScrollRowAndCol, computeScrollPosition } from '@/canvas';
import styles from './index.module.css';
import {
  coreStore,
  contextMenuStore,
  activeCellStore,
  sheetListStore,
  fontFamilyStore,
} from '@/containers/store';
import { MainCanvas, registerGlobalEvent, Content } from '@/canvas';
import { MOCK_MODEL } from '@/model';

type Props = {
  controller: IController;
};

type State = {
  prevPageY: number;
  prevPageX: number;
  scrollStatus: ScrollStatus;
  lastTimeStamp: number;
};

function createCanvas() {
  const canvas = document.createElement('canvas');
  canvas.style.display = 'none';
  document.body.appendChild(canvas);
  return canvas;
}

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
function handleModelChange(
  changeSet: Set<ChangeEventType>,
  controller: IController,
) {
  if (
    changeSet.has('setActiveCell') ||
    changeSet.has('setCellStyle') ||
    changeSet.has('setCellValues')
  ) {
    const { top } = controller.getDomRect();
    const activeCell = controller.getActiveCell();
    const cell = controller.getCell(activeCell);
    const cellPosition = controller.computeCellPosition(
      activeCell.row,
      activeCell.col,
    );
    cellPosition.top = top + cellPosition.top;
    if (!cell.style) {
      cell.style = {};
    }
    if (!cell.style.fontFamily) {
      let defaultFontFamily = '';
      const list = fontFamilyStore.getSnapshot();
      for (const item of list) {
        if (!item.disabled) {
          defaultFontFamily = String(item.value);
          break;
        }
      }
      cell.style.fontFamily = defaultFontFamily;
    }
    activeCellStore.mergeState({
      ...cellPosition,
      ...cell,
    });
  }
  if (changeSet.has('sheetList')) {
    const sheetList = controller
      .getSheetList()
      .filter((v) => !v.isHide)
      .map((v) => ({ value: v.sheetId, label: v.name }));
    sheetListStore.setState(sheetList);
  }
  if (changeSet.has('currentSheetId')) {
    coreStore.mergeState({
      currentSheetId: controller.getCurrentSheetId(),
    });
  }
}
function initCanvas(controller: IController) {
  const content = createCanvas();
  const mainCanvas = new MainCanvas(
    controller,
    new Content(controller, content),
  );
  const resize = () => {
    mainCanvas.resize();
    mainCanvas.render({
      changeSet: new Set<ChangeEventType>(['content']),
    });
  };
  resize();
  const removeEvent = registerGlobalEvent(controller, resize);
  controller.setHooks({
    copy,
    cut,
    paste,
    modelChange: (changeSet) => {
      mainCanvas.render({ changeSet: changeSet });
      mainCanvas.render({
        changeSet: controller.getChangeSet(),
      });
      handleModelChange(changeSet, controller);
    },
  });
  controller.fromJSON(MOCK_MODEL);
  return removeEvent;
}

export const CanvasContainer: React.FunctionComponent<Props> = (props) => {
  const { controller } = props;
  const state = useRef<State>({
    prevPageX: 0,
    prevPageY: 0,
    scrollStatus: ScrollStatus.NONE,
    lastTimeStamp: 0,
  });
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current || controller.getMainDom().canvas) {
      return;
    }
    controller.setMainDom({ canvas: ref.current! });
    return initCanvas(controller);
  }, []);
  const headerSize = controller.getHeaderSize();
  const scrollData = controller.getScroll();
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
  const handleContextMenu = (event: React.MouseEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    contextMenuStore.mergeState({
      top: event.clientY,
      left: event.clientX,
    });
    return false;
  };
  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const headerSize = controller.getHeaderSize();
    const rect = controller.getDomRect();
    const { clientX, clientY } = event;
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    if (event.buttons !== 1) {
      return;
    }
    if (x > headerSize.width && y > headerSize.height) {
      const position = getHitInfo(event, controller);
      if (!position) {
        return;
      }
      const activeCell = controller.getActiveCell();
      if (activeCell.row === position.row && activeCell.col === position.col) {
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
  };
  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
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
      const sheetInfo = controller.getSheetInfo(controller.getCurrentSheetId());
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
      const sheetInfo = controller.getSheetInfo(controller.getCurrentSheetId());
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
        controller.setCellValues([[value]], [], [controller.getActiveCell()]);
        coreStore.mergeState({ isCellEditing: false });
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
      const delay = timeStamp - state.current.lastTimeStamp;
      if (delay < DOUBLE_CLICK_TIME) {
        coreStore.mergeState({ isCellEditing: true });
      }
    }

    state.current.lastTimeStamp = timeStamp;
  };
  return (
    <div className={styles['canvas-container']} data-testid="canvas-container">
      <canvas
        className={styles['canvas-content']}
        onContextMenu={handleContextMenu}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        ref={ref}
      ></canvas>
      <div
        className={styles['vertical-scroll-bar']}
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
            transform: `translateY(${scrollData.scrollTop}px)`,
          }}
        ></div>
      </div>
      <div
        className={styles['horizontal-scroll-bar']}
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
            transform: `translateX(${scrollData.scrollLeft}px)`,
          }}
        ></div>
      </div>
    </div>
  );
};
CanvasContainer.displayName = 'CanvasContainer';
