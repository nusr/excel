import { App } from '@/containers';
import { initControllerForTest } from '@/controller';
import * as React from 'react';
import {
  cleanup,
  render,
  screen,
  fireEvent,
  act,
} from '@testing-library/react';
import '@testing-library/jest-dom';

describe('SheetBar.test.ts', () => {
  afterEach(cleanup);

  describe('sheet bar', () => {
    test('normal', () => {
      act(() => {
        render(<App controller={initControllerForTest()} />);
      });
      expect(screen.getByTestId('sheet-bar-list')!.childNodes).toHaveLength(1);
    });
    test('add sheet', () => {
      act(() => {
        render(<App controller={initControllerForTest()} />);
      });
      fireEvent.click(screen.getByTestId('sheet-bar-add-sheet'));
      fireEvent.click(screen.getByTestId('sheet-bar-add-sheet'));
      expect(screen.getByTestId('sheet-bar-list')!.childNodes).toHaveLength(3);
    });
  });

  describe('context menu', () => {
    test('normal', () => {
      act(() => {
        render(<App controller={initControllerForTest()} />);
      });
      fireEvent.contextMenu(
        screen.getByTestId('sheet-bar-list')!.childNodes[0],
        {
          clientX: 199,
        },
      );
      expect(
        screen.getByTestId('sheet-bar-context-menu').childNodes,
      ).toHaveLength(6);
    });

    test('insert sheet', () => {
      act(() => {
        render(<App controller={initControllerForTest()} />);
      });
      fireEvent.contextMenu(
        screen.getByTestId('sheet-bar-list')!.childNodes[0],
        {
          clientX: 199,
        },
      );
      fireEvent.click(screen.getByTestId('sheet-bar-context-menu-insert'));

      expect(screen.getByTestId('sheet-bar-list')!.childNodes).toHaveLength(2);
    });
    test('hide sheet', () => {
      act(() => {
        render(<App controller={initControllerForTest()} />);
      });
      fireEvent.contextMenu(
        screen.getByTestId('sheet-bar-list')!.childNodes[0],
        {
          clientX: 199,
        },
      );
      fireEvent.click(screen.getByTestId('sheet-bar-context-menu-insert'));
      expect(screen.getByTestId('sheet-bar-list')!.childNodes).toHaveLength(2);

      fireEvent.contextMenu(
        screen.getByTestId('sheet-bar-list')!.childNodes[1],
        {
          clientX: 199,
        },
      );
      fireEvent.click(screen.getByTestId('sheet-bar-context-menu-hide'));
      expect(screen.getByTestId('sheet-bar-list')!.childNodes).toHaveLength(1);
    });

    test('delete sheet', () => {
      act(() => {
        render(<App controller={initControllerForTest()} />);
      });
      fireEvent.contextMenu(
        screen.getByTestId('sheet-bar-list')!.childNodes[0],
        {
          clientX: 199,
        },
      );
      fireEvent.click(screen.getByTestId('sheet-bar-context-menu-insert'));
      expect(screen.getByTestId('sheet-bar-list')!.childNodes).toHaveLength(2);

      fireEvent.contextMenu(
        screen.getByTestId('sheet-bar-list')!.childNodes[1],
        {
          clientX: 199,
        },
      );
      fireEvent.click(screen.getByTestId('sheet-bar-context-menu-delete'));
      expect(screen.getByTestId('sheet-bar-list')!.childNodes).toHaveLength(1);
    });

    test('rename sheet', async () => {
      act(() => {
        render(<App controller={initControllerForTest()} />);
      });
      fireEvent.contextMenu(
        screen.getByTestId('sheet-bar-list')!.childNodes[0],
        {
          clientX: 199,
        },
      );
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
    test('tab color', async () => {
      act(() => {
        render(<App controller={initControllerForTest()} />);
      });
      fireEvent.contextMenu(
        screen.getByTestId('sheet-bar-list')!.childNodes[0],
        {
          clientX: 199,
        },
      );
      fireEvent.click(screen.getByTestId('sheet-bar-context-menu-tab-color'));

      const dom = screen.getByTestId('sheet-bar-context-menu-tab-color-list');
      dom.setAttribute('data-value', '#B2B2B2');
      fireEvent.click(dom);
      expect(screen.getByTestId('sheet-bar-tab-color-item')).toHaveStyle({
        backgroundColor: '#B2B2B2',
      });
    });
  });
  describe('unhide sheet', () => {
    test('normal', () => {
      act(() => {
        render(<App controller={initControllerForTest()} />);
      });
      fireEvent.contextMenu(screen.getByTestId('sheet-bar-active-item'), {
        clientX: 199,
      });
      expect(
        screen.getByTestId('sheet-bar-context-menu-unhide'),
      ).toBeDisabled();
    });

    test('unhide', () => {
      act(() => {
        render(<App controller={initControllerForTest()} />);
      });
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
      expect(screen.getByTestId('sheet-bar-active-item')).toHaveTextContent(
        'Sheet4',
      );
    });
  });
  describe('select sheet', () => {
    test('normal', () => {
      act(() => {
        render(<App controller={initControllerForTest()} />);
      });
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
