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

describe('FormulaBar.test.tsx', () => {
  afterEach(cleanup);

  describe('formula bar', () => {
    test('normal', () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      expect(
        screen.getByTestId('formula-bar-name')!.querySelector('input')!.value,
      ).toEqual('A1');
      expect(screen.getByTestId('formula-bar')!.childNodes).toHaveLength(2);
    });
    test('range jump', async () => {
      const controller = initController();
      act(() => {
        render(<App controller={controller} />);
      });

      fireEvent.change(screen.getByTestId('formula-bar-name-input'), {
        currentTarget: { value: 'G100' },
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
        render(<App controller={initController()} />);
      });
      fireEvent.change(screen.getByTestId('formula-bar-name-input'), {
        currentTarget: { value: 'foo' },
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
        render(<App controller={initController()} />);
      });
      fireEvent.change(screen.getByTestId('formula-bar-name-input'), {
        currentTarget: { value: 'foo_343.=' },
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
        render(<App controller={initController()} />);
      });
      type('3');
      expect(
        screen.getByTestId('formula-editor-trigger').textContent,
      ).toEqual('3');
    });
  });
});
