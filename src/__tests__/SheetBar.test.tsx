import { screen, fireEvent } from '@testing-library/react';
import './global.mock';
import { renderComponent } from './util';

describe('SheetBar.test.ts', () => {
  beforeEach(async () => {
    renderComponent();
    await screen.findByTestId('formula-editor-trigger');
  });
  describe('sheet bar', () => {
    test('normal', () => {
      expect(screen.getByTestId('sheet-bar-list')!.childNodes).toHaveLength(1);
    });
    test('add sheet', () => {
      fireEvent.click(screen.getByTestId('sheet-bar-add-sheet'));
      fireEvent.click(screen.getByTestId('sheet-bar-add-sheet'));
      expect(screen.getByTestId('sheet-bar-list')!.childNodes).toHaveLength(3);
    });
    test('click active', () => {
      fireEvent.click(screen.getByTestId('sheet-bar-add-sheet'));
      fireEvent.click(screen.getByTestId('sheet-bar-add-sheet'));
      const text =
        screen.getByTestId('sheet-bar-active-item').textContent || '';
      fireEvent.click(screen.getByTestId('sheet-bar-active-item'));
      expect(screen.getByTestId('sheet-bar-active-item')).toHaveTextContent(
        text,
      );
    });
  });
  describe('tab color', () => {
    test('ok', async () => {
      fireEvent.contextMenu(screen.getByTestId('sheet-bar-active-item'), {
        clientX: 199,
      });
      fireEvent.click(screen.getByTestId('sheet-bar-context-menu-tab-color'));

      const dom = screen.getByTestId('sheet-bar-context-menu-tab-color-list');
      dom.setAttribute('data-value', '#B2B2B2');
      fireEvent.click(dom);
      expect(screen.getByTestId('sheet-bar-tab-color-item')).toHaveStyle({
        backgroundColor: '#B2B2B2',
      });
    });
    test('add sheet', async () => {
      fireEvent.contextMenu(screen.getByTestId('sheet-bar-active-item'), {
        clientX: 199,
      });
      fireEvent.click(screen.getByTestId('sheet-bar-context-menu-tab-color'));

      const dom = screen.getByTestId('sheet-bar-context-menu-tab-color-list');
      dom.setAttribute('data-value', '#B2B2B2');
      fireEvent.click(dom);
      expect(screen.getByTestId('sheet-bar-tab-color-item')).toHaveStyle({
        backgroundColor: '#B2B2B2',
      });
      fireEvent.click(screen.getByTestId('sheet-bar-add-sheet'));

      expect(screen.getByTestId('sheet-bar-list')!.firstChild).toHaveStyle({
        backgroundColor: '#B2B2B2',
      });
    });
  });
  describe('rename sheet', () => {
    test('empty', async () => {
      fireEvent.contextMenu(screen.getByTestId('sheet-bar-active-item'), {
        clientX: 199,
      });
      fireEvent.click(screen.getByTestId('sheet-bar-context-menu-rename'));

      fireEvent.change(screen.getByTestId('sheet-bar-rename-input'), {
        target: { value: '' },
      });
      fireEvent.keyDown(screen.getByTestId('sheet-bar-rename-input'), {
        key: 'Enter',
      });
      expect(screen.getByTestId('sheet-bar-active-item')).toHaveTextContent(
        'Sheet1',
      );
    });
    test('ok', async () => {
      fireEvent.contextMenu(screen.getByTestId('sheet-bar-active-item'), {
        clientX: 199,
      });
      fireEvent.click(screen.getByTestId('sheet-bar-context-menu-rename'));

      fireEvent.change(screen.getByTestId('sheet-bar-rename-input'), {
        target: { value: 'test_sheet_name' },
      });
      fireEvent.keyDown(screen.getByTestId('sheet-bar-rename-input'), {
        key: 'Enter',
      });
      expect(screen.getByTestId('sheet-bar-list')).toHaveTextContent(
        'test_sheet_name',
      );
    });
  });
  describe('context menu', () => {
    test('normal', () => {
      fireEvent.contextMenu(screen.getByTestId('sheet-bar-active-item'), {
        clientX: 199,
      });
      expect(
        screen.getByTestId('sheet-bar-context-menu').childNodes,
      ).toHaveLength(6);
    });
    test('hide sheet', () => {
      fireEvent.contextMenu(screen.getByTestId('sheet-bar-active-item'), {
        clientX: 199,
      });
      fireEvent.click(screen.getByTestId('sheet-bar-context-menu-insert'));
      expect(screen.getByTestId('sheet-bar-list')!.childNodes).toHaveLength(2);

      fireEvent.contextMenu(screen.getByTestId('sheet-bar-active-item'), {
        clientX: 199,
      });
      fireEvent.click(screen.getByTestId('sheet-bar-context-menu-hide'));
      expect(screen.getByTestId('sheet-bar-list')!.childNodes).toHaveLength(1);
    });

    test('insert sheet', () => {
      fireEvent.contextMenu(screen.getByTestId('sheet-bar-active-item'), {
        clientX: 199,
      });
      fireEvent.click(screen.getByTestId('sheet-bar-context-menu-insert'));

      expect(screen.getByTestId('sheet-bar-list')!.childNodes).toHaveLength(2);
    });

    test('delete sheet', () => {
      fireEvent.contextMenu(screen.getByTestId('sheet-bar-active-item'), {
        clientX: 199,
      });
      fireEvent.click(screen.getByTestId('sheet-bar-context-menu-insert'));
      expect(screen.getByTestId('sheet-bar-list')!.childNodes).toHaveLength(2);
      fireEvent.contextMenu(screen.getByTestId('sheet-bar-active-item'), {
        clientX: 199,
      });
      fireEvent.click(screen.getByTestId('sheet-bar-context-menu-delete'));
      expect(screen.getByTestId('sheet-bar-list')!.childNodes).toHaveLength(1);
    });
  });
  describe('unhide sheet', () => {
    test('normal', () => {
      fireEvent.contextMenu(screen.getByTestId('sheet-bar-active-item'), {
        clientX: 199,
      });
      expect(
        screen.getByTestId('sheet-bar-context-menu-unhide'),
      ).toBeDisabled();
    });

    test('unhide', () => {
      fireEvent.click(screen.getByTestId('sheet-bar-add-sheet'));
      fireEvent.click(screen.getByTestId('sheet-bar-add-sheet'));
      fireEvent.click(screen.getByTestId('sheet-bar-add-sheet'));
      fireEvent.contextMenu(screen.getByTestId('sheet-bar-active-item'), {
        clientX: 199,
      });
      fireEvent.click(screen.getByTestId('sheet-bar-context-menu-hide'));

      fireEvent.contextMenu(screen.getByTestId('sheet-bar-active-item'), {
        clientX: 199,
      });
      expect(
        screen.getByTestId('sheet-bar-context-menu-unhide'),
      ).not.toBeDisabled();
      fireEvent.click(screen.getByTestId('sheet-bar-context-menu-unhide'));

      fireEvent.click(
        screen.getByTestId('sheet-bar-context-menu-unhide-dialog-confirm'),
      );
      expect(screen.getByTestId('sheet-bar-list')!.childNodes).toHaveLength(4);
    });
    test('unhide change', () => {
      fireEvent.click(screen.getByTestId('sheet-bar-add-sheet'));
      fireEvent.click(screen.getByTestId('sheet-bar-add-sheet'));
      fireEvent.click(screen.getByTestId('sheet-bar-add-sheet'));
      fireEvent.contextMenu(screen.getByTestId('sheet-bar-active-item'), {
        clientX: 199,
      });
      fireEvent.click(screen.getByTestId('sheet-bar-context-menu-hide'));

      fireEvent.contextMenu(screen.getByTestId('sheet-bar-active-item'), {
        clientX: 199,
      });
      fireEvent.click(screen.getByTestId('sheet-bar-context-menu-hide'));

      fireEvent.contextMenu(screen.getByTestId('sheet-bar-active-item'), {
        clientX: 199,
      });
      fireEvent.click(screen.getByTestId('sheet-bar-context-menu-unhide'));
      fireEvent.change(
        screen.getByTestId('sheet-bar-context-menu-unhide-dialog-select'),
        { target: { value: '4' } },
      );

      fireEvent.click(
        screen.getByTestId('sheet-bar-context-menu-unhide-dialog-confirm'),
      );
      expect(screen.getByTestId('sheet-bar-active-item')).toHaveTextContent(
        'Sheet4',
      );
    });
    test('unhide cancel', () => {
      fireEvent.click(screen.getByTestId('sheet-bar-add-sheet'));
      fireEvent.click(screen.getByTestId('sheet-bar-add-sheet'));
      fireEvent.click(screen.getByTestId('sheet-bar-add-sheet'));
      fireEvent.contextMenu(screen.getByTestId('sheet-bar-active-item'), {
        clientX: 199,
      });
      fireEvent.click(screen.getByTestId('sheet-bar-context-menu-hide'));

      fireEvent.contextMenu(screen.getByTestId('sheet-bar-active-item'), {
        clientX: 199,
      });
      fireEvent.click(screen.getByTestId('sheet-bar-context-menu-unhide'));

      fireEvent.click(
        screen.getByTestId('sheet-bar-context-menu-unhide-dialog-cancel'),
      );
      expect(screen.getByTestId('sheet-bar-list')!.childNodes).toHaveLength(3);
    });
  });
  describe('select sheet', () => {
    test('normal', () => {
      fireEvent.click(screen.getByTestId('sheet-bar-add-sheet'));
      fireEvent.click(screen.getByTestId('sheet-bar-add-sheet'));
      expect(screen.getByTestId('sheet-bar-active-item')).toHaveTextContent(
        'Sheet3',
      );

      fireEvent.click(screen.getByTestId('sheet-bar-select-sheet'));

      const dom = screen.getByTestId('sheet-bar-select-sheet-popup');
      dom.setAttribute('data-value', '1');
      fireEvent.click(dom);
      expect(screen.getByTestId('sheet-bar-active-item')).toHaveTextContent(
        'Sheet1',
      );
    });
  });
});
