import {
  KeyboardEventItem,
  IController,
  EUnderLine,
  EditorStatus,
  IRange,
  ScrollValue,
} from '@/types';
import {
  isMac,
  SHEET_ITEM_TEST_ID_PREFIX,
  sheetViewSizeSet,
  headerSizeSet,
  sizeConfig,
  mainDomSet,
} from '@/util';
import { coreStore } from '@/containers/store';
export const BOTTOM_BUFF = 200;

export function handleTabClick(controller: IController) {
  controller.batchUpdate(() => {
    checkActiveElement(controller);
    controller.setNextActiveCell('right');
    recalculateScroll(controller);
  });
}

export function handleEnterClick(controller: IController) {
  controller.batchUpdate(() => {
    checkActiveElement(controller);
    controller.setNextActiveCell('down');
    recalculateScroll(controller);
  });
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

export function scrollSheetToView(sheetId: string) {
  const selector = `div[data-testid="${SHEET_ITEM_TEST_ID_PREFIX}${sheetId}"]`;
  const dom = document.querySelector(selector);
  if (dom && typeof dom.scrollIntoView === 'function') {
    dom.scrollIntoView();
  }
}

export function scrollToView(controller: IController, range: IRange) {
  controller.batchUpdate(() => {
    const sheetId = range.sheetId || controller.getCurrentSheetId();
    if (sheetId !== controller.getCurrentSheetId()) {
      controller.setCurrentSheetId(sheetId);
    }
    const sheetInfo = controller.getSheetInfo(sheetId);
    if (!sheetInfo) {
      return;
    }
    if (
      range.row < 0 ||
      range.col < 0 ||
      range.row >= sheetInfo.rowCount ||
      range.col >= sheetInfo.colCount
    ) {
      return;
    }
    const scroll = controller.getScroll(sheetId);
    const old = controller.computeCellPosition({
      row: scroll.row,
      col: scroll.col,
      colCount: 1,
      rowCount: 1,
      sheetId: sheetId,
    });
    const size = mainDomSet.getDomRect();
    const headerSize = headerSizeSet.get();
    const { top, left } = controller.computeCellPosition(range);
    const minTop = old.top;
    const minLeft = old.left;
    const maxTop = old.top + size.height - headerSize.height;
    const maxLeft = old.left + size.width - headerSize.width;
    if (top >= minTop && top < maxTop && left >= minLeft && left <= maxLeft) {
      controller.setActiveCell(range);
      return;
    }
    const oldPosition = controller.computeCellPosition(
      controller.getActiveCell(),
    );

    scrollBar(controller, left - oldPosition.left, top - oldPosition.top);
    controller.setActiveCell(range);
  });
}

export function computeScrollPosition(left: number, top: number) {
  const contentSize = parseInt(sizeConfig.scrollBarContent, 10);
  const canvasRect = mainDomSet.getDomRect();
  const viewSize = sheetViewSizeSet.get();
  const maxHeight = viewSize.height - canvasRect.height + BOTTOM_BUFF;
  const maxWidth = viewSize.width - canvasRect.width + BOTTOM_BUFF;
  const maxScrollHeight = canvasRect.height - contentSize;
  const maxScrollWidth = canvasRect.width - contentSize;

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
    computeScrollPosition(oldScroll.left, oldScroll.top);
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
  const newValue: ScrollValue = {
    row,
    col,
    top,
    left,
    scrollTop,
    scrollLeft,
  };
  controller.setScroll(newValue);
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
  const domRect = mainDomSet.getDomRect();
  const oldScroll = controller.getScroll();
  const sheetInfo = controller.getSheetInfo(controller.getCurrentSheetId())!;
  const headerSize = headerSizeSet.get();
  const buff = 5;
  const { maxHeight, maxWidth, maxScrollHeight, maxScrollWidth } =
    computeScrollPosition(oldScroll.left, oldScroll.top);
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

export function checkFocus() {
  const inputDom = mainDomSet.get()?.input;
  if (!inputDom) {
    return false;
  }
  return document.activeElement === inputDom;
}

export function setActiveCellValue(controller: IController) {
  const inputDom = mainDomSet.get().input!;
  controller.setCell([[inputDom.value]], [], controller.getActiveRange().range);
  inputDom.value = '';
  inputDom.blur();
  coreStore.mergeState({
    editorStatus: EditorStatus.NONE,
  });
}

function checkActiveElement(controller: IController) {
  if (!checkFocus()) {
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
      if (checkFocus()) {
        return;
      }
      controller.batchUpdate(() => {
        checkActiveElement(controller);
        const viewSize = sheetViewSizeSet.get();
        scrollBar(controller, 0, viewSize.height);
      });
    },
  },
  {
    key: 'ArrowUp',
    modifierKey: [isMac() ? 'meta' : 'ctrl'],
    handler: (controller) => {
      if (checkFocus()) {
        return;
      }
      controller.batchUpdate(() => {
        checkActiveElement(controller);
        const viewSize = sheetViewSizeSet.get();
        scrollBar(controller, 0, -viewSize.height);
      });
    },
  },
  {
    key: 'ArrowRight',
    modifierKey: [isMac() ? 'meta' : 'ctrl'],
    handler: (controller) => {
      if (checkFocus()) {
        return;
      }
      controller.batchUpdate(() => {
        checkActiveElement(controller);
        const viewSize = sheetViewSizeSet.get();
        scrollBar(controller, viewSize.width, 0);
      });
    },
  },
  {
    key: 'ArrowLeft',
    modifierKey: [isMac() ? 'meta' : 'ctrl'],
    handler: (controller) => {
      if (checkFocus()) {
        return;
      }
      controller.batchUpdate(() => {
        checkActiveElement(controller);
        const viewSize = sheetViewSizeSet.get();
        scrollBar(controller, -viewSize.width, 0);
      });
    },
  },
  {
    key: 'ArrowDown',
    modifierKey: [],
    handler: (controller) => {
      if (checkFocus()) {
        return;
      }
      handleEnterClick(controller);
    },
  },
  {
    key: 'ArrowUp',
    modifierKey: [],
    handler: (controller) => {
      if (checkFocus()) {
        return;
      }
      controller.batchUpdate(() => {
        checkActiveElement(controller);
        controller.setNextActiveCell('up');
        recalculateScroll(controller);
      });
    },
  },
  {
    key: 'ArrowRight',
    modifierKey: [],
    handler: (controller) => {
      if (checkFocus()) {
        return;
      }
      handleTabClick(controller);
    },
  },
  {
    key: 'ArrowLeft',
    modifierKey: [],
    handler: (controller) => {
      if (checkFocus()) {
        return;
      }
      controller.batchUpdate(() => {
        checkActiveElement(controller);
        controller.setNextActiveCell('left');
        recalculateScroll(controller);
      });
    },
  },
  {
    key: 'b',
    modifierKey: [isMac() ? 'meta' : 'ctrl'],
    handler: (controller) => {
      if (checkFocus()) {
        return;
      }
      const cellData = controller.getCell(controller.getActiveCell());
      controller.updateCellStyle(
        { isBold: !cellData?.style?.isBold },
        controller.getActiveCell(),
      );
    },
  },
  {
    key: 'i',
    modifierKey: [isMac() ? 'meta' : 'ctrl'],
    handler: (controller) => {
      if (checkFocus()) {
        return;
      }

      const cellData = controller.getCell(controller.getActiveCell());
      controller.updateCellStyle(
        { isItalic: !cellData?.style?.isItalic },
        controller.getActiveCell(),
      );
    },
  },
  {
    key: '5',
    modifierKey: [isMac() ? 'meta' : 'ctrl'],
    handler: (controller) => {
      if (checkFocus()) {
        return;
      }
      const cellData = controller.getCell(controller.getActiveCell());
      controller.updateCellStyle(
        { isStrike: !cellData?.style?.isStrike },
        controller.getActiveCell(),
      );
    },
  },
  {
    key: 'u',
    modifierKey: [isMac() ? 'meta' : 'ctrl'],
    handler: (controller) => {
      if (checkFocus()) {
        return;
      }
      const cellData = controller.getCell(controller.getActiveCell());
      const underline = cellData?.style?.underline;
      let newUnderline = EUnderLine.NONE;
      if (underline === undefined || underline === EUnderLine.NONE) {
        newUnderline = EUnderLine.SINGLE;
      } else {
        newUnderline = EUnderLine.NONE;
      }
      controller.updateCellStyle(
        { underline: newUnderline },
        controller.getActiveCell(),
      );
    },
  },
  {
    key: 'z',
    modifierKey: [isMac() ? 'meta' : 'ctrl'],
    handler: (controller) => {
      controller.undo();
    },
  },
  {
    key: 'y',
    modifierKey: [isMac() ? 'meta' : 'ctrl'],
    handler: (controller) => {
      controller.redo();
    },
  },
];
