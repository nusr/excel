import { screen, fireEvent } from '@testing-library/react';
import { type, extractDataFromTransform, renderComponent } from './util';
import './global.mock';
import { IController } from '../types';

describe('FloatElement.test.ts', () => {
  let controller: IController;
  beforeEach(async () => {
    const r = await renderComponent();
    controller = r.controller;
  });
  describe('float element', () => {
    test('add chart', async () => {
      type('1');

      fireEvent.click(screen.getByTestId('toolbar-chart'));

      expect(await screen.findAllByTestId('float-element')).toHaveLength(1);
    });
    test('active chart', async () => {
      type('1');
      fireEvent.click(screen.getByTestId('toolbar-chart'));
      expect(await screen.findByTestId('float-element')).not.toHaveClass(
        'active',
      );
      fireEvent.pointerDown(await screen.findByTestId('float-element'), {
        buttons: 1,
      });
      expect(await screen.findByTestId('float-element')).toHaveClass('active');
    });
    test('toggle mask', async () => {
      type('1');
      fireEvent.click(screen.getByTestId('toolbar-chart'));
      expect(screen.getByTestId('float-element-mask')).not.toHaveClass(
        'active',
      );
      fireEvent.pointerDown(await screen.findByTestId('float-element'), {
        buttons: 1,
        clientX: 0,
        clientY: 0,
      });
      expect(screen.getByTestId('float-element-mask')).toHaveClass('active');
      fireEvent.pointerDown(screen.getByTestId('float-element-mask'));
      expect(screen.getByTestId('float-element-mask')).not.toHaveClass(
        'active',
      );
    });
    test('not active float element', async () => {
      type('1');
      fireEvent.click(screen.getByTestId('toolbar-chart'));
      fireEvent.pointerDown(await screen.findByTestId('float-element'), {
        buttons: 0,
      });
      expect(screen.getByTestId('float-element-mask')).not.toHaveClass(
        'active',
      );
    });
  });
  describe('context menu', () => {
    test('show', async () => {
      type('1');
      fireEvent.click(screen.getByTestId('toolbar-chart'));
      fireEvent.contextMenu(await screen.findByTestId('float-element'), {
        clientY: 20,
        clientX: 20,
      });

      expect(
        screen.getByTestId('float-element-context-menu')?.childNodes,
      ).toHaveLength(10);
    });
    test('copy', async () => {
      type('1');
      fireEvent.click(screen.getByTestId('toolbar-chart'));
      expect(await screen.findAllByTestId('float-element')).toHaveLength(1);
      fireEvent.contextMenu(await screen.findByTestId('float-element'), {
        clientY: 20,
        clientX: 20,
      });

      fireEvent.click(screen.getByTestId('float-element-context-menu-copy'));
      fireEvent.contextMenu(await screen.findByTestId('float-element'), {
        clientY: 20,
        clientX: 20,
      });
      fireEvent.click(screen.getByTestId('float-element-context-menu-paste'));
      expect(await screen.findAllByTestId('float-element')).toHaveLength(2);
    });
    test('cut', async () => {
      type('1');
      fireEvent.click(screen.getByTestId('toolbar-chart'));
      fireEvent.contextMenu(await screen.findByTestId('float-element'), {
        clientY: 20,
        clientX: 20,
      });
      fireEvent.click(screen.getByTestId('float-element-context-menu-cut'));

      fireEvent.keyDown(document.body, { key: 'ArrowDown' });
      fireEvent.contextMenu(await screen.findByTestId('float-element'), {
        clientY: 20,
        clientX: 20,
      });
      fireEvent.click(screen.getByTestId('float-element-context-menu-paste'));
      expect(await screen.findAllByTestId('float-element')).toHaveLength(1);
    });
    test('duplicate', async () => {
      type('1');
      fireEvent.click(screen.getByTestId('toolbar-chart'));
      fireEvent.contextMenu(await screen.findByTestId('float-element'), {
        clientY: 20,
        clientX: 20,
      });
      fireEvent.click(
        screen.getByTestId('float-element-context-menu-duplicate'),
      );
      expect(await screen.findAllByTestId('float-element')).toHaveLength(2);
    });
    test('delete', async () => {
      type('1');
      fireEvent.click(screen.getByTestId('toolbar-chart'));
      fireEvent.contextMenu(await screen.findByTestId('float-element'), {
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

    test('reset size disabled', async () => {
      type('1');
      fireEvent.click(screen.getByTestId('toolbar-chart'));
      fireEvent.contextMenu(await screen.findByTestId('float-element'), {
        clientY: 20,
        clientX: 20,
      });
      expect(
        screen.getByTestId('float-element-context-reset-size'),
      ).toBeDisabled();
    });
    test('reset size', async () => {
      type('1');
      fireEvent.click(screen.getByTestId('toolbar-chart'));
      fireEvent.pointerDown(await screen.findByTestId('float-element'), {
        buttons: 1,
        clientX: 0,
        clientY: 0,
      });
      const oldHeight = window.getComputedStyle(
        await screen.findByTestId('float-element'),
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
          window.getComputedStyle(await screen.findByTestId('float-element'))
            .height,
          10,
        ),
      ).toEqual(parseInt(oldHeight, 10) - 20);

      fireEvent.contextMenu(await screen.findByTestId('float-element'), {
        clientY: 20,
        clientX: 20,
      });
      fireEvent.click(screen.getByTestId('float-element-context-reset-size'));
      expect(
        window.getComputedStyle(await screen.findByTestId('float-element'))
          .height,
      ).toEqual(oldHeight);
    });
  });

  describe('select data', () => {
    test('ok', async () => {
      type('1');
      fireEvent.click(screen.getByTestId('toolbar-chart'));
      fireEvent.contextMenu(await screen.findByTestId('float-element'), {
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
    test('empty', async () => {
      type('1');
      fireEvent.click(screen.getByTestId('toolbar-chart'));
      fireEvent.contextMenu(await screen.findByTestId('float-element'), {
        clientY: 20,
        clientX: 20,
      });
      fireEvent.click(
        screen.getByTestId('float-element-context-menu-select-data'),
      );
      fireEvent.change(screen.getByTestId('dialog-select-data-input'), {
        target: { value: '' },
      });

      fireEvent.click(screen.getByTestId('dialog-select-data-confirm'));
      expect(
        screen.getByTestId('select-data-empty-toast'),
      ).not.toHaveTextContent('');
    });

    test('invalid', async () => {
      type('1');
      fireEvent.click(screen.getByTestId('toolbar-chart'));
      fireEvent.contextMenu(await screen.findByTestId('float-element'), {
        clientY: 20,
        clientX: 20,
      });
      fireEvent.click(
        screen.getByTestId('float-element-context-menu-select-data'),
      );
      fireEvent.change(screen.getByTestId('dialog-select-data-input'), {
        target: { value: '_.fe3435' },
      });

      fireEvent.click(screen.getByTestId('dialog-select-data-confirm'));
      expect(
        screen.getByTestId('select-data-invalid-toast'),
      ).not.toHaveTextContent('');
    });
    test('cancel dialog', async () => {
      type('1');
      fireEvent.click(screen.getByTestId('toolbar-chart'));
      const oldChartRange = controller.getDrawingList()[0].chartRange!;
      fireEvent.contextMenu(await screen.findByTestId('float-element'), {
        clientY: 20,
        clientX: 20,
      });
      fireEvent.click(
        screen.getByTestId('float-element-context-menu-select-data'),
      );
      fireEvent.change(screen.getByTestId('dialog-select-data-input'), {
        target: { value: '_.fe3435' },
      });

      fireEvent.click(screen.getByTestId('dialog-select-data-cancel'));
      expect(controller.getDrawingList()[0].chartRange!).toEqual(oldChartRange);
    });
  });
  describe('chart title', () => {
    test('ok', async () => {
      type('1');
      fireEvent.click(screen.getByTestId('toolbar-chart'));
      fireEvent.contextMenu(await screen.findByTestId('float-element'), {
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
    test('empty value', async () => {
      type('1');
      fireEvent.click(screen.getByTestId('toolbar-chart'));
      fireEvent.contextMenu(await screen.findByTestId('float-element'), {
        clientY: 20,
        clientX: 20,
      });
      fireEvent.click(
        screen.getByTestId('float-element-context-menu-change-chart-title'),
      );
      fireEvent.change(screen.getByTestId('dialog-change-chart-title-input'), {
        target: { value: '' },
      });

      fireEvent.click(screen.getByTestId('dialog-change-chart-title-confirm'));
      expect(
        screen.getByTestId('change-chart-title-toast'),
      ).not.toHaveTextContent('');
    });
    test('cancel dialog', async () => {
      type('1');
      fireEvent.click(screen.getByTestId('toolbar-chart'));
      const oldData = controller.getDrawingList()[0].title;
      fireEvent.contextMenu(await screen.findByTestId('float-element'), {
        clientY: 20,
        clientX: 20,
      });
      fireEvent.click(
        screen.getByTestId('float-element-context-menu-change-chart-title'),
      );

      fireEvent.click(screen.getByTestId('dialog-change-chart-title-cancel'));
      expect(controller.getDrawingList()[0].title).toEqual(oldData);
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
        type('1');
        fireEvent.click(screen.getByTestId('toolbar-chart'));
        fireEvent.contextMenu(await screen.findByTestId('float-element'), {
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
    test('cancel dialog', async () => {
      type('1');
      fireEvent.click(screen.getByTestId('toolbar-chart'));
      const oldData = controller.getDrawingList()[0].chartType!;
      fireEvent.contextMenu(await screen.findByTestId('float-element'), {
        clientY: 20,
        clientX: 20,
      });
      fireEvent.click(
        screen.getByTestId('float-element-context-menu-change-chart-type'),
      );

      fireEvent.click(screen.getByTestId('dialog-change-chart-type-cancel'));
      expect(controller.getDrawingList()[0].chartType!).toEqual(oldData);
    });
  });
  describe('resize float element', () => {
    for (const item of ['top', 'top-right', 'top-left']) {
      test(item, async () => {
        type('1');
        fireEvent.click(screen.getByTestId('toolbar-chart'));
        fireEvent.pointerDown(await screen.findByTestId('float-element'), {
          buttons: 1,
          clientX: 0,
          clientY: 0,
        });
        const oldStyle = window.getComputedStyle(
          await screen.findByTestId('float-element'),
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
          buttons: 1,
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
          await screen.findByTestId('float-element'),
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
        type('1');
        fireEvent.click(screen.getByTestId('toolbar-chart'));
        fireEvent.pointerDown(await screen.findByTestId('float-element'), {
          buttons: 1,
          clientX: 0,
          clientY: 0,
        });
        const oldHeight = window.getComputedStyle(
          await screen.findByTestId('float-element'),
        ).height;
        const dom = screen.getByTestId('float-element-resize-top');
        dom.setAttribute('data-position', item);
        fireEvent.pointerDown(dom, {
          clientX: 0,
          clientY: 0,
          buttons: 1,
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
            window.getComputedStyle(await screen.findByTestId('float-element'))
              .height,
            10,
          ),
        ).toEqual(parseInt(oldHeight, 10) + 20);
      });
    }
    for (const item of ['top-left', 'bottom-left', 'left']) {
      test(item, async () => {
        type('1');
        fireEvent.click(screen.getByTestId('toolbar-chart'));
        fireEvent.pointerDown(await screen.findByTestId('float-element'), {
          buttons: 1,
          clientX: 0,
          clientY: 0,
        });
        const oldStyle = window.getComputedStyle(
          await screen.findByTestId('float-element'),
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
          await screen.findByTestId('float-element'),
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
        type('1');
        fireEvent.click(screen.getByTestId('toolbar-chart'));
        fireEvent.pointerDown(await screen.findByTestId('float-element'), {
          buttons: 1,
          clientX: 0,
          clientY: 0,
        });
        const oldWidth = window.getComputedStyle(
          await screen.findByTestId('float-element'),
        ).width;
        const dom = screen.getByTestId('float-element-resize-top');
        dom.setAttribute('data-position', item);
        fireEvent.pointerDown(dom, {
          clientX: 0,
          clientY: 0,
          buttons: 1,
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
            window.getComputedStyle(await screen.findByTestId('float-element'))
              .width,
            10,
          ),
        ).toEqual(parseInt(oldWidth, 10) + 20);
      });
    }
    test('no buttons', async () => {
      type('1');
      fireEvent.click(screen.getByTestId('toolbar-chart'));
      fireEvent.pointerDown(await screen.findByTestId('float-element'), {
        buttons: 1,
        clientX: 0,
        clientY: 0,
      });
      const oldWidth = window.getComputedStyle(
        await screen.findByTestId('float-element'),
      ).width;
      const dom = screen.getByTestId('float-element-resize-top');
      dom.setAttribute('data-position', 'top');
      fireEvent.pointerDown(dom, {
        clientX: 0,
        clientY: 0,
        buttons: 0,
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
          window.getComputedStyle(await screen.findByTestId('float-element'))
            .width,
          10,
        ),
      ).toEqual(parseInt(oldWidth, 10));
    });
    test('no data-position', async () => {
      type('1');
      fireEvent.click(screen.getByTestId('toolbar-chart'));
      fireEvent.pointerDown(await screen.findByTestId('float-element'), {
        buttons: 1,
        clientX: 0,
        clientY: 0,
      });
      const oldWidth = window.getComputedStyle(
        await screen.findByTestId('float-element'),
      ).width;
      const dom = screen.getByTestId('float-element-resize-top');
      fireEvent.pointerDown(dom, {
        clientX: 0,
        clientY: 0,
        buttons: 1,
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
          window.getComputedStyle(await screen.findByTestId('float-element'))
            .width,
          10,
        ),
      ).toEqual(parseInt(oldWidth, 10));
    });
  });
  describe('move float element', () => {
    test('move right', async () => {
      type('1');
      fireEvent.click(screen.getByTestId('toolbar-chart'));
      fireEvent.pointerDown(await screen.findByTestId('float-element'), {
        buttons: 1,
        clientX: 0,
        clientY: 0,
      });
      const oldStyle = window.getComputedStyle(
        await screen.findByTestId('float-element'),
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
        await screen.findByTestId('float-element'),
      );
      const newLeft = extractDataFromTransform(
        newStyle.transform,
        'translateX',
      );
      expect(newLeft).toEqual(oldLeft + 20);
    });
    test('move down', async () => {
      type('1');
      fireEvent.click(screen.getByTestId('toolbar-chart'));
      fireEvent.pointerDown(await screen.findByTestId('float-element'), {
        buttons: 1,
        clientX: 0,
        clientY: 0,
      });
      const oldStyle = window.getComputedStyle(
        await screen.findByTestId('float-element'),
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
        await screen.findByTestId('float-element'),
      );
      const newTop = extractDataFromTransform(newStyle.transform, 'translateY');
      expect(newTop).toEqual(oldTop + 20);
    });
  });
  describe('rotate floating picture', () => {
    test('ok', async () => {
      const file = new File(['test content'], 'test.png', {
        type: 'image/png',
      });
      fireEvent.change(screen.getByTestId('toolbar-floating-picture-input'), {
        target: { files: [file] },
      });

      expect(await screen.findAllByTestId('float-element')).toHaveLength(1);

      fireEvent.pointerDown(await screen.findByTestId('float-element'), {
        buttons: 1,
        clientX: 0,
        clientY: 0,
      });
      const oldStyle = window.getComputedStyle(
        await screen.findByTestId('float-element'),
      );
      const oldValue = extractDataFromTransform(oldStyle.transform, 'rotate');
      const dom = screen.getByTestId('float-element-resize-top');
      dom.setAttribute('data-position', 'rotate');
      fireEvent.pointerDown(dom, {
        clientX: 0,
        clientY: 0,
      });
      fireEvent.pointerMove(document, {
        buttons: 1,
        clientX: 20,
        clientY: 20,
      });
      fireEvent.pointerUp(document, {
        buttons: 1,
      });
      const newStyle = window.getComputedStyle(
        await screen.findByTestId('float-element'),
      );
      const newValue = extractDataFromTransform(newStyle.transform, 'rotate');
      expect(newValue).toEqual(oldValue + 45);
    });
  });
});
