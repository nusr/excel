import { IController, ChangeEventType, EUnderLine, IRange } from '@/types';
import {
  DEFAULT_FONT_SIZE,
  Range,
  parseNumber,
  HIDE_CELL,
  getThemeColor,
  convertResultTypeToString,
  eventEmitter,
} from '@/util';
import {
  coreStore,
  activeCellStore,
  sheetListStore,
  fontFamilyStore,
  scrollStore,
  floatElementStore,
  FloatElementItem,
  defineNameStore,
  styleStore,
} from '@/containers/store';
import {
  MainCanvas,
  registerGlobalEvent,
  Content,
  scrollSheetToView,
} from '@/canvas';

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
  const sheetId = activeCell.sheetId || controller.getCurrentSheetId();
  const cell = controller.getCell(activeCell);
  const defineName = controller.getDefineName(
    new Range(activeCell.row, activeCell.col, 1, 1, sheetId),
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
    fontColor = getThemeColor('contentColor'),
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
    value: convertResultTypeToString(cell?.value),
    formula: cell?.formula || '',
    defineName,
  });
  styleStore.mergeState({
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
    isMergeCell: isMerged,
  });
}

const handleStateChange = (
  changeSet: Set<ChangeEventType>,
  controller: IController,
) => {
  if (
    changeSet.has('rangeMap') ||
    changeSet.has('cellStyle') ||
    changeSet.has('cellValue')
  ) {
    updateActiveCell(controller);
  }
  if (changeSet.has('workbook')) {
    const sheetList = controller.getSheetList().map((v) => ({
      sheetId: v.sheetId,
      name: v.name,
      isHide: v.isHide,
      tabColor: v.tabColor || '',
    }));
    sheetListStore.setState(sheetList);
  }

  if (changeSet.has('currentSheetId')) {
    coreStore.mergeState({
      canRedo: controller.canRedo(),
      canUndo: controller.canUndo(),
      activeUuid: '',
      currentSheetId: controller.getCurrentSheetId(),
    });
  } else {
    coreStore.mergeState({
      canRedo: controller.canRedo(),
      canUndo: controller.canUndo(),
    });
  }

  if (changeSet.has('scroll')) {
    const scroll = controller.getScroll();
    const canvasSize = controller.getDomRect();
    const showBottomBar = scroll.scrollTop / canvasSize.height >= 0.91;
    scrollStore.mergeState({
      scrollLeft: scroll.scrollLeft,
      scrollTop: scroll.scrollTop,
      showBottomBar,
    });
  }
  if (changeSet.has('definedNames')) {
    const list = controller.getDefineNameList().map((v) => v.name);
    defineNameStore.setState(list);
  }

  if (
    changeSet.has('drawings') ||
    changeSet.has('cellValue') ||
    changeSet.has('row') ||
    changeSet.has('col') ||
    changeSet.has('currentSheetId') ||
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

  if (changeSet.has('currentSheetId')) {
    setTimeout(() => {
      scrollSheetToView(controller.getCurrentSheetId());
    }, 0);
  }
};
export function initCanvas(controller: IController): () => void {
  const mainCanvas = new MainCanvas(
    controller,
    new Content(controller, createCanvas()),
  );
  const resize = () => {
    mainCanvas.resize();
    mainCanvas.render({ changeSet: new Set<ChangeEventType>(['row']) });
  };
  eventEmitter.on('modelChange', ({ changeSet }) => {
    handleStateChange(changeSet, controller);
    mainCanvas.render({ changeSet });
  });

  const removeEvent = registerGlobalEvent(controller, resize);

  const changeSet = new Set<ChangeEventType>([
    'currentSheetId',
    'rangeMap',
    'workbook',
    'worksheets',
    'drawings',
    'definedNames',
    'mergeCells',
    'scroll',
    'cellValue',
    'row',
    'col',
    'cellStyle',
    'undoRedo',
    'antLine',
  ]);

  handleStateChange(changeSet, controller);
  mainCanvas.resize();
  mainCanvas.render({ changeSet });
  setTimeout(() => {
    handleStateChange(changeSet, controller);
    mainCanvas.resize();
    mainCanvas.render({ changeSet });
  }, 0);



  return () => {
    removeEvent();
    eventEmitter.offAll();
  };
}
