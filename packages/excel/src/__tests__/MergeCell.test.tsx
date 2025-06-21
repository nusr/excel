import { screen, fireEvent } from '@testing-library/react';
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
      expect(screen.getByTestId('toolbar-merge-cell')).toHaveClass('active');
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

      expect(screen.getByTestId('toolbar-merge-cell')).toHaveClass('active');

      fireEvent.click(screen.getByTestId('toolbar-merge-cell'));

      expect(screen.getByTestId('toolbar-merge-cell')).not.toHaveClass(
        'active',
      );
    });
    test('merge content', async () => {
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
      fireEvent.click(screen.getByTestId('toolbar-merge-cell-select-trigger'));
      const dom = screen.getByTestId('toolbar-merge-cell-select-popup');
      dom.setAttribute('data-value', '2');

      fireEvent.click(dom);

      expect(screen.getByTestId('toolbar-merge-cell')).toHaveClass('active');
      expect(screen.getByTestId('formula-editor-trigger')).toHaveTextContent(
        'test aa',
      );
    });
  });
});
