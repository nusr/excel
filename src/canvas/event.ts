import { StoreValue, IController } from '@/types';
import {
  FORMULA_EDITOR_ID,
  DOUBLE_CLICK_TIME,
  SCROLL_SIZE,
  debounce,
} from '@/util';

interface IHitInfo {
  width: number;
  height: number;
  x: number;
  y: number;
  row: number;
  col: number;
  pageX: number;
  pageY: number;
}

function getHitInfo(
  event: MouseEvent,
  controller: IController,
  canvasSize: DOMRect,
): IHitInfo | null {
  const scroll = controller.getScroll();
  const sheetInfo = controller.getSheetInfo(controller.getCurrentSheetId());
  const headerSize = controller.getHeaderSize();
  const { pageX, pageY } = event;
  const x = pageX - canvasSize.left;
  const y = pageY - canvasSize.top;
  let resultX = headerSize.width;
  let resultY = headerSize.height;
  let row = scroll.row;
  let col = scroll.col;
  while (resultX + controller.getColWidth(col) <= x) {
    resultX += controller.getColWidth(col);
    col++;
  }
  while (resultY + controller.getRowHeight(row) <= y) {
    resultY += controller.getRowHeight(row);
    row++;
  }
  if (row >= sheetInfo.rowCount || col >= sheetInfo.colCount) {
    return null;
  }
  const cellSize = controller.getCellSize(row, col);
  return { ...cellSize, row, col, pageY, pageX, x, y };
}

const BOTTOM_BUFF = 200;

function scrollBar(
  controller: IController,
  canvas: HTMLCanvasElement,
  scrollX: number,
  scrollY: number,
) {
  const headerSize = controller.getHeaderSize();
  const canvasRect = canvas.getBoundingClientRect();
  const viewSize = controller.getViewSize();
  const oldScroll = controller.getScroll();

  const maxHeight = viewSize.height - canvasRect.height + BOTTOM_BUFF;
  const maxWidth = viewSize.width - canvasRect.width + BOTTOM_BUFF;

  const maxScrollHeight =
    canvasRect.height - headerSize.height - SCROLL_SIZE * 1.5;
  const maxScrollWidth =
    canvasRect.width - headerSize.width - SCROLL_SIZE * 1.5;
  let top = oldScroll.top + scrollY;
  if (top < 0) {
    top = 0;
  } else if (top > maxHeight) {
    top = maxHeight;
  }

  let left = oldScroll.left + scrollX;
  if (left < 0) {
    left = 0;
  } else if (left > maxWidth) {
    left = maxWidth;
  }
  const realDeltaY = top - oldScroll.top;
  const realDeltaX = left - oldScroll.left;
  let { row, col } = oldScroll;

  if (Math.abs(realDeltaY) > 0) {
    if (realDeltaY > 0) {
      let t = realDeltaY;
      while (t > 0) {
        const a = controller.getRowHeight(row + 1);
        if (a > t) {
          break;
        }
        t -= a;
        row++;
      }
    } else {
      let t = -realDeltaY;
      while (t > 0) {
        const a = controller.getRowHeight(row - 1);
        if (a > t) {
          break;
        }
        t -= a;
        row--;
      }
    }
  }
  if (Math.abs(realDeltaX) > 0) {
    if (realDeltaX > 0) {
      let t = realDeltaX;
      while (t > 0) {
        const a = controller.getColWidth(col + 1);
        if (a > t) {
          break;
        }
        t -= a;
        col++;
      }
    } else {
      let t = -realDeltaX;
      while (t > 0) {
        const a = controller.getColWidth(col - 1);
        if (a > t) {
          break;
        }
        t -= a;
        col--;
      }
    }
  }

  const scrollTop = (top * maxScrollHeight) / maxHeight;
  const scrollLeft = (left * maxScrollWidth) / maxWidth;
  controller.setScroll({
    top,
    left,
    row,
    col,
    scrollLeft: Math.floor(scrollLeft),
    scrollTop: Math.floor(scrollTop),
  });
}

