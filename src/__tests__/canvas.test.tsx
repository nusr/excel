import { App } from '@/containers';
import * as React from 'react';
import {
  cleanup,
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from '@testing-library/react';
import { isMac } from '@/util';
import '@testing-library/jest-dom';
import { type, extractDataFromTransform } from './util';
import { initControllerForTest } from '@/controller';

describe('Canvas.test.ts', () => {
  afterEach(cleanup);

  describe('canvas', () => {
    test('normal', () => {
      act(() => {
        render(<App controller={initControllerForTest()} />);
      });
      expect(screen.getByTestId('canvas-container')!.childNodes).toHaveLength(
        5,
      );
      expect(
        screen.getByTestId('canvas-container')!.firstChild!.nodeName,
      ).toEqual('CANVAS');
    });
    test('context menu', () => {
      act(() => {
        render(<App controller={initControllerForTest()} />);
      });
      fireEvent.contextMenu(screen.getByTestId('canvas-main'), {
        clientY: 200,
        clientX: 200,
      });
      expect(screen.getByTestId('context-menu')!.childNodes).toHaveLength(7);
    });
  });
  describe('BottomBar', () => {
    test('normal', () => {
      act(() => {
        render(<App controller={initControllerForTest()} />);
      });
      const key = `${isMac() ? 'meta' : 'ctrl'}Key`;
      fireEvent.keyDown(document.body, { key: 'ArrowDown', [key]: true });
      expect(screen.getByTestId('canvas-bottom-bar').childNodes.length).toEqual(
        4,
      );
    });
    test('add rows', () => {
      const controller = initControllerForTest();
      act(() => {
        render(<App controller={controller} />);
      });
      const key = `${isMac() ? 'meta' : 'ctrl'}Key`;
      fireEvent.keyDown(document.body, { key: 'ArrowDown', [key]: true });
      const oldSheetInfo = controller.getSheetInfo()!;

      fireEvent.change(screen.getByTestId('canvas-bottom-bar-input'), {
        target: { value: '12' },
      });
      fireEvent.click(screen.getByTestId('canvas-bottom-bar-add'));
      const newSheetInfo = controller.getSheetInfo()!;
      expect(newSheetInfo.rowCount).toEqual(oldSheetInfo.rowCount + 12);
    });
    test('add rows threshold', () => {
      const controller = initControllerForTest();
      act(() => {
        render(<App controller={controller} />);
      });
      const key = `${isMac() ? 'meta' : 'ctrl'}Key`;
      fireEvent.keyDown(document.body, { key: 'ArrowDown', [key]: true });
      const oldSheetInfo = controller.getSheetInfo()!;

      fireEvent.change(screen.getByTestId('canvas-bottom-bar-input'), {
        target: { value: '10000' },
      });
      fireEvent.click(screen.getByTestId('canvas-bottom-bar-add'));
      const newSheetInfo = controller.getSheetInfo()!;
      expect(newSheetInfo.rowCount).toEqual(oldSheetInfo.rowCount + 200);
    });
  });
  describe('ScrollBar', () => {
    test('scroll down', async () => {
      act(() => {
        render(<App controller={initControllerForTest()} />);
      });

      const oldTop = extractDataFromTransform(
        window.getComputedStyle(
          screen.getByTestId('vertical-scroll-bar-content'),
        ).transform,
        'translateY',
      );
      fireEvent.pointerDown(screen.getByTestId('vertical-scroll-bar'), {
        buttons: 1,
        clientX: 0,
        clientY: 0,
      });
      fireEvent.pointerMove(document, { buttons: 1, clientY: 20, clientX: 0 });
      fireEvent.pointerUp(document);
      const newTop = extractDataFromTransform(
        window.getComputedStyle(
          screen.getByTestId('vertical-scroll-bar-content'),
        ).transform,
        'translateY',
      );
      expect(newTop).toEqual(oldTop + 20);
    });
    test('scroll right', async () => {
      act(() => {
        render(<App controller={initControllerForTest()} />);
      });

      const old = extractDataFromTransform(
        window.getComputedStyle(
          screen.getByTestId('horizontal-scroll-bar-content'),
        ).transform,
        'translateX',
      );
      fireEvent.pointerDown(screen.getByTestId('horizontal-scroll-bar'), {
        buttons: 1,
        clientX: 0,
        clientY: 0,
      });
      fireEvent.pointerMove(document, { buttons: 1, clientY: 0, clientX: 20 });
      fireEvent.pointerUp(document);
      const newData = extractDataFromTransform(
        window.getComputedStyle(
          screen.getByTestId('horizontal-scroll-bar-content'),
        ).transform,
        'translateX',
      );
      expect(newData).toEqual(old + 20);
    });
  });
  describe('selection', () => {
    test('select col', () => {
      act(() => {
        render(<App controller={initControllerForTest()} />);
      });
      fireEvent.pointerDown(screen.getByTestId('canvas-main'), {
        timeStamp: 100,
        clientX: 341,
        clientY: 145,
        buttons: 1,
      });
      expect(screen.getByTestId('formula-bar-name-input')).toHaveValue('E1');
    });
    test('select col move', () => {
      const controller = initControllerForTest();
      act(() => {
        render(<App controller={controller} />);
      });
      fireEvent.pointerDown(screen.getByTestId('canvas-main'), {
        timeStamp: 100,
        clientX: 341,
        clientY: 145,
        buttons: 1,
      });
      expect(screen.getByTestId('formula-bar-name-input')).toHaveValue('E1');
      fireEvent.pointerMove(screen.getByTestId('canvas-main'), {
        timeStamp: 100,
        clientX: 600,
        clientY: 145,
        buttons: 1,
      });
      expect(controller.getActiveCell().colCount).toBeGreaterThan(3);
    });
    test('select row', () => {
      act(() => {
        render(<App controller={initControllerForTest()} />);
      });
      fireEvent.pointerDown(screen.getByTestId('canvas-main'), {
        timeStamp: 100,
        clientX: 17,
        clientY: 298,
        buttons: 1,
      });
      expect(screen.getByTestId('formula-bar-name-input')).toHaveValue('A6');
    });
    test('select row move', () => {
      const controller = initControllerForTest();
      act(() => {
        render(<App controller={controller} />);
      });
      fireEvent.pointerDown(screen.getByTestId('canvas-main'), {
        timeStamp: 100,
        clientX: 17,
        clientY: 298,
        buttons: 1,
      });
      expect(screen.getByTestId('formula-bar-name-input')).toHaveValue('A6');

      fireEvent.pointerMove(screen.getByTestId('canvas-main'), {
        timeStamp: 100,
        clientX: 17,
        clientY: 500,
        buttons: 1,
      });
      expect(controller.getActiveCell().rowCount).toBeGreaterThan(3);
    });
    test('select all', () => {
      act(() => {
        render(<App controller={initControllerForTest()} />);
      });
      fireEvent.pointerDown(screen.getByTestId('canvas-main'), {
        timeStamp: 100,
        clientX: 16,
        clientY: 155,
        buttons: 1,
      });

      expect(screen.getByTestId('formula-bar-name-input')).toHaveValue('A1');
    });
    test('range move', () => {
      const controller = initControllerForTest();
      act(() => {
        render(<App controller={controller} />);
      });
      fireEvent.pointerDown(screen.getByTestId('canvas-main'), {
        timeStamp: 100,
        clientX: 300,
        clientY: 300,
        buttons: 1,
      });
      const oldRange = controller.getActiveCell();
      expect(oldRange.rowCount).toEqual(1);
      expect(oldRange.colCount).toEqual(1);
      fireEvent.pointerMove(screen.getByTestId('canvas-main'), {
        timeStamp: 100,
        clientX: 600,
        clientY: 500,
        buttons: 1,
      });
      const newRange = controller.getActiveCell();
      expect(newRange.rowCount).toBeGreaterThan(2);
      expect(newRange.colCount).toBeGreaterThan(2);
    });
  });
  describe('context menu', () => {
    test('copy', async () => {
      const controller = initControllerForTest();
      act(() => {
        render(<App controller={controller} />);
      });
      type('test');
      fireEvent.contextMenu(screen.getByTestId('canvas-main'), {
        clientY: 200,
        clientX: 200,
      });
      fireEvent.click(screen.getByTestId('context-menu-copy'));
      fireEvent.keyDown(document.body, { key: 'ArrowDown' });

      fireEvent.contextMenu(screen.getByTestId('canvas-main'), {
        clientY: 200,
        clientX: 200,
      });
      fireEvent.click(screen.getByTestId('context-menu-paste'));
      await waitFor(() => {
        expect(controller.getCell(controller.getActiveCell())?.value).toEqual(
          'test',
        );
      });
    });
    test('cut', async () => {
      const controller = initControllerForTest();
      act(() => {
        render(<App controller={controller} />);
      });
      type('test');
      fireEvent.contextMenu(screen.getByTestId('canvas-main'), {
        clientY: 200,
        clientX: 200,
      });
      fireEvent.click(screen.getByTestId('context-menu-cut'));
      fireEvent.keyDown(document.body, { key: 'ArrowDown' });

      fireEvent.contextMenu(screen.getByTestId('canvas-main'), {
        clientY: 200,
        clientX: 200,
      });
      fireEvent.click(screen.getByTestId('context-menu-paste'));

      await waitFor(() => {
        expect(controller.getCell(controller.getActiveCell())?.value).toEqual(
          'test',
        );
      });

      fireEvent.keyDown(document.body, { key: 'ArrowUp' });
      await waitFor(() => {
        expect(controller.getCell(controller.getActiveCell())).toBeNull();
      });
    });

    test('change column width', () => {
      const controller = initControllerForTest();
      act(() => {
        render(<App controller={controller} />);
      });
      fireEvent.pointerDown(screen.getByTestId('canvas-main'), {
        timeStamp: 100,
        clientX: 395,
        clientY: 154,
        buttons: 1,
      });
      fireEvent.contextMenu(screen.getByTestId('canvas-main'), {
        clientX: 395,
        clientY: 154,
      });

      fireEvent.click(screen.getByTestId('context-menu-column-width'));
      fireEvent.change(
        screen.getByTestId('context-menu-width-height-dialog-input'),
        {
          target: { value: '200' },
        },
      );

      fireEvent.click(
        screen.getByTestId('context-menu-width-height-dialog-confirm'),
      );
      expect(
        controller.getColWidth(controller.getActiveCell().col).len,
      ).toEqual(200);
    });
    test('hide col', () => {
      const controller = initControllerForTest();
      act(() => {
        render(<App controller={controller} />);
      });
      fireEvent.pointerDown(screen.getByTestId('canvas-main'), {
        timeStamp: 100,
        clientX: 341,
        clientY: 145,
        buttons: 1,
      });
      fireEvent.contextMenu(screen.getByTestId('canvas-main'), {
        clientX: 341,
        clientY: 145,
      });

      fireEvent.click(screen.getByTestId('context-menu-hide-column'));

      expect(
        controller.getColWidth(controller.getActiveCell().col).len,
      ).toEqual(0);
    });
    test('delete col', () => {
      const controller = initControllerForTest();
      act(() => {
        render(<App controller={controller} />);
      });
      const oldColCount = controller.getSheetInfo()!.colCount;
      fireEvent.pointerDown(screen.getByTestId('canvas-main'), {
        timeStamp: 100,
        clientX: 341,
        clientY: 145,
        buttons: 1,
      });
      fireEvent.contextMenu(screen.getByTestId('canvas-main'), {
        clientX: 341,
        clientY: 145,
      });

      fireEvent.click(screen.getByTestId('context-menu-delete-column'));

      expect(controller.getSheetInfo()!.colCount).toEqual(oldColCount - 1);
    });
    test('add col left', () => {
      const controller = initControllerForTest();
      act(() => {
        render(<App controller={controller} />);
      });
      const oldColCount = controller.getSheetInfo()!.colCount;
      fireEvent.pointerDown(screen.getByTestId('canvas-main'), {
        timeStamp: 100,
        clientX: 341,
        clientY: 145,
        buttons: 1,
      });
      fireEvent.contextMenu(screen.getByTestId('canvas-main'), {
        clientX: 341,
        clientY: 145,
      });

      fireEvent.click(screen.getByTestId('context-menu-insert-column-left'));

      expect(controller.getSheetInfo()!.colCount).toEqual(oldColCount + 1);
    });

    test('add col right', () => {
      const controller = initControllerForTest();
      act(() => {
        render(<App controller={controller} />);
      });
      const oldColCount = controller.getSheetInfo()!.colCount;
      fireEvent.pointerDown(screen.getByTestId('canvas-main'), {
        timeStamp: 100,
        clientX: 341,
        clientY: 145,
        buttons: 1,
      });
      fireEvent.contextMenu(screen.getByTestId('canvas-main'), {
        clientX: 341,
        clientY: 145,
      });

      fireEvent.click(screen.getByTestId('context-menu-insert-column-right'));

      expect(controller.getSheetInfo()!.colCount).toEqual(oldColCount + 1);
    });

    test('change row height', () => {
      const controller = initControllerForTest();
      act(() => {
        render(<App controller={controller} />);
      });
      fireEvent.pointerDown(screen.getByTestId('canvas-main'), {
        timeStamp: 100,
        clientX: 17,
        clientY: 298,
        buttons: 1,
      });
      fireEvent.contextMenu(screen.getByTestId('canvas-main'), {
        clientX: 17,
        clientY: 298,
      });

      fireEvent.click(screen.getByTestId('context-menu-row-height'));
      fireEvent.change(
        screen.getByTestId('context-menu-width-height-dialog-input'),
        {
          target: { value: '200' },
        },
      );

      fireEvent.click(
        screen.getByTestId('context-menu-width-height-dialog-confirm'),
      );
      expect(
        controller.getRowHeight(controller.getActiveCell().row).len,
      ).toEqual(200);
    });

    test('hide row', () => {
      const controller = initControllerForTest();
      act(() => {
        render(<App controller={controller} />);
      });
      fireEvent.pointerDown(screen.getByTestId('canvas-main'), {
        timeStamp: 100,
        clientX: 17,
        clientY: 298,
        buttons: 1,
      });
      fireEvent.contextMenu(screen.getByTestId('canvas-main'), {
        clientX: 17,
        clientY: 298,
      });

      fireEvent.click(screen.getByTestId('context-menu-hide-row'));

      expect(
        controller.getRowHeight(controller.getActiveCell().row).len,
      ).toEqual(0);
    });

    test('delete row', () => {
      const controller = initControllerForTest();
      act(() => {
        render(<App controller={controller} />);
      });
      const oldRowCount = controller.getSheetInfo()!.rowCount;
      fireEvent.pointerDown(screen.getByTestId('canvas-main'), {
        timeStamp: 100,
        clientX: 17,
        clientY: 298,
        buttons: 1,
      });
      fireEvent.contextMenu(screen.getByTestId('canvas-main'), {
        clientX: 17,
        clientY: 298,
      });

      fireEvent.click(screen.getByTestId('context-menu-delete-row'));

      expect(controller.getSheetInfo()!.rowCount).toEqual(oldRowCount - 1);
    });
    test('add row above', () => {
      const controller = initControllerForTest();
      act(() => {
        render(<App controller={controller} />);
      });
      const oldRowCount = controller.getSheetInfo()!.rowCount;
      fireEvent.pointerDown(screen.getByTestId('canvas-main'), {
        timeStamp: 100,
        clientX: 17,
        clientY: 298,
        buttons: 1,
      });
      fireEvent.contextMenu(screen.getByTestId('canvas-main'), {
        clientX: 17,
        clientY: 298,
      });

      fireEvent.click(screen.getByTestId('context-menu-insert-row-above'));

      expect(controller.getSheetInfo()!.rowCount).toEqual(oldRowCount + 1);
    });
    test('add row below', () => {
      const controller = initControllerForTest();
      act(() => {
        render(<App controller={controller} />);
      });
      const oldRowCount = controller.getSheetInfo()!.rowCount;
      fireEvent.pointerDown(screen.getByTestId('canvas-main'), {
        timeStamp: 100,
        clientX: 17,
        clientY: 298,
        buttons: 1,
      });
      fireEvent.contextMenu(screen.getByTestId('canvas-main'), {
        clientX: 17,
        clientY: 298,
      });

      fireEvent.click(screen.getByTestId('context-menu-insert-row-below'));

      expect(controller.getSheetInfo()!.rowCount).toEqual(oldRowCount + 1);
    });
  });
});
