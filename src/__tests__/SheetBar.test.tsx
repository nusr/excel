import { screen, fireEvent } from '@testing-library/react';
import './global.mock';
import { renderComponent } from './util';

describe('SheetBar.test.ts', () => {
  beforeEach(async () => {
    renderComponent();
  });
  describe('sheet bar', () => {
    test('normal', () => {
      expect(screen.getByTestId('sheet-bar-list').childNodes).toHaveLength(1);
    });
    test('add sheet', async () => {
      fireEvent.click(screen.getByTestId('sheet-bar-add-sheet'));
      fireEvent.click(screen.getByTestId('sheet-bar-add-sheet'));
      expect(
        (await screen.findByTestId('sheet-bar-list')).childNodes,
      ).toHaveLength(3);
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
    test('hide sheet', async () => {
      fireEvent.contextMenu(screen.getByTestId('sheet-bar-active-item'), {
        clientX: 199,
      });
      fireEvent.click(screen.getByTestId('sheet-bar-context-menu-insert'));

      expect(
        (await screen.findByTestId('sheet-bar-list')).childNodes,
      ).toHaveLength(2);

      fireEvent.contextMenu(screen.getByTestId('sheet-bar-active-item'), {
        clientX: 199,
      });
      fireEvent.click(screen.getByTestId('sheet-bar-context-menu-hide'));

      expect(
        (await screen.findByTestId('sheet-bar-list')).childNodes,
      ).toHaveLength(1);
    });

    test('insert sheet', async () => {
      fireEvent.contextMenu(screen.getByTestId('sheet-bar-active-item'), {
        clientX: 199,
      });
      fireEvent.click(screen.getByTestId('sheet-bar-context-menu-insert'));

      expect(
        (await screen.findByTestId('sheet-bar-list')).childNodes,
      ).toHaveLength(2);
    });

    test('delete sheet', async () => {
      fireEvent.contextMenu(screen.getByTestId('sheet-bar-active-item'), {
        clientX: 199,
      });
      fireEvent.click(screen.getByTestId('sheet-bar-context-menu-insert'));
      expect(
        (await screen.findByTestId('sheet-bar-list')).childNodes,
      ).toHaveLength(2);
      fireEvent.contextMenu(screen.getByTestId('sheet-bar-active-item'), {
        clientX: 199,
      });
      fireEvent.click(screen.getByTestId('sheet-bar-context-menu-delete'));
      expect(
        (await screen.findByTestId('sheet-bar-list')).childNodes,
      ).toHaveLength(1);
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

    test('unhide', async () => {
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
        await screen.findByTestId('sheet-bar-context-menu-unhide'),
      ).not.toBeDisabled();
      fireEvent.click(screen.getByTestId('sheet-bar-context-menu-unhide'));

      fireEvent.click(
        screen.getByTestId('sheet-bar-context-menu-unhide-dialog-confirm'),
      );

      expect(
        (await screen.findByTestId('sheet-bar-list')).childNodes,
      ).toHaveLength(4);
    });
    test('unhide change', async () => {
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
      fireEvent.click(
        await screen.findByTestId('sheet-bar-context-menu-unhide'),
      );
      fireEvent.change(
        await screen.findByTestId(
          'sheet-bar-context-menu-unhide-dialog-select',
        ),
        { target: { value: '4' } },
      );

      fireEvent.click(
        await screen.findByTestId(
          'sheet-bar-context-menu-unhide-dialog-confirm',
        ),
      );
      expect(
        await screen.findByTestId('sheet-bar-active-item'),
      ).toHaveTextContent('Sheet1');
    });
    test('unhide cancel', async () => {
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
      fireEvent.click(
        await screen.findByTestId('sheet-bar-context-menu-unhide'),
      );

      fireEvent.click(
        await screen.findByTestId(
          'sheet-bar-context-menu-unhide-dialog-cancel',
        ),
      );
      expect(
        (await screen.findByTestId('sheet-bar-list')).childNodes,
      ).toHaveLength(3);
    });
  });
});
