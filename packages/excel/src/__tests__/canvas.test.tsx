import { screen, fireEvent, waitFor } from '@testing-library/react';
import { isMac } from '../util';
import { type, extractDataFromTransform, renderComponent } from './util';
import './global.mock';
import { IController } from '../types';
import userEvent from '@testing-library/user-event';

describe('Canvas.test.ts', () => {
  let controller: IController;
  beforeEach(async () => {
    const r = await renderComponent();
    controller = r.controller;
  });
  describe('canvas', () => {
    test('normal', () => {
      expect(screen.getByTestId('canvas-container').childNodes).toHaveLength(4);
      expect(
        screen.getByTestId('canvas-container').firstChild!.nodeName,
      ).toEqual('CANVAS');
    });
    test('context menu', () => {
      fireEvent.contextMenu(screen.getByTestId('canvas-main'), {
        clientY: 200,
        clientX: 200,
      });
      expect(screen.getByTestId('context-menu').childNodes).toHaveLength(7);
    });
  });
  describe('BottomBar', () => {
    test('normal', () => {
      const key = `${isMac() ? 'meta' : 'ctrl'}Key`;
      fireEvent.keyDown(document.body, { key: 'ArrowDown', [key]: true });
      expect(screen.getByTestId('canvas-bottom-bar').childNodes.length).toEqual(
        4,
      );
    });
    test('add rows', () => {
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
      const oldTop = extractDataFromTransform(
        window.getComputedStyle(
          await screen.findByTestId('vertical-scroll-bar-content'),
        ).transform,
        'translateY',
      );
      fireEvent.pointerDown(await screen.findByTestId('vertical-scroll-bar'), {
        buttons: 1,
        clientX: 0,
        clientY: 0,
      });
      fireEvent.pointerMove(document.body, {
        buttons: 1,
        clientY: 20,
        clientX: 0,
      });
      fireEvent.pointerUp(document.body);
      const newTop = extractDataFromTransform(
        window.getComputedStyle(
          await screen.findByTestId('vertical-scroll-bar-content'),
        ).transform,
        'translateY',
      );

      expect(newTop).toEqual(oldTop + 20);
    });
    test('scroll right', async () => {
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
      fireEvent.pointerDown(screen.getByTestId('canvas-main'), {
        timeStamp: 100,
        clientX: 350,
        clientY: 145,
        buttons: 1,
      });
      expect(screen.getByTestId('formula-bar-name-input')).toHaveValue('E1');
    });
    test('select col move', () => {
      fireEvent.pointerDown(screen.getByTestId('canvas-main'), {
        timeStamp: 100,
        clientX: 350,
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
      expect(controller.getActiveRange().range.colCount).toBeGreaterThan(3);
    });
    test('select row', () => {
      fireEvent.pointerDown(screen.getByTestId('canvas-main'), {
        timeStamp: 100,
        clientX: 17,
        clientY: 290,
        buttons: 1,
      });
      expect(screen.getByTestId('formula-bar-name-input')).toHaveValue('A6');
    });
    test('select row move', () => {
      fireEvent.pointerDown(screen.getByTestId('canvas-main'), {
        timeStamp: 100,
        clientX: 17,
        clientY: 290,
        buttons: 1,
      });
      expect(screen.getByTestId('formula-bar-name-input')).toHaveValue('A6');

      fireEvent.pointerMove(screen.getByTestId('canvas-main'), {
        timeStamp: 100,
        clientX: 17,
        clientY: 500,
        buttons: 1,
      });
      expect(controller.getActiveRange().range.rowCount).toBeGreaterThan(3);
    });
    test('select all', () => {
      fireEvent.pointerDown(screen.getByTestId('canvas-main'), {
        timeStamp: 100,
        clientX: 16,
        clientY: 155,
        buttons: 1,
      });

      expect(screen.getByTestId('formula-bar-name-input')).toHaveValue('A1');
    });
    test('range move', () => {
      fireEvent.pointerDown(screen.getByTestId('canvas-main'), {
        timeStamp: 100,
        clientX: 300,
        clientY: 300,
        buttons: 1,
      });
      const oldRange = controller.getActiveRange().range;
      expect(oldRange.rowCount).toEqual(1);
      expect(oldRange.colCount).toEqual(1);
      fireEvent.pointerMove(screen.getByTestId('canvas-main'), {
        timeStamp: 100,
        clientX: 600,
        clientY: 500,
        buttons: 1,
      });
      const newRange = controller.getActiveRange().range;
      expect(newRange.rowCount).toBeGreaterThan(2);
      expect(newRange.colCount).toBeGreaterThan(2);
    });
  });
  describe('context menu', () => {
    test('copy', async () => {
      const user = userEvent.setup();
      type('test');
      fireEvent.contextMenu(screen.getByTestId('canvas-main'), {
        clientY: 200,
        clientX: 200,
      });
      await user.click(screen.getByTestId('context-menu-copy'));
      fireEvent.keyDown(document.body, { key: 'ArrowDown' });

      fireEvent.contextMenu(screen.getByTestId('canvas-main'), {
        clientY: 200,
        clientX: 200,
      });
      await user.click(screen.getByTestId('context-menu-paste'));
      await waitFor(() => {
        expect(
          controller.getCell(controller.getActiveRange().range)?.value,
        ).toEqual('test');
      });
    });
    test('cut', async () => {
      const user = userEvent.setup();
      type('test');
      fireEvent.contextMenu(screen.getByTestId('canvas-main'), {
        clientY: 200,
        clientX: 200,
      });
      await user.click(screen.getByTestId('context-menu-cut'));
      fireEvent.keyDown(document.body, { key: 'ArrowDown' });

      fireEvent.contextMenu(screen.getByTestId('canvas-main'), {
        clientY: 200,
        clientX: 200,
      });
      await user.click(screen.getByTestId('context-menu-paste'));

      await waitFor(() => {
        expect(
          controller.getCell(controller.getActiveRange().range)?.value,
        ).toEqual('test');
      });

      fireEvent.keyDown(document.body, { key: 'ArrowUp' });
      await waitFor(() => {
        expect(
          controller.getCell(controller.getActiveRange().range),
        ).toBeUndefined();
      });
    });

    test('change column width', () => {
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
        controller.getCol(controller.getActiveRange().range.col).len,
      ).toEqual(200);
    });
    test('hide col', () => {
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
        controller.getCol(controller.getActiveRange().range.col).isHide,
      ).toEqual(true);
    });
    test('delete col', () => {
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
        controller.getRow(controller.getActiveRange().range.row).len,
      ).toEqual(200);
    });

    test('hide row', () => {
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
        controller.getRow(controller.getActiveRange().range.row).isHide,
      ).toEqual(true);
    });

    test('delete row', () => {
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
    test('delete all', async () => {
      type('test');
      fireEvent.click(screen.getByTestId('toolbar-bold'));
      expect(screen.getByTestId('formula-editor-trigger')).toHaveStyle({
        fontWeight: 'bold',
      });
      expect(screen.getByTestId('formula-editor-trigger')).toHaveTextContent(
        'test',
      );

      fireEvent.pointerDown(screen.getByTestId('canvas-main'), {
        timeStamp: 100,
        clientX: 11,
        clientY: 150,
        buttons: 1,
      });
      fireEvent.contextMenu(screen.getByTestId('canvas-main'), {
        clientX: 11,
        clientY: 150,
      });

      fireEvent.click(screen.getByTestId('context-menu-delete'));

      expect(
        await screen.findByTestId('formula-editor-trigger'),
      ).not.toHaveStyle({
        fontWeight: 'bold',
      });
      expect(
        await screen.findByTestId('formula-editor-trigger'),
      ).toHaveTextContent('');
    });

    test('change row height cancel', () => {
      const oldHeight = controller.getRow(
        controller.getActiveRange().range.row,
      ).len;
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

      fireEvent.click(
        screen.getByTestId('context-menu-width-height-dialog-cancel'),
      );
      expect(
        controller.getRow(controller.getActiveRange().range.row).len,
      ).toEqual(oldHeight);
    });
  });
});
