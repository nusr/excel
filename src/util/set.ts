import { IWindowSize, CanvasOverlayPosition } from '@/types';
import { ROW_TITLE_HEIGHT, COL_TITLE_WIDTH } from './constant';

class BaseSet<T extends Record<string, any>> {
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

export const workerSet = new BaseSet<{ worker?: Worker }>({});
