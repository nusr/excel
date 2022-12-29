import { StoreValue, IController } from '@/types';
import { FORMULA_EDITOR_ID, DOUBLE_CLICK_TIME, SCROLL_SIZE } from '@/util';
import { debounce } from '@/lodash';

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
  const sheetInfo = controller.getSheetInfo();
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

const BOTTOM_BUFF = 100;

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
    if (event.key === 'Enter') {
      controller.setActiveCell(
        stateValue.activeCell.row + 1,
        stateValue.activeCell.col,
        1,
        1,
      );
    } else if (event.key === 'Tab') {
      controller.setActiveCell(
        stateValue.activeCell.row,
        stateValue.activeCell.col + 1,
        1,
        1,
      );
    }
    if (inputDom === event.target) {
      return;
    }
    stateValue.isCellEditing = true;
    inputDom.focus();
  });

  document.body.addEventListener(
    'wheel',
    debounce((event) => {
      if (event.target !== canvas) {
        return;
      }
      const headerSize = controller.getHeaderSize();
      const canvasRect = canvas.getBoundingClientRect();
      const sheetInfo = controller.getSheetInfo();
      const viewSize = controller.getViewSize();
      const oldScroll = controller.getScroll();

      const maxHeight = viewSize.height - canvasRect.height + BOTTOM_BUFF;
      const maxWidth = viewSize.width - canvasRect.width + BOTTOM_BUFF;

      const maxScrollHeight =
        canvasRect.height - headerSize.height - SCROLL_SIZE * 1.5;
      const maxScrollWidth =
        canvasRect.width - headerSize.width - SCROLL_SIZE * 1.5;
      let top = oldScroll.top + event.deltaY;
      if (top < 0) {
        top = 0;
      } else if (top > maxHeight) {
        top = maxHeight;
      }

      let left = oldScroll.left + event.deltaX;
      if (left < 0) {
        left = 0;
      } else if (left > maxWidth) {
        left = maxWidth;
      }

      let resultX = 0;
      let resultY = 0;
      let r = 0;
      let c = 0;
      while (resultX < left && c < sheetInfo.colCount) {
        resultX += controller.getColWidth(c);
        c++;
      }
      while (resultY < top && r < sheetInfo.rowCount) {
        resultY += controller.getRowHeight(r);
        r++;
      }

      const scrollTop = (top * maxScrollHeight) / maxHeight;
      const scrollLeft = (left * maxScrollWidth) / maxWidth;
      controller.setScroll({
        top: top,
        left: left,
        row: r,
        col: c,
        scrollLeft,
        scrollTop,
      });
    }),
  );

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
      controller.selectAll(0, 0);
      return;
    }
    if (headerSize.width > x && headerSize.height <= y) {
      controller.selectRow(position.row, position.col);
      return;
    }
    if (headerSize.width <= x && headerSize.height > y) {
      controller.selectCol(position.row, position.col);
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
    const checkMove =
      x > headerSize.width && y > headerSize.height && event.buttons === 1;
    if (checkMove) {
      const position = getHitInfo(event, controller, rect);
      if (!position) {
        return;
      }
      controller.updateSelection(position.row, position.col);
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
