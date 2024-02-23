import {
  KeyboardEventItem,
  IController,
  EUnderLine,
  EditorStatus,
} from '@/types';
import { BOTTOM_BUFF, SCROLL_SIZE, isMac } from '@/util';
import { coreStore } from '@/containers/store';

export function handleTabClick(controller: IController) {
  checkActiveElement(controller);
  controller.setNextActiveCell('right');
  recalculateScroll(controller);
}

export function handleEnterClick(controller: IController) {
  checkActiveElement(controller);
  controller.setNextActiveCell('down');
  recalculateScroll(controller);
}

export function computeScrollRowAndCol(
  controller: IController,
  left: number,
  top: number,
) {
  const oldScroll = controller.getScroll();
  let { row, col } = oldScroll;
  if (oldScroll.top !== top) {
    row = 0;
    let t = top;
    while (t > 0) {
      const a = controller.getRowHeight(row).len;
      if (a > t) {
        break;
      }
      t -= a;
      row++;
    }
  }
  if (oldScroll.left !== left) {
    col = 0;
    let t = left;
    while (t > 0) {
      const a = controller.getColWidth(col).len;
      if (a > t) {
        break;
      }
      t -= a;
      col++;
    }
  }

  return {
    row,
    col,
  };
}

export function computeScrollPosition(
  controller: IController,
  left: number,
  top: number,
) {
  const headerSize = controller.getHeaderSize();
  const canvasRect = controller.getDomRect();
  const viewSize = controller.getViewSize();
  const maxHeight = viewSize.height - canvasRect.height + BOTTOM_BUFF;
  const maxWidth = viewSize.width - canvasRect.width + BOTTOM_BUFF;
  const maxScrollHeight =
    canvasRect.height - headerSize.height - SCROLL_SIZE * 1.5;
  const maxScrollWidth =
    canvasRect.width - headerSize.width - SCROLL_SIZE * 1.5;

  const scrollTop = Math.floor((top * maxScrollHeight) / maxHeight);
  const scrollLeft = Math.floor((left * maxScrollWidth) / maxWidth);
  return {
    maxHeight,
    maxWidth,
    maxScrollHeight,
    maxScrollWidth,
    scrollTop,
    scrollLeft,
  };
}

export function scrollBar(
  controller: IController,
  scrollX: number,
  scrollY: number,
) {
  const oldScroll = controller.getScroll();
  const { maxHeight, maxWidth, maxScrollHeight, maxScrollWidth } =
    computeScrollPosition(controller, oldScroll.left, oldScroll.top);
  let top = oldScroll.top + Math.ceil(scrollY);
  if (top < 0) {
    top = 0;
  } else if (top > maxHeight) {
    top = maxHeight;
  }

  let left = oldScroll.left + Math.ceil(scrollX);
  if (left < 0) {
    left = 0;
  } else if (left > maxWidth) {
    left = maxWidth;
  }
  const { row, col } = computeScrollRowAndCol(controller, left, top);
  const scrollTop = Math.floor((top * maxScrollHeight) / maxHeight);
  const scrollLeft = Math.floor((left * maxScrollWidth) / maxWidth);
  controller.setScroll({
    row,
    col,
    top,
    left,
    scrollTop,
    scrollLeft,
  });
}

function recalculateScroll(controller: IController) {
  const activeCell = controller.getActiveCell();
  const temp = {
    row: activeCell.row,
    col: activeCell.col,
    colCount: 1,
    rowCount: 1,
    sheetId: '',
  };
  const position = controller.computeCellPosition(temp);
  const cellSize = controller.getCellSize(temp);
  const domRect = controller.getDomRect();
  const oldScroll = controller.getScroll();
  const sheetInfo = controller.getSheetInfo(controller.getCurrentSheetId());
  const headerSize = controller.getHeaderSize();
  const buff = 5;
  const { maxHeight, maxWidth, maxScrollHeight, maxScrollWidth } =
    computeScrollPosition(controller, oldScroll.left, oldScroll.top);
  if (position.left + cellSize.width + buff > domRect.width) {
    if (oldScroll.col <= sheetInfo.colCount - 2) {
      const col = oldScroll.col + 1;
      const left = oldScroll.left + controller.getColWidth(oldScroll.col).len;
      const scrollLeft = Math.floor((left * maxScrollWidth) / maxWidth);
      controller.setScroll({
        ...oldScroll,
        col,
        left,
        scrollLeft,
      });
    }
  }

  if (position.left - headerSize.width < domRect.left + buff) {
    if (oldScroll.col >= 1) {
      const col = oldScroll.col - 1;
      const left = oldScroll.left - controller.getColWidth(oldScroll.col).len;
      const scrollLeft = Math.floor((left * maxScrollWidth) / maxWidth);
      controller.setScroll({
        ...oldScroll,
        col,
        left,
        scrollLeft,
      });
    }
  }
  if (position.top + cellSize.height + buff > domRect.height) {
    if (oldScroll.row <= sheetInfo.rowCount - 2) {
      const row = oldScroll.row + 1;
      const top = oldScroll.top + controller.getRowHeight(oldScroll.row).len;
      const scrollTop = Math.floor((top * maxScrollHeight) / maxHeight);
      controller.setScroll({
        ...oldScroll,
        row,
        top,
        scrollTop,
      });
    }
  }

  if (position.top - headerSize.height < domRect.top + buff) {
    if (oldScroll.row >= 1) {
      const row = oldScroll.row - 1;
      const top = oldScroll.top - controller.getRowHeight(oldScroll.row).len;
      const scrollTop = Math.floor((top * maxScrollHeight) / maxHeight);
      controller.setScroll({
        ...oldScroll,
        row,
        top,
        scrollTop,
      });
    }
  }
}

