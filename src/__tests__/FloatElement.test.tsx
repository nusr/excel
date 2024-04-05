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

describe('FloatElement.test.ts', () => {
  afterEach(cleanup);
  beforeAll(() => {
    global.ResizeObserver = class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  });
  describe('float element', () => {
    test('throw error', () => {
      act(() => {
        render(<App controller={initController()} />);
      });

      fireEvent.click(screen.getByTestId('toolbar-chart'));
      expect(screen.getByTestId('assert_toast')).toHaveTextContent(
        'The selected cells must contain the data',
      );
    });
    test('add chart', async () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      type('1');
      fireEvent.click(screen.getByTestId('toolbar-chart'));
      expect(screen.getAllByTestId('float-element')).toHaveLength(1);
    });
  });
  describe('context menu', () => {
    test('show', async () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      type('1');
      fireEvent.click(screen.getByTestId('toolbar-chart'));
      fireEvent.contextMenu(screen.getByTestId('float-element'), {
        clientY: 20,
        clientX: 20,
      });

      expect(
        screen.getByTestId('float-element-context-menu')!.childNodes,
      ).toHaveLength(10);
    });
    test('copy', async () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      type('1');
      fireEvent.click(screen.getByTestId('toolbar-chart'));
      expect(screen.getAllByTestId('float-element')).toHaveLength(1);
      fireEvent.contextMenu(screen.getByTestId('float-element'), {
        clientY: 20,
        clientX: 20,
      });

      fireEvent.click(screen.getByTestId('float-element-context-menu-copy'));
      fireEvent.contextMenu(screen.getByTestId('float-element'), {
        clientY: 20,
        clientX: 20,
      });
      fireEvent.click(screen.getByTestId('float-element-context-menu-paste'));
      expect(screen.getAllByTestId('float-element')).toHaveLength(2);
    });
    test('cut', async () => {
      const controller = initController();
      act(() => {
        render(<App controller={controller} />);
      });
      type('1');
      fireEvent.click(screen.getByTestId('toolbar-chart'));
      const oldFromRow = controller.getDrawingList()[0].fromRow;
      expect(screen.getAllByTestId('float-element')).toHaveLength(1);
      fireEvent.contextMenu(screen.getByTestId('float-element'), {
        clientY: 20,
        clientX: 20,
      });
      fireEvent.click(screen.getByTestId('float-element-context-menu-cut'));

      fireEvent.keyDown(document.body, { key: 'ArrowDown' });
      fireEvent.contextMenu(screen.getByTestId('float-element'), {
        clientY: 20,
        clientX: 20,
      });
      fireEvent.click(screen.getByTestId('float-element-context-menu-paste'));
      expect(screen.getAllByTestId('float-element')).toHaveLength(1);
      expect(controller.getDrawingList()[0].fromRow).toEqual(oldFromRow + 1);
    });
    test('duplicate', async () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      type('1');
      fireEvent.click(screen.getByTestId('toolbar-chart'));
      fireEvent.contextMenu(screen.getByTestId('float-element'), {
        clientY: 20,
        clientX: 20,
      });
      fireEvent.click(
        screen.getByTestId('float-element-context-menu-duplicate'),
      );
      expect(screen.getAllByTestId('float-element')).toHaveLength(2);
    });
    test('delete', async () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      type('1');
      fireEvent.click(screen.getByTestId('toolbar-chart'));
      fireEvent.contextMenu(screen.getByTestId('float-element'), {
        clientY: 20,
        clientX: 20,
      });
      fireEvent.click(
        screen.getByTestId('float-element-context-menu-duplicate'),
      );
      expect(screen.getAllByTestId('float-element')).toHaveLength(2);

      fireEvent.contextMenu(screen.getAllByTestId('float-element')[1], {
        clientY: 20,
        clientX: 20,
      });
      fireEvent.click(screen.getByTestId('float-element-context-menu-delete'));

      expect(screen.getAllByTestId('float-element')).toHaveLength(1);
    });
    test('change chart title', async () => {
      const controller = initController();
      act(() => {
        render(<App controller={controller} />);
      });
      type('1');
      fireEvent.click(screen.getByTestId('toolbar-chart'));
      fireEvent.contextMenu(screen.getByTestId('float-element'), {
        clientY: 20,
        clientX: 20,
      });
      fireEvent.click(
        screen.getByTestId('float-element-context-menu-change-chart-title'),
      );
      fireEvent.change(screen.getByTestId('dialog-change-chart-title-input'), {
        target: { value: 'new_chart_title' },
      });

      fireEvent.click(screen.getByTestId('dialog-change-chart-title-confirm'));
      expect(controller.getDrawingList()[0].title).toEqual('new_chart_title');
    });
    test('change chart title', async () => {
      const controller = initController();
      act(() => {
        render(<App controller={controller} />);
      });
      type('1');
      fireEvent.click(screen.getByTestId('toolbar-chart'));
      fireEvent.contextMenu(screen.getByTestId('float-element'), {
        clientY: 20,
        clientX: 20,
      });
      fireEvent.click(
        screen.getByTestId('float-element-context-menu-change-chart-type'),
      );
      fireEvent.change(screen.getByTestId('dialog-change-chart-type-select'), {
        target: { value: 'line' },
      });

      fireEvent.click(screen.getByTestId('dialog-change-chart-type-confirm'));
      expect(controller.getDrawingList()[0].chartType!).toEqual('line');
    });
    test('select data', async () => {
      const controller = initController();
      act(() => {
        render(<App controller={controller} />);
      });
      type('1');
      fireEvent.click(screen.getByTestId('toolbar-chart'));
      fireEvent.contextMenu(screen.getByTestId('float-element'), {
        clientY: 20,
        clientX: 20,
      });
      fireEvent.click(
        screen.getByTestId('float-element-context-menu-select-data'),
      );
      fireEvent.change(screen.getByTestId('dialog-select-data-input'), {
        target: { value: 'C3' },
      });

      fireEvent.click(screen.getByTestId('dialog-select-data-confirm'));
      expect(controller.getDrawingList()[0].chartRange!).toEqual({
        row: 2,
        col: 2,
        rowCount: 1,
        colCount: 1,
        sheetId: controller.getCurrentSheetId(),
      });
    });
    test('reset size disabled', async () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      type('1');
      fireEvent.click(screen.getByTestId('toolbar-chart'));
      fireEvent.contextMenu(screen.getByTestId('float-element'), {
        clientY: 20,
        clientX: 20,
      });
      expect(
        screen.getByTestId('float-element-context-reset-size'),
      ).toBeDisabled();
    });
    test.skip('reset size', async () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      type('1');
      fireEvent.click(screen.getByTestId('toolbar-chart'));
      fireEvent.pointerDown(screen.getByTestId('float-element'), {
        buttons: 1,
        clientX: 0,
        clientY: 0,
        stopPropagation: () => {},
        preventDefault: () => {},
      });
      const height = window.getComputedStyle(
        screen.getByTestId('float-element'),
      ).height;
      const dom = screen.getByTestId('float-element-resize-top');
      dom.setAttribute('data-position', 'top');
      fireEvent.pointerDown(dom, {
        clientX: 0,
        clientY: 0,
        stopPropagation: () => {},
        preventDefault: () => {},
      });
      fireEvent.pointerMove(document, {
        buttons: 1,
        clientX: 0,
        clientY: 20,
        stopPropagation: () => {},
        preventDefault: () => {},
      });
      fireEvent.pointerUp(document, {
        stopPropagation: () => {},
        preventDefault: () => {},
        buttons: 1,
      });
      const newHeight = window.getComputedStyle(
        screen.getByTestId('float-element'),
      ).height;
      expect(parseInt(newHeight, 10)).toEqual(parseInt(height, 10) + 20);
    });
  });
});
