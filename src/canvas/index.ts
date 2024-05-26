import { MainView, IController } from '@/types';
import { workerSet, canvasSizeSet } from '@/util';
import { MainCanvas } from './MainCanvas';

export { registerGlobalEvent } from './event';
export {
  computeScrollRowAndCol,
  computeScrollPosition,
  checkFocus,
  setActiveCellValue,
  scrollBar,
  scrollToView,
  scrollSheetToView,
} from './shortcut';

let instance: MainCanvas;

export function initRenderCanvas(
  controller: IController,
  canvas: HTMLCanvasElement,
): MainView {
  const worker = workerSet.get().worker;
  if (!worker) {
    // only run in test environment
    return {
      render() {},
      resize() {
        const { width, height } = canvasSizeSet.get();
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
      },
    };
  }
  if (instance) {
    return instance;
  }
  instance = new MainCanvas(controller, canvas);
  return instance;
}
