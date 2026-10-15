import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type, renderComponent } from './util';
import './global.mock';

describe('MergeCell.test.tsx', () => {
  beforeEach(async () => {
    await renderComponent();
  });
  describe('toolbar', () => {
    test('add merge cell', async () => {
      type('test');
      fireEvent.pointerDown(screen.getByTestId('canvas-main'), {
        timeStamp: 100,
        clientX: 67,
        clientY: 176,
        buttons: 1,
      });
      fireEvent.pointerMove(screen.getByTestId('canvas-main'), {
        timeStamp: 100,
        clientX: 67,
        clientY: 300,
        buttons: 1,
      });

      fireEvent.click(screen.getByTestId('toolbar-merge-cell'));

      expect(screen.getByTestId('formula-editor-trigger')).toHaveTextContent(
        'test',
      );
      expect(screen.getByTestId('toolbar-merge-cell')).toHaveAttribute(
        'aria-pressed',
        'true',
      );
    });
    test('toggle merge cell', async () => {
      type('test');
      fireEvent.pointerDown(screen.getByTestId('canvas-main'), {
        timeStamp: 100,
        clientX: 67,
        clientY: 176,
        buttons: 1,
      });
      fireEvent.pointerMove(screen.getByTestId('canvas-main'), {
        timeStamp: 100,
        clientX: 67,
        clientY: 300,
        buttons: 1,
      });

      fireEvent.click(screen.getByTestId('toolbar-merge-cell'));

      expect(screen.getByTestId('toolbar-merge-cell')).toHaveAttribute(
        'aria-pressed',
        'true',
      );

      fireEvent.click(screen.getByTestId('toolbar-merge-cell'));

      expect(screen.getByTestId('toolbar-merge-cell')).toHaveAttribute(
        'aria-pressed',
        'false',
      );
    });
    test('merge content', async () => {
      const user = userEvent.setup();
      type('test');
      fireEvent.keyDown(document.body, {
        key: 'Enter',
      });
      type('aa');
      fireEvent.pointerDown(screen.getByTestId('canvas-main'), {
        timeStamp: 100,
        clientX: 67,
        clientY: 176,
        buttons: 1,
      });
      fireEvent.pointerMove(screen.getByTestId('canvas-main'), {
        timeStamp: 100,
        clientX: 67,
        clientY: 300,
        buttons: 1,
      });
      await user.click(screen.getByTestId('toolbar-merge-cell-select-trigger'));
      await user.click(
        screen.getByRole('menuitemradio', { name: 'Merge Content' }),
      );

      expect(screen.getByTestId('toolbar-merge-cell')).toHaveAttribute(
        'aria-pressed',
        'true',
      );
      expect(screen.getByTestId('formula-editor-trigger')).toHaveTextContent(
        'test aa',
      );
    });
  });
});
