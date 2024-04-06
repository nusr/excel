import { App } from '@/containers';
import { initController } from '@/controller';
import * as React from 'react';
import {
  cleanup,
  render,
  screen,
  act,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import { type } from './util';

describe('Toolbar.test.ts', () => {
  afterEach(cleanup);
  describe('toolbar', () => {
    test('normal', () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      expect(
        screen.getByTestId('toolbar')!.childNodes.length,
      ).toBeGreaterThanOrEqual(3);
    });
  });
  describe('fontSize', () => {
    test('normal', () => {
      const controller = initController();
      act(() => {
        render(<App controller={controller} />);
      });
      fireEvent.change(screen.getByTestId('toolbar-font-size'), {
        target: { value: '72' },
      });
      expect(controller.getCell(controller.getActiveCell())?.style).toEqual({
        fontSize: 72,
      });
    });
  });
  describe('fontFamily', () => {
    test('normal', () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      fireEvent.change(screen.getByTestId('toolbar-font-family'), {
        target: { value: 'serif' },
      });
      expect(screen.getByTestId('formula-editor-trigger')).toHaveStyle({
        fontFamily: 'serif',
      });
    });
    test('query all', async () => {
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
      act(() => {
        render(<App controller={initController()} />);
      });

      fireEvent.change(screen.getByTestId('toolbar-font-family'), {
        target: { value: 'QUERY_ALL_LOCAL_FONT' },
      });
      await waitFor(() => {
        expect(
          screen.getByTestId('toolbar-font-family').textContent,
        ).not.toContain('--> get all local installed fonts');
      });
    });
  });
  describe('undo', () => {
    test('normal', () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      expect(screen.getByTestId('toolbar-undo')).not.toBeDisabled();
    });
    test('able', () => {
      act(() => {
        render(<App controller={initController(true)} />);
      });
      expect(screen.getByTestId('toolbar-undo')).toBeDisabled();
      fireEvent.click(screen.getByTestId('toolbar-bold'));
      expect(screen.getByTestId('toolbar-undo')).not.toBeDisabled();

      fireEvent.click(screen.getByTestId('toolbar-undo'));
      expect(screen.getByTestId('toolbar-undo')).toBeDisabled();
      expect(screen.getByTestId('toolbar-redo')).not.toBeDisabled();
    });
  });

  describe('redo', () => {
    test('normal', () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      expect(screen.getByTestId('toolbar-redo')).toBeDisabled();
    });
    test('able', () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      expect(screen.getByTestId('toolbar-redo')).toBeDisabled();
      fireEvent.click(screen.getByTestId('toolbar-bold'));
      fireEvent.click(screen.getByTestId('toolbar-undo'));
      expect(screen.getByTestId('toolbar-redo')).not.toBeDisabled();
      fireEvent.click(screen.getByTestId('toolbar-redo'));
      expect(screen.getByTestId('toolbar-redo')).toBeDisabled();

      expect(screen.getByTestId('toolbar-undo')).not.toBeDisabled();
    });
  });
  describe('copy', () => {
    test('toolbar', async () => {
      const controller = initController();
      act(() => {
        render(<App controller={controller} />);
      });
      type('=SUM(1,2)');
      fireEvent.click(screen.getByTestId('toolbar-bold'));
      fireEvent.click(screen.getByTestId('toolbar-italic'));

      fireEvent.click(screen.getByTestId('toolbar-copy'));

      fireEvent.keyDown(document.body, { key: 'Enter' });
      fireEvent.click(screen.getByTestId('toolbar-paste'));

      await waitFor(() => {
        expect(controller.getCell(controller.getActiveCell())).toEqual({
          style: { isBold: true, isItalic: true },
          row: 1,
          col: 0,
          formula: '=SUM(1,2)',
          value: 3,
        });
      });
    });
  });
  describe('cut', () => {
    test('toolbar', async () => {
      const controller = initController();
      act(() => {
        render(<App controller={controller} />);
      });
      type('=SUM(1,2)');
      fireEvent.click(screen.getByTestId('toolbar-bold'));
      fireEvent.click(screen.getByTestId('toolbar-italic'));

      fireEvent.click(screen.getByTestId('toolbar-cut'));

      fireEvent.keyDown(document.body, { key: 'Enter' });
      fireEvent.click(screen.getByTestId('toolbar-paste'));

      await waitFor(() => {
        expect(controller.getCell(controller.getActiveCell())).toEqual({
          style: { isBold: true, isItalic: true },
          row: 1,
          col: 0,
          formula: '=SUM(1,2)',
          value: 3,
        });
      });
      fireEvent.keyDown(document.body, { key: 'ArrowUp' });
      expect(screen.getByTestId('formula-bar-name-input')).toHaveValue('A1');
      expect(screen.getByTestId('formula-editor-trigger')).not.toHaveStyle({
        fontWeight: 'bold',
        fontStyle: 'italic',
      });
    });
  });
  describe('bold', () => {
    test('normal', () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      fireEvent.click(screen.getByTestId('toolbar-bold'));
      expect(screen.getByTestId('formula-editor-trigger')).toHaveStyle({
        fontWeight: 'bold',
      });
    });
  });
  describe('italic', () => {
    test('normal', () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      fireEvent.click(screen.getByTestId('toolbar-italic'));
      expect(screen.getByTestId('formula-editor-trigger')).toHaveStyle({
        fontStyle: 'italic',
      });
    });
  });
  describe('strike', () => {
    test('normal', () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      fireEvent.click(screen.getByTestId('toolbar-strike'));
      expect(screen.getByTestId('formula-editor-trigger')).toHaveStyle({
        textDecorationLine: 'line-through',
      });
    });
  });
  describe('underline', () => {
    test('single underline', () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      fireEvent.change(screen.getByTestId('toolbar-underline'), {
        target: { value: '1' },
      });
      expect(screen.getByTestId('formula-editor-trigger')).toHaveStyle({
        textDecorationLine: 'underline',
      });
    });
    test('double underline', () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      fireEvent.change(screen.getByTestId('toolbar-underline'), {
        target: { value: '2' },
      });
      expect(screen.getByTestId('formula-editor-trigger')).toHaveStyle({
        textDecorationLine: 'underline',
      });
    });
    test('strike', () => {
      act(() => {
        render(<App controller={initController()} />);
      });
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
      const controller = initController();
      act(() => {
        render(<App controller={controller} />);
      });
      fireEvent.click(screen.getByTestId('toolbar-wrap-text'));
      expect(controller.getCell(controller.getActiveCell())?.style).toEqual({
        isWrapText: true,
      });
    });
  });
  describe('fill color', () => {
    test('normal', () => {
      const controller = initController();
      act(() => {
        render(<App controller={controller} />);
      });
      fireEvent.click(screen.getByTestId('toolbar-fill-color'));

      const dom = screen.getByTestId('toolbar-fill-color-list');
      dom.setAttribute('data-value', '#B2B2B2');
      fireEvent.click(dom);
      expect(controller.getCell(controller.getActiveCell())?.style).toEqual({
        fillColor: '#B2B2B2',
      });
    });
    test('saturation', () => {
      const controller = initController();
      act(() => {
        render(<App controller={controller} />);
      });
      fireEvent.click(screen.getByTestId('toolbar-fill-color'));

      fireEvent.pointerDown(
        screen.getByTestId('toolbar-fill-color-saturation'),
        { buttons: 1, clientX: 10, clientY: 10, pageX: 10, pageY: 10 },
      );
      fireEvent.pointerMove(document.body, {
        buttons: 1,
        clientX: 100,
        clientY: 100,
        pageX: 100,
        pageY: 100,
      });
      fireEvent.pointerUp(document.body);

      expect(controller.getCell(controller.getActiveCell())?.style).toEqual({
        fillColor: '#ffffff',
      });
    });
  });
  describe('font color', () => {
    test('normal', () => {
      const controller = initController();
      act(() => {
        render(<App controller={controller} />);
      });
      fireEvent.click(screen.getByTestId('toolbar-font-color'));

      const dom = screen.getByTestId('toolbar-font-color-list');
      dom.setAttribute('data-value', '#B2B2B2');
      fireEvent.click(dom);
      expect(controller.getCell(controller.getActiveCell())?.style).toEqual({
        fontColor: '#B2B2B2',
      });
    });
    test('saturation', () => {
      const controller = initController();
      act(() => {
        render(<App controller={controller} />);
      });
      fireEvent.click(screen.getByTestId('toolbar-font-color'));

      fireEvent.pointerDown(
        screen.getByTestId('toolbar-font-color-saturation'),
        { buttons: 1, clientX: 10, clientY: 10, pageX: 10, pageY: 10 },
      );
      fireEvent.pointerMove(document.body, {
        buttons: 1,
        clientX: 100,
        clientY: 100,
        pageX: 100,
        pageY: 100,
      });
      fireEvent.pointerUp(document.body);

      expect(controller.getCell(controller.getActiveCell())?.style).toEqual({
        fontColor: '#ffffff',
      });
    });
  });
});