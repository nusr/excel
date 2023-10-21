import { IController, ChangeEventType, EUnderLine } from '@/types';
import {
  DEFAULT_FONT_SIZE,
  DEFAULT_FONT_COLOR,
  copy,
  cut,
  paste,
} from '@/util';
import {
  coreStore,
  activeCellStore,
  sheetListStore,
  fontFamilyStore,
  scrollStore,
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
      fontSize = DEFAULT_FONT_SIZE,
      fontColor = DEFAULT_FONT_COLOR,
      fillColor = '',
      isWrapText = false,
      underline = EUnderLine.NONE,
      fontFamily = '',
      numberFormat = 0,
    } = cell.style;
    const defineName = controller.getDefineName(cell.row, cell.col);
    activeCellStore.setState({
      ...cellPosition,
      row: cell.row,
      col: cell.col,
      value: cell.value,
      formula: cell.formula,
      isBold,
      isItalic,
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
    coreStore.mergeState({ currentSheetId: controller.getCurrentSheetId() });
  }
  if (changeSet.has('scroll')) {
    const scroll = controller.getScroll();
    scrollStore.setState({
      scrollLeft: scroll.scrollLeft,
      scrollTop: scroll.scrollTop,
    });
  }
};
export function initCanvas(controller: IController) {
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
    copy,
    cut,
    paste,
    modelChange: (changeSet) => {
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
  ]);
  handleStateChange(changeSet, controller);
  resize(changeSet);

  return removeEvent;
}
