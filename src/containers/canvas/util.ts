import {
  IController,
  ChangeEventType,
  EUnderLine,
  IRange,
  EMergeCellType,
  EHorizontalAlign,
} from '@/types';
import {
  DEFAULT_FONT_SIZE,
  parseNumber,
  HIDE_CELL,
  getThemeColor,
  eventEmitter,
  initFontFamilyList,
  reactLog,
  sizeConfig,
  canvasSizeSet,
  MERGE_CELL_LINE_BREAK,
  LINE_BREAK,
  DEFAULT_FORMAT_CODE,
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
import { numberFormat as numberFormatUtil, isDateFormat } from '@/model';

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
    for (let c = col, endCol = col + colCount;c < endCol;c++) {
      const t = controller.getCell({
        row: r,
        col: c,
        rowCount: 1,
        colCount: 1,
        sheetId,
      });
      if (!t) {
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
  const { top } = canvasSizeSet.get();
  const { range: activeCell, isMerged } = controller.getActiveRange();
  const sheetId = activeCell.sheetId || controller.getCurrentSheetId();
  const cell = controller.getCell(activeCell);
  const defineName = controller.getDefineName({
    row: activeCell.row,
    col: activeCell.col,
    rowCount: 1,
    colCount: 1,
    sheetId,
  });
  const cellSize = controller.getCellSize(activeCell);
  const cellPosition = controller.computeCellPosition(activeCell);
  cellPosition.top = top + cellPosition.top;
  let fontFamily = cell?.style?.fontFamily ?? '';
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
    horizontalAlign,
    verticalAlign,
  } = cell?.style || {};

  const numberFormat = cell?.style?.numberFormat || DEFAULT_FORMAT_CODE;
  const isRight = numberFormat === DEFAULT_FORMAT_CODE && typeof cell?.value === 'number';
  let horAlign = horizontalAlign;
  if (horizontalAlign === undefined && isRight) {
    horAlign = EHorizontalAlign.RIGHT
  }
  let displayValue = ''
  if (isDateFormat(numberFormat)) {
    displayValue = numberFormatUtil(cell?.value, numberFormat);
  } else {
    displayValue = numberFormatUtil(cell?.value, DEFAULT_FORMAT_CODE);
  }

  let mergeType = '';
  if (isMerged) {
    if (displayValue.includes(MERGE_CELL_LINE_BREAK)) {
      mergeType = String(EMergeCellType.MERGE_CONTENT);
      displayValue = displayValue.replaceAll(MERGE_CELL_LINE_BREAK, LINE_BREAK);
    } else {
      mergeType = String(EMergeCellType.MERGE_CENTER);
    }
  }
  const textValue = cell?.formula ? cell.formula : displayValue;
  activeCellStore.setState({
    top: cellPosition.top,
    left: cellPosition.left,
    width: cellSize.width,
    height: cellSize.height,
    row: activeCell.row,
    col: activeCell.col,
    rowCount: activeCell.rowCount,
    colCount: activeCell.colCount,
    value: textValue,
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
    mergeType,
    horizontalAlign: horAlign,
    verticalAlign,
  });
}

const handleStateChange = (
  changeSet: Set<ChangeEventType>,
  controller: IController,
) => {
  reactLog('handleStateChange', changeSet);
  if (
    changeSet.has('rangeMap') ||
    changeSet.has('cellStyle') ||
    changeSet.has('cellValue') ||
    changeSet.has('currentSheetId') ||
    changeSet.has('mergeCells')
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
    const canvasSize = canvasSizeSet.get();
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
    const canvasSize = canvasSizeSet.get();
    const minX = scroll.left;
    const minY = scroll.top;
    const maxX = canvasSize.width + minX;
    const maxY = canvasSize.height + minY;
    const list = controller.getDrawingList(controller.getCurrentSheetId());
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
    // async update
    setTimeout(() => {
      scrollSheetToView(controller.getCurrentSheetId());
    }, 0);
  }
};

function computeCanvasSize(canvas: HTMLCanvasElement) {
  const scrollbarSize = parseInt(sizeConfig.largePadding, 10);
  const dom = canvas.parentElement!;
  const size = dom.getBoundingClientRect();
  const result = {
    top: size.top,
    left: size.left,
    width: dom.clientWidth - scrollbarSize,
    height: dom.clientHeight - scrollbarSize,
  };
  canvasSizeSet.set(result);
  return result;
}

export function initCanvas(
  controller: IController,
  canvas: HTMLCanvasElement,
): () => void {
  const familyList = initFontFamilyList();
  fontFamilyStore.setState(familyList);
  const content = new Content(controller, createCanvas());
  const mainCanvas = new MainCanvas(controller, canvas, content);
  const resize = () => {
    computeCanvasSize(canvas);
    mainCanvas.resize();
    mainCanvas.render({ changeSet: new Set<ChangeEventType>(['row']) });
  };
  const offEvent = eventEmitter.on('modelChange', ({ changeSet }) => {
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
  computeCanvasSize(canvas);
  mainCanvas.resize();
  mainCanvas.render({ changeSet });
  queueMicrotask(resize);

  return () => {
    removeEvent();
    offEvent();
  };
}