export function checkFocus(controller: IController) {
  const inputDom = controller.getMainDom()?.input;
  if (!inputDom) {
    return false;
  }
  return document.activeElement === inputDom;
}

export function setActiveCellValue(controller: IController) {
  const inputDom = controller.getMainDom().input!;
  controller.setCellValues(
    [[inputDom.value]],
    [],
    [controller.getActiveRange().range],
  );
  inputDom.value = '';
  inputDom.blur();
  coreStore.mergeState({
    editorStatus: EditorStatus.NONE,
  });
}

function checkActiveElement(controller: IController) {
  if (!checkFocus(controller)) {
    return false;
  }
  setActiveCellValue(controller);
  return true;
}

export const keyboardEventList: KeyboardEventItem[] = [
  {
    key: 'Enter',
    modifierKey: [],
    handler: handleEnterClick,
  },
  {
    key: 'Tab',
    modifierKey: [],
    handler: handleTabClick,
  },
  {
    key: 'ArrowDown',
    modifierKey: [isMac() ? 'meta' : 'ctrl'],
    handler: (controller) => {
      if (checkFocus(controller)) {
        return;
      }
      checkActiveElement(controller);
      const viewSize = controller.getViewSize();
      scrollBar(controller, 0, viewSize.height);
    },
  },
  {
    key: 'ArrowUp',
    modifierKey: [isMac() ? 'meta' : 'ctrl'],
    handler: (controller) => {
      if (checkFocus(controller)) {
        return;
      }
      checkActiveElement(controller);
      const viewSize = controller.getViewSize();
      scrollBar(controller, 0, -viewSize.height);
    },
  },
  {
    key: 'ArrowRight',
    modifierKey: [isMac() ? 'meta' : 'ctrl'],
    handler: (controller) => {
      if (checkFocus(controller)) {
        return;
      }
      checkActiveElement(controller);
      const viewSize = controller.getViewSize();
      scrollBar(controller, viewSize.width, 0);
    },
  },
  {
    key: 'ArrowLeft',
    modifierKey: [isMac() ? 'meta' : 'ctrl'],
    handler: (controller) => {
      if (checkFocus(controller)) {
        return;
      }
      checkActiveElement(controller);
      const viewSize = controller.getViewSize();
      scrollBar(controller, -viewSize.width, 0);
    },
  },
  {
    key: 'ArrowDown',
    modifierKey: [],
    handler: (controller) => {
      if (checkFocus(controller)) {
        return;
      }
      handleEnterClick(controller);
    },
  },
  {
    key: 'ArrowUp',
    modifierKey: [],
    handler: (controller) => {
      if (checkFocus(controller)) {
        return;
      }
      checkActiveElement(controller);
      controller.setNextActiveCell('up');
      recalculateScroll(controller);
    },
  },
  {
    key: 'ArrowRight',
    modifierKey: [],
    handler: (controller) => {
      if (checkFocus(controller)) {
        return;
      }
      handleTabClick(controller);
    },
  },
  {
    key: 'ArrowLeft',
    modifierKey: [],
    handler: (controller) => {
      if (checkFocus(controller)) {
        return;
      }
      checkActiveElement(controller);
      controller.setNextActiveCell('left');
      recalculateScroll(controller);
    },
  },
  {
    key: 'b',
    modifierKey: [isMac() ? 'meta' : 'ctrl'],
    handler: (controller) => {
      if (checkFocus(controller)) {
        return;
      }
      const cellData = controller.getCell(controller.getActiveCell());
      if (!cellData) {
        return;
      }
      const style = cellData.style || {};
      style.isBold = !style.isBold;
      controller.setCellStyle(style, [controller.getActiveCell()]);
    },
  },
  {
    key: 'i',
    modifierKey: [isMac() ? 'meta' : 'ctrl'],
    handler: (controller) => {
      if (checkFocus(controller)) {
        return;
      }
      const cellData = controller.getCell(controller.getActiveCell());
      if (!cellData) {
        return;
      }
      const style = cellData.style || {};
      style.isItalic = !style.isItalic;
      controller.setCellStyle(style, [controller.getActiveCell()]);
    },
  },
  {
    key: '5',
    modifierKey: [isMac() ? 'meta' : 'ctrl'],
    handler: (controller) => {
      if (checkFocus(controller)) {
        return;
      }
      const cellData = controller.getCell(controller.getActiveCell());
      if (!cellData) {
        return;
      }
      const style = cellData.style || {};
      style.isStrike = !style.isStrike;
      controller.setCellStyle(style, [controller.getActiveCell()]);
    },
  },
  {
    key: 'u',
    modifierKey: [isMac() ? 'meta' : 'ctrl'],
    handler: (controller) => {
      if (checkFocus(controller)) {
        return;
      }
      const cellData = controller.getCell(controller.getActiveCell());
      if (!cellData) {
        return;
      }
      const style = cellData.style || {};
      if (
        style.underline === undefined ||
        style.underline === EUnderLine.NONE
      ) {
        style.underline = EUnderLine.SINGLE;
      } else {
        style.underline = EUnderLine.NONE;
      }
      controller.setCellStyle(style, [controller.getActiveCell()]);
    },
  },
];
