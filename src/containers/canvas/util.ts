import { IController, ChangeEventType, EUnderLine } from '@/types';
import {
  DEFAULT_FONT_SIZE,
  DEFAULT_FONT_COLOR,
  copyOrCut,
  paste,
  Range,
  parseNumber,
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

const handleStateChange = (
  changeSet: Set<ChangeEventType>,
  controller: IController,
) => {
  if (
    changeSet.has('setActiveCell') ||
    changeSet.has('setCellStyle') ||
    changeSet.has('setCellValues')
  ) {
    const { top } = controller.getDomRect();
    const activeCell = controller.getActiveCell();
    const cell = controller.getCell(activeCell);
    const cellPosition = controller.computeCellPosition(
      activeCell.row,
      activeCell.col,
    );
    cellPosition.top = top + cellPosition.top;
    if (!cell.style) {
      cell.style = {};
    }
    if (!cell.style.fontFamily) {
      let defaultFontFamily = '';
      const list = fontFamilyStore.getSnapshot();
      for (const item of list) {
        if (!item.disabled) {
          defaultFontFamily = String(item.value);
          break;
        }
      }
      cell.style.fontFamily = defaultFontFamily;
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
      fontFamily = '',
      numberFormat = 0,
    } = cell.style;
    const defineName = controller.getDefineName(
      new Range(cell.row, cell.col, 1, 1, controller.getCurrentSheetId()),
    );
    activeCellStore.setState({
      ...cellPosition,
      row: cell.row,
      col: cell.col,
      value: cell.value,
      formula: cell.formula,
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
    });
  }
  if (changeSet.has('sheetList')) {
    const sheetList = controller
      .getSheetList()
      .map((v) => ({ value: v.sheetId, label: v.name, disabled: v.isHide }));
    sheetListStore.setState(sheetList);
  }
  if (changeSet.has('currentSheetId')) {
    coreStore.mergeState({
      currentSheetId: controller.getCurrentSheetId(),
      canRedo: controller.canRedo(),
      canUndo: controller.canUndo(),
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
  if (changeSet.has('floatElement')) {
    const list = controller.getFloatElementList(controller.getCurrentSheetId());
    floatElementStore.setState(
      list.map((v) => {
        const size = controller.computeCellPosition(v.fromRow, v.fromCol);
        const result: FloatElementItem = {
          ...v,
          top: size.top,
          left: size.left,
          labels: [],
          datasets: [],
        };
        if (v.type === 'chart' && v.chartRange) {
          const { row, col, rowCount, colCount, sheetId } = v.chartRange;
          for (
            let r = row, index = 1, endRow = row + rowCount;
            r < endRow;
            r++, index++
          ) {
            result.labels.push(String(index));
            const list = [];
            for (let c = col, endCol = col + colCount; c < endCol; c++) {
              const t = controller.getCell({
                row: r,
                col: c,
                rowCount: 1,
                colCount: 1,
                sheetId,
              });
              list.push(parseNumber(t.value));
            }
            result.datasets.push({ label: `Series${index}`, data: list });
          }
        }
        return result;
      }),
    );
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
    'currentSheetId',
    'scroll',
    'content',
    'setActiveCell',
    'sheetList',
    'floatElement',
  ]);
  handleStateChange(changeSet, controller);
  resize(changeSet);

  return removeEvent;
}
