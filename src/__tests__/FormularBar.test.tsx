import { App } from '@/containers';
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
import { initControllerForTest } from '@/controller';

describe('FormulaBar.test.tsx', () => {
  afterEach(cleanup);

  describe('formula bar', () => {
    test('normal', () => {
      act(() => {
        render(<App controller={initControllerForTest()} />);
      });
      expect(
        screen.getByTestId('formula-bar-name')!.querySelector('input')!.value,
      ).toEqual('A1');
      expect(screen.getByTestId('formula-bar')!.childNodes).toHaveLength(2);
    });
    test('range jump', async () => {
      const controller = initControllerForTest();
      act(() => {
        render(<App controller={controller} />);
      });

      fireEvent.change(screen.getByTestId('formula-bar-name-input'), {
        target: { value: 'G100' },
      });
      fireEvent.keyDown(screen.getByTestId('formula-bar-name-input'), {
        key: 'Enter',
      });
      expect(
        (screen.getByTestId('formula-bar-name-input') as HTMLInputElement)
          .value,
      ).toEqual('G100');
    });
    test('define name jump', async () => {
      act(() => {
        render(<App controller={initControllerForTest()} />);
      });
      fireEvent.change(screen.getByTestId('formula-bar-name-input'), {
        target: { value: 'foo' },
      });
      fireEvent.keyDown(screen.getByTestId('formula-bar-name-input'), {
        key: 'Enter',
      });
      expect(
        (screen.getByTestId('formula-bar-name-input') as HTMLInputElement)
          .value,
      ).toEqual('foo');
    });
    test('error define name', async () => {
      act(() => {
        render(<App controller={initControllerForTest()} />);
      });
      fireEvent.change(screen.getByTestId('formula-bar-name-input'), {
        target: { value: 'foo_343.=' },
      });
      fireEvent.keyDown(screen.getByTestId('formula-bar-name-input'), {
        key: 'Enter',
      });
      expect(
        (screen.getByTestId('formula-bar-name-input') as HTMLInputElement)
          .value,
      ).toEqual('A1');
    });
  });
  describe('formula editor', () => {
    test('input', async () => {
      act(() => {
        render(<App controller={initControllerForTest()} />);
      });
      type('3');
      expect(screen.getByTestId('formula-editor-trigger').textContent).toEqual(
        '3',
      );
    });
  });
});
