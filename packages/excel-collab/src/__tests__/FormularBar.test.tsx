import { screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type, renderComponent } from './util';
import './global.mock';
import type { IController } from '../types';

describe('FormulaBar.test.tsx', () => {
  let controller: IController;
  beforeEach(async () => {
    ({ controller } = await renderComponent());
  });
  describe('defined name', () => {
    test('sheet-qualified jumps resolve mixed-case sheet names', () => {
      const first = controller.getCurrentSheetId();
      let target = '';
      act(() => {
        target = controller.addSheet()!.sheetId;
        controller.renameSheet('Mixed Case');
        controller.setCurrentSheetId(first);
      });
      fireEvent.change(screen.getByTestId('formula-bar-name-input'), {
        target: { value: "'Mixed Case'!C3" },
      });
      fireEvent.keyDown(screen.getByTestId('formula-bar-name-input'), { key: 'Enter' });
      expect(controller.getCurrentSheetId()).toBe(target);
      expect(controller.getActiveRange().range).toMatchObject({ row: 2, col: 2 });
    });
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
      const user = userEvent.setup();
      fireEvent.change(screen.getByTestId('formula-bar-name-input'), {
        target: { value: 'foo' },
      });
      fireEvent.keyDown(screen.getByTestId('formula-bar-name-input'), {
        key: 'Enter',
      });
      expect(await screen.findByTestId('formula-bar-name-input')).toHaveValue('foo');

      fireEvent.keyDown(document.body, { key: 'Enter' });

      await user.click(await screen.findByTestId('formula-bar-name-trigger'));
      await user.click(await screen.findByRole('menuitemradio', { name: 'foo' }));
      expect(await screen.findByTestId('formula-bar-name-input')).toHaveValue('foo');
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
      expect(screen.getByTestId('formula-editor-trigger')).toHaveTextContent('3');
    });
    test('tab', async () => {
      type('3', false);
      expect(screen.getByTestId('formula-editor-trigger')).toHaveTextContent('3');
    });
  });
});
