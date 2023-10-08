import React, { useRef, useEffect } from 'react';
import { IController, ChangeEventType } from '@/types';
import { getHitInfo, copy, cut, paste } from '@/util';
import styles from './index.module.css';
import {
  coreStore,
  contextMenuStore,
  activeCellStore,
  sheetListStore,
  fontFamilyStore,
  CoreStore,
} from '@/containers/store';
import { MainCanvas, registerGlobalEvent, Content } from '@/canvas';
import { MOCK_MODEL } from '@/model';
import { ScrollBar } from './ScrollBar';

type Props = {
  controller: IController;
};

function createCanvas() {
  const canvas = document.createElement('canvas');
  canvas.style.display = 'none';
  document.body.appendChild(canvas);
  return canvas;
}

const DOUBLE_CLICK_TIME = 300;

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
    // reset data
    activeCellStore.setState({
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
  const state: Partial<CoreStore> = {};
  if (changeSet.has('currentSheetId')) {
    state.currentSheetId = controller.getCurrentSheetId();

  }
  if (changeSet.has('scroll')) {
    const scroll = controller.getScroll();
    state.scrollLeft = scroll.scrollLeft;
    state.scrollTop = scroll.scrollTop;
  }
  if (Object.keys(state).length > 0) {
    coreStore.mergeState(state);
  }
}
function initCanvas(controller: IController) {
  const mainCanvas = new MainCanvas(
    controller,
    new Content(controller, createCanvas()),
  );
  const resize = () => {
    mainCanvas.resize();
    mainCanvas.render({
      changeSet: new Set<ChangeEventType>(['content', 'setActiveCell']),
    });
  };
  resize();
  const removeEvent = registerGlobalEvent(controller, resize);
  controller.setHooks({
    copy,
    cut,
    paste,
    modelChange: (changeSet) => {
      handleModelChange(changeSet, controller);
      mainCanvas.render({ changeSet: changeSet });
      const newChangeSet = controller.getChangeSet();
      mainCanvas.render({
        changeSet: newChangeSet,
      });
    },
  });
  controller.fromJSON(MOCK_MODEL);
  return removeEvent;
}

export const CanvasContainer: React.FunctionComponent<Props> = (props) => {
  const { controller } = props;
  const lastTimeStamp = useRef(0);
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) {
      return;
    }
    controller.setMainDom({ canvas: ref.current! });
    return initCanvas(controller);
  }, []);
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
      const delay = timeStamp - lastTimeStamp.current;
      if (delay < DOUBLE_CLICK_TIME) {
        coreStore.mergeState({ isCellEditing: true });
      }
    }

    lastTimeStamp.current = timeStamp;
  };
  return (
    <div className={styles['canvas-container']} data-testid="canvas-container">
      <canvas
        className={styles['canvas-content']}
        onContextMenu={handleContextMenu}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        ref={ref}
      />
      <ScrollBar controller={controller} />
    </div>
  );
};
CanvasContainer.displayName = 'CanvasContainer';
