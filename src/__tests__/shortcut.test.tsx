import '@testing-library/jest-dom';
import { App } from '@/containers';
import * as React from 'react';
import {
  render,
  fireEvent,
  act,
  screen,
  waitFor,
} from '@testing-library/react';
import { isMac } from '@/util';
import { initController } from '@/controller';
import './global.mock';

describe('shortcut.test.tsx', () => {
  describe('Enter', () => {
    test('normal', async () => {
      render(<App controller={initController()} />);
      fireEvent.keyDown(document.body, { key: 'Enter' });
      expect(screen.getByTestId('formula-bar-name-input')).toHaveValue('A2');
    });
  });
  describe('Tab', () => {
    test('normal', () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      fireEvent.click(screen.getByTestId('canvas-main'));
      fireEvent.keyDown(document.body, { key: 'Tab' });
      expect(screen.getByTestId('formula-bar-name-input')).toHaveValue('B1');
    });
  });
  describe('ArrowDown', () => {
    test('meta', () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      expect(screen.getByTestId('canvas-bottom-bar')).not.toHaveClass('active');
      const key = `${isMac() ? 'meta' : 'ctrl'}Key`;
      fireEvent.keyDown(document.body, { key: 'ArrowDown', [key]: true });
      expect(screen.getByTestId('canvas-bottom-bar')).toHaveClass('active');
    });
  });
  describe('ArrowUp', () => {
    test('normal', async () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      fireEvent.keyDown(document.body, { key: 'ArrowDown' });
      expect(screen.getByTestId('formula-bar-name-input')).toHaveValue('A2');
      fireEvent.keyDown(document.body, { key: 'ArrowUp' });
      expect(screen.getByTestId('formula-bar-name-input')).toHaveValue('A1');
    });

    test('meta', () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      expect(screen.getByTestId('canvas-bottom-bar')).not.toHaveClass('active');
      const key = `${isMac() ? 'meta' : 'ctrl'}Key`;
      fireEvent.keyDown(document.body, { key: 'ArrowDown', [key]: true });
      expect(screen.getByTestId('canvas-bottom-bar')).toHaveClass('active');

      fireEvent.keyDown(document.body, { key: 'ArrowUp', [key]: true });
      expect(screen.getByTestId('canvas-bottom-bar')).not.toHaveClass('active');
    });
  });
  describe('ArrowRight', () => {
    test('normal', () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      fireEvent.keyDown(document.body, { key: 'ArrowRight' });
      expect(screen.getByTestId('formula-bar-name-input')).toHaveValue('B1');
      fireEvent.keyDown(document.body, { key: 'ArrowLeft' });
      expect(screen.getByTestId('formula-bar-name-input')).toHaveValue('A1');
    });
    test('meta', () => {
      const controller = initController();
      act(() => {
        render(<App controller={controller} />);
      });
      const key = `${isMac() ? 'meta' : 'ctrl'}Key`;
      fireEvent.keyDown(document.body, { key: 'ArrowRight', [key]: true });
      expect(controller.getScroll().col).toBeGreaterThanOrEqual(10);
    });
  });
  describe('ArrowLeft', () => {
    test('meta', () => {
      const controller = initController();
      act(() => {
        render(<App controller={controller} />);
      });
      const key = `${isMac() ? 'meta' : 'ctrl'}Key`;
      fireEvent.keyDown(document.body, { key: 'ArrowRight', [key]: true });
      expect(controller.getScroll().col).toBeGreaterThanOrEqual(10);
      fireEvent.keyDown(document.body, { key: 'ArrowLeft', [key]: true });
      expect(controller.getScroll().col).toEqual(0);
    });
  });
  describe('bold', () => {
    test('normal', () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      const key = `${isMac() ? 'meta' : 'ctrl'}Key`;
      fireEvent.keyDown(document.body, { key: 'b', [key]: true });
      expect(screen.getByTestId('formula-editor-trigger')).toHaveStyle({
        fontWeight: 'bold',
      });
    });
    test('twice', () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      const key = `${isMac() ? 'meta' : 'ctrl'}Key`;
      fireEvent.keyDown(document.body, { key: 'b', [key]: true });
      expect(screen.getByTestId('formula-editor-trigger')).toHaveStyle({
        fontWeight: 'bold',
      });
      fireEvent.keyDown(document.body, { key: 'b', [key]: true });
      expect(screen.getByTestId('formula-editor-trigger')).not.toHaveStyle({
        fontWeight: 'bold',
      });
    });
  });
  describe('italic', () => {
    test('normal', () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      const key = `${isMac() ? 'meta' : 'ctrl'}Key`;
      fireEvent.keyDown(document.body, { key: 'i', [key]: true });
      expect(screen.getByTestId('formula-editor-trigger')).toHaveStyle({
        fontStyle: 'italic',
      });
    });
    test('twice', () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      const key = `${isMac() ? 'meta' : 'ctrl'}Key`;
      fireEvent.keyDown(document.body, { key: 'i', [key]: true });
      expect(screen.getByTestId('formula-editor-trigger')).toHaveStyle({
        fontStyle: 'italic',
      });
      fireEvent.keyDown(document.body, { key: 'i', [key]: true });
      expect(screen.getByTestId('formula-editor-trigger')).not.toHaveStyle({
        fontStyle: 'italic',
      });
    });
  });
  describe('strike', () => {
    test('normal', () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      const key = `${isMac() ? 'meta' : 'ctrl'}Key`;
      fireEvent.keyDown(document.body, { key: '5', [key]: true });
      expect(screen.getByTestId('formula-editor-trigger')).toHaveStyle({
        textDecorationLine: 'line-through',
      });
    });
    test('twice', () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      const key = `${isMac() ? 'meta' : 'ctrl'}Key`;
      fireEvent.keyDown(document.body, { key: '5', [key]: true });
      expect(screen.getByTestId('formula-editor-trigger')).toHaveStyle({
        textDecorationLine: 'line-through',
      });
      fireEvent.keyDown(document.body, { key: '5', [key]: true });
      expect(screen.getByTestId('formula-editor-trigger')).not.toHaveStyle({
        textDecorationLine: 'line-through',
      });
    });
  });
  describe('underline', () => {
    test('normal', () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      const key = `${isMac() ? 'meta' : 'ctrl'}Key`;
      fireEvent.keyDown(document.body, { key: 'u', [key]: true });
      expect(screen.getByTestId('formula-editor-trigger')).toHaveStyle({
        textDecorationLine: 'underline',
      });
    });
    test('twice', () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      const key = `${isMac() ? 'meta' : 'ctrl'}Key`;
      fireEvent.keyDown(document.body, { key: 'u', [key]: true });
      expect(screen.getByTestId('formula-editor-trigger')).toHaveStyle({
        textDecorationLine: 'underline',
      });
      fireEvent.keyDown(document.body, { key: 'u', [key]: true });
      expect(screen.getByTestId('formula-editor-trigger')).not.toHaveStyle({
        textDecorationLine: 'underline',
      });
    });
    test('strike', () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      const key = `${isMac() ? 'meta' : 'ctrl'}Key`;
      fireEvent.keyDown(document.body, { key: 'u', [key]: true });
      fireEvent.keyDown(document.body, { key: '5', [key]: true });
      expect(screen.getByTestId('formula-editor-trigger')).toHaveStyle({
        textDecorationLine: 'underline line-through',
      });
    });
  });
  describe('copy', () => {
    test('normal', async () => {
      const controller = initController();
      act(() => {
        render(<App controller={controller} />);
      });
      const key = `${isMac() ? 'meta' : 'ctrl'}Key`;
      fireEvent.keyDown(document.body, { key: 'b', [key]: true });
      expect(screen.getByTestId('formula-editor-trigger')).toHaveStyle({
        fontWeight: 'bold',
      });

      fireEvent.copy(document.body, { clipboardData: { setData: () => {} } });

      fireEvent.keyDown(document.body, { key: 'Enter' });
      fireEvent.paste(document.body, { clipboardData: { getData: () => '' } });
      await waitFor(() => {
        expect(controller.getCell(controller.getActiveRange().range)).toEqual({
          style: { isBold: true },
        });
        expect(screen.getByTestId('formula-bar-name-input')).toHaveValue('A2');
      });
    });
  });
  describe('cut', () => {
    test('normal', async () => {
      const controller = initController();
      act(() => {
        render(<App controller={controller} />);
      });
      const key = `${isMac() ? 'meta' : 'ctrl'}Key`;
      fireEvent.keyDown(document.body, { key: 'b', [key]: true });
      expect(screen.getByTestId('formula-editor-trigger')).toHaveStyle({
        fontWeight: 'bold',
      });

      fireEvent.cut(document.body, { clipboardData: { setData: () => {} } });

      fireEvent.keyDown(document.body, { key: 'Enter' });
      fireEvent.paste(document.body, { clipboardData: { getData: () => '' } });
      await waitFor(() => {
        expect(controller.getCell(controller.getActiveRange().range)).toEqual({
          style: { isBold: true },
        });
        expect(screen.getByTestId('formula-bar-name-input')).toHaveValue('A2');
      });

      fireEvent.keyDown(document.body, { key: 'ArrowUp' });
      expect(screen.getByTestId('formula-bar-name-input')).toHaveValue('A1');
      expect(screen.getByTestId('formula-editor-trigger')).not.toHaveStyle({
        fontWeight: 'bold',
      });
    });
  });

  describe('wheel', () => {
    test('scroll down', async () => {
      act(() => {
        render(<App controller={initController()} />);
      });

      expect(
        window.getComputedStyle(
          screen.getByTestId('vertical-scroll-bar-content'),
        ).transform,
      ).toEqual('translateY(0px)');
      fireEvent.wheel(document.body, {
        deltaX: 0,
        deltaY: 200,
      });
      const transform = window.getComputedStyle(
        screen.getByTestId('vertical-scroll-bar-content'),
      ).transform;
      expect(transform).toEqual('translateY(20px)');
    });
    test(' scroll right', async () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      expect(
        window.getComputedStyle(
          screen.getByTestId('horizontal-scroll-bar-content'),
        ).transform,
      ).toEqual('translateX(0px)');
      fireEvent.wheel(document.body, {
        deltaX: 200,
        deltaY: 0,
      });
      const transform = window.getComputedStyle(
        screen.getByTestId('horizontal-scroll-bar-content'),
      ).transform;
      expect(transform).toEqual('translateX(260px)');
    });
  });

  describe('undo', () => {
    test('ok', () => {
      act(() => {
        render(<App controller={initController(true)} />);
      });
      expect(screen.getByTestId('toolbar-undo')).toBeDisabled();
      fireEvent.click(screen.getByTestId('toolbar-bold'));
      expect(screen.getByTestId('toolbar-undo')).not.toBeDisabled();
      const key = `${isMac() ? 'meta' : 'ctrl'}Key`;
      fireEvent.keyDown(document.body, { key: 'z', [key]: true });
      expect(screen.getByTestId('toolbar-undo')).toBeDisabled();
    });
  });

  describe('redo', () => {
    test('ok', () => {
      act(() => {
        render(<App controller={initController(true)} />);
      });
      fireEvent.click(screen.getByTestId('toolbar-bold'));
      expect(screen.getByTestId('toolbar-redo')).toBeDisabled();
      const key = `${isMac() ? 'meta' : 'ctrl'}Key`;
      fireEvent.keyDown(document.body, { key: 'z', [key]: true });
      expect(screen.getByTestId('toolbar-redo')).not.toBeDisabled();
      fireEvent.keyDown(document.body, { key: 'y', [key]: true });
      expect(screen.getByTestId('toolbar-redo')).toBeDisabled();
      expect(screen.getByTestId('toolbar-undo')).not.toBeDisabled();
    });
  });
});
