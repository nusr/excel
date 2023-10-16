import React, { useRef, useEffect } from 'react';
import { IController, ChangeEventType, EUnderLine } from '@/types';
import {
  getHitInfo,
  copy,
  cut,
  paste,
  DEFAULT_FONT_SIZE,
  DEFAULT_FONT_COLOR,
} from '@/util';
import styles from './index.module.css';
import {
  coreStore,
  contextMenuStore,
  activeCellStore,
  sheetListStore,
  fontFamilyStore,
  scrollStore,
} from '@/containers/store';
import { MainCanvas, registerGlobalEvent, Content } from '@/canvas';
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

const handleStateChange = (
  changeSet: Set<ChangeEventType>,
  controller: IController,
) => {
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
    const {
      isBold = false,
      isItalic = false,
      fontSize = DEFAULT_FONT_SIZE,
      fontColor = DEFAULT_FONT_COLOR,
      fillColor = '',
      isWrapText = false,
      underline = EUnderLine.NONE,
      fontFamily = '',
      numberFormat = 0,
    } = cell.style;
    activeCellStore.setState({
      ...cellPosition,
      row: cell.row,
      col: cell.col,
      value: cell.value,
      formula: cell.formula,
      isBold,
      isItalic,
      fontColor,
      fontSize,
      fontFamily,
      fillColor,
      isWrapText,
      underline,
      numberFormat,
    });
  }
  if (changeSet.has('sheetList')) {
    const sheetList = controller
      .getSheetList()
      .map((v) => ({ value: v.sheetId, label: v.name, disabled: v.isHide }));
    sheetListStore.setState(sheetList);
  }
  if (changeSet.has('currentSheetId')) {
    coreStore.mergeState({ currentSheetId: controller.getCurrentSheetId() });
  }
  if (changeSet.has('scroll')) {
    const scroll = controller.getScroll();
    scrollStore.setState({
      scrollLeft: scroll.scrollLeft,
      scrollTop: scroll.scrollTop,
    });
  }
};

function initCanvas(controller: IController) {
  const mainCanvas = new MainCanvas(
    controller,
    new Content(controller, createCanvas()),
  );
  const render = (changeSet: Set<ChangeEventType>) => {
    mainCanvas.render({ changeSet });
    mainCanvas.render({
      changeSet: controller.getChangeSet(),
    });
  };
  const resize = (changeSet: Set<ChangeEventType>) => {
    mainCanvas.resize();
    render(changeSet);
  };

  const removeEvent = registerGlobalEvent(controller, resize);
  controller.setHooks({
    copy,
    cut,
    paste,
    modelChange: (changeSet) => {
      handleStateChange(changeSet, controller);
      render(changeSet);
    },
  });

  const changeSet = new Set<ChangeEventType>([
    'currentSheetId',
    'scroll',
    'content',
    'setActiveCell',
    'sheetList',
  ]);
  handleStateChange(changeSet, controller);
  resize(changeSet);

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
        data-testid="canvas-main"
      />
      <ScrollBar controller={controller} />
    </div>
  );
};
CanvasContainer.displayName = 'CanvasContainer';
