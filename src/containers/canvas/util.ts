import { IController, ChangeEventType, EUnderLine, IRange } from '@/types';
import {
  DEFAULT_FONT_SIZE,
  DEFAULT_FONT_COLOR,
  copyOrCut,
  paste,
  Range,
  parseNumber,
  HIDE_CELL,
} from '@/util';
import {
  coreStore,
  activeCellStore,
  sheetListStore,
  fontFamilyStore,
  scrollStore,
  floatElementStore,
  FloatElementItem,
} from '@/containers/store';
import { MainCanvas, registerGlobalEvent, Content } from '@/canvas';

function createCanvas() {
  const canvas = document.createElement('canvas');
  canvas.style.display = 'none';
  document.body.appendChild(canvas);
  return canvas;
}

function getChartData(
  range: IRange,
  controller: IController,
): Pick<FloatElementItem, 'labels' | 'datasets'> {
  const { row, col, rowCount, colCount, sheetId } = range;
  const result: Pick<FloatElementItem, 'labels' | 'datasets'> = {
    labels: [],
    datasets: [],
  };
  for (
    let r = row, index = 1, endRow = row + rowCount;
    r < endRow;
    r++, index++
  ) {
    const rowHeight = controller.getRowHeight(r).len;
    if (rowHeight === HIDE_CELL) {
      continue;
    }
    const list = [];
    for (let c = col, endCol = col + colCount; c < endCol; c++) {
      const t = controller.getCell({
        row: r,
        col: c,
        rowCount: 1,
        colCount: 1,
        sheetId,
      });
      if (!t || typeof t.value === 'undefined') {
        continue;
      }
      list.push(parseNumber(t.value));
    }
    if (list.length > 0) {
      result.datasets.push({ label: `Series${index}`, data: list });
    }
  }
  if (result.datasets[0] && result.datasets[0].data.length > 0) {
    result.labels = Array.from({ length: result.datasets[0].data.length })
      .fill('')
      .map((_value, i) => String(i + 1));
  }
  return result;
}

function updateActiveCell(controller: IController) {
  const { top } = controller.getDomRect();
  const { range: activeCell, isMerged } = controller.getActiveRange();
  const cell = controller.getCell(activeCell);
  const defineName = controller.getDefineName(
    new Range(
      activeCell.row,
      activeCell.col,
      1,
      1,
      controller.getCurrentSheetId(),
    ),
  );
  const cellSize = controller.getCellSize(activeCell);
  const cellPosition = controller.computeCellPosition(activeCell);
  cellPosition.top = top + cellPosition.top;
  let fontFamily = cell?.style?.fontFamily || '';
  if (!fontFamily) {
    let defaultFontFamily = '';
    const list = fontFamilyStore.getSnapshot();
    for (const item of list) {
      if (!item.disabled) {
        defaultFontFamily = String(item.value);
        break;
      }
    }
    fontFamily = defaultFontFamily;
  }
  const {
    isBold = false,
    isItalic = false,
    isStrike = false,
    fontSize = DEFAULT_FONT_SIZE,
    fontColor = DEFAULT_FONT_COLOR,
    fillColor = '',
    isWrapText = false,
    underline = EUnderLine.NONE,
    numberFormat = 0,
  } = cell?.style || {};

  activeCellStore.setState({
    top: cellPosition.top,
    left: cellPosition.left,
    width: cellSize.width,
    height: cellSize.height,
    row: activeCell.row,
    col: activeCell.col,
    rowCount: activeCell.rowCount,
    colCount: activeCell.colCount,
    sheetId: activeCell.sheetId || controller.getCurrentSheetId(),
    value: cell?.value,
    formula: cell?.formula,
    isBold,
    isItalic,
    isStrike,
    fontColor,
    fontSize,
    fontFamily,
    fillColor,
    isWrapText,
    underline,
    numberFormat,
    defineName,
    isMergeCell: isMerged,
  });
}

const handleStateChange = (
  changeSet: Set<ChangeEventType>,
  controller: IController,
) => {
  if (
    changeSet.has('range') ||
    changeSet.has('cellStyle') ||
    changeSet.has('cellValue')
  ) {
    updateActiveCell(controller);
  }
  if (changeSet.has('sheetList')) {
    const sheetList = controller
      .getSheetList()
      .map((v) => ({ value: v.sheetId, label: v.name, disabled: v.isHide }));
    sheetListStore.setState(sheetList);
  }

  if (changeSet.has('sheetId')) {
    coreStore.mergeState({
      canRedo: controller.canRedo(),
      canUndo: controller.canUndo(),
      activeUuid: '',
    });
  } else {
    coreStore.mergeState({
      canRedo: controller.canRedo(),
      canUndo: controller.canUndo(),
    });
  }

  if (changeSet.has('scroll')) {
    const scroll = controller.getScroll();
    scrollStore.setState({
      scrollLeft: scroll.scrollLeft,
      scrollTop: scroll.scrollTop,
    });
  }

  if (
    changeSet.has('floatElement') ||
    changeSet.has('cellValue') ||
    changeSet.has('row') ||
    changeSet.has('col') ||
    changeSet.has('sheetId') ||
    changeSet.has('scroll')
  ) {
    const scroll = controller.getScroll();
    const canvasSize = controller.getDomRect();
    const minX = scroll.left;
    const minY = scroll.top;
    const maxX = canvasSize.width + minX;
    const maxY = canvasSize.height + minY;
    const list = controller.getFloatElementList(controller.getCurrentSheetId());
    const result: FloatElementItem[] = [];
    for (const v of list) {
      const p = controller.computeCellPosition({
        row: v.fromRow,
        col: v.fromCol,
        colCount: 1,
        rowCount: 1,
        sheetId: '',
      });
      const top = p.top + v.marginY;
      const left = p.left + v.marginX;
      // the start point in the box or the end point in the box
      const check =
        (top > minY && top < maxY) ||
        (left > minX && left < maxX) ||
        (top + v.height > minY && top + v.height < maxY) ||
        (left + v.width > minX && left + v.width < maxX);
      if (check) {
        const t: FloatElementItem = {
          ...v,
          top,
          left,
          labels: [],
          datasets: [],
        };
        if (v.type === 'chart') {
          const c = getChartData(v.chartRange!, controller);
          t.labels = c.labels;
          t.datasets = c.datasets;
        }
        result.push(t);
      }
    }
    floatElementStore.setState(result);
  }
};
export function initCanvas(controller: IController): () => void {
  const mainCanvas = new MainCanvas(
    controller,
    new Content(controller, createCanvas()),
  );
  const render = (changeSet: Set<ChangeEventType>) => {
    mainCanvas.render({ changeSet });
    mainCanvas.render({
      changeSet: controller.getChangeSet(),
    });
  };
  const resize = (changeSet: Set<ChangeEventType>) => {
    mainCanvas.resize();
    render(changeSet);
  };

  const removeEvent = registerGlobalEvent(controller, resize);
  controller.setHooks({
    copyOrCut,
    paste,
    modelChange: (changeSet: Set<ChangeEventType>) => {
      handleStateChange(changeSet, controller);
      render(changeSet);
    },
  });

  const changeSet = new Set<ChangeEventType>([
    'sheetId',
    'scroll',
    'range',
    'sheetList',
    'floatElement',
  ]);
  handleStateChange(changeSet, controller);
  resize(changeSet);

  return () => {
    removeEvent();
  };
}
