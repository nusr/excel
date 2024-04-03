import { App } from '@/containers';
import { initController } from '@/controller';
import * as React from 'react';
import {
  cleanup,
  render,
  screen,
  act,
  fireEvent,
} from '@testing-library/react';
import '@testing-library/jest-dom';

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
      dom.setAttribute('data-color', '#B2B2B2');
      fireEvent.click(dom);
      expect(controller.getCell(controller.getActiveCell())?.style).toEqual({
        fillColor: '#B2B2B2',
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
      dom.setAttribute('data-color', '#B2B2B2');
      fireEvent.click(dom);
      expect(controller.getCell(controller.getActiveCell())?.style).toEqual({
        fontColor: '#B2B2B2',
      });
    });
  });
});
