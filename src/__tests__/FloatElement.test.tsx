import { App } from '@/containers';
import { initController } from '@/controller';
import * as React from 'react';
import {
  cleanup,
  render,
  screen,
  fireEvent,
  act,
} from '@testing-library/react';
import '@testing-library/jest-dom';

describe.skip('FloatElement.test.ts', () => {
  afterEach(cleanup);
  describe('float element', () => {
    test('add chart', async () => {
      const controller = initController();
      const range = {
        row: 0,
        col: 0,
        rowCount: 3,
        colCount: 3,
        sheetId: controller.getCurrentSheetId(),
      };
      controller.setActiveCell(range);
      controller.setCell(
        [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
        ],
        [],
        range,
      );

      act(() => {
        render(<App controller={controller} />);
      });
      controller.setActiveCell(range);
      fireEvent.click(screen.getByTestId('toolbar-chart'), {
        clientX: 10,
        clientY: 10,
      });
      fireEvent.click(screen.getByTestId('toolbar-chart'), {
        clientX: 10,
        clientY: 10,
      });
      expect(screen.getByTestId('float-element')).toBeVisible();
    });
  });
});
