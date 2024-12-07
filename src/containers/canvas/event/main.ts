import { type EventHandler, type EventData, EditorStatus } from '../../../types';
import { PointerEvent } from 'react';
import { isSameRange } from '../../../util';
import { coreStore } from '../../../containers/store';
import { checkFocus, setActiveCellValue } from '../../../canvas';

const DOUBLE_CLICK_TIME = 300;

export class MainHandler implements EventHandler {
  private lastTimeStamp = 0;
  pointerMove(data: EventData) {
    const { controller, x, y, position } = data;
    const headerSize = controller.getHeaderSize();
    if (!position) {
      return false;
    }
    const { range, isMerged } = controller.getActiveRange({
      row: position.row,
      col: position.col,
      colCount: 1,
      rowCount: 1,
      sheetId: '',
    });
    const activeCell = controller.getActiveRange().range;
    if (activeCell.row === range.row && activeCell.col === range.col) {
      return false;
    }
    let rowCount = 0;
    let colCount = 0;
    if (x > headerSize.width && y > headerSize.height) {
      if (isMerged) {
        controller.setActiveRange(range);
        return false;
      }
      colCount = Math.abs(position.col - activeCell.col) + 1;
      rowCount = Math.abs(position.row - activeCell.row) + 1;
    }
    // select row
    if (headerSize.width > x && headerSize.height <= y) {
      rowCount = Math.abs(position.row - activeCell.row) + 1;
    }
    // select col
    if (headerSize.width <= x && headerSize.height > y) {
      colCount = Math.abs(position.col - activeCell.col) + 1;
    }
    controller.setActiveRange({
      row: Math.min(position.row, activeCell.row),
      col: Math.min(position.col, activeCell.col),
      rowCount,
      colCount,
      sheetId: '',
    });
    return false;
  }
  pointerDown(data: EventData, event: PointerEvent<HTMLCanvasElement>) {
    const { controller, x, y, position } = data;
    const headerSize = controller.getHeaderSize();
    const { timeStamp } = event;
    if (!position) {
      return false;
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
      return false;
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
      return false;
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
      return false;
    }
    const { range } = controller.getActiveRange({
      row: position.row,
      col: position.col,
      colCount: 1,
      rowCount: 1,
      sheetId: controller.getCurrentSheetId(),
    });
    const activeCell = controller.getActiveRange().range;
    if (isSameRange(activeCell, range)) {
      const delay = timeStamp - this.lastTimeStamp;
      if (delay < DOUBLE_CLICK_TIME) {
        coreStore.setState({ editorStatus: EditorStatus.EDIT_CELL });
      }
    } else {
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
    }
    this.lastTimeStamp = timeStamp;
    return false;
  }
}
