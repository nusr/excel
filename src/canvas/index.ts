import type { MainView, IController } from '../types';
import { MainCanvas } from './MainCanvas';

export { registerGlobalEvent } from './event';
export {
  computeScrollRowAndCol,
  checkFocus,
  setActiveCellValue,
  scrollBar,
  scrollToView,
  scrollSheetToView,
  computeScrollPosition,
} from './shortcut';

let instance: MainCanvas;

export function initRenderCanvas(
  controller: IController,
  canvas: HTMLCanvasElement,
): MainView {
  if (instance) {
    return instance;
  }
  instance = new MainCanvas(controller, canvas);
  return instance;
}
