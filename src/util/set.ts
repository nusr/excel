import { IWindowSize, CanvasOverlayPosition, MainDom } from '@/types';
import { ROW_TITLE_HEIGHT, COL_TITLE_WIDTH } from './constant';
import { sizeConfig } from './theme';
class BaseSet<T extends Record<string, any>> {
  private state: T;
  constructor(initValue: T) {
    this.state = initValue;
  }
  set = (data: T): void => {
    this.state = data;
  };
  merge = (data: Partial<T>): void => {
    this.state = Object.assign(this.state, data);
  };
  get() {
    return this.state;
  }
}

class MainDomSet extends BaseSet<MainDom> {
  getDomRect(): CanvasOverlayPosition {
    const canvas = this.get().canvas;
    if (!canvas || !canvas.parentElement) {
      return {
        top: 0,
        left: 0,
        width: 0,
        height: 0,
      };
    }
    const scrollbarSize = parseInt(sizeConfig.scrollBarSize, 10);
    const dom = canvas.parentElement;
    const size = dom.getBoundingClientRect();
    return {
      top: size.top,
      left: size.left,
      width: dom.clientWidth - scrollbarSize,
      height: dom.clientHeight - scrollbarSize,
    };
  }
}
export const mainDomSet = new MainDomSet({});

export const sheetViewSizeSet = new BaseSet<IWindowSize>({
  width: 0,
  height: 0,
});

export const headerSizeSet = new BaseSet<IWindowSize>({
  width: COL_TITLE_WIDTH,
  height: ROW_TITLE_HEIGHT,
});
