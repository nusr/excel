import { screen, fireEvent } from '@testing-library/react';
import { type, renderComponent } from './util';
import './global.mock';

describe('FormulaBar.test.tsx', () => {
  beforeEach(async () => {
    renderComponent();
    await screen.findByTestId('formula-editor-trigger');
  });
  describe('defined name', () => {
    test('normal', () => {
      expect(screen.getByTestId('formula-bar-name-input')).toHaveValue('A1');
      expect(screen.getByTestId('formula-bar')!.childNodes).toHaveLength(2);
    });
    test('range jump', async () => {
      fireEvent.change(screen.getByTestId('formula-bar-name-input'), {
        target: { value: 'G100' },
      });
      fireEvent.keyDown(screen.getByTestId('formula-bar-name-input'), {
        key: 'Enter',
      });
      expect(screen.getByTestId('formula-bar-name-input')).toHaveValue('G100');
    });
    test('define name jump', async () => {
      fireEvent.change(screen.getByTestId('formula-bar-name-input'), {
        target: { value: 'foo' },
      });
      fireEvent.keyDown(screen.getByTestId('formula-bar-name-input'), {
        key: 'Enter',
      });
      expect(screen.getByTestId('formula-bar-name-input')).toHaveValue('foo');
    });
    test('error define name', async () => {
      fireEvent.change(screen.getByTestId('formula-bar-name-input'), {
        target: { value: 'foo_343.=' },
      });
      fireEvent.keyDown(screen.getByTestId('formula-bar-name-input'), {
        key: 'Enter',
      });
      expect(screen.getByTestId('formula-bar-name-input')).toHaveValue('A1');
    });
    test('empty', async () => {
      fireEvent.change(screen.getByTestId('formula-bar-name-input'), {
        target: { value: '' },
      });
      fireEvent.keyDown(screen.getByTestId('formula-bar-name-input'), {
        key: 'Enter',
      });
      expect(screen.getByTestId('formula-bar-name-input')).toHaveValue('A1');
    });

    test('popup jump', async () => {
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
    test('enter', async () => {
      type('3');
      expect(screen.getByTestId('formula-editor-trigger')).toHaveTextContent(
        '3',
      );
    });
    test('tab', async () => {
      type('3', false);
      expect(screen.getByTestId('formula-editor-trigger')).toHaveTextContent(
        '3',
      );
    });
  });
});
