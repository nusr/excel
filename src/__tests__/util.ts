import { screen, fireEvent } from '@testing-library/react';

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
