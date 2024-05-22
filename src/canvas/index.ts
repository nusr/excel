import { MainView, IController } from '@/types';
import { workerSet } from '@/util';
import { MainCanvas } from './Main';
import { OffScreenCanvas } from './offScreenCanvas';

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

let instance: OffScreenCanvas;

export function initRenderCanvas(
  controller: IController,
  canvas: HTMLCanvasElement,
): MainView {
  const worker = workerSet.get().worker;
  if (!worker) {
    return new MainCanvas(controller, canvas);
  }
  if (instance) {
    return instance;
  }
  instance = new OffScreenCanvas(controller, canvas);
  return instance;
}
