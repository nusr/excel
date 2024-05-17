import { MainCanvas } from './Main';
import { Content } from './Content';
import { IController } from '@/types';

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

function createCanvas() {
  const canvas = document.createElement('canvas');
  canvas.style.display = 'none';
  document.body.appendChild(canvas);
  return canvas;
}
export function initRenderCanvas(
  controller: IController,
  canvas: HTMLCanvasElement,
) {
  const contentCanvas = createCanvas();
  const content = new Content(controller, contentCanvas);
  const mainCanvas = new MainCanvas(controller, canvas, content);
  return mainCanvas;
}
