import { screen, fireEvent } from '@testing-library/react';
import { type, renderComponent } from './util';
import { IController } from '../types';
import './global.mock';

describe('Toolbar.test.ts', () => {
  let controller: IController;
  beforeEach(async () => {
    const r = renderComponent();
    controller = r.controller;
  });
  describe('toolbar', () => {
    test('normal', () => {
      expect(
        screen.getByTestId('toolbar')!.childNodes.length,
      ).toBeGreaterThanOrEqual(3);
    });
  });
  describe('fontSize', () => {
    test('normal', async () => {
      fireEvent.change(screen.getByTestId('toolbar-font-size'), {
        target: { value: '72' },
      });
      expect(await screen.findByTestId('formula-editor-trigger')).toHaveStyle({
        fontSize: 72,
      });
    });
  });
  describe('fontFamily', () => {
    test('query all', async () => {
      localStorage.setItem(
        'LOCAL_FONT_KEY',
        JSON.stringify(['simsun', 'QUERY_ALL_LOCAL_FONT']),
      );
      Object.defineProperty(window, 'queryLocalFonts', {
        writable: true,
        value: async () => {
          return [
            {
              fullName: 'serif',
              family: 'serif',
              postscriptName: 'serif',
              style: '',
            },
            {
              fullName: 'Times New Roman',
              family: 'Times New Roman',
              postscriptName: 'Times New Roman',
              style: '',
            },
          ];
        },
      });

      fireEvent.change(screen.getByTestId('toolbar-font-family'), {
        target: { value: 'QUERY_ALL_LOCAL_FONT' },
      });

      expect(
        await screen.findByTestId('toolbar-font-family'),
      ).not.toHaveTextContent('Get all the fonts installed locally');
    });
    test('query all empty', async () => {
      localStorage.setItem(
        'LOCAL_FONT_KEY',
        JSON.stringify(['simsun', 'QUERY_ALL_LOCAL_FONT']),
      );
      Object.defineProperty(window, 'queryLocalFonts', {
        writable: true,
        value: async () => {
          return [];
        },
      });

      fireEvent.change(screen.getByTestId('toolbar-font-family'), {
        target: { value: 'QUERY_ALL_LOCAL_FONT' },
      });

      expect(
        await screen.findByTestId('toolbar-font-family'),
      ).not.toHaveTextContent('Get all the fonts installed locally');
    });
  });
  describe('undo', () => {
    test('normal', () => {
      expect(screen.getByTestId('toolbar-undo')).toBeDisabled();
    });
    test('able', async () => {
      await type('test');
      expect(screen.getByTestId('toolbar-undo')).not.toBeDisabled();

      fireEvent.click(screen.getByTestId('toolbar-undo'));
      expect(screen.getByTestId('toolbar-redo')).not.toBeDisabled();
    });
  });

  describe('redo', () => {
    test('normal', () => {
      expect(screen.getByTestId('toolbar-redo')).toBeDisabled();
    });
    test('able', async () => {
      expect(screen.getByTestId('toolbar-redo')).toBeDisabled();
      await type('test');
      fireEvent.click(screen.getByTestId('toolbar-undo'));
      expect(screen.getByTestId('toolbar-redo')).not.toBeDisabled();
      fireEvent.click(screen.getByTestId('toolbar-redo'));
      expect(screen.getByTestId('toolbar-redo')).toBeDisabled();

      expect(screen.getByTestId('toolbar-undo')).not.toBeDisabled();
    });
  });
  describe('copy', () => {
    test('toolbar', async () => {
      type('=SUM(1,2)');
      fireEvent.click(screen.getByTestId('toolbar-copy'));
      fireEvent.keyDown(document.body, { key: 'Enter' });
      fireEvent.click(screen.getByTestId('toolbar-paste'));

      expect(await screen.findByTestId('formula-bar-name-input')).toHaveValue(
        'A2',
      );
      expect(
        await screen.findByTestId('formula-editor-trigger'),
      ).toHaveTextContent('=SUM(1,2)');
    });
  });
  describe('cut', () => {
    test('toolbar', async () => {
      type('=SUM(1,2)');
      fireEvent.click(screen.getByTestId('toolbar-cut'));
      fireEvent.keyDown(document.body, { key: 'Enter' });
      fireEvent.click(screen.getByTestId('toolbar-paste'));

      expect(await screen.findByTestId('formula-bar-name-input')).toHaveValue(
        'A2',
      );
      expect(
        await screen.findByTestId('formula-editor-trigger'),
      ).toHaveTextContent('=SUM(1,2)');

      fireEvent.keyDown(document.body, { key: 'ArrowUp' });
      expect(screen.getByTestId('formula-bar-name-input')).toHaveValue('A1');
    });
  });
  describe('bold', () => {
    test('normal', () => {
      fireEvent.click(screen.getByTestId('toolbar-bold'));
      expect(screen.getByTestId('formula-editor-trigger')).toHaveStyle({
        fontWeight: 'bold',
      });
    });
  });
  describe('italic', () => {
    test('normal', () => {
      fireEvent.click(screen.getByTestId('toolbar-italic'));
      expect(screen.getByTestId('formula-editor-trigger')).toHaveStyle({
        fontStyle: 'italic',
      });
    });
  });
  describe('strike', () => {
    test('normal', () => {
      fireEvent.click(screen.getByTestId('toolbar-strike'));
      expect(screen.getByTestId('formula-editor-trigger')).toHaveStyle({
        textDecorationLine: 'line-through',
      });
    });
  });
  describe('underline', () => {
    test('single underline', () => {
      fireEvent.change(screen.getByTestId('toolbar-underline'), {
        target: { value: '1' },
      });
      expect(screen.getByTestId('formula-editor-trigger')).toHaveStyle({
        textDecorationLine: 'underline',
      });
    });
    test('double underline', () => {
      fireEvent.change(screen.getByTestId('toolbar-underline'), {
        target: { value: '2' },
      });
      expect(screen.getByTestId('formula-editor-trigger')).toHaveStyle({
        textDecorationLine: 'underline',
      });
    });
    test('strike', () => {
      fireEvent.change(screen.getByTestId('toolbar-underline'), {
        target: { value: '1' },
      });
      fireEvent.click(screen.getByTestId('toolbar-strike'));
      expect(screen.getByTestId('formula-editor-trigger')).toHaveStyle({
        textDecorationLine: 'underline line-through',
      });
    });
  });
  describe('wrap text', () => {
    test('normal', () => {
      type('This is a very long text that needs to be wrapped');
      fireEvent.click(screen.getByTestId('toolbar-wrap-text'));
      expect(
        controller.getCell(controller.getActiveRange().range)?.isWrapText,
      ).toEqual(true);
    });
    test('single underline', () => {
      type('This is a very long text that needs to be wrapped');
      fireEvent.click(screen.getByTestId('toolbar-wrap-text'));

      fireEvent.change(screen.getByTestId('toolbar-underline'), {
        target: { value: '1' },
      });
      expect(screen.getByTestId('formula-editor-trigger')).toHaveStyle({
        textDecorationLine: 'underline',
      });
    });
    test('double underline', () => {
      type('This is a very long text that needs to be wrapped');
      fireEvent.click(screen.getByTestId('toolbar-wrap-text'));

      fireEvent.change(screen.getByTestId('toolbar-underline'), {
        target: { value: '2' },
      });
      expect(screen.getByTestId('formula-editor-trigger')).toHaveStyle({
        textDecorationLine: 'underline',
      });
    });
  });
  describe('fill color', () => {
    test('normal', () => {
      fireEvent.click(screen.getByTestId('toolbar-fill-color'));

      const dom = screen.getByTestId('toolbar-fill-color-list');
      dom.setAttribute('data-value', '#B2B2B2');
      fireEvent.click(dom);
      expect(
        controller.getCell(controller.getActiveRange().range)?.fillColor,
      ).toEqual('#B2B2B2');
    });
    test('saturation', () => {
      fireEvent.click(screen.getByTestId('toolbar-fill-color'));

      fireEvent.pointerDown(
        screen.getByTestId('toolbar-fill-color-saturation'),
        { buttons: 1, clientX: 10, clientY: 10 },
      );
      fireEvent.pointerMove(document.body, {
        buttons: 1,
        clientX: 100,
        clientY: 100,
      });
      fireEvent.pointerUp(document.body);

      expect(
        controller.getCell(controller.getActiveRange().range)?.fillColor,
      ).toEqual('#804949');
    });
  });
  describe('font color', () => {
    test('normal', () => {
      fireEvent.click(screen.getByTestId('toolbar-font-color'));

      const dom = screen.getByTestId('toolbar-font-color-list');
      dom.setAttribute('data-value', '#B2B2B2');
      fireEvent.click(dom);
      expect(
        controller.getCell(controller.getActiveRange().range)?.fontColor,
      ).toEqual('#B2B2B2');
    });
    test('saturation', () => {
      fireEvent.click(screen.getByTestId('toolbar-font-color'));

      fireEvent.pointerDown(
        screen.getByTestId('toolbar-font-color-saturation'),
        { buttons: 1, clientX: 20, clientY: 20 },
      );
      fireEvent.pointerMove(document.body, {
        buttons: 1,
        clientX: 50,
        clientY: 50,
      });
      fireEvent.pointerUp(document.body);

      expect(
        controller.getCell(controller.getActiveRange().range)?.fontColor,
      ).toEqual('#bf9696');
    });

    test('hue', () => {
      fireEvent.click(screen.getByTestId('toolbar-font-color'));

      fireEvent.pointerDown(screen.getByTestId('toolbar-font-color-hue'), {
        buttons: 1,
        clientX: 20,
        clientY: 20,
      });
      fireEvent.pointerDown(
        screen.getByTestId('toolbar-font-color-saturation'),
        { buttons: 1, clientX: 20, clientY: 20 },
      );
      fireEvent.pointerMove(document.body, {
        buttons: 1,
        clientX: 50,
        clientY: 50,
      });
      fireEvent.pointerUp(document.body);

      expect(
        controller.getCell(controller.getActiveRange().range)?.fontColor,
      ).toEqual('#b4bf96');
    });
    test('reset', () => {
      fireEvent.click(screen.getByTestId('toolbar-font-color'));

      const dom = screen.getByTestId('toolbar-font-color-list');
      dom.setAttribute('data-value', '#B2B2B2');
      fireEvent.click(dom);
      expect(
        controller.getCell(controller.getActiveRange().range)?.fontColor,
      ).toEqual('#B2B2B2');
      fireEvent.click(screen.getByTestId('toolbar-font-color-reset'));
      expect(
        controller.getCell(controller.getActiveRange().range)?.fontColor,
      ).toEqual('');
    });
  });
});

test('queryLocalFonts', async () => {
  Object.defineProperty(window, 'queryLocalFonts', {
    writable: true,
    value: async () => {
      return [];
    },
  });
  localStorage.setItem('LOCAL_FONT_KEY', JSON.stringify(['serif']));

  renderComponent();

  fireEvent.change(await screen.findByTestId('toolbar-font-family'), {
    target: { value: 'serif' },
  });
  expect(await screen.findByTestId('formula-editor-trigger')).toHaveStyle({
    fontFamily: 'serif',
  });
});
