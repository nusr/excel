import {
  KeyboardEventItem,
  IController,
  EUnderLine,
  EditorStatus,
  IRange,
  ScrollValue,
} from '@excel/shared';
import {
  isMac,
  SHEET_ITEM_TEST_ID_PREFIX,
  sheetViewSizeSet,
  headerSizeSet,
  computeScrollPosition,
  canvasSizeSet,
  FORMULA_EDITOR_ROLE,
  MERGE_CELL_LINE_BREAK,
  LINE_BREAK,
  isMergeContent,
} from '@excel/shared';
import { coreStore } from '../containers/store';
export const BOTTOM_BUFF = 200;

export function handleTabClick(controller: IController) {
  controller.transaction(() => {
    checkActiveElement(controller);
    controller.setNextActiveCell('right');
    recalculateScroll(controller);
  });
}

export function handleEnterClick(controller: IController) {
  controller.transaction(() => {
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
      const a = controller.getRowHeight(row);
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
      const a = controller.getColWidth(col);
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
  controller.transaction(() => {
    const sheetId = range.sheetId || controller.getCurrentSheetId();
    if (sheetId !== controller.getCurrentSheetId()) {
      controller.setCurrentSheetId(sheetId);
    }
    const sheetInfo = controller.getSheetInfo(sheetId);
    if (!sheetInfo) {
      return true;
    }
    if (
      range.row < 0 ||
      range.col < 0 ||
      range.row >= sheetInfo.rowCount ||
      range.col >= sheetInfo.colCount
    ) {
      return true;
    }
    const scroll = controller.getScroll(sheetId);
    const old = controller.computeCellPosition({
      row: scroll.row,
      col: scroll.col,
      colCount: 1,
      rowCount: 1,
      sheetId: sheetId,
    });
    const size = canvasSizeSet.get();
    const headerSize = headerSizeSet.get();
    const { top, left } = controller.computeCellPosition(range);
    const minTop = old.top;
    const minLeft = old.left;
    const maxTop = old.top + size.height - headerSize.height;
    const maxLeft = old.left + size.width - headerSize.width;
    if (top >= minTop && top < maxTop && left >= minLeft && left <= maxLeft) {
      controller.setActiveRange(range);
      return true;
    }
    const oldPosition = controller.computeCellPosition(
      controller.getActiveRange().range,
    );

    scrollBar(controller, left - oldPosition.left, top - oldPosition.top);
    controller.setActiveRange(range);
    return true;
  });
}

export function scrollBar(
  controller: IController,
  scrollX: number,
  scrollY: number,
) {
  const oldScroll = controller.getScroll();

  const size = computeScrollPosition();

  const { maxHeight, maxWidth, maxScrollHeight, maxScrollWidth } = size;
  let top = oldScroll.top + Math.ceil(scrollY);

  let left = oldScroll.left + Math.ceil(scrollX);

  if (top < 0) {
    top = 0;
  } else if (top > maxHeight) {
    top = maxHeight;
  }

  if (left < 0) {
    left = 0;
  } else if (left > maxWidth) {
    left = maxWidth;
  }
  const scrollTop = Math.floor((top * maxScrollHeight) / maxHeight);
  const scrollLeft = Math.floor((left * maxScrollWidth) / maxWidth);

  const { row, col } = computeScrollRowAndCol(controller, left, top);

  const newValue: ScrollValue = {
    left,
    top,
    scrollLeft,
    scrollTop,
    row,
    col,
  };
  controller.setScroll(newValue);
}

export function recalculateScroll(controller: IController) {
  const activeCell = controller.getActiveRange().range;
  const temp = {
    row: activeCell.row,
    col: activeCell.col,
    colCount: 1,
    rowCount: 1,
    sheetId: '',
  };
  const position = controller.computeCellPosition(temp);
  const cellSize = controller.getCellSize(temp);
  const domRect = canvasSizeSet.get();
  const oldScroll = controller.getScroll();
  const sheetInfo = controller.getSheetInfo(controller.getCurrentSheetId())!;
  const headerSize = headerSizeSet.get();
  const buff = 5;
  const size = computeScrollPosition();
  const { maxHeight, maxWidth, maxScrollHeight, maxScrollWidth } = size;
  if (position.left + cellSize.width + buff > domRect.width) {
    if (oldScroll.col <= sheetInfo.colCount - 2) {
      const left = oldScroll.left + controller.getCol(oldScroll.col).len;
      const scrollLeft = Math.floor((left * maxScrollWidth) / maxWidth);
      controller.setScroll({
        ...oldScroll,
        col: oldScroll.col + 1,
        left,
        scrollLeft,
      });
    }
  }

  if (position.left - headerSize.width < domRect.left + buff) {
    if (oldScroll.col >= 1) {
      const left = oldScroll.left - controller.getCol(oldScroll.col).len;
      const scrollLeft = Math.floor((left * maxScrollWidth) / maxWidth);
      controller.setScroll({
        ...oldScroll,
        col: oldScroll.col - 1,
        left,
        scrollLeft,
      });
    }
  }
  if (position.top + cellSize.height + buff > domRect.height) {
    if (oldScroll.row <= sheetInfo.rowCount - 2) {
      const top = oldScroll.top + controller.getRowHeight(oldScroll.row);
      const scrollTop = Math.floor((top * maxScrollHeight) / maxHeight);
      controller.setScroll({
        ...oldScroll,
        row: oldScroll.row + 1,
        top,
        scrollTop,
      });
    }
  }

  if (position.top - headerSize.height < domRect.top + buff) {
    if (oldScroll.row >= 1) {
      const top = oldScroll.top - controller.getRowHeight(oldScroll.row);
      const scrollTop = Math.floor((top * maxScrollHeight) / maxHeight);
      controller.setScroll({
        ...oldScroll,
        row: oldScroll.row - 1,
        top,
        scrollTop,
      });
    }
  }
}

export function checkFocus() {
  const dom = document.activeElement;
  if (!dom || dom.getAttribute('data-role') !== FORMULA_EDITOR_ROLE) {
    return false;
  }
  return true;
}

export function setActiveCellValue(controller: IController) {
  const inputDom = document.activeElement as
    | HTMLInputElement
    | HTMLTextAreaElement;
  const { range, isMerged } = controller.getActiveRange();
  const cellData = controller.getCell(range);
  let value = inputDom.value;
  if (
    typeof cellData?.value === 'string' &&
    isMergeContent(isMerged, cellData?.value)
  ) {
    value = value.replaceAll(LINE_BREAK, MERGE_CELL_LINE_BREAK);
  }
  controller.setCellValue(value, range);
  inputDom.value = '';
  inputDom.blur();
  coreStore.setState({
    editorStatus: EditorStatus.NONE,
  });
}

function checkActiveElement(controller: IController) {
  if (!checkFocus()) {
    return;
  }
  setActiveCellValue(controller);
}
const modifierKey: KeyboardEventItem['modifierKey'] = [
  isMac() ? 'meta' : 'ctrl',
];
/* jscpd:ignore-start */
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
    modifierKey,
    handler: (controller) => {
      if (checkFocus()) {
        return;
      }
      controller.transaction(() => {
        checkActiveElement(controller);
        const viewSize = sheetViewSizeSet.get();
        scrollBar(controller, 0, viewSize.height);
        return true;
      });
    },
  },
  {
    key: 'ArrowUp',
    modifierKey,
    handler: (controller) => {
      if (checkFocus()) {
        return;
      }
      controller.transaction(() => {
        checkActiveElement(controller);
        const viewSize = sheetViewSizeSet.get();
        scrollBar(controller, 0, -viewSize.height);
        return true;
      });
    },
  },
  {
    key: 'ArrowRight',
    modifierKey,
    handler: (controller) => {
      if (checkFocus()) {
        return;
      }
      controller.transaction(() => {
        checkActiveElement(controller);
        const viewSize = sheetViewSizeSet.get();
        scrollBar(controller, viewSize.width, 0);
        return true;
      });
    },
  },
  {
    key: 'ArrowLeft',
    modifierKey,
    handler: (controller) => {
      if (checkFocus()) {
        return;
      }
      controller.transaction(() => {
        checkActiveElement(controller);
        const viewSize = sheetViewSizeSet.get();
        scrollBar(controller, -viewSize.width, 0);
        return true;
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
      controller.transaction(() => {
        checkActiveElement(controller);
        controller.setNextActiveCell('up');
        recalculateScroll(controller);
        return true;
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
      controller.transaction(() => {
        checkActiveElement(controller);
        controller.setNextActiveCell('left');
        recalculateScroll(controller);
        return true;
      });
    },
  },
  {
    key: 'b',
    modifierKey,
    handler: (controller) => {
      if (checkFocus()) {
        return;
      }
      const cellData = controller.getCell(controller.getActiveRange().range);
      controller.updateCellStyle(
        { isBold: !cellData?.isBold },
        controller.getActiveRange().range,
      );
    },
  },
  {
    key: 'i',
    modifierKey,
    handler: (controller) => {
      if (checkFocus()) {
        return;
      }

      const cellData = controller.getCell(controller.getActiveRange().range);
      controller.updateCellStyle(
        { isItalic: !cellData?.isItalic },
        controller.getActiveRange().range,
      );
    },
  },
  {
    key: '5',
    modifierKey,
    handler: (controller) => {
      if (checkFocus()) {
        return;
      }
      const cellData = controller.getCell(controller.getActiveRange().range);
      controller.updateCellStyle(
        { isStrike: !cellData?.isStrike },
        controller.getActiveRange().range,
      );
    },
  },
  {
    key: 'u',
    modifierKey,
    handler: (controller) => {
      if (checkFocus()) {
        return;
      }
      const cellData = controller.getCell(controller.getActiveRange().range);
      const underline = cellData?.underline;
      let newUnderline = EUnderLine.NONE;
      if (underline === undefined || underline === EUnderLine.NONE) {
        newUnderline = EUnderLine.SINGLE;
      } else {
        newUnderline = EUnderLine.NONE;
      }
      controller.updateCellStyle(
        { underline: newUnderline },
        controller.getActiveRange().range,
      );
    },
  },
  {
    key: 'z',
    modifierKey,
    handler: (controller) => {
      controller.undo();
    },
  },
  {
    key: 'y',
    modifierKey,
    handler: (controller) => {
      controller.redo();
    },
  },
];
/* jscpd:ignore-end */