export function registerEvents(
  stateValue: StoreValue,
  controller: IController,
  canvas: HTMLCanvasElement,
  resizeWindow: () => void,
): void {
  let lastTimeStamp = 0;
  const inputDom = document.querySelector<HTMLInputElement>(
    `#${FORMULA_EDITOR_ID}`,
  )!;
  window.addEventListener('resize', () => {
    resizeWindow();
  });
  window.addEventListener('keydown', function (event) {
    if (event.code === 'Enter') {
      controller.setActiveCell(
        stateValue.activeCell.row + 1,
        stateValue.activeCell.col,
        1,
        1,
      );
    } else if (event.code === 'Tab') {
      controller.setActiveCell(
        stateValue.activeCell.row,
        stateValue.activeCell.col + 1,
        1,
        1,
      );
    }
    if (event.ctrlKey || event.metaKey) {
      if (event.code === 'KeyC') {
        controller.copy();
        return;
      }
      if (event.code === 'KeyX') {
        controller.cut();
        return;
      }
      if (event.code === 'ArrowDown' || event.code === 'ArrowUp') {
        const viewSize = controller.getViewSize();
        scrollBar(
          controller,
          canvas,
          0,
          event.code === 'ArrowUp' ? -viewSize.height : viewSize.height,
        );
        return;
      }
      if (event.code === 'ArrowRight' || event.code === 'ArrowLeft') {
        const viewSize = controller.getViewSize();
        scrollBar(
          controller,
          canvas,
          event.code === 'ArrowLeft' ? -viewSize.width : viewSize.width,
          0,
        );
        return;
      }
      return;
    }
    if (inputDom === event.target) {
      return;
    }

    stateValue.isCellEditing = true;
    inputDom.focus();
  });

  window.addEventListener(
    'wheel',
    debounce((event: WheelEvent) => {
      if (event.target !== canvas) {
        return;
      }
      scrollBar(controller, canvas, event.deltaX, event.deltaY);
    }),
  );
  document.body.addEventListener('paste', function (event: ClipboardEvent) {
    event.stopPropagation();
    event.preventDefault();
    controller.paste(event);
  });

  canvas.addEventListener('mousedown', (event) => {
    const headerSize = controller.getHeaderSize();
    stateValue.contextMenuPosition = undefined;
    const canvasRect = canvas.getBoundingClientRect();
    const { timeStamp, clientX, clientY } = event;
    const x = clientX - canvasRect.left;
    const y = clientY - canvasRect.top;
    const position = getHitInfo(event, controller, canvasRect);
    if (!position) {
      return;
    }
    if (headerSize.width > x && headerSize.height > y) {
      controller.setActiveCell(0, 0, 0, 0);
      return;
    }
    if (headerSize.width > x && headerSize.height <= y) {
      const sheetInfo = controller.getSheetInfo(controller.getCurrentSheetId());
      controller.setActiveCell(
        position.row,
        position.col,
        0,
        sheetInfo.colCount,
      );
      return;
    }
    if (headerSize.width <= x && headerSize.height > y) {
      const sheetInfo = controller.getSheetInfo(controller.getCurrentSheetId());
      controller.setActiveCell(
        position.row,
        position.col,
        sheetInfo.rowCount,
        0,
      );
      return;
    }
    const activeCell = controller.getActiveCell();
    const check =
      activeCell.row >= 0 &&
      activeCell.row === position.row &&
      activeCell.col === position.col;
    if (!check) {
      controller.setActiveCell(position.row, position.col, 1, 1);
    }
    const delay = timeStamp - lastTimeStamp;
    if (delay < DOUBLE_CLICK_TIME) {
      stateValue.isCellEditing = true;
    }
    lastTimeStamp = timeStamp;
  });

  canvas.addEventListener('mousemove', (event) => {
    const headerSize = controller.getHeaderSize();
    const rect = canvas.getBoundingClientRect();
    const { clientX, clientY } = event;
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    if (event.buttons === 1) {
      if (x > headerSize.width && y > headerSize.height) {
        const position = getHitInfo(event, controller, rect);
        if (!position) {
          return;
        }
        const activeCell = controller.getActiveCell();
        if (
          activeCell.row === position.row &&
          activeCell.col === position.col
        ) {
          return;
        }
        const colCount = Math.abs(position.col - activeCell.col) + 1;
        const rowCount = Math.abs(position.row - activeCell.row) + 1;
        controller.setActiveCell(
          Math.min(position.row, activeCell.row),
          Math.min(position.col, activeCell.col),
          rowCount,
          colCount,
        );
      }
    }
  });
  canvas.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    stateValue.contextMenuPosition = {
      top: event.clientY,
      left: event.clientX,
      width: 100,
      height: 100,
    };
    return false;
  });
}
