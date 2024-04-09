import { App } from '@/containers';
import * as React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { type } from './util';
import { initControllerForTest } from '@/controller';
import './global.mock';

describe('FormulaBar.test.tsx', () => {
  describe('formula bar', () => {
    test('normal', () => {
      act(() => {
        render(<App controller={initControllerForTest()} />);
      });
      expect(screen.getByTestId('formula-bar-name-input')).toHaveValue('A1');
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
      expect(screen.getByTestId('formula-bar-name-input')).toHaveValue('G100');
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
      expect(screen.getByTestId('formula-bar-name-input')).toHaveValue('foo');
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
      expect(screen.getByTestId('formula-bar-name-input')).toHaveValue('A1');
    });
    test('empty', async () => {
      act(() => {
        render(<App controller={initControllerForTest()} />);
      });
      fireEvent.change(screen.getByTestId('formula-bar-name-input'), {
        target: { value: '' },
      });
      fireEvent.keyDown(screen.getByTestId('formula-bar-name-input'), {
        key: 'Enter',
      });
      expect(screen.getByTestId('formula-bar-name-input')).toHaveValue('A1');
    });

    test('popup jump', async () => {
      act(() => {
        render(<App controller={initControllerForTest()} />);
      });
      fireEvent.change(screen.getByTestId('formula-bar-name-input'), {
        target: { value: 'foo' },
      });
      fireEvent.keyDown(screen.getByTestId('formula-bar-name-input'), {
        key: 'Enter',
      });
      expect(screen.getByTestId('formula-bar-name-input')).toHaveValue('foo');

      fireEvent.keyDown(document.body, { key: 'Enter' });

      fireEvent.click(screen.getByTestId('formula-bar-name-trigger'));
      const dom = screen.getByTestId('formula-bar-name-popup');
      dom.setAttribute('data-value', 'foo');
      fireEvent.click(dom);
      expect(screen.getByTestId('formula-bar-name-input')).toHaveValue('foo');
    });

    test('duplicate', async () => {
      act(() => {
        render(<App controller={initControllerForTest()} />);
      });
      fireEvent.change(screen.getByTestId('formula-bar-name-input'), {
        target: { value: 'foo' },
      });
      fireEvent.keyDown(screen.getByTestId('formula-bar-name-input'), {
        key: 'Enter',
      });
      expect(screen.getByTestId('formula-bar-name-input')).toHaveValue('foo');

      fireEvent.keyDown(document.body, { key: 'Enter' });

      fireEvent.change(screen.getByTestId('formula-bar-name-input'), {
        target: { value: 'foo' },
      });
      fireEvent.keyDown(screen.getByTestId('formula-bar-name-input'), {
        key: 'Enter',
      });
      expect(screen.getByTestId('formula-bar-name-input')).toHaveValue('foo');
    });
  });
  describe('formula editor', () => {
    test('input', async () => {
      act(() => {
        render(<App controller={initControllerForTest()} />);
      });
      type('3');
      expect(screen.getByTestId('formula-editor-trigger')).toHaveTextContent(
        '3',
      );
    });
  });
});
