import React, { useRef, useEffect, Fragment, useState, memo } from 'react';
import { IController, EditorStatus } from '@/types';
import {
  getHitInfo,
  DEFAULT_POSITION,
  headerSizeSet,
  canvasSizeSet,
} from '@/util';
import styles from './index.module.css';
import { coreStore } from '@/containers/store';
import { ScrollBar } from './ScrollBar';
import { ContextMenu } from './ContextMenu';
import { initCanvas } from './util';
import { checkFocus, setActiveCellValue } from '@/canvas';
import { BottomBar } from './BottomBar';
import { FloatElementContainer } from '../FloatElement';

interface Props {
  controller: IController;
}
const DOUBLE_CLICK_TIME = 300;

type State = {
  timeStamp: number;
};

export const CanvasContainer: React.FunctionComponent<Props> = memo((props) => {
  const { controller } = props;
  const state = useRef<State>({
    timeStamp: 0,
  });
  const [menuPosition, setMenuPosition] = useState({
    top: DEFAULT_POSITION,
    left: DEFAULT_POSITION,
  });

  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) {
      return;
    }
    const fn = initCanvas(controller, ref.current);
    return () => {
      fn();
    };
  }, []);
  const handleContextMenu = (event: React.MouseEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    setMenuPosition({
      top: event.clientY,
      left: event.clientX,
    });
  };
  const hideContextMenu = () => {
    setMenuPosition({
      top: DEFAULT_POSITION,
      left: DEFAULT_POSITION,
    });
  };
  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (event.buttons <= 0) {
      return;
    }
    const headerSize = headerSizeSet.get();
    const rect = canvasSizeSet.get();
    const { clientX = 0, clientY = 0 } = event;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const position = getHitInfo(controller, x, y);
    if (!position) {
      return;
    }
    const activeCell = controller.getActiveRange().range;
    if (activeCell.row === position.row && activeCell.col === position.col) {
      return;
    }
    if (x > headerSize.width && y > headerSize.height) {
      const colCount = Math.abs(position.col - activeCell.col) + 1;
      const rowCount = Math.abs(position.row - activeCell.row) + 1;
      controller.setActiveRange({
        row: Math.min(position.row, activeCell.row),
        col: Math.min(position.col, activeCell.col),
        rowCount,
        colCount,
        sheetId: '',
      });
      return;
    }
    // select row
    if (headerSize.width > x && headerSize.height <= y) {
      const rowCount = Math.abs(position.row - activeCell.row) + 1;
      controller.setActiveRange({
        row: Math.min(position.row, activeCell.row),
        col: Math.min(position.col, activeCell.col),
        rowCount,
        colCount: 0,
        sheetId: '',
      });
      return;
    }
    // select col
    if (headerSize.width <= x && headerSize.height > y) {
      const colCount = Math.abs(position.col - activeCell.col) + 1;
      controller.setActiveRange({
        row: Math.min(position.row, activeCell.row),
        col: Math.min(position.col, activeCell.col),
        rowCount: 0,
        colCount,
        sheetId: '',
      });
      return;
    }
  };
  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (event.buttons <= 0) {
      return;
    }
    const headerSize = headerSizeSet.get();
    const canvasRect = canvasSizeSet.get();
    const { timeStamp, clientX = 0, clientY = 0 } = event;
    const x = clientX - canvasRect.left;
    const y = clientY - canvasRect.top;
    const position = getHitInfo(controller, x, y);
    if (!position) {
      return;
    }
    // select all
    if (headerSize.width > x && headerSize.height > y) {
      controller.setActiveRange({
        row: 0,
        col: 0,
        colCount: 0,
        rowCount: 0,
        sheetId: '',
      });
      return;
    }
    // select row
    if (headerSize.width > x && headerSize.height <= y) {
      controller.setActiveRange({
        row: position.row,
        col: position.col,
        rowCount: 1,
        colCount: 0,
        sheetId: '',
      });
      return;
    }
    // select col
    if (headerSize.width <= x && headerSize.height > y) {
      controller.setActiveRange({
        row: position.row,
        col: position.col,
        rowCount: 0,
        colCount: 1,
        sheetId: '',
      });
      return;
    }
    const activeCell = controller.getActiveRange().range;
    const check =
      activeCell.row >= 0 &&
      activeCell.row === position.row &&
      activeCell.col === position.col;
    if (!check) {
      if (checkFocus()) {
        setActiveCellValue(controller);
      }
      controller.setActiveRange({
        row: position.row,
        col: position.col,
        rowCount: 1,
        colCount: 1,
        sheetId: '',
      });
    } else {
      const delay = timeStamp - state.current.timeStamp;
      if (delay < DOUBLE_CLICK_TIME) {
        coreStore.mergeState({ editorStatus: EditorStatus.EDIT_CELL });
      }
    }

    state.current.timeStamp = timeStamp;
  };

  return (
    <Fragment>
      <div
        className={styles['canvas-container']}
        data-testid="canvas-container"
      >
        <canvas
          className={styles['canvas-content']}
          onContextMenu={handleContextMenu}
          onPointerMove={handlePointerMove}
          onPointerDown={handlePointerDown}
          ref={ref}
          data-testid="canvas-main"
        />
        <ScrollBar controller={controller} />
        <BottomBar controller={controller} />
        <FloatElementContainer controller={controller} />
      </div>
      {menuPosition.top >= 0 && menuPosition.left >= 0 && (
        <ContextMenu
          {...menuPosition}
          controller={controller}
          hideContextMenu={hideContextMenu}
        />
      )}
    </Fragment>
  );
});
CanvasContainer.displayName = 'CanvasContainer';
