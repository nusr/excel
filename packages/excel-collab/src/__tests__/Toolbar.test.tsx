import { screen, fireEvent } from '@testing-library/react';
import { chooseSelectOption, type, renderComponent } from './util';
import { IController } from '../types';
import './global.mock';
import userEvent from '@testing-library/user-event';
import { useCoreStore } from '../containers/store';
import { initFontFamilyList } from '../containers/canvas/isSupportFontFamily';

jest.mock('../containers/canvas/isSupportFontFamily', () => ({
  ...jest.requireActual('../containers/canvas/isSupportFontFamily'),
  isSupportFontFamily: () => true,
  initFontFamilyList: () =>
    jest
      .requireActual<typeof import('../containers/canvas/isSupportFontFamily')>(
        '../containers/canvas/isSupportFontFamily',
      )
      .initFontFamilyList(() => true),
}));

describe('Toolbar.test.ts', () => {
  let controller: IController;
  beforeEach(async () => {
    const r = await renderComponent();
    controller = r.controller;
  });
  describe('fontSize', () => {
    test('normal', async () => {
      await chooseSelectOption('toolbar-font-size', '72');
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
      useCoreStore.getState().setFontFamilies(initFontFamilyList());

      await chooseSelectOption(
        'toolbar-font-family',
        'Get all the fonts installed locally',
      );

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
      useCoreStore.getState().setFontFamilies(initFontFamilyList());

      await chooseSelectOption(
        'toolbar-font-family',
        'Get all the fonts installed locally',
      );

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
      const user = userEvent.setup();
      type('=SUM(1,2)');
      await user.click(screen.getByTestId('toolbar-copy'));
      fireEvent.keyDown(document.body, { key: 'Enter' });
      await user.click(screen.getByTestId('toolbar-paste'));

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
      const user = userEvent.setup();
      type('=SUM(1,2)');
      await user.click(screen.getByTestId('toolbar-cut'));
      fireEvent.keyDown(document.body, { key: 'Enter' });
      await user.click(screen.getByTestId('toolbar-paste'));

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
    test('single underline', async () => {
      await chooseSelectOption('toolbar-underline', /single/i);
      expect(screen.getByTestId('formula-editor-trigger')).toHaveStyle({
        textDecorationLine: 'underline',
      });
    });
    test('double underline', async () => {
      await chooseSelectOption('toolbar-underline', /double/i);
      expect(screen.getByTestId('formula-editor-trigger')).toHaveStyle({
        textDecorationLine: 'underline',
      });
    });
    test('strike', async () => {
      await chooseSelectOption('toolbar-underline', /single/i);
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
    test('single underline', async () => {
      type('This is a very long text that needs to be wrapped');
      fireEvent.click(screen.getByTestId('toolbar-wrap-text'));

      await chooseSelectOption('toolbar-underline', /single/i);
      expect(screen.getByTestId('formula-editor-trigger')).toHaveStyle({
        textDecorationLine: 'underline',
      });
    });
    test('double underline', async () => {
      type('This is a very long text that needs to be wrapped');
      fireEvent.click(screen.getByTestId('toolbar-wrap-text'));

      await chooseSelectOption('toolbar-underline', /double/i);
      expect(screen.getByTestId('formula-editor-trigger')).toHaveStyle({
        textDecorationLine: 'underline',
      });
    });
  });
  describe('fill color', () => {
    test('normal', async () => {
      const user = userEvent.setup();
      await user.click(screen.getByTestId('toolbar-fill-color'));
      await user.click(
        await screen.findByTestId('toolbar-fill-color-swatch-B2B2B2'),
      );
      expect(
        controller.getCell(controller.getActiveRange().range)?.fillColor,
      ).toEqual('#B2B2B2');
    });
    test('saturation', async () => {
      const user = userEvent.setup();
      await user.click(screen.getByTestId('toolbar-fill-color'));
      await chooseSelectOption('toolbar-fill-color-space', 'HSB');
      const saturation = screen.getByLabelText('saturation');
      await user.clear(saturation);
      await user.type(saturation, '50');
      const brightness = screen.getByLabelText('brightness');
      await user.clear(brightness);
      await user.type(brightness, '80');

      expect(
        controller.getCell(controller.getActiveRange().range)?.fillColor,
      ).toBeTruthy();
    });
  });
  describe('font color', () => {
    test('normal', async () => {
      const user = userEvent.setup();
      await user.click(screen.getByTestId('toolbar-font-color'));
      await user.click(
        await screen.findByTestId('toolbar-font-color-swatch-B2B2B2'),
      );
      expect(
        controller.getCell(controller.getActiveRange().range)?.fontColor,
      ).toEqual('#B2B2B2');
    });
    test('saturation', async () => {
      const user = userEvent.setup();
      await user.click(screen.getByTestId('toolbar-font-color'));
      await chooseSelectOption('toolbar-font-color-space', 'HSB');
      const saturation = screen.getByLabelText('saturation');
      await user.clear(saturation);
      await user.type(saturation, '50');
      const brightness = screen.getByLabelText('brightness');
      await user.clear(brightness);
      await user.type(brightness, '80');

      expect(
        controller.getCell(controller.getActiveRange().range)?.fontColor,
      ).toBeTruthy();
    });

    test('hue', async () => {
      const user = userEvent.setup();
      await user.click(screen.getByTestId('toolbar-font-color'));
      await chooseSelectOption('toolbar-font-color-space', 'HSB');
      const hue = screen.getByLabelText('hue');
      await user.clear(hue);
      await user.type(hue, '120');
      const saturation = screen.getByLabelText('saturation');
      await user.clear(saturation);
      await user.type(saturation, '80');
      const brightness = screen.getByLabelText('brightness');
      await user.clear(brightness);
      await user.type(brightness, '80');

      expect(
        controller.getCell(controller.getActiveRange().range)?.fontColor,
      ).toBeTruthy();
    });
    test('reset', async () => {
      const user = userEvent.setup();
      await user.click(screen.getByTestId('toolbar-font-color'));
      await user.click(
        await screen.findByTestId('toolbar-font-color-swatch-B2B2B2'),
      );
      expect(
        controller.getCell(controller.getActiveRange().range)?.fontColor,
      ).toEqual('#B2B2B2');
      await user.click(screen.getByTestId('toolbar-font-color-reset'));
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
  useCoreStore.getState().setFontFamilies(initFontFamilyList());

  await renderComponent();

  await chooseSelectOption('toolbar-font-family', 'serif');
  expect(await screen.findByTestId('formula-editor-trigger')).toHaveStyle({
    fontFamily: 'serif',
  });
});
