import React, { useRef, useEffect, Fragment, useState, useMemo } from 'react';
import { IController, EditorStatus } from '@/types';
import { getHitInfo, DEFAULT_POSITION } from '@/util';
import styles from './index.module.css';
import { coreStore } from '@/containers/store';
import { ScrollBar } from './ScrollBar';
import { ContextMenu, computeMenuStyle, ClickPosition } from './ContextMenu';
import { initCanvas } from './util';
import { checkFocus, setActiveCellValue } from '@/canvas';
import { BottomBar } from './BottomBar';
import { Dialog } from '../components';

interface Props {
  controller: IController;
}
const DOUBLE_CLICK_TIME = 300;

type State = {
  timeStamp: number;
  row: number;
  col: number;
};

export const CanvasContainer: React.FunctionComponent<Props> = (props) => {
  const { controller } = props;
  const state = useRef<State>({
    timeStamp: 0,
    row: 0,
    col: 0,
  });
  const [value, setValue] = useState(0);
  const [clickPosition, setClickPosition] = useState(ClickPosition.CONTENT);
  const [menuPosition, setMenuPosition] = useState({
    top: DEFAULT_POSITION,
    left: DEFAULT_POSITION,
  });

  const ref = useRef<HTMLCanvasElement>(null);
  const menuStyle = useMemo(() => {
    return computeMenuStyle(controller, menuPosition.top, menuPosition.left);
  }, [menuPosition]);
  useEffect(() => {
    if (!ref.current) {
      return;
    }
    controller.setMainDom({ canvas: ref.current! });
    return initCanvas(controller);
  }, []);
  const handleContextMenu = (event: React.MouseEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    const data = getHitInfo(event, controller);
    if (data) {
      state.current.row = data.row;
      state.current.col = data.col;
    }
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
    const check =
      activeCell.row >= 0 &&
      activeCell.row === position.row &&
      activeCell.col === position.col;
    if (!check) {
      if (checkFocus(controller)) {
        setActiveCellValue(controller);
      }
      controller.setActiveCell({
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

  const showDialog = (position: ClickPosition) => {
    setClickPosition(position);
    if (position === ClickPosition.COLUMN_HEADER) {
      setValue(controller.getColWidth(state.current.col));
    }
    if (position === ClickPosition.ROW_HEADER) {
      setValue(controller.getRowHeight(state.current.row));
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.currentTarget.value;
    setValue(parseInt(val, 10));
    event.stopPropagation();
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
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          ref={ref}
          data-testid="canvas-main"
        />
        <ScrollBar controller={controller} />
        <BottomBar controller={controller} />
      </div>
      {menuPosition.top >= 0 && menuPosition.left >= 0 && (
        <ContextMenu
          controller={controller}
          style={menuStyle.style}
          position={menuStyle.position}
          hideContextMenu={hideContextMenu}
          showDialog={showDialog}
        />
      )}
      <Dialog
        visible={
          clickPosition === ClickPosition.ROW_HEADER ||
          clickPosition === ClickPosition.COLUMN_HEADER
        }
        title={
          clickPosition === ClickPosition.ROW_HEADER
            ? 'Row Height'
            : 'Column Width'
        }
        onOk={() => {
          if (clickPosition === ClickPosition.ROW_HEADER) {
            controller.setRowHeight(state.current.row, value, true);
          }
          if (clickPosition === ClickPosition.COLUMN_HEADER) {
            controller.setColWidth(state.current.col, value, true);
          }
          setClickPosition(ClickPosition.CONTENT);
        }}
        onCancel={() => setClickPosition(ClickPosition.CONTENT)}
      >
        <input
          type="number"
          min="0"
          max="10000"
          value={value}
          onChange={handleChange}
        />
      </Dialog>
    </Fragment>
  );
};
CanvasContainer.displayName = 'CanvasContainer';
