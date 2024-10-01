import { screen, fireEvent } from '@testing-library/react';
import { type, renderComponent } from './util';
import './global.mock';

describe('HorizontalAlign.test.tsx', () => {
  beforeEach(async () => {
    renderComponent();
    await screen.findByTestId('formula-editor-trigger');
  });
  describe('left', () => {
    test('ok', () => {
      type('test');
      fireEvent.click(screen.getByTestId('toolbar-horizontal-left'));
      expect(screen.getByTestId('toolbar-horizontal-left')).toHaveClass(
        'active',
      );
    });
  });
  describe('center', () => {
    test('ok', () => {
      type('test');
      fireEvent.click(screen.getByTestId('toolbar-horizontal-center'));
      expect(screen.getByTestId('toolbar-horizontal-center')).toHaveClass(
        'active',
      );
    });
  });
  describe('right', () => {
    test('ok', () => {
      type('test');
      fireEvent.click(screen.getByTestId('toolbar-horizontal-right'));
      expect(screen.getByTestId('toolbar-horizontal-right')).toHaveClass(
        'active',
      );
    });
  });
});
