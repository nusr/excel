import { IWindowSize, CanvasOverlayPosition } from '@/types';
import { ROW_TITLE_HEIGHT, COL_TITLE_WIDTH } from './constant';
import { sizeConfig } from '../theme'

class BaseSet<T> {
  private state: T;
  constructor(initValue: T) {
    this.state = initValue;
  }
  set = (data: T): void => {
    this.state = data;
  };
  get() {
    return this.state;
  }
}

export const canvasSizeSet = new BaseSet<CanvasOverlayPosition>({
  top: 0,
  left: 0,
  width: 0,
  height: 0,
});

export const sheetViewSizeSet = new BaseSet<IWindowSize>({
  width: 0,
  height: 0,
});

export const headerSizeSet = new BaseSet<IWindowSize>({
  width: COL_TITLE_WIDTH,
  height: ROW_TITLE_HEIGHT,
});
export const BOTTOM_BUFF = 200;
export function computeScrollPosition() {
  const contentSize = parseInt(sizeConfig.scrollBarContent, 10);
  const canvasRect = canvasSizeSet.get();
  const viewSize = sheetViewSizeSet.get();
  const maxHeight = viewSize.height - canvasRect.height + BOTTOM_BUFF;
  const maxWidth = viewSize.width - canvasRect.width + BOTTOM_BUFF;
  const maxScrollHeight = canvasRect.height - contentSize;
  const maxScrollWidth = canvasRect.width - contentSize;

  return {
    maxHeight,
    maxWidth,
    maxScrollHeight,
    maxScrollWidth,
  };
}
