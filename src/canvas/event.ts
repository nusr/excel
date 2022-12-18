import { StoreValue, IController } from '@/types';
import {
  COL_TITLE_WIDTH,
  ROW_TITLE_HEIGHT,
  FORMULA_EDITOR_ID,
  DOUBLE_CLICK_TIME,
  SCROLL_SIZE,
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
  canvas: HTMLCanvasElement,
  controller: IController,
): IHitInfo {
  const { pageX, pageY } = event;
  const size = canvas.getBoundingClientRect();
  const x = pageX - size.left;
  const y = pageY - size.top;
  let resultX = COL_TITLE_WIDTH;
  let resultY = ROW_TITLE_HEIGHT;
  let row = 0;
  let col = 0;
  while (resultX + controller.getColWidth(col) <= x) {
    resultX += controller.getColWidth(col);
    col++;
  }
  while (resultY + controller.getRowHeight(row) <= y) {
    resultY += controller.getRowHeight(row);
    row++;
  }
  const cellSize = controller.getCellSize(row, col);
  return { ...cellSize, row, col, pageY, pageX, x, y };
}

export function registerEvents(
  stateValue: StoreValue,
  controller: IController,
  canvas: HTMLCanvasElement,
): void {
  let lastTimeStamp = 0;
  const inputDom = document.querySelector<HTMLInputElement>(
    `#${FORMULA_EDITOR_ID}`,
  )!;
  window.addEventListener('resize', () => {
    controller.windowResize();
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

  document.body.addEventListener('wheel', (event) => {
    if (event.target !== canvas) {
      return;
    }
    let scrollTop = stateValue.scroll.top;
    let scrollLeft = stateValue.scroll.left;
    const canvasRect = canvas.getBoundingClientRect();
    if (event.deltaY > 0) {
      scrollTop = stateValue.scroll.top + event.deltaY;
      if (scrollTop < 0) {
        scrollTop = 0;
      } else if (scrollTop > canvasRect.height - SCROLL_SIZE) {
        scrollTop = canvasRect.height - SCROLL_SIZE;
      }
    }
    if (event.deltaX > 0) {
      scrollLeft = stateValue.scroll.left + event.deltaX;
      if (scrollLeft < 0) {
        scrollLeft = 0;
      } else if (scrollLeft > canvasRect.width - SCROLL_SIZE) {
        scrollLeft = canvasRect.width - SCROLL_SIZE;
      }
    }
    controller.setScroll(scrollLeft, scrollTop);
  });

  canvas.addEventListener('mousedown', (event) => {
    stateValue.contextMenuPosition = undefined;
    const canvasRect = canvas.getBoundingClientRect();
    const { timeStamp, clientX, clientY } = event;
    const x = clientX - canvasRect.left;
    const y = clientY - canvasRect.top;
    const position = getHitInfo(event, canvas, controller);
    if (COL_TITLE_WIDTH > x && ROW_TITLE_HEIGHT > y) {
      controller.selectAll(position.row, position.col);
      return;
    }
    if (COL_TITLE_WIDTH > x && ROW_TITLE_HEIGHT <= y) {
      controller.selectRow(position.row, position.col);
      return;
    }
    if (COL_TITLE_WIDTH <= x && ROW_TITLE_HEIGHT > y) {
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
    const rect = canvas.getBoundingClientRect();
    const { clientX, clientY } = event;
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const checkMove =
      x > COL_TITLE_WIDTH && y > ROW_TITLE_HEIGHT && event.buttons === 1;
    if (checkMove) {
      const position = getHitInfo(event, canvas, controller);
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

export function makeScroll(prop: 'scrollLeft' | 'scrollTop') {
  return function scroll(
    el: Element,
    to: number,
    cb: (err: Error | null, scroll: number) => void,
  ) {
    const start = Date.now();
    const from = el[prop];
    const duration = 350;
    let cancelled = false;

    return (
      from === to
        ? cb(new Error('Element already at target scroll position'), el[prop])
        : requestAnimationFrame(animate),
      cancel
    );

    function cancel() {
      cancelled = true;
    }

    function animate() {
      if (cancelled) return cb(new Error('Scroll cancelled'), el[prop]);

      const now = Date.now();
      const time = Math.min(1, (now - start) / duration);
      const eased = inOutSine(time);

      el[prop] = eased * (to - from) + from;

      time < 1
        ? requestAnimationFrame(animate)
        : requestAnimationFrame(function () {
            cb(null, el[prop]);
          });
    }
  };
}

function inOutSine(n: number) {
  return 0.5 * (1 - Math.cos(Math.PI * n));
}
