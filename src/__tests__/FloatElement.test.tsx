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
import { type } from './util';
import { sleep } from '@/util';

describe('FloatElement.test.ts', () => {
  afterEach(cleanup);
  describe('float element', () => {
    test('throw error', () => {
      act(() => {
        render(<App controller={initController()} />);
      });

      fireEvent.click(screen.getByTestId('toolbar-chart'));
      expect(screen.getByTestId('assert_toast')).toHaveTextContent(
        'The selected cells must contain the data',
      );
    });
  });
  describe.skip('context menu', () => {
    test('context menu', async () => {
      const controller = initController();
      act(() => {
        render(<App controller={controller} />);
      });
      type('1');
      fireEvent.click(screen.getByTestId('toolbar-chart'));
      await sleep(1000);
      fireEvent.contextMenu(screen.getByTestId('float-element'), {
        clientY: 20,
        clientX: 20,
      });

      expect(
        screen.getByTestId('float-element-context-menu')!.childNodes,
      ).toHaveLength(10);
    });
  });
});
