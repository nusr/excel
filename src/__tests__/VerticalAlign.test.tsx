import { screen, fireEvent } from '@testing-library/react';
import { type, renderComponent } from './util';
import './global.mock';

describe('VerticalAlign.test.tsx', () => {
  beforeEach(async () => {
    await renderComponent();
  });
  describe('top', () => {
    test('ok', async () => {
      type('test');
      fireEvent.click(screen.getByTestId('toolbar-vertical-top'));
      expect(screen.getByTestId('toolbar-vertical-top')).toHaveClass('active');
    });
  });
  describe('middle', () => {
    test('ok', async () => {
      type('test');
      fireEvent.click(screen.getByTestId('toolbar-vertical-middle'));
      expect(screen.getByTestId('toolbar-vertical-middle')).toHaveClass(
        'active',
      );
    });
  });
  describe('bottom', () => {
    test('ok', async () => {
      type('test');
      fireEvent.click(screen.getByTestId('toolbar-vertical-bottom'));
      expect(screen.getByTestId('toolbar-vertical-bottom')).toHaveClass(
        'active',
      );
    });
  });
});
