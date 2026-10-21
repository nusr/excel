import { vi } from 'vitest';
import { MainCanvas } from '../../canvas';
import { initController } from '../../controller';
import { initCanvas } from '../canvas/util';
import { useActiveCell } from '../store';
import { StateContext } from '../store';
import { CanvasContainer } from '../canvas';
import { render, screen } from '@testing-library/react';
import '../../__tests__/global.mock';

vi.mock('../../canvas', async (original) => ({
  ...await original<typeof import('../../canvas')>(),
  MainCanvas: class {
    static instance: MainCanvas | undefined;
    resize = vi.fn();
    render = vi.fn();
  },
  registerGlobalEvent: () => vi.fn(),
}));

test.each([
  [0, 0, 0, 0],
  [12, 10, 0, 0],
  [800, 600, 780, 580],
])('canvas %sx%s keeps scrollbar-adjusted dimensions nonnegative', (width, height, expectedWidth, expectedHeight) => {
  const controller = initController();
  controller.addFirstSheet();
  const parent = document.createElement('div');
  Object.defineProperties(parent, {
    clientWidth: { value: width },
    clientHeight: { value: height },
  });
  const canvas = document.createElement('canvas');
  parent.append(canvas);
  const cleanup = initCanvas(controller, canvas);
  try {
    expect(controller.getCanvasSize()).toMatchObject({
      width: expectedWidth,
      height: expectedHeight,
    });
  } finally {
    cleanup();
    controller.destroy();
    controller.getHooks().doc.destroy();
  }
});

test('canvas initialization binds a fresh renderer and cleanup preserves a newer renderer', () => {
  const controller = initController();
  controller.addFirstSheet();
  const parent = document.createElement('div');
  const canvas = document.createElement('canvas');
  parent.append(canvas);
  vi.spyOn(parent, 'getBoundingClientRect').mockReturnValue({
    top: 50, left: 120, width: 800, height: 400,
  } as DOMRect);
  const left = controller.computeCellPosition(controller.getActiveRange().range).left;
  const cleanupFirst = initCanvas(controller, canvas);
  const first = MainCanvas.instance;
  expect(useActiveCell.getState().left).toBe(left + 120);
  cleanupFirst();
  const cleanupReplay = initCanvas(controller, canvas);
  expect(MainCanvas.instance).toBe(first);
  const secondCanvas = document.createElement('canvas');
  parent.append(secondCanvas);
  const cleanupSecond = initCanvas(controller, secondCanvas);
  const second = MainCanvas.instance;
  expect(second).not.toBe(first);
  cleanupReplay();
  expect(MainCanvas.instance).toBe(second);
  cleanupSecond();
  expect(MainCanvas.instance).toBeUndefined();
  controller.destroy();
  controller.getHooks().doc.destroy();
  vi.restoreAllMocks();
});

test('replacing a controller gives it a new transferable canvas even for the same Doc', () => {
  const first = initController();
  first.addFirstSheet();
  const worker = new Worker('test-worker');
  const second = initController({ doc: first.getHooks().doc, worker });
  const view = render(
    <StateContext.Provider value={{ controller: first }}><CanvasContainer /></StateContext.Provider>,
  );
  const firstCanvas = screen.getByTestId('canvas-main');
  view.rerender(
    <StateContext.Provider value={{ controller: second }}><CanvasContainer /></StateContext.Provider>,
  );
  expect(screen.getByTestId('canvas-main')).not.toBe(firstCanvas);
  view.unmount();
  first.destroy();
  second.destroy();
  worker.terminate();
  first.getHooks().doc.destroy();
});
