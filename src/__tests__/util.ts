import { screen, fireEvent } from '@testing-library/react';

export function type(content: string) {
  fireEvent.click(screen.getByTestId('formula-editor-trigger'));
  fireEvent.change(screen.getByTestId('formula-editor'), {
    currentTarget: { value: content },
    target: { value: content },
  });
  fireEvent.keyDown(screen.getByTestId('formula-editor'), {
    key: 'Enter',
  });

  fireEvent.keyDown(document.body, { key: 'ArrowUp' });
}
