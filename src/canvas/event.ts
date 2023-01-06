import { StoreValue, IController, KeyboardEventItem } from '@/types';
import { FORMULA_EDITOR_ID, debounce } from '@/util';
import { keyboardEventList, scrollBar } from './shortcut';

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
): IHitInfo | null {
  const canvasSize = controller.getDomRect();
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

export function registerEvents(
  stateValue: StoreValue,
  controller: IController,
  canvas: HTMLCanvasElement,
  resizeWindow: () => void,
): void {
  let isClick = false;
  const inputDom = document.querySelector<HTMLInputElement>(
    `#${FORMULA_EDITOR_ID}`,
  )!;
  window.addEventListener('resize', function () {
    resizeWindow();
  });
  window.addEventListener('keydown', function (event) {
    const list = keyboardEventList.filter((v) => v.key === event.key);
    list.sort((a, b) => b.modifierKey.length - a.modifierKey.length);
    let temp: KeyboardEventItem | null = null;
    for (const item of list) {
      if (item.modifierKey.length > 0) {
        if (item.modifierKey.some((v) => event[`${v}Key`])) {
          temp = item;
          break;
        }
      } else {
        temp = item;
        break;
      }
    }
    if (temp) {
      temp.handler(controller);
      return;
    }
    if (event.metaKey || event.ctrlKey) {
      return;
    }
    if (inputDom === event.target) {
      return;
    }
    console.log(event.key);

    stateValue.isCellEditing = true;
    inputDom.focus();
  });

  window.addEventListener(
    'wheel',
    debounce(function (event: WheelEvent) {
      if (event.target !== canvas) {
        return;
      }
      scrollBar(controller, event.deltaX, event.deltaY);
    }),
  );
  document.body.addEventListener('paste', function (event) {
    event.preventDefault();
    controller.paste(event);
  });
  document.body.addEventListener('copy', function (event) {
    event.preventDefault();
    controller.copy(event);
  });
  document.body.addEventListener('cut', function (event) {
    event.preventDefault();
    controller.cut(event);
  });

  canvas.addEventListener('click', function (event) {
    isClick = true;
    stateValue.contextMenuPosition = undefined;
    const headerSize = controller.getHeaderSize();
    const canvasRect = controller.getDomRect();
    const { clientX, clientY } = event;
    const x = clientX - canvasRect.left;
    const y = clientY - canvasRect.top;
    const position = getHitInfo(event, controller);
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

    isClick = false;
  });
  canvas.addEventListener('dblclick', function () {
    isClick = true;
    stateValue.isCellEditing = true;
    isClick = false;
  });

  canvas.addEventListener('mousemove', function (event) {
    if (!isClick) {
      return;
    }
    const headerSize = controller.getHeaderSize();
    const rect = controller.getDomRect();
    const { clientX, clientY } = event;
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    if (event.buttons === 1) {
      if (x > headerSize.width && y > headerSize.height) {
        const position = getHitInfo(event, controller);
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
  canvas.addEventListener('contextmenu', function (event) {
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
