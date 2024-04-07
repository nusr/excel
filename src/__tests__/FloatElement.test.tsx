import { App } from '@/containers';
import * as React from 'react';
import {
  cleanup,
  render,
  screen,
  fireEvent,
  act,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import { type, extractDataFromTransform } from './util';
import { initControllerForTest } from '@/controller';

describe('FloatElement.test.ts', () => {
  afterEach(cleanup);
  describe('float element', () => {
    test('throw error', () => {
      act(() => {
        render(<App controller={initControllerForTest()} />);
      });

      fireEvent.click(screen.getByTestId('toolbar-chart'));
      expect(screen.getByTestId('assert_toast')).toHaveTextContent(
        'The selected cells must contain the data',
      );
    });
    test('add chart', async () => {
      act(() => {
        render(<App controller={initControllerForTest()} />);
      });
      type('1');
      fireEvent.click(screen.getByTestId('toolbar-chart'));
      expect(screen.getAllByTestId('float-element')).toHaveLength(1);
    });
    test('active chart', async () => {
      act(() => {
        render(<App controller={initControllerForTest()} />);
      });
      type('1');
      fireEvent.click(screen.getByTestId('toolbar-chart'));
      expect(screen.getByTestId('float-element')).not.toHaveClass('active');
      fireEvent.pointerDown(screen.getByTestId('float-element'), {
        buttons: 1,
      });
      expect(screen.getByTestId('float-element')).toHaveClass('active');
    });
  });
  describe('context menu', () => {
    test('show', async () => {
      act(() => {
        render(<App controller={initControllerForTest()} />);
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
        render(<App controller={initControllerForTest()} />);
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
      const controller = initControllerForTest();
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
        render(<App controller={initControllerForTest()} />);
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
        render(<App controller={initControllerForTest()} />);
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
      const controller = initControllerForTest();
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

    test('select data', async () => {
      const controller = initControllerForTest();
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
        render(<App controller={initControllerForTest()} />);
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
    test('reset size', async () => {
      act(() => {
        render(<App controller={initControllerForTest()} />);
      });
      type('1');
      fireEvent.click(screen.getByTestId('toolbar-chart'));
      fireEvent.pointerDown(screen.getByTestId('float-element'), {
        buttons: 1,
        clientX: 0,
        clientY: 0,
      });
      const oldHeight = window.getComputedStyle(
        screen.getByTestId('float-element'),
      ).height;
      const dom = screen.getByTestId('float-element-resize-top');
      dom.setAttribute('data-position', 'top');
      fireEvent.pointerDown(dom, {
        clientX: 0,
        clientY: 0,
      });
      fireEvent.pointerMove(document, {
        buttons: 1,
        clientX: 0,
        clientY: 20,
      });
      fireEvent.pointerUp(document, {
        buttons: 1,
      });
      expect(
        parseInt(
          window.getComputedStyle(screen.getByTestId('float-element')).height,
          10,
        ),
      ).toEqual(parseInt(oldHeight, 10) - 20);

      fireEvent.contextMenu(screen.getByTestId('float-element'), {
        clientY: 20,
        clientX: 20,
      });
      fireEvent.click(screen.getByTestId('float-element-context-reset-size'));
      expect(
        window.getComputedStyle(screen.getByTestId('float-element')).height,
      ).toEqual(oldHeight);
    });
  });
  describe('chart type', () => {
    for (const item of [
      'line',
      'bar',
      'pie',
      'scatter',
      'radar',
      'polarArea',
    ]) {
      test(`change chart type to: ${item}`, async () => {
        const controller = initControllerForTest();
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
        fireEvent.change(
          screen.getByTestId('dialog-change-chart-type-select'),
          {
            target: { value: item },
          },
        );

        fireEvent.click(screen.getByTestId('dialog-change-chart-type-confirm'));
        expect(controller.getDrawingList()[0].chartType!).toEqual(item);
      });
    }
  });
  describe('resize float element', () => {
    for (const item of ['top', 'top-right', 'top-left']) {
      test(item, async () => {
        act(() => {
          render(<App controller={initControllerForTest()} />);
        });
        type('1');
        fireEvent.click(screen.getByTestId('toolbar-chart'));
        fireEvent.pointerDown(screen.getByTestId('float-element'), {
          buttons: 1,
          clientX: 0,
          clientY: 0,
        });
        const oldStyle = window.getComputedStyle(
          screen.getByTestId('float-element'),
        );
        const oldHeight = oldStyle.height;
        const oldTop = extractDataFromTransform(
          oldStyle.transform,
          'translateY',
        );
        const dom = screen.getByTestId('float-element-resize-top');
        dom.setAttribute('data-position', item);
        fireEvent.pointerDown(dom, {
          clientX: 0,
          clientY: 0,
        });
        fireEvent.pointerMove(document, {
          buttons: 1,
          clientX: 0,
          clientY: 20,
        });
        fireEvent.pointerUp(document, {
          buttons: 1,
        });
        const newStyle = window.getComputedStyle(
          screen.getByTestId('float-element'),
        );
        const newTop = extractDataFromTransform(
          newStyle.transform,
          'translateY',
        );
        expect(parseInt(newStyle.height, 10)).toEqual(
          parseInt(oldHeight, 10) - 20,
        );
        expect(newTop).toEqual(oldTop + 20);
      });
    }
    for (const item of ['bottom', 'bottom-right', 'bottom-left']) {
      test(item, async () => {
        act(() => {
          render(<App controller={initControllerForTest()} />);
        });
        type('1');
        fireEvent.click(screen.getByTestId('toolbar-chart'));
        fireEvent.pointerDown(screen.getByTestId('float-element'), {
          buttons: 1,
          clientX: 0,
          clientY: 0,
        });
        const oldHeight = window.getComputedStyle(
          screen.getByTestId('float-element'),
        ).height;
        const dom = screen.getByTestId('float-element-resize-top');
        dom.setAttribute('data-position', item);
        fireEvent.pointerDown(dom, {
          clientX: 0,
          clientY: 0,
        });
        fireEvent.pointerMove(document, {
          buttons: 1,
          clientX: 0,
          clientY: 20,
        });
        fireEvent.pointerUp(document, {
          buttons: 1,
        });
        expect(
          parseInt(
            window.getComputedStyle(screen.getByTestId('float-element')).height,
            10,
          ),
        ).toEqual(parseInt(oldHeight, 10) + 20);
      });
    }
    for (const item of ['top-left', 'bottom-left', 'left']) {
      test(item, async () => {
        act(() => {
          render(<App controller={initControllerForTest()} />);
        });
        type('1');
        fireEvent.click(screen.getByTestId('toolbar-chart'));
        fireEvent.pointerDown(screen.getByTestId('float-element'), {
          buttons: 1,
          clientX: 0,
          clientY: 0,
        });
        const oldStyle = window.getComputedStyle(
          screen.getByTestId('float-element'),
        );
        const oldWidth = oldStyle.width;
        const oldLeft = extractDataFromTransform(
          oldStyle.transform,
          'translateX',
        );
        const dom = screen.getByTestId('float-element-resize-top');
        dom.setAttribute('data-position', item);
        fireEvent.pointerDown(dom, {
          clientX: 0,
          clientY: 0,
        });
        fireEvent.pointerMove(document, {
          buttons: 1,
          clientX: 20,
          clientY: 0,
        });
        fireEvent.pointerUp(document, {
          buttons: 1,
        });
        const newStyle = window.getComputedStyle(
          screen.getByTestId('float-element'),
        );
        const newLeft = extractDataFromTransform(
          newStyle.transform,
          'translateX',
        );
        expect(parseInt(newStyle.width, 10)).toEqual(
          parseInt(oldWidth, 10) - 20,
        );
        expect(newLeft).toEqual(oldLeft + 20);
      });
    }
    for (const item of ['top-right', 'bottom-right', 'right']) {
      test(item, async () => {
        act(() => {
          render(<App controller={initControllerForTest()} />);
        });
        type('1');
        fireEvent.click(screen.getByTestId('toolbar-chart'));
        fireEvent.pointerDown(screen.getByTestId('float-element'), {
          buttons: 1,
          clientX: 0,
          clientY: 0,
        });
        const oldWidth = window.getComputedStyle(
          screen.getByTestId('float-element'),
        ).width;
        const dom = screen.getByTestId('float-element-resize-top');
        dom.setAttribute('data-position', item);
        fireEvent.pointerDown(dom, {
          clientX: 0,
          clientY: 0,
        });
        fireEvent.pointerMove(document, {
          buttons: 1,
          clientX: 20,
          clientY: 0,
        });
        fireEvent.pointerUp(document, {
          buttons: 1,
        });
        expect(
          parseInt(
            window.getComputedStyle(screen.getByTestId('float-element')).width,
            10,
          ),
        ).toEqual(parseInt(oldWidth, 10) + 20);
      });
    }
  });
  describe('move float element', () => {
    test('move right', async () => {
      act(() => {
        render(<App controller={initControllerForTest()} />);
      });
      type('1');
      fireEvent.click(screen.getByTestId('toolbar-chart'));
      fireEvent.pointerDown(screen.getByTestId('float-element'), {
        buttons: 1,
        clientX: 0,
        clientY: 0,
      });
      const oldStyle = window.getComputedStyle(
        screen.getByTestId('float-element'),
      );
      const oldLeft = extractDataFromTransform(
        oldStyle.transform,
        'translateX',
      );

      fireEvent.pointerMove(document, {
        buttons: 1,
        clientX: 20,
        clientY: 0,
      });
      fireEvent.pointerUp(document, {
        buttons: 1,
      });
      const newStyle = window.getComputedStyle(
        screen.getByTestId('float-element'),
      );
      const newLeft = extractDataFromTransform(
        newStyle.transform,
        'translateX',
      );
      expect(newLeft).toEqual(oldLeft + 20);
    });
    test('move down', async () => {
      act(() => {
        render(<App controller={initControllerForTest()} />);
      });
      type('1');
      fireEvent.click(screen.getByTestId('toolbar-chart'));
      fireEvent.pointerDown(screen.getByTestId('float-element'), {
        buttons: 1,
        clientX: 0,
        clientY: 0,
      });
      const oldStyle = window.getComputedStyle(
        screen.getByTestId('float-element'),
      );
      const oldTop = extractDataFromTransform(oldStyle.transform, 'translateY');

      fireEvent.pointerMove(document, {
        buttons: 1,
        clientX: 0,
        clientY: 20,
      });
      fireEvent.pointerUp(document, {
        buttons: 1,
      });
      const newStyle = window.getComputedStyle(
        screen.getByTestId('float-element'),
      );
      const newTop = extractDataFromTransform(newStyle.transform, 'translateY');
      expect(newTop).toEqual(oldTop + 20);
    });
  });
});
