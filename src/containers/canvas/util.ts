import {
  IController,
  ChangeEventType,
  EUnderLine,
  IRange,
  EMergeCellType,
  EHorizontalAlign,
} from '../../types';
import {
  DEFAULT_FONT_SIZE,
  HIDE_CELL,
  MERGE_CELL_LINE_BREAK,
  LINE_BREAK,
  DEFAULT_FORMAT_CODE,
  getFormatCode,
  parseNumber,
  isTestEnv,
  KEY_LIST,
} from '../../util';
import { getThemeColor } from '../../theme';
import {
  CoreStore,
  useActiveCell,
  useCoreStore,
  useScrollStore,
  FloatElementItem,
  useStyleStore,
  useUserInfo,
} from '../../containers/store';
import {
  MainCanvas,
  registerGlobalEvent,
  scrollSheetToView,
} from '../../canvas';
import { numberFormat as numberFormatUtil, isDateFormat } from '../../formula';
import { initFontFamilyList } from './isSupportFontFamily';
import { toast } from '../../components';

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
    const rowHeight = controller.getRowHeight(r);
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
      if (!t) {
        continue;
      }
      list.push(parseNumber(t.value)[1]);
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

function updateActiveCell(controller: IController, canvas: HTMLCanvasElement) {
  const pos = computeCanvasSize(canvas);
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
  cellPosition.top += pos?.top ?? 0;
  let fontFamily = cell?.fontFamily ?? '';
  if (!fontFamily) {
    let defaultFontFamily = '';
    const list = useCoreStore.getState().fontFamilies;
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
  } = cell || {};

  const numberFormat = cell?.numberFormat || DEFAULT_FORMAT_CODE;
  const isRight =
    numberFormat === DEFAULT_FORMAT_CODE && typeof cell?.value === 'number';
  let horAlign = horizontalAlign;
  if (horizontalAlign === undefined && isRight) {
    horAlign = EHorizontalAlign.RIGHT;
  }
  let displayValue = numberFormatUtil(cell?.value, numberFormat);
  let realValue = '';
  if (isDateFormat(numberFormat) || numberFormat === getFormatCode(10)) {
    realValue = displayValue;
  } else {
    const t = cell?.value ?? '';
    realValue = typeof t === 'boolean' ? t.toString().toUpperCase() : String(t);
    displayValue = realValue;
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

  useActiveCell.setState({
    top: cellPosition.top,
    left: cellPosition.left,
    width: cellSize.width,
    height: cellSize.height,
    row: activeCell.row,
    col: activeCell.col,
    rowCount: activeCell.rowCount,
    colCount: activeCell.colCount,
    value: cell?.formula || realValue,
    defineName,
    displayValue: cell?.formula || displayValue,
  });

  useStyleStore.setState({
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
  canvas: HTMLCanvasElement,
) => {
  if (
    changeSet.has('rangeMap') ||
    changeSet.has('cellStyle') ||
    changeSet.has('worksheets') ||
    changeSet.has('currentSheetId') ||
    changeSet.has('mergeCells')
  ) {
    updateActiveCell(controller, canvas);
  }

  const core: Partial<CoreStore> = {
    canRedo: controller.canRedo(),
    canUndo: controller.canUndo(),
  };
  if (changeSet.has('workbook')) {
    const sheetList = controller.getSheetList().map((v) => ({
      sheetId: v.sheetId,
      name: v.name,
      isHide: v.isHide,
      tabColor: v.tabColor || '',
    }));
    core.sheetList = sheetList;
  }
  if (changeSet.has('currentSheetId')) {
    core.activeUuid = '';
    core.currentSheetId = controller.getCurrentSheetId();
    core.isFilter = !!controller.getFilter();
  }

  if (changeSet.has('autoFilter')) {
    core.isFilter = !!controller.getFilter();
  }
  if (changeSet.has('definedNames')) {
    const list = controller.getDefineNameList().map((v) => v.name);
    core.defineNames = list;
  }
  if (
    changeSet.has('drawings') ||
    changeSet.has('worksheets') ||
    changeSet.has('customHeight') ||
    changeSet.has('customWidth') ||
    changeSet.has('currentSheetId') ||
    changeSet.has('scroll')
  ) {
    const scroll = controller.getScroll();
    const canvasSize = controller.getCanvasSize();
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
    core.drawings = result;
  }
  useCoreStore.setState(core);

  if (changeSet.has('scroll')) {
    const scroll = controller.getScroll();
    const canvasSize = controller.getCanvasSize();
    useScrollStore.setState({
      scrollLeft: scroll.scrollLeft,
      scrollTop: scroll.scrollTop,
      row: scroll.row,
      col: scroll.col,
      canvasHeight: canvasSize.height,
      canvasWidth: canvasSize.width,
    });
  }

  if (
    changeSet.has('currentSheetId') &&
    useCoreStore.getState().sheetList.length > 5
  ) {
    // async update
    setTimeout(() => {
      scrollSheetToView(controller.getCurrentSheetId());
    }, 0);
  }
};

function computeCanvasSize(canvas: HTMLCanvasElement) {
  const dom = canvas.parentElement;
  if (!dom) {
    return null;
  }
  const scrollbarSize = 20;
  const size = dom.getBoundingClientRect();
  const width = dom.clientWidth - scrollbarSize;
  const height = dom.clientHeight - scrollbarSize;
  const result = {
    top: size.top,
    left: size.left,
    width,
    height,
  };
  return result;
}

export function initCanvas(
  controller: IController,
  canvas: HTMLCanvasElement,
): () => void {
  useCoreStore.getState().setFontFamilies(initFontFamilyList());
  useUserInfo.getState().setClientId(controller.getHooks().doc.clientID);

  const mainCanvas =
    MainCanvas.instance ||
    (MainCanvas.instance = new MainCanvas(controller, canvas));
  const renderCanvas = (changeSet: Set<ChangeEventType>) => {
    const size = computeCanvasSize(canvas);
    if (size) {
      controller.setCanvasSize(size);
    }
    mainCanvas.resize();
    return mainCanvas.render({ changeSet });
  };
  const resize = () => {
    renderCanvas(new Set<ChangeEventType>(['customWidth']));
  };
  const offRenderChange = controller.on('renderChange', ({ changeSet }) => {
    handleStateChange(changeSet, controller, canvas);
    mainCanvas.render({ changeSet });
  });

  const offGlobalEvent = registerGlobalEvent(controller, resize);

  const changeSet = new Set<ChangeEventType>([
    ...KEY_LIST,
    'scroll',
    'cellStyle',
    'antLine',
    'undo',
    'redo',
  ]);
  handleStateChange(changeSet, controller, canvas);
  renderCanvas(changeSet);
  if (!isTestEnv()) {
    setTimeout(() => {
      handleStateChange(changeSet, controller, canvas);
      renderCanvas(changeSet);
    }, 50);
  }

  const offToastMessage = controller.on(
    'toastMessage',
    ({ type, message, duration = 5, testId }) => {
      toast({ type, message, duration, testId: testId ?? `${type}-toast` });
    },
  );
  const offModelToastMessage = controller.model.on(
    'toastMessage',
    ({ type, message, duration = 5, testId }) => {
      toast({ type, message, duration, testId: testId ?? `${type}-toast` });
    },
  );
  return () => {
    offGlobalEvent();
    offRenderChange();
    offToastMessage();
    offModelToastMessage();
  };
}
