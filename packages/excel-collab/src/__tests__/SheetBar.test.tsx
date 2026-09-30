import { screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import './global.mock';
import { chooseSelectOption, renderComponent } from './util';

describe('SheetBar.test.ts', () => {
  beforeEach(async () => {
    await renderComponent();
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
      const user = userEvent.setup();
      fireEvent.contextMenu(screen.getByTestId('sheet-bar-active-item'), {
        clientX: 199,
      });
      await user.hover(
        screen.getByTestId('sheet-bar-context-menu-tab-color'),
      );
      await user.click(await screen.findByRole('menuitem', { name: '#B2B2B2' }));
      expect(screen.getByTestId('sheet-bar-tab-color-item')).toHaveStyle({
        backgroundColor: '#B2B2B2',
      });
    });
    test('add sheet', async () => {
      const user = userEvent.setup();
      fireEvent.contextMenu(screen.getByTestId('sheet-bar-active-item'), {
        clientX: 199,
      });
      await user.hover(
        screen.getByTestId('sheet-bar-context-menu-tab-color'),
      );
      await user.click(await screen.findByRole('menuitem', { name: '#B2B2B2' }));
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
        within(screen.getByTestId('sheet-bar-context-menu')).getAllByRole(
          'menuitem',
        ),
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
      ).toHaveAttribute('aria-disabled', 'true');
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

      fireEvent.click(screen.getByRole('button', { name: /confirm/i }));

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
      await chooseSelectOption(
        'sheet-bar-context-menu-unhide-dialog-select',
        'Sheet4',
      );

      fireEvent.click(await screen.findByRole('button', { name: /confirm/i }));
      expect(
        await screen.findByTestId('sheet-bar-active-item'),
      ).toHaveTextContent('Sheet4');
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

      fireEvent.click(await screen.findByRole('button', { name: /cancel/i }));
      expect(
        (await screen.findByTestId('sheet-bar-list')).childNodes,
      ).toHaveLength(3);
    });
  });
});
