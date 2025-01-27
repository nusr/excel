import { screen, fireEvent } from '@testing-library/react';
import { type, renderComponent } from './util';
import './global.mock';

describe('HorizontalAlign.test.tsx', () => {
  beforeEach(async () => {
    await renderComponent();
  });
  describe('left', () => {
    test('ok', async () => {
      type('test');

      fireEvent.click(screen.getByTestId('toolbar-horizontal-left'));

      expect(screen.getByTestId('toolbar-horizontal-left')).toHaveClass(
        'active',
      );
    });
  });
  describe('center', () => {
    test('ok', async () => {
      type('test');

      fireEvent.click(screen.getByTestId('toolbar-horizontal-center'));

      expect(screen.getByTestId('toolbar-horizontal-center')).toHaveClass(
        'active',
      );
    });
  });
  describe('right', () => {
    test('ok', async () => {
      type('test');

      fireEvent.click(screen.getByTestId('toolbar-horizontal-right'));

      expect(screen.getByTestId('toolbar-horizontal-right')).toHaveClass(
        'active',
      );
    });
  });
});
