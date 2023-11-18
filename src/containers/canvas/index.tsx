import React, { useRef, useEffect, Fragment, useState } from 'react';
import { IController } from '@/types';
import { getHitInfo, DEFAULT_POSITION } from '@/util';
import styles from './index.module.css';
import { coreStore } from '@/containers/store';
import { ScrollBar } from './ScrollBar';
import { ContextMenu } from './ContextMenu';
import { initCanvas } from './util';

interface Props {
  controller: IController;
}
const DOUBLE_CLICK_TIME = 300;

export const CanvasContainer: React.FunctionComponent<Props> = (props) => {
  const { controller } = props;
  const lastTimeStamp = useRef(0);
  const [menuPosition, setMenuPosition] = useState({
    top: DEFAULT_POSITION,
    left: DEFAULT_POSITION,
  });
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
    setMenuPosition({
      top: event.clientY,
      left: event.clientX,
    });
    return false;
  };
  const hideContextMenu = () => {
    setMenuPosition({
      top: DEFAULT_POSITION,
      left: DEFAULT_POSITION,
    });
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
    const check = activeCell.row >= 0 && activeCell.row === position.row && activeCell.col === position.col;
    if (!check) {
      const inputDom = controller.getMainDom().input!;
      const isInputFocus = document.activeElement === inputDom;
      if (isInputFocus) {
        const { value } = inputDom;
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
    <Fragment>
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
      {menuPosition.top >= 0 && menuPosition.left >= 0 && (
        <ContextMenu
          controller={controller}
          top={menuPosition.top}
          left={menuPosition.left}
          hideContextMenu={hideContextMenu}
        />
      )}
    </Fragment>
  );
};
CanvasContainer.displayName = 'CanvasContainer';
