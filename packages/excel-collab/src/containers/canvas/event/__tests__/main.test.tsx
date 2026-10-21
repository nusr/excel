import { createEvent, fireEvent, render, screen } from '@testing-library/react';
import { MainHandler } from '../main';
import { initController } from '../../../../controller';
import { useCoreStore } from '../../../store';
import { EditorStatus } from '../../../../types';
import '../../../../__tests__/global.mock';

const controllers: ReturnType<typeof initController>[] = [];

function setup() {
  const controller = initController();
  controller.addFirstSheet();
  controllers.push(controller);
  const handler = new MainHandler();
  const header = controller.getHeaderSize();
  render(
    <canvas
      data-testid="pointer-target"
      onPointerDown={(event) => handler.pointerDown({
        controller,
        x: header.width + 5,
        y: header.height + 5,
        position: { row: 0, col: 0, marginX: 5, marginY: 5 },
      }, event)}
    />,
  );
  return (button: number, timeStamp: number) => {
    const canvas = screen.getByTestId('pointer-target');
    const event = createEvent.pointerDown(canvas, { button, buttons: button === 0 ? 1 : 2 });
    Object.defineProperty(event, 'timeStamp', { value: timeStamp });
    fireEvent(canvas, event);
  };
}

beforeEach(() => useCoreStore.setState({ editorStatus: EditorStatus.NONE }));
afterEach(() => {
  for (const controller of controllers.splice(0)) {
    controller.destroy();
    controller.getHooks().doc.destroy();
  }
});

test.each([0, 2])('an early first pointer click with button %s does not enter cell editing', (button) => {
  const pointerDown = setup();
  pointerDown(button, 100);
  expect(useCoreStore.getState().editorStatus).toBe(EditorStatus.NONE);
});

test('a right-click after a primary click never enters editing or starts another double-click', () => {
  const pointerDown = setup();
  pointerDown(0, 100);
  pointerDown(2, 150);
  expect(useCoreStore.getState().editorStatus).toBe(EditorStatus.NONE);
  pointerDown(0, 200);
  expect(useCoreStore.getState().editorStatus).toBe(EditorStatus.NONE);
});

test('two primary clicks still enter cell editing', () => {
  const pointerDown = setup();
  pointerDown(0, 100);
  pointerDown(0, 200);
  expect(useCoreStore.getState().editorStatus).toBe(EditorStatus.EDIT_CELL);
});
