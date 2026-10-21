import {
  IController,
  ChangeEventType,
  EUnderLine,
  IRange,
  EMergeCellType,
  EHorizontalAlign,
  EVerticalAlign,
} from '../../types';
import type { StoreApi } from 'zustand';
import { shallow } from 'zustand/shallow';
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
import { queue } from '../../component/Toast';

function updateStore<T>(store: StoreApi<T>, patch: Partial<T>) {
  store.setState((state) => {
    const next = { ...state, ...patch };
    return shallow(state, next) ? state : next;
  });
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
    const rowHeight = controller.getRowHeight(r, sheetId);
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
      list.push(parseNumber(t?.value)[1]);
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

function getActiveCellPosition(
  controller: IController,
  canvas: HTMLCanvasElement,
) {
  const pos = computeCanvasSize(canvas);
  const { range } = controller.getActiveRange();
  const cellSize = controller.getCellSize(range);
  const cellPosition = controller.computeCellPosition(range);
  return {
    top: cellPosition.top + (pos?.top ?? 0),
    left: cellPosition.left + (pos?.left ?? 0),
    width: cellSize.width,
    height: cellSize.height,
    row: range.row,
    col: range.col,
    rowCount: range.rowCount,
    colCount: range.colCount,
  };
}

function updateActiveCell(controller: IController, canvas: HTMLCanvasElement) {
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
    verticalAlign = EVerticalAlign.MIDDLE,
  } = cell || {};

  const numberFormat = cell?.numberFormat || DEFAULT_FORMAT_CODE;
  const isRight =
    numberFormat === DEFAULT_FORMAT_CODE && typeof cell?.value === 'number';
  const horAlign =
    horizontalAlign ?? (isRight ? EHorizontalAlign.RIGHT : EHorizontalAlign.LEFT);
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

  updateStore(useActiveCell, {
    ...getActiveCellPosition(controller, canvas),
    value: cell?.formula || realValue,
    defineName,
    displayValue: cell?.formula || displayValue,
  });

  updateStore(useStyleStore, {
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
  const activeCellChanged =
    changeSet.has('rangeMap') ||
    changeSet.has('cellStyle') ||
    changeSet.has('worksheets') ||
    changeSet.has('currentSheetId') ||
    changeSet.has('mergeCells');
  const viewportChanged =
    changeSet.has('scroll') ||
    changeSet.has('currentSheetId') ||
    changeSet.has('customHeight') ||
    changeSet.has('customWidth');

  if (activeCellChanged) {
    updateActiveCell(controller, canvas);
  } else {
    if (viewportChanged) {
      updateStore(useActiveCell, getActiveCellPosition(controller, canvas));
    }
    if (changeSet.has('definedNames')) {
      updateStore(useActiveCell, {
        defineName: controller.getDefineName(controller.getActiveRange().range),
      });
    }
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
    viewportChanged
  ) {
    const canvasSize = controller.getCanvasSize();
    const sheetId = controller.getCurrentSheetId();
    const list = controller.getDrawingList(sheetId);
    const result: FloatElementItem[] = [];
    for (const v of list) {
      const p = controller.computeCellPosition({
        row: v.fromRow,
        col: v.fromCol,
        colCount: 1,
        rowCount: 1,
        sheetId,
      });
      const top = p.top + v.marginY;
      const left = p.left + v.marginX;
      const check =
        top < canvasSize.height &&
        top + v.height > 0 &&
        left < canvasSize.width &&
        left + v.width > 0;
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
  updateStore(useCoreStore, core);

  if (viewportChanged) {
    const scroll = controller.getScroll();
    const canvasSize = controller.getCanvasSize();
    updateStore(useScrollStore, {
      top: scroll.top,
      left: scroll.left,
      scrollLeft: scroll.scrollLeft,
      scrollTop: scroll.scrollTop,
      row: scroll.row,
      col: scroll.col,
      canvasHeight: canvasSize.height,
      canvasWidth: canvasSize.width,
    });
  }
};

function computeCanvasSize(canvas: HTMLCanvasElement) {
  const dom = canvas.parentElement;
  if (!dom) {
    return null;
  }
  const scrollbarSize = 20;
  const size = dom.getBoundingClientRect();
  const width = Math.max(0, dom.clientWidth - scrollbarSize);
  const height = Math.max(0, dom.clientHeight - scrollbarSize);
  const result = {
    top: size.top,
    left: size.left,
    width,
    height,
  };
  return result;
}

const canvasRenderers = new WeakMap<HTMLCanvasElement, { controller: IController; renderer: MainCanvas }>();

export function initCanvas(
  controller: IController,
  canvas: HTMLCanvasElement,
): () => void {
  useCoreStore.getState().setFontFamilies(initFontFamilyList());
  useUserInfo.getState().setClientId(controller.getHooks().doc.clientID);

  const cached = canvasRenderers.get(canvas);
  const mainCanvas = cached?.controller === controller
    ? cached.renderer
    : new MainCanvas(controller, canvas);
  canvasRenderers.set(canvas, { controller, renderer: mainCanvas });
  MainCanvas.instance = mainCanvas;
  let sheetScrollTimeout: ReturnType<typeof setTimeout> | undefined;
  const syncState = (changeSet: Set<ChangeEventType>) => {
    handleStateChange(changeSet, controller, canvas);
    if (changeSet.has('currentSheetId')) {
      clearTimeout(sheetScrollTimeout);
      if (useCoreStore.getState().sheetList.length > 5) {
        const sheetId = controller.getCurrentSheetId();
        sheetScrollTimeout = setTimeout(() => {
          scrollSheetToView(sheetId);
        }, 0);
      }
    }
  };
  const renderCanvas = (changeSet: Set<ChangeEventType>) => {
    const size = computeCanvasSize(canvas);
    if (size) {
      controller.setCanvasSize(size);
    }
    mainCanvas.resize();
    syncState(changeSet);
    return mainCanvas.render({ changeSet });
  };
  const resize = () => {
    renderCanvas(new Set<ChangeEventType>(['customWidth']));
  };
  const offRenderChange = controller.on('renderChange', ({ changeSet }) => {
    syncState(changeSet);
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
  renderCanvas(changeSet);
  let initialRender: ReturnType<typeof setTimeout> | undefined;
  if (!isTestEnv()) {
    initialRender = setTimeout(() => {
      renderCanvas(changeSet);
    }, 50);
  }

  const offToastMessage = controller.on(
    'toastMessage',
    ({ message, duration = 5 }) => {
      queue.add({ title: message }, { timeout: duration * 1000 });
    },
  );
  const offModelToastMessage = controller.model.on(
    'toastMessage',
    ({ message, duration = 5 }) => {
      queue.add({ title: message }, { timeout: duration * 1000 });
    },
  );
  return () => {
    clearTimeout(initialRender);
    clearTimeout(sheetScrollTimeout);
    if (MainCanvas.instance === mainCanvas) MainCanvas.instance = undefined;
    offGlobalEvent();
    offRenderChange();
    offToastMessage();
    offModelToastMessage();
  };
}
