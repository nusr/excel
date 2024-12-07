import { screen, fireEvent, render, act } from '@testing-library/react';
import { App, StateContext } from '../containers';
import { initController, getMockHooks } from '../controller';

export function type(content: string, isEnter = true) {
  fireEvent.click(screen.getByTestId('formula-editor-trigger'));
  fireEvent.change(screen.getByTestId('formula-editor'), {
    target: { value: content },
  });
  fireEvent.keyDown(screen.getByTestId('formula-editor'), {
    key: isEnter ? 'Enter' : 'Tab',
  });

  if (isEnter) {
    fireEvent.keyDown(document.body, { key: 'ArrowUp' });
  } else {
    fireEvent.keyDown(document.body, { key: 'ArrowLeft' });
  }
}
export function extractDataFromTransform(
  transform: string,
  type: 'translateX' | 'translateY' | 'rotate',
): number {
  const p = type === 'rotate' ? 'deg' : 'px';
  const reg = new RegExp(type + `\\((\\d+)${p}\\)`);
  const t = transform.match(reg) ?? [];
  return Number(t[1]);
}

export function renderComponent() {
  const controller = initController(getMockHooks());
  controller.addSheet();
  act(() => {
    render(
      <StateContext
        value={{
          controller,
        }}
      >
        <App />
      </StateContext>,
    );
  });
  controller.setCanvasSize({ top: 144, left: 0, width: 1300, height: 500 });
  return { controller };
}
